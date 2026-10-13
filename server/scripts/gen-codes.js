#!/usr/bin/env node
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { insertRedeemCodes } from "../db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1 || !process.argv[i + 1]) return fallback;
  return process.argv[i + 1];
}

const count = Math.min(500, Math.max(1, Number(arg("count", "5")) || 5));
const credits = Math.max(1, Number(arg("credits", "300")) || 300);
const days = Math.max(1, Number(arg("days", "30")) || 30);
const maxUses = Math.max(1, Number(arg("max-uses", "1")) || 1);
const note = arg("note", "manual");

const rows = [];
for (let i = 0; i < count; i += 1) {
  const code = `PINGU-${crypto.randomBytes(4).toString("hex").toUpperCase()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
  rows.push({
    code,
    credits,
    days,
    max_uses: maxUses,
    expires_at: null,
    note,
  });
}

insertRedeemCodes(rows);
console.log(`Created ${rows.length} code(s): ${credits} credits, ${days} days each`);
for (const r of rows) console.log(r.code);
