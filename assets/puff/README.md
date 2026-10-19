# 棉棉 Puff · 角色组件包 v0.3

一团会呼吸的磨砂玻璃棉花。这个包里有角色的全部样式、动效、交互逻辑和静态素材，可以直接放进 Web / H5 / WebView 里用，也可以作为原生重做的参考。

## 包里有什么

| 文件 | 用途 |
|---|---|
| `puff.js` | 组件本体：渲染角色、配件、7 种颜色、4 种动作、点击随机动作、计数模式掉棉花。无依赖。 |
| `puff.css` | 所有样式和动画关键帧，类名全部以 `pf-` 开头。 |
| `tokens.json` | 颜色、动作时长、点击概率、计数规则，给开发或做原生版本时对照。 |
| `demo.html` | 演示页，双击用浏览器打开就能玩。 |
| `assets/colors/` | 7 色角色静态 SVG（发呆状态）。 |
| `assets/accessories/` | 粉色角色戴各种配件的静态 SVG，含两套组合（工作、裹成一团）。 |
| `assets/expressions/` | 三种眼睛：平时、挤眼、睡着。 |
| `assets/cotton/` | 7 色掉落棉花团 SVG。 |
| `assets/png/` | 以上全部素材的 PNG，@1x / @2x / @3x。 |

## 快速开始

### 普通网页 / H5 / WebView

```html
<link rel="stylesheet" href="puff.css">
<div id="puff" style="width: 100%; height: 520px"></div>
<script src="puff.js"></script>
<script>
  const puff = Puff.create(document.getElementById('puff'), {
    color: 'pink',
    size: 320,               // 角色尺寸，px
    onCount: (count, combo) => console.log(count, combo)
  });
</script>
```

### React

```jsx
import { useEffect, useRef } from 'react';
import Puff from './puff/puff.js';
import './puff/puff.css';

export function PuffView({ color = 'pink', mode = 'normal', onCount }) {
  const box = useRef(null);
  const inst = useRef(null);
  useEffect(() => {
    inst.current = Puff.create(box.current, { color, mode, size: 320, onCount });
    return () => inst.current.destroy();
  }, []);
  useEffect(() => { inst.current?.set({ color }); }, [color]);
  useEffect(() => { inst.current?.setMode(mode); }, [mode]);
  return <div ref={box} style={{ width: '100%', height: 480 }} />;
}
```

Vue 同理：`onMounted` 里 `create`，`onBeforeUnmount` 里 `destroy`。

## API

### `Puff.create(container, options)` → 实例

| 参数 | 默认 | 说明 |
|---|---|---|
| `color` | `'pink'` | `pink` `white` `black` `blue` `green` `orange` `rose` |
| `hat` `glasses` `headphones` `blanket` | `false` | 配件开关，可以叠加 |
| `hold` | `'none'` | 手上拿的：`'none'` `'laptop'` `'pillow'`，二选一 |
| `mode` | `'normal'` | `'normal'` 点击随机动作；`'count'` 点击计数掉棉花 |
| `size` | `420` | 角色尺寸（px），所有动效按比例缩放 |
| `autoPlay` | `true` | 发呆时每 3–7 秒自己随机做一个动作 |
| `background` | `true` | 是否画舞台渐变背景；设成 `false` 背景透明，方便叠在你自己的页面上 |
| `onTap(info)` | – | 每次点击回调 |
| `onAction(name)` | – | 每次开始播放动作 |
| `onCount(count, combo)` | – | 计数变化；连击结束时会再回调一次，`combo` 为 0 |

### 实例方法

| 方法 | 说明 |
|---|---|
| `play(name)` | 播放动作：`'hop'` `'float'` `'press'` `'fog'` |
| `tap()` | 模拟一次点击 |
| `set(patch)` | 改外观，传哪些改哪些，例如 `set({ color: 'blue', hat: true })` |
| `setMode(mode)` | 切换 `'normal'` / `'count'` |
| `setAutoPlay(bool)` | 开关自动动作 |
| `getState()` | 当前外观、模式、计数、是否睡着、正在播放的动作 |
| `getCount()` / `resetCount()` | 读取 / 清零计数 |
| `destroy()` | 停掉所有计时器并移除 DOM |

