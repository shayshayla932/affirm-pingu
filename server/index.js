import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  bindUserContact,
  createUser,
  deductCredit,
  findUserById,
  findUserWithPasswordById,
  findUserByLogin,
  getRedeemCode,
  insertRedeemCodes,
  isInternalEmail,
  normalizePhone,
  redeemCodeForUser,
  userCanChat,
  updateUserPassword,
} from "./db.js";

dotenv.config();

const PORT = Number(process.env.PORT || 8787);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_DEFAULT_MODEL = process.env.OPENAI_DEFAULT_MODEL || "gpt-4o-mini";
const JWT_SECRET = process.env.JWT_SECRET || "";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "";

if (!OPENAI_API_KEY) {
  console.warn("[pingu-server] OPENAI_API_KEY missing — chat will fail until .env is set");
}
if (!JWT_SECRET || JWT_SECRET.length < 16) {
  console.warn("[pingu-server] JWT_SECRET should be a long random string");
}

function parseCorsOrigins(raw) {
  const v = (raw || "*").trim();
  if (v === "*") return true;
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

const app = express();
app.use(express.json({ limit: "512kb" }));
app.use(
  cors({
    origin: parseCorsOrigins(process.env.CORS_ORIGINS),
    credentials: true,
  }),
);

function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "90d" });
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const m = header.match(/^Bearer\s+(.+)$/i);
  if (!m) return res.status(401).json({ error: "unauthorized" });
  try {
    const payload = jwt.verify(m[1], JWT_SECRET);
    const user = findUserById(Number(payload.sub));
    if (!user) return res.status(401).json({ error: "unauthorized" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "unauthorized" });
  }
}

function maskPhone(phone) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 4) return phone;
  return `${phone.slice(0, 3)}****${digits.slice(-4)}`;
}

function entitlementPayload(user) {
  const email =
    user.email && !isInternalEmail(user.email) ? user.email : null;
  return {
    email,
    phone: user.phone || null,
    phoneMasked: maskPhone(user.phone || ""),
    hasEmail: Boolean(email),
    hasPhone: Boolean(user.phone),
    creditsRemaining: user.credits,
    planExpiresAt: user.plan_expires_at,
    canChat: userCanChat(user),
  };
}

function parseIdentity(body) {
  const email = String(body?.email || "")
    .trim()
    .toLowerCase();
  const phone = normalizePhone(body?.phone || body?.phoneNumber || "");
  const password = String(body?.password || "");
  return { email: email.includes("@") ? email : "", phone, password };
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "affirm-pingu-server" });
});

app.post("/v1/auth/register", async (req, res) => {
  const { email, phone, password } = parseIdentity(req.body);
  if (!email && !phone) {
    return res.status(400).json({ error: "identity_required" });
  }
  if (email && (email.length > 120 || !email.includes("@"))) {
    return res.status(400).json({ error: "invalid_email" });
  }
  if (phone && phone.length < 10) {
    return res.status(400).json({ error: "invalid_phone" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "password_too_short" });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = createUser({
      email: email || null,
      phone: phone || null,
      passwordHash,
    });
    const token = signToken(user.id);
    res.json({ token, user: entitlementPayload(user) });
  } catch (err) {
    const msg = err?.message || "register_failed";
    if (msg === "email_taken" || msg === "phone_taken") {
      return res.status(409).json({ error: msg });
    }
    return res.status(400).json({ error: msg });
  }
});

app.post("/v1/auth/login", async (req, res) => {
  const { email, phone, password } = parseIdentity(req.body);
  if ((!email && !phone) || !password) {
    return res.status(400).json({ error: "invalid_credentials" });
  }
  const row = findUserByLogin({ email, phone });
  if (!row) return res.status(401).json({ error: "invalid_credentials" });
  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });
  const user = findUserById(row.id);
  const token = signToken(user.id);
  res.json({ token, user: entitlementPayload(user) });
});

app.post("/v1/auth/bind", authMiddleware, (req, res) => {
  const { email, phone } = parseIdentity(req.body);
  const result = bindUserContact(req.user.id, {
    email: email || null,
    phone: phone || null,
  });
  if (!result.ok) return res.status(400).json({ error: result.error });
  res.json({ ok: true, user: entitlementPayload(result.user) });
});

