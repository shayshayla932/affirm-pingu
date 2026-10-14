var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var encoder = new TextEncoder();
function json(data, status = 200, origin = "*") {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": origin,
      "access-control-allow-headers": "authorization, content-type, x-admin-secret",
      "access-control-allow-methods": "GET, POST, OPTIONS",
      vary: "Origin"
    }
  });
}
__name(json, "json");
function allowedOrigin(request, env) {
  const origin = request.headers.get("origin") || "*";
  const configured = String(env.CORS_ORIGINS || "*").trim();
  if (configured === "*") return "*";
  const allowed = configured.split(",").map((value) => value.trim());
  return allowed.includes(origin) ? origin : allowed[0] || "*";
}
__name(allowedOrigin, "allowedOrigin");
function base64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
__name(base64Url, "base64Url");
function fromBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}
__name(fromBase64Url, "fromBase64Url");
async function hmac(value, secret) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}
__name(hmac, "hmac");
async function signToken(userId, secret) {
  const payload = base64Url(encoder.encode(JSON.stringify({ sub: Number(userId), exp: Math.floor(Date.now() / 1e3) + 90 * 86400 })));
  const signature = base64Url(await hmac(payload, secret));
  return `${payload}.${signature}`;
}
__name(signToken, "signToken");
async function verifyToken(token, secret) {
  const [payload, signature] = String(token || "").split(".");
  if (!payload || !signature) return null;
  const expected = await hmac(payload, secret);
  const actual = fromBase64Url(signature);
  if (actual.length !== expected.length) return null;
  let mismatch = 0;
  for (let i = 0; i < actual.length; i += 1) mismatch |= actual[i] ^ expected[i];
  if (mismatch) return null;
  const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
  return parsed.exp > Date.now() / 1e3 ? parsed : null;
}
__name(verifyToken, "verifyToken");
async function hashPassword(password, saltBytes = crypto.getRandomValues(new Uint8Array(16))) {
  const material = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: saltBytes, iterations: 21e4 }, material, 256);
  return `pbkdf2-sha256$210000$${base64Url(saltBytes)}$${base64Url(new Uint8Array(bits))}`;
}
__name(hashPassword, "hashPassword");
async function verifyPassword(password, stored) {
  const [algorithm, rounds, salt, expected] = String(stored || "").split("$");
  if (algorithm !== "pbkdf2-sha256" || !salt || !expected) return false;
  const material = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: fromBase64Url(salt), iterations: Number(rounds) }, material, 256));
  const target = fromBase64Url(expected);
  if (bits.length !== target.length) return false;
  let mismatch = 0;
  for (let i = 0; i < bits.length; i += 1) mismatch |= bits[i] ^ target[i];
  return mismatch === 0;
}
__name(verifyPassword, "verifyPassword");
function normalizePhone(raw) {
  let digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("86") && digits.length >= 13) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("1")) return `+86${digits}`;
  if (String(raw || "").trim().startsWith("+") && digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : "";
}
__name(normalizePhone, "normalizePhone");
function parseIdentity(body) {
  const rawEmail = String(body?.email || "").trim().toLowerCase();
  return {
    email: rawEmail.includes("@") ? rawEmail : "",
    phone: normalizePhone(body?.phone || body?.phoneNumber || ""),
    password: String(body?.password || "")
  };
}
__name(parseIdentity, "parseIdentity");
function maskPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length > 4 ? `${String(phone).slice(0, 3)}****${digits.slice(-4)}` : String(phone || "");
}
__name(maskPhone, "maskPhone");
function userPayload(user) {
  const active = user.plan_expires_at && Date.parse(user.plan_expires_at) > Date.now();
  return {
    email: user.email || null,
    phone: user.phone || null,
    phoneMasked: maskPhone(user.phone),
    hasEmail: Boolean(user.email),
    hasPhone: Boolean(user.phone),
    creditsRemaining: user.credits,
    planExpiresAt: user.plan_expires_at,
    canChat: Boolean(active && user.credits > 0)
  };
}
__name(userPayload, "userPayload");
async function bodyOf(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
__name(bodyOf, "bodyOf");
async function currentUser(request, env) {
  const match = (request.headers.get("authorization") || "").match(/^Bearer\s+(.+)$/i);
  const payload = match ? await verifyToken(match[1], env.JWT_SECRET) : null;
  return payload ? env.DB.prepare("SELECT id, email, phone, credits, plan_expires_at FROM users WHERE id = ?").bind(payload.sub).first() : null;
}
__name(currentUser, "currentUser");
async function handle(request, env) {
  const url = new URL(request.url);
  const origin = allowedOrigin(request, env);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "access-control-allow-origin": origin, "access-control-allow-headers": "authorization, content-type, x-admin-secret", "access-control-allow-methods": "GET, POST, OPTIONS" } });
  if (request.method === "GET" && url.pathname === "/health") return json({ ok: true, service: "dreamey-api" }, 200, origin);
  if (request.method === "POST" && url.pathname === "/v1/auth/register") {
    const { email, phone, password } = parseIdentity(await bodyOf(request));
    if (!email && !phone) return json({ error: "identity_required" }, 400, origin);
    if (password.length < 8) return json({ error: "password_too_short" }, 400, origin);
    const existing = email ? await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first() : await env.DB.prepare("SELECT id FROM users WHERE phone = ?").bind(phone).first();
    if (existing) return json({ error: email ? "email_taken" : "phone_taken" }, 409, origin);
    const passwordHash = await hashPassword(password);
    try {
      const result = await env.DB.prepare("INSERT INTO users (email, phone, password_hash) VALUES (?, ?, ?)").bind(email || null, phone || null, passwordHash).run();
      const user2 = await env.DB.prepare("SELECT id, email, phone, credits, plan_expires_at FROM users WHERE id = ?").bind(result.meta.last_row_id).first();
      return json({ token: await signToken(user2.id, env.JWT_SECRET), user: userPayload(user2) }, 200, origin);
    } catch (error) {
      return json({ error: String(error).includes("UNIQUE") ? email ? "email_taken" : "phone_taken" : "register_failed" }, 400, origin);
    }
  }
  if (request.method === "POST" && url.pathname === "/v1/auth/login") {
    const { email, phone, password } = parseIdentity(await bodyOf(request));
    const user2 = email ? await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first() : phone ? await env.DB.prepare("SELECT * FROM users WHERE phone = ?").bind(phone).first() : null;
    if (!user2 || !await verifyPassword(password, user2.password_hash)) return json({ error: "invalid_credentials" }, 401, origin);
    return json({ token: await signToken(user2.id, env.JWT_SECRET), user: userPayload(user2) }, 200, origin);
  }
  const user = await currentUser(request, env);
  if (["/v1/me", "/v1/auth/bind", "/v1/auth/password", "/v1/redeem", "/v1/chat"].includes(url.pathname) && !user) return json({ error: "unauthorized" }, 401, origin);
  if (request.method === "GET" && url.pathname === "/v1/me") return json(userPayload(user), 200, origin);
  if (request.method === "POST" && url.pathname === "/v1/auth/bind") {
    const { email, phone } = parseIdentity(await bodyOf(request));
    if (!email && !phone) return json({ error: "nothing_to_bind" }, 400, origin);
    const clash = email ? await env.DB.prepare("SELECT id FROM users WHERE email = ? AND id != ?").bind(email, user.id).first() : await env.DB.prepare("SELECT id FROM users WHERE phone = ? AND id != ?").bind(phone, user.id).first();
    if (clash) return json({ error: email ? "email_taken" : "phone_taken" }, 400, origin);
    await env.DB.prepare("UPDATE users SET email = ?, phone = ? WHERE id = ?").bind(email || user.email, phone || user.phone, user.id).run();
    const updated = await env.DB.prepare("SELECT id, email, phone, credits, plan_expires_at FROM users WHERE id = ?").bind(user.id).first();
    return json({ ok: true, user: userPayload(updated) }, 200, origin);
  }
  if (request.method === "POST" && url.pathname === "/v1/auth/password") {
    const body = await bodyOf(request);
    const fullUser = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(user.id).first();
    if (!await verifyPassword(String(body.currentPassword || ""), fullUser.password_hash)) return json({ error: "invalid_current_password" }, 401, origin);
    if (String(body.newPassword || "").length < 8) return json({ error: "invalid_password" }, 400, origin);
    await env.DB.prepare("UPDATE users SET password_hash = ? WHERE id = ?").bind(await hashPassword(String(body.newPassword)), user.id).run();
    return json({ ok: true }, 200, origin);
  }
  if (request.method === "POST" && url.pathname === "/v1/redeem") {
    const code = String((await bodyOf(request)).code || "").trim();
    const row = await env.DB.prepare("SELECT * FROM redeem_codes WHERE code = ?").bind(code).first();
    if (!row) return json({ error: "code_invalid" }, 404, origin);
    if (row.expires_at && Date.parse(row.expires_at) < Date.now()) return json({ error: "code_expired" }, 400, origin);
    if (row.used_count >= row.max_uses) return json({ error: "code_exhausted" }, 400, origin);
    const used = await env.DB.prepare("SELECT 1 FROM redeem_uses WHERE code = ? AND user_id = ?").bind(row.code, user.id).first();
    if (used) return json({ error: "code_already_used" }, 400, origin);
    const expiryBase = Math.max(Date.now(), user.plan_expires_at ? Date.parse(user.plan_expires_at) : 0);
    const planExpiresAt = new Date(expiryBase + row.days * 864e5).toISOString();
    await env.DB.batch([
      env.DB.prepare("UPDATE users SET credits = credits + ?, plan_expires_at = ? WHERE id = ?").bind(row.credits, planExpiresAt, user.id),
      env.DB.prepare("UPDATE redeem_codes SET used_count = used_count + 1 WHERE code = ?").bind(row.code),
      env.DB.prepare("INSERT INTO redeem_uses (code, user_id) VALUES (?, ?)").bind(row.code, user.id)
    ]);
    const updated = await env.DB.prepare("SELECT id, email, phone, credits, plan_expires_at FROM users WHERE id = ?").bind(user.id).first();
    return json({ ok: true, user: userPayload(updated) }, 200, origin);
  }
  if (request.method === "POST" && url.pathname === "/v1/chat") {
    if (!userPayload(user).canChat) return json({ error: "no_entitlement", user: userPayload(user) }, 402, origin);
    const body = await bodyOf(request);
    const messages = Array.isArray(body.messages) ? body.messages.slice(-48).filter((m) => ["system", "user", "assistant"].includes(m?.role) && typeof m.content === "string").map((m) => ({ role: m.role, content: m.content.slice(0, 12e3) })) : [];
    if (!messages.length) return json({ error: "messages_required" }, 400, origin);
    const response = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: String(body.model || env.OPENAI_DEFAULT_MODEL || "gpt-4o-mini"), temperature: 0.7, messages }) });
    const data = await response.json().catch(() => null);
    if (!response.ok) return json({ error: "openai_error", message: data?.error?.message || "openai_error" }, 502, origin);
    const content = data?.choices?.[0]?.message?.content?.trim();
    if (!content) return json({ error: "empty_model_response" }, 502, origin);
    await env.DB.prepare("UPDATE users SET credits = credits - 1 WHERE id = ? AND credits > 0").bind(user.id).run();
    const updated = await env.DB.prepare("SELECT id, email, phone, credits, plan_expires_at FROM users WHERE id = ?").bind(user.id).first();
    return json({ content, usage: data.usage || null, user: userPayload(updated) }, 200, origin);
  }
  if (request.method === "POST" && url.pathname === "/v1/admin/codes") {
    if (!env.ADMIN_SECRET || request.headers.get("x-admin-secret") !== env.ADMIN_SECRET) return json({ error: "forbidden" }, 403, origin);
    const body = await bodyOf(request);
    const count = Math.min(100, Math.max(1, Number(body.count) || 1));
    const codes = [];
    for (let i = 0; i < count; i += 1) {
      const bytes = crypto.getRandomValues(new Uint8Array(6));
      const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
      const code = `PINGU-${hex.slice(0, 8)}-${hex.slice(8)}`;
      await env.DB.prepare("INSERT INTO redeem_codes (code, credits, days, max_uses, note) VALUES (?, ?, ?, ?, ?)").bind(code, Math.max(1, Number(body.credits) || 300), Math.max(1, Number(body.days) || 30), Math.max(1, Number(body.maxUses) || 1), String(body.note || "api").slice(0, 120)).run();
      codes.push(code);
    }
    return json({ ok: true, codes }, 200, origin);
  }
  return json({ error: "not_found" }, 404, origin);
}
__name(handle, "handle");
var src_default = {
  async fetch(request, env) {
    try {
      if (!env.JWT_SECRET) return json({ error: "server_not_configured" }, 503, allowedOrigin(request, env));
      return await handle(request, env);
    } catch (error) {
      console.error(error);
      return json({ error: "internal_error" }, 500, allowedOrigin(request, env));
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// .wrangler/tmp/bundle-zXmNwt/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-zXmNwt/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
