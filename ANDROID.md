# Affirm Pingu → 三星 APK 可行方案

你这台电脑目前 **没有 Java / Android SDK**，所以不能直接在本机打出 APK。  
项目里已经接好 **Capacitor Android**，可以用下面任一方案拿到安装包。

---

## 方案 A（推荐）：装 Android Studio，本机出 APK

适合：想马上在三星手机安装，文件在自己电脑上。

### 1. 安装（只做一次）
1. 下载安装 [Android Studio](https://developer.android.com/studio)
2. 打开后按向导安装 **Android SDK**（默认即可）
3. 安装时会带上 JDK

### 2. 在本项目打包
在终端执行：

```bash
cd ~/Desktop/affirm-pingu
npm run cap:open
```

会自动同步网页资源并打开 Android Studio。

### 3. 生成 APK
在 Android Studio：
1. 菜单 **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. 完成后点 **locate**，或到：

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

### 4. 传到三星手机安装
- 用数据线 / 微信 / 网盘 把 `app-debug.apk` 发到手机
- 手机打开该文件 → 允许「安装未知应用」→ 安装

以后改了页面代码，再执行一次：

```bash
npm run cap:open
```

然后重新 Build APK。

---

## 方案 B：GitHub Actions 云端打包（电脑不装 Android Studio）

适合：代码已推到 GitHub。

1. 把本仓库推到 GitHub
2. 打开仓库 → **Actions** → **Build Android APK** → **Run workflow**
3. 跑完后在该次运行页底部 **Artifacts** 下载 `Affirm-Pingu-debug`
4. 解压得到 `app-debug.apk`，发到手机安装

工作流文件已在：`.github/workflows/android-apk.yml`

---

## 方案 C：PWABuilder（网页转 APK，最快试装）

1. 先把网站部署到公网 HTTPS（如 Netlify / Cloudflare Pages / Vercel）
2. 打开 https://www.pwabuilder.com/
3. 填你的网址 → 生成 Android 包并下载
4. 安装到手机（同样要允许未知来源）

注意：这个包依赖你的网站在线可访问；本地 `file://` 或临时隧道不太适合长期用。

---

## 现在项目里已准备好的东西

| 内容 | 路径 |
|------|------|
| Capacitor 配置 | `capacitor.config.json` |
| Android 工程 | `android/` |
| 网页同步脚本 | `npm run www` / `npm run cap:sync` |
| 一键打开 Android Studio | `npm run cap:open` |
| GitHub 打 APK 流程 | `.github/workflows/android-apk.yml` |

---

## 我建议你怎么选

1. **想最快拿到可装的 APK**：选 **方案 A**（装 Android Studio）
2. **不想在电脑装大软件**：把项目推 GitHub，用 **方案 B**
3. **已经有公网网址**：可用 **方案 C**

装好 Android Studio 之后跟我说一声，我可以继续帮你点到生成 APK、确认文件位置。
