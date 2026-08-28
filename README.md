# Affirm Pingu

像素风粉色 laptop 肯定语计数器。已做成可双击打开的本机应用。

## 打开方式

桌面上已有：

**`Affirm Pingu.app`**

双击即可，会以独立窗口打开（不是浏览器标签页）。需要本机已安装 Chrome / Edge / Brave 之一。

也可在终端运行：

```bash
open ~/Desktop/Affirm\ Pingu.app
```

想放到「应用程序」里：

```bash
cp -R ~/Desktop/Affirm\ Pingu.app /Applications/
```

## 改代码后重新同步到 App

在项目目录执行：

```bash
npm run app
```

## 可选：Electron 版本

若网络能下载 Electron，也可以：

```bash
export ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
npm install
npm start
```

## 功能

- **空格键**：今日 affirm +1，企鹅跳跃
- **左侧面板**：日历 / 列表切换，查看每日次数
- **下方输入框**：肯定语（机打字体）
- 数据保存在本机，重启不会丢失
