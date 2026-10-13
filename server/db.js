import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "pingu.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS redeem_codes (
    code TEXT PRIMARY KEY COLLATE NOCASE,
    credits INTEGER NOT NULL,
    days INTEGER NOT NULL,
    max_uses INTEGER NOT NULL DEFAULT 1,
    used_count INTEGER NOT NULL DEFAULT 0,
    expires_at TEXT,
    note TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS redeem_uses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    redeemed_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(code, user_id)
  );
`);

function usersHasPhoneColumn() {
  const cols = db.prepare("PRAGMA table_info(users)").all();
  return cols.some((c) => c.name === "phone");
}

function migrateUsersTable() {
  const exists = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
    .get();
  if (!exists) {
    db.exec(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE COLLATE NOCASE,
        phone TEXT UNIQUE COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        credits INTEGER NOT NULL DEFAULT 0,
        plan_expires_at TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        CHECK (email IS NOT NULL OR phone IS NOT NULL)
      );
    `);
    return;
  }
  if (!usersHasPhoneColumn()) {
    db.exec(`
      CREATE TABLE users_v2 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE COLLATE NOCASE,
        phone TEXT UNIQUE COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        credits INTEGER NOT NULL DEFAULT 0,
        plan_expires_at TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        CHECK (email IS NOT NULL OR phone IS NOT NULL)
      );
      INSERT INTO users_v2 (id, email, phone, password_hash, credits, plan_expires_at, created_at)
        SELECT id, email, NULL, password_hash, credits, plan_expires_at, created_at FROM users;
      DROP TABLE users;
      ALTER TABLE users_v2 RENAME TO users;
    `);
  }
}

migrateUsersTable();

export function normalizePhone(raw) {
  let digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("86") && digits.length >= 13) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("1")) return `+86${digits}`;
  if (String(raw || "").trim().startsWith("+")) return `+${digits}`;
  if (digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  return "";
}

export function isInternalEmail(email) {
  return typeof email === "string" && /@internal\.pingu$/i.test(email);
}

export function findUserByEmail(email) {
  const e = String(email || "")
    .trim()
    .toLowerCase();
  if (!e || !e.includes("@")) return undefined;
  return db.prepare("SELECT * FROM users WHERE email = ?").get(e);
}

export function findUserByPhone(phone) {
  const p = normalizePhone(phone);
  if (!p) return undefined;
  return db.prepare("SELECT * FROM users WHERE phone = ?").get(p);
}

export function findUserByLogin({ email, phone }) {
  if (email) {
    const row = findUserByEmail(email);
    if (row) return row;
  }
  if (phone) {
    const row = findUserByPhone(phone);
    if (row) return row;
  }
  return undefined;
}

export function findUserById(id) {
  return db
    .prepare("SELECT id, email, phone, credits, plan_expires_at FROM users WHERE id = ?")
    .get(id);
}

export function findUserWithPasswordById(id) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
}

export function updateUserPassword(userId, passwordHash) {
  return db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(passwordHash, userId);
}

export function createUser({ email, phone, passwordHash }) {
  const e = email
    ? String(email)
        .trim()
        .toLowerCase()
    : null;
  const p = phone ? normalizePhone(phone) : null;
  if (!e && !p) throw new Error("identity_required");
  if (e && findUserByEmail(e)) throw new Error("email_taken");
  if (p && findUserByPhone(p)) throw new Error("phone_taken");
  const info = db
    .prepare(
      "INSERT INTO users (email, phone, password_hash, credits, plan_expires_at) VALUES (?, ?, ?, 0, NULL)",
    )
    .run(e, p, passwordHash);
  return findUserById(info.lastInsertRowid);
}

export function bindUserContact(userId, { email, phone }) {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  if (!user) return { ok: false, error: "user_not_found" };
  const e = email
    ? String(email)
        .trim()
        .toLowerCase()
    : null;
  const p = phone ? normalizePhone(phone) : null;
  if (e) {
    if (!e.includes("@")) return { ok: false, error: "invalid_email" };
    const taken = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(e, userId);
    if (taken) return { ok: false, error: "email_taken" };
  }
  if (p) {
    const taken = db.prepare("SELECT id FROM users WHERE phone = ? AND id != ?").get(p, userId);
    if (taken) return { ok: false, error: "phone_taken" };
  }
  if (!e && !p) return { ok: false, error: "nothing_to_bind" };
  const nextEmail = e || user.email;
  const nextPhone = p || user.phone;
  if (!nextEmail && !nextPhone) return { ok: false, error: "identity_required" };
  db.prepare("UPDATE users SET email = ?, phone = ? WHERE id = ?").run(nextEmail, nextPhone, userId);
  return { ok: true, user: findUserById(userId) };
}

export function updateUserEntitlement(userId, credits, planExpiresAt) {
  db.prepare("UPDATE users SET credits = ?, plan_expires_at = ? WHERE id = ?").run(
    credits,
    planExpiresAt,
    userId,
  );
}

export function deductCredit(userId) {
  const row = findUserById(userId);
  if (!row || row.credits <= 0) return false;
  db.prepare("UPDATE users SET credits = credits - 1 WHERE id = ? AND credits > 0").run(userId);
  return true;
}

export function getRedeemCode(code) {
  return db.prepare("SELECT * FROM redeem_codes WHERE code = ?").get(code.trim());
}

export function insertRedeemCodes(rows) {
  const stmt = db.prepare(
    `INSERT INTO redeem_codes (code, credits, days, max_uses, expires_at, note)
     VALUES (@code, @credits, @days, @max_uses, @expires_at, @note)`,
  );
  const insertMany = db.transaction((list) => {
    for (const row of list) stmt.run(row);
  });
  insertMany(rows);
}

export function redeemCodeForUser(codeRow, userId) {
  const user = findUserById(userId);
  if (!user) return { ok: false, error: "user_not_found" };

  const now = Date.now();
  if (codeRow.expires_at && Date.parse(codeRow.expires_at) < now) {
    return { ok: false, error: "code_expired" };
  }
  if (codeRow.used_count >= codeRow.max_uses) {
    return { ok: false, error: "code_exhausted" };
  }

  const used = db
    .prepare("SELECT 1 FROM redeem_uses WHERE code = ? AND user_id = ?")
    .get(codeRow.code, userId);
  if (used) return { ok: false, error: "code_already_used" };

  const currentExpiry = user.plan_expires_at ? Date.parse(user.plan_expires_at) : 0;
  const base = Math.max(now, currentExpiry);
  const planExpiresAt = new Date(base + codeRow.days * 86400000).toISOString();
  const credits = user.credits + codeRow.credits;

  const tx = db.transaction(() => {
    db.prepare("UPDATE users SET credits = ?, plan_expires_at = ? WHERE id = ?").run(
      credits,
      planExpiresAt,
      userId,
    );
    db.prepare("UPDATE redeem_codes SET used_count = used_count + 1 WHERE code = ?").run(codeRow.code);
    db.prepare("INSERT INTO redeem_uses (code, user_id) VALUES (?, ?)").run(codeRow.code, userId);
  });
  tx();

  return { ok: true, credits, planExpiresAt };
}

export function userCanChat(user) {
  if (!user) return false;
  if (user.credits <= 0) return false;
  if (!user.plan_expires_at) return false;
  return Date.parse(user.plan_expires_at) > Date.now();
}

export default db;