### 工具函数

- `Puff.renderSVG({ color, hat, ..., eyes: 'squeeze', standalone: true })` → SVG 字符串，可存文件或当头像。
- `Puff.renderCottonSVG(color, true)` → 单个棉花团 SVG。
- `Puff.THEMES` / `Puff.COLORS` / `Puff.DURATIONS` / `Puff.TAP_WEIGHTS` / `Puff.IDLE_WEIGHTS`

## 动作和规则

| 动作 | 时长 | 点击触发概率 | 发呆自动概率 | 说明 |
|---|---|---|---|---|
| `hop` 弹跳 | 0.92s | 40% | 55% | 压扁蓄力 → 拉长起跳 → 落地压扁回弹，影子同步缩放 |
| `float` Z 字飘浮 | 3.65s | 25% | 25% | 左右左斜着飘上去，悬停晃两下，落回 |
| `press` 贴屏幕 | 2.65s | 20% | 12% | 3D 透视冲向镜头，贴住时横向压扁、眼睛挤成缝，背景后退变虚 |
| `fog` 哈气画笑脸 | 5.25s | 15% | 8% | 靠近哈气，白雾铺满，蹭出眼睛和笑弧，退回，雾散 |

- **常驻动画**：呼吸 3.4s 一周期（睡着时 5.6s），七个棉花小团错开胀缩，约 4.8s 眨一次眼。
- **睡觉**：`hold: 'pillow'` 即进入睡眠，眼睛变月牙、冒 Zz、呼吸变慢，不再自动做动作（点击仍然会响应）。
- **计数模式**：
  - 每次点击计数 +1，身体被按扁一下，眼睛挤成 >< 约 0.3s。
  - 掉落数量 = `min(9, 1 + floor(最近 1 秒点击次数 × 0.9))`，点得越快掉得越多。
  - 同屏最多 40 团，循环复用。停手 2.3s 后连击归零，地上的棉花清掉。
  - 计数数字和连击文案由你的 App 自己画，组件通过 `onCount` 给你数据（演示页有例子）。

## 放进原生 App（iOS / Android / Flutter / 小程序）

- **最快的方式**：用 WebView 加载一个只放了 `puff.js` + `puff.css` 的本地页面，通过 JS Bridge 调 `set` / `play` / `setMode`，把 `onCount` 回传给原生。
- **想要原生渲染**：建议设计侧用 Rive 或 Lottie 按本包重做一遍。`tokens.json` 里有全部颜色、时长和概率；SVG 素材可以直接导入作为图层底稿。注意贴屏幕动作依赖 3D 透视（`perspective: 700px`、`translateZ` 约 395px），在 Lottie 里需要用缩放 + 透视变形近似。
- **小程序**：不支持 SVG 内联动画，建议用 PNG 序列或 Lottie（`lottie-miniprogram`）。

## 其他说明

- **系统"减少动态效果"**：系统开了这个选项时，所有动画会自动关掉，角色保持静止，交互仍然可用。
- **性能**：
  - 动画全部是 CSS transform / opacity，跑在合成层。
  - 背景渐变和角色身体用了几处 SVG 模糊滤镜。低端安卓 WebView 上如果掉帧，可以先关掉 `background`，或者把 `size` 调小。
- **哈气雾**：雾是半透明白色遮罩，没有真正的背景模糊。如果真做模糊，擦出来的笑脸也会一起糊掉，就看不出"擦干净"的效果。
- **静态素材的光影**：SVG 素材里的模糊光影，在某些设计工具（比如 Figma 导入）里可能显示得稍微不一样。要做精确的视觉稿，以 PNG 为准。