app.post("/v1/auth/password", authMiddleware, async (req, res) => {
  const currentPassword = String(req.body?.currentPassword || "");
  const newPassword = String(req.body?.newPassword || "");
  if (!currentPassword || newPassword.length < 8) {
    return res.status(400).json({ error: "invalid_password" });
  }
  const user = findUserWithPasswordById(req.user.id);
  if (!user) return res.status(401).json({ error: "unauthorized" });
  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) return res.status(401).json({ error: "invalid_current_password" });
  const passwordHash = await bcrypt.hash(newPassword, 10);
  updateUserPassword(user.id, passwordHash);
  res.json({ ok: true });
});

app.get("/v1/me", authMiddleware, (req, res) => {
  res.json(entitlementPayload(req.user));
});

app.post("/v1/redeem", authMiddleware, (req, res) => {
  const code = String(req.body?.code || "").trim();
  if (!code) return res.status(400).json({ error: "code_required" });
  const codeRow = getRedeemCode(code);
  if (!codeRow) return res.status(404).json({ error: "code_invalid" });
  const result = redeemCodeForUser(codeRow, req.user.id);
  if (!result.ok) return res.status(400).json({ error: result.error });
  const user = findUserById(req.user.id);
  res.json({ ok: true, user: entitlementPayload(user) });
});

app.post("/v1/chat", authMiddleware, async (req, res) => {
  const user = findUserById(req.user.id);
  if (!userCanChat(user)) {
    return res.status(402).json({
      error: "no_entitlement",
      message: "Redeem a code or renew your plan to continue.",
      user: entitlementPayload(user),
    });
  }

  const messages = req.body?.messages;
  if (!Array.isArray(messages) || !messages.length) {
    return res.status(400).json({ error: "messages_required" });
  }
  const safeMessages = messages
    .slice(-48)
    .filter(
      (m) =>
        m &&
        typeof m.content === "string" &&
        (m.role === "system" || m.role === "user" || m.role === "assistant"),
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, 12000) }));

  if (!safeMessages.length) {
    return res.status(400).json({ error: "messages_invalid" });
  }

  const model =
    typeof req.body?.model === "string" && req.body.model.trim()
      ? req.body.model.trim().slice(0, 64)
      : OPENAI_DEFAULT_MODEL;

  if (!OPENAI_API_KEY) {
    return res.status(503).json({ error: "openai_not_configured" });
  }

  const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: safeMessages,
    }),
  });

  let data = null;
  try {
    data = await openaiRes.json();
  } catch {
    data = null;
  }

  if (!openaiRes.ok) {
    const apiMsg = data?.error?.message || "openai_error";
    return res.status(502).json({ error: "openai_error", message: apiMsg });
  }

  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) {
    return res.status(502).json({ error: "empty_model_response" });
  }

  if (!deductCredit(user.id)) {
    return res.status(402).json({ error: "no_credits" });
  }

  const updated = findUserById(user.id);
  res.json({
    content,
    usage: data.usage || null,
    user: entitlementPayload(updated),
  });
});

app.post("/v1/admin/codes", (req, res) => {
  const secret = req.headers["x-admin-secret"];
  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    return res.status(403).json({ error: "forbidden" });
  }
  const credits = Math.max(1, Number(req.body?.credits) || 300);
  const days = Math.max(1, Number(req.body?.days) || 30);
  const count = Math.min(100, Math.max(1, Number(req.body?.count) || 1));
  const maxUses = Math.max(1, Number(req.body?.maxUses) || 1);
  const note = String(req.body?.note || "api").slice(0, 120);
  const rows = [];
  for (let i = 0; i < count; i += 1) {
    rows.push({
      code: `PINGU-${crypto.randomBytes(4).toString("hex").toUpperCase()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`,
      credits,
      days,
      max_uses: maxUses,
      expires_at: null,
      note,
    });
  }
  insertRedeemCodes(rows);
  res.json({ ok: true, codes: rows.map((r) => r.code) });
});

app.listen(PORT, () => {
  console.log(`[pingu-server] http://127.0.0.1:${PORT}`);
});
