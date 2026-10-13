#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WWW="$ROOT/www"

rm -rf "$WWW"
mkdir -p "$WWW/assets" "$WWW/coach"

cp "$ROOT/index.html" "$ROOT/styles.css" "$ROOT/v2.css" "$ROOT/app.js" "$ROOT/sw.js" "$ROOT/manifest.webmanifest" "$WWW/"
cp "$ROOT/lite.html" "$ROOT/lite.css" "$ROOT/lite.js" "$WWW/" 2>/dev/null || true
cp "$ROOT/assets/"* "$WWW/assets/" 2>/dev/null || true
cp "$ROOT/coach/"* "$WWW/coach/" 2>/dev/null || true

# Capacitor apps don't need service worker for offline the same way; keep files anyway
echo "Synced web assets -> www/"
