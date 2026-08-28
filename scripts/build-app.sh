#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP="${1:-$HOME/Desktop/Affirm Pingu.app}"
DATE_VER="$(date +%Y%m%d%H%M)"

mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources/app/assets" "$APP/Contents/Resources/app/coach"

cp "$ROOT/index.html" "$ROOT/styles.css" "$ROOT/app.js" "$APP/Contents/Resources/app/"
cp "$ROOT/lite.html" "$ROOT/lite.css" "$ROOT/lite.js" "$APP/Contents/Resources/app/" 2>/dev/null || true
cp "$ROOT/manifest.webmanifest" "$ROOT/sw.js" "$APP/Contents/Resources/app/" 2>/dev/null || true
cp "$ROOT/assets/"* "$APP/Contents/Resources/app/assets/" 2>/dev/null || true
cp "$ROOT/coach/"* "$APP/Contents/Resources/app/coach/" 2>/dev/null || true

if [ -f "$ROOT/assets/AppIcon.icns" ]; then
  cp "$ROOT/assets/AppIcon.icns" "$APP/Contents/Resources/AppIcon.icns"
fi

cat > "$APP/Contents/MacOS/Affirm Pingu" << 'EOF'
#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_HTML="$ROOT/Resources/app/index.html"
# cache-bust so Chrome --app mode picks up updates
FILE_URL="file://${APP_HTML}?v=$(date +%s)"

launch_chrome_app() {
  local bin="$1"
  exec "$bin" \
    --app="$FILE_URL" \
    --new-window \
    --window-size=1120,820 \
    --disable-features=TranslateUI \
    --disk-cache-size=1 \
    --no-first-run \
    --no-default-browser-check
}

if [ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
  launch_chrome_app "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
elif [ -x "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" ]; then
  launch_chrome_app "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
elif [ -x "/Applications/Chromium.app/Contents/MacOS/Chromium" ]; then
  launch_chrome_app "/Applications/Chromium.app/Contents/MacOS/Chromium"
elif [ -x "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" ]; then
  launch_chrome_app "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
else
  open "$APP_HTML"
fi
EOF

chmod +x "$APP/Contents/MacOS/Affirm Pingu"

cat > "$APP/Contents/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDevelopmentRegion</key>
  <string>zh_CN</string>
  <key>CFBundleExecutable</key>
  <string>Affirm Pingu</string>
  <key>CFBundleIconFile</key>
  <string>AppIcon</string>
  <key>CFBundleIdentifier</key>
  <string>com.shaygu.affirmpingu</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundleName</key>
  <string>Affirm Pingu</string>
  <key>CFBundleDisplayName</key>
  <string>Affirm Pingu</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleShortVersionString</key>
  <string>1.1.0</string>
  <key>CFBundleVersion</key>
  <string>${DATE_VER}</string>
  <key>LSMinimumSystemVersion</key>
  <string>11.0</string>
  <key>NSHighResolutionCapable</key>
  <true/>
</dict>
</plist>
EOF

xattr -dr com.apple.quarantine "$APP" 2>/dev/null || true

touch "$APP"

echo "已更新本机应用：$APP"
echo "请完全退出旧窗口后重新打开 Affirm Pingu.app"
