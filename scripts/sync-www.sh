#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WWW="$ROOT/www"

rm -rf "$WWW"
mkdir -p "$WWW/assets" "$WWW/coach"

cp "$ROOT/index.html" "$ROOT/styles.css" "$ROOT/v2.css" "$ROOT/app.js" "$ROOT/sw.js" "$ROOT/manifest.webmanifest" "$WWW/"
cp "$ROOT/lite.html" "$ROOT/lite.css" "$ROOT/lite.js" "$WWW/" 2>/dev/null || true
rsync -a \
  --exclude '/figma/' \
  --exclude '/puff/assets/' \
  --exclude '/puff/demo.html' \
  --exclude '/puff/README.md' \
  --exclude '/puff/tokens.json' \
  "$ROOT/assets/" "$WWW/assets/"
cp "$ROOT/coach/"* "$WWW/coach/" 2>/dev/null || true

# Capacitor apps don't need service worker for offline the same way; keep files anyway
echo "Synced web assets -> www/"
