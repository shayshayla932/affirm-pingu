#!/usr/bin/env python3
from pathlib import Path

css = Path("/Users/shaygu/Desktop/affirm-pingu/styles.css")
t = css.read_text()

# --- root tokens: light Sequence ---
old_root = """:root {
  /* Sequence-like product palette */
  --bg: #f7f8fa;
  --bg-deep: #eef1f6;
  --surface: #ffffff;
  --ink: #111a25;
  --ink-soft: #344054;
  --muted: #667085;
  --line: #e4e7ec;
  --accent: #5e5cff;
  --accent-deep: #4a48e6;
  --accent-soft: #eeedff;
  --accent-glow: rgba(94, 92, 255, 0.18);
  --violet: #716fff;
  --violet-soft: #d7caf2;
  --blue: #0062ff;
  --success: #0acf83;
  /* Pale pink device chrome (kept on purpose) */
  --pink-shell: #ffe4ef;
  --pink-deep: #ffd0e2;
  --pink-shadow: #f5b8ce;
  --pink-border: #f7c4d8;
  --pink-highlight: #fff5f9;
  --shell: var(--pink-shell);
  --shell-deep: var(--pink-deep);
  --shell-shadow: var(--pink-shadow);
  --screen-edge: #1d1d20;
  --navy: #111a25;
  --sea: #5e5cff;
  --sea-deep: #0062ff;
  --ice: #ffffff;
  --ice-blue: #c0e6ff;
  --hud: rgba(17, 26, 37, 0.55);
  --hud-border: rgba(255, 255, 255, 0.14);
  --yellow: #5e5cff;
  --orange: #ff6b95;
  --mint: #5e5cff;
  --mint-deep: #4a48e6;
  --pixel: "Inter", "Noto Sans SC", system-ui, sans-serif;
  --cute: "Inter", "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --home-bg-color: #111a25;
  --chat-bg-color: #f4f6fb;
}"""

new_root = """:root {
  /* Sequence light product palette */
  --bg: #ffffff;
  --bg-deep: #f7f7f7;
  --surface: #ffffff;
  --ink: #1a1a1a;
  --ink-soft: #344054;
  --muted: #667085;
  --line: #e8eaef;
  --accent: #716fff;
  --accent-deep: #5e5cff;
  --accent-soft: #eeedff;
  --accent-glow: rgba(113, 111, 255, 0.16);
  --violet: #716fff;
  --violet-soft: #d7caf2;
  --sky: #c0e6ff;
  --mist: #f6f2fa;
  --grad-main: linear-gradient(to right, #c0e6ff, #f6f2fa 70%);
  --grad-hero: radial-gradient(64% 77% at 52% 106%, #fff 15%, #d7caf2 34%, rgba(215, 202, 242, 0.4) 100%);
  --grad-soft: linear-gradient(180deg, #f7f7f7 0%, #ffffff 100%);
  --blue: #0062ff;
  --success: #0acf83;
  --cta: #1a1a1a;
  /* Pale pink device chrome */
  --pink-shell: #ffe4ef;
  --pink-deep: #ffd0e2;
  --pink-shadow: #f5b8ce;
  --pink-border: #f7c4d8;
  --pink-highlight: #fff5f9;
  --shell: var(--pink-shell);
  --shell-deep: var(--pink-deep);
  --shell-shadow: var(--pink-shadow);
  --screen-edge: #1a1a1a;
  --navy: #f6f2fa;
  --sea: #716fff;
  --sea-deep: #5e5cff;
  --ice: #ffffff;
  --ice-blue: #c0e6ff;
  --hud: rgba(255, 255, 255, 0.78);
  --hud-border: rgba(26, 26, 26, 0.08);
  --yellow: #716fff;
  --orange: #ff6b95;
  --mint: #716fff;
  --mint-deep: #5e5cff;
  --pixel: "Inter", "Noto Sans SC", system-ui, sans-serif;
  --cute: "Inter", "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --home-bg-color: #f6f2fa;
  --chat-bg-color: #f6f2fa;
}"""

if old_root not in t:
    raise SystemExit("root block not found")
t = t.replace(old_root, new_root)

# body background → Sequence gradients
t = t.replace(
"""body {
  font-family: var(--cute);
  color: #fff;
  background:
    radial-gradient(ellipse at 15% 0%, rgba(215, 202, 242, 0.55) 0%, transparent 42%),
    radial-gradient(ellipse at 90% 10%, rgba(192, 230, 255, 0.45) 0%, transparent 40%),
    radial-gradient(ellipse at 50% 100%, rgba(255, 212, 226, 0.35) 0%, transparent 45%),
    linear-gradient(180deg, #ffffff 0%, #f7f8fa 55%, #eef1f6 100%);""",
"""body {
  font-family: var(--cute);
  color: var(--ink);
  background:
    var(--grad-hero),
    linear-gradient(to right, #c0e6ff, #f6f2fa 70%),
    linear-gradient(180deg, #ffffff 0%, #f7f7f7 100%);"""
)

# screen light
t = t.replace(
"""  background: var(--navy);
  border: 1px solid rgba(17, 26, 37, 0.55);
  border-radius: 16px;
  overflow: hidden;
  display: grid;
  grid-template-columns: var(--rail-w, 58px) 1fr;
  grid-template-rows: 1fr;
  isolation: isolate;
  transition: grid-template-columns 0.28s ease;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.screen.rail-collapsed {
  --rail-w: 44px;
}

.screen.drawer-open {
  grid-template-columns: var(--rail-w, 58px) 272px 1fr;
}

.screen.rail-collapsed.drawer-open {
  grid-template-columns: var(--rail-w, 44px) 272px 1fr;
}""",
"""  background:
    linear-gradient(to right, rgba(192, 230, 255, 0.9), rgba(246, 242, 250, 0.95) 70%),
    #f6f2fa;
  border: 1px solid rgba(26, 26, 26, 0.08);
  border-radius: 16px;
  overflow: hidden;
  display: grid;
  grid-template-columns: var(--rail-w, 58px) 1fr;
  grid-template-rows: 1fr;
  isolation: isolate;
  transition: grid-template-columns 0.28s ease;
  color: var(--ink);
}

.screen.rail-collapsed {
  --rail-w: 0px;
}

.screen.drawer-open {
  grid-template-columns: var(--rail-w, 58px) 272px 1fr;
}

.screen.rail-collapsed.drawer-open {
  grid-template-columns: 0px 272px 1fr;
}"""
)

# scene bg light
t = t.replace("background: #06122e;", "background: #f6f2fa;")
t = t.replace(
"""  background:
    radial-gradient(ellipse at center, transparent 50%, rgba(4, 12, 30, 0.28) 100%);""",
"""  background:
    radial-gradient(ellipse at center, transparent 58%, rgba(215, 202, 242, 0.22) 100%);"""
)
t = t.replace("var(--home-bg-color, #06122e)", "var(--home-bg-color, #f6f2fa)")

css.write_text(t)
print("pass1 ok")
