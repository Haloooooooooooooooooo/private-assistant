请在现有 INNEX 收录箱页面基础上做一次视觉升级，要求保留当前所有功能、页面结构和信息层级，只优化视觉风格与 UI 细节。目标是把页面从普通后台管理界面，升级成更有设计感的「现代画报风个人知识工作台」。

## 一、整体风格方向

参考风格关键词：

- 现代画报风
- 黑白灰 + 橙色撞色
- 粗体大字标题
- 几何圆形太阳元素
- 斜切构图
- 代码网格背景
- 理性、克制、高级、有视觉冲击
- 可以用 HTML/CSS 实现，不要复杂 3D，不要过度发光，不要 AI 味

整体配色：

```css
:root {
  --bg-dark: #0B0F0E;
  --bg-deep: #111815;
  --paper: #EFEAE2;
  --paper-light: #F8F4ED;
  --orange: #F15A24;
  --sun: #F6C449;
  --ink: #111111;
  --muted: #6F6B63;
  --line: rgba(0, 0, 0, 0.12);
}
```

页面整体仍然是：

- 左侧深色导航栏
- 顶部 Hero 区
- 快速录入区
- 收录箱列表区

不要改变布局和功能，只做视觉升级。

------

## 二、左侧导航栏

左侧导航保持深色背景，但做得更精致。

要求：

1. 保留 INNEX logo。
2. 保留三个导航项：
   - 收录箱 / INBOX
   - 知识库 / KNOWLEDGE BASE
   - AI 助手 / AI ASSISTANT
3. 当前选中项「收录箱」使用橙色竖条强调。
4. 选中项背景使用深棕黑渐变，不要纯灰色。
5. 左下角保留一句小字：

```text
BUILDING KNOWLEDGE.
INTERNALIZING VALUE.
```

1. 左下角可以加 3 个小方块作为系统状态装饰，其中 1-2 个使用橙色。

------

## 三、顶部 Hero 区

顶部 Hero 是本次改动的重点，要做成更强的画报视觉。

### 1. 背景

Hero 背景使用深色：

- 主背景为 #0B0F0E
- 加入非常淡的代码纹理
- 加入网格线
- 加入斜切几何图形

可以用 CSS 实现：

```css
.hero {
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.04) 0 1px, transparent 1px),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 42px),
    repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 42px),
    #0B0F0E;
}
```

加入几个 absolute 装饰元素：

- 小橙色方块
- 坐标文本
- 系统版本号
- 淡淡的代码片段

例如：

```text
INNEX_SYSTEM v3.2
INTERNALIZATION ENGINE

13.07.25
35°42'10.2"S
150°10'22.1"E
```

------

### 2. 大标题

把顶部标题改成更有冲击力的画报字体：

```text
WELCOME,
HALO
```

要求：

- WELCOME 使用白色 / 米白色。
- HALO 使用亮橙色。
- 字体要非常粗，使用 condensed / impact 风格。
- HALO 比 WELCOME 更大一点。
- 字距压紧。
- 整体靠左居中偏上，形成视觉焦点。

CSS 参考：

```css
.hero-title {
  font-family: Impact, "Arial Black", "Anton", sans-serif;
  font-size: clamp(64px, 7vw, 120px);
  line-height: 0.88;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  color: #F8F4ED;
}

.hero-title .accent {
  display: block;
  color: #F15A24;
  transform: scaleX(0.96);
}
```

HTML 结构参考：

```html
<h1 class="hero-title">
  WELCOME,
  <span class="accent">HALO</span>
</h1>
```

------

### 3. 大圆形太阳元素

参考海报中的大黄色圆形，在 Hero 右侧加入一个巨大圆形色块。

要求：

- 颜色使用 #F6C449 或橙黄色渐变。
- 放在 Hero 右侧偏上。
- 圆形可以被右侧斜切黑色块遮挡一部分，形成画报构图。
- 不要做成 3D 球体，不要强光效，只要平面几何圆。

CSS 参考：

```css
.hero-sun {
  position: absolute;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  right: 18%;
  top: -70px;
  background: radial-gradient(circle, #F6C449 0%, #F15A24 120%);
  opacity: 0.95;
  z-index: 1;
}
```

加入斜切遮挡层：

```css
.hero-cut {
  position: absolute;
  right: 0;
  top: 0;
  width: 38%;
  height: 100%;
  background: linear-gradient(135deg, transparent 0 35%, rgba(255,255,255,0.08) 35% 55%, transparent 55%);
  z-index: 2;
}
```

------

### 4. 右侧标语

保留原来的中文理念，但排版要更像画报标语：

```text
把有价值的信息，
先收进来，再慢慢内化
成自己的知识。
```

要求：

- 放在 Hero 右侧。
- 白色文字。
- 行距稍大。
- 左侧或下方加一条小橙色短线。
- 不要太大，避免抢标题。

------

## 四、快速录入区

快速录入区不要像普通表单卡片，要做成「Capture Console」。

标题结构：

```text
| 快速录入    QUICK CAPTURE
```

要求：

1. 左侧有橙色竖条。
2. 中文标题加粗。
3. 英文小字使用灰色，字距拉开。
4. 整个卡片使用米白色纸张背景。
5. 边框比现在更明确。
6. 加一点非常轻微的纸张纹理，不要脏。
7. 输入框边框使用细线，focus 时橙色高亮。
8. 附件按钮和文件标签改成小票据 / 胶囊风。
9. 「添加记录 +」按钮使用橙色实心按钮， hover 时微微上移。

CSS 参考：

```css
.capture-panel {
  background:
    radial-gradient(circle at 20% 10%, rgba(241,90,36,0.05), transparent 30%),
    linear-gradient(180deg, #F8F4ED, #EFEAE2);
  border: 1px solid rgba(0,0,0,0.16);
  box-shadow: 0 18px 42px rgba(0,0,0,0.08);
  border-radius: 14px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
}

.section-title::before {
  content: "";
  width: 4px;
  height: 22px;
  background: #F15A24;
  border-radius: 2px;
}

.section-title small {
  color: #8A8278;
  letter-spacing: 0.14em;
  font-size: 12px;
}
```

按钮参考：

```css
.primary-btn {
  background: #F15A24;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  padding: 12px 22px;
  box-shadow: 0 8px 18px rgba(241,90,36,0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(241,90,36,0.32);
}
```

------

## 五、收录箱列表区

收录箱区域要从普通表格改成「知识档案板」。

标题结构：

```text
| 收录箱    INBOX
```

要求：

1. 保持表格结构不变。
2. 卡片背景使用米白色。
3. 边框更清晰。
4. 搜索框放在右上角，做成浅色胶囊。
5. Tabs 做成文字导航：
   - 当前选中项橙色
   - 下方橙色细线
6. 筛选按钮使用轻边框小按钮。
7. 表格 header 使用浅米灰背景。
8. 表格每一行 hover 变成极浅橙色。
9. 状态标签优化：
   - 待内化：橙色浅底
   - 已沉淀：绿色浅底
   - 需整理：红色浅底
10. 操作按钮统一为小胶囊样式，减少杂乱感。

CSS 参考：

```css
.inbox-panel {
  background: #F8F4ED;
  border: 1px solid rgba(0,0,0,0.14);
  border-radius: 14px;
  box-shadow: 0 16px 36px rgba(0,0,0,0.06);
}

.tabs .active {
  color: #F15A24;
  font-weight: 700;
  border-bottom: 2px solid #F15A24;
}

.table-row:hover {
  background: rgba(241,90,36,0.06);
}

.status.pending {
  background: rgba(241,90,36,0.12);
  color: #F15A24;
}

.status.done {
  background: rgba(36,160,102,0.12);
  color: #1C8C5A;
}

.status.warning {
  background: rgba(220,70,70,0.12);
  color: #D94A3A;
}

.action-btn {
  border: 1px solid rgba(0,0,0,0.14);
  background: rgba(255,255,255,0.55);
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 12px;
}

.action-btn.orange {
  color: #F15A24;
  border-color: rgba(241,90,36,0.32);
  background: rgba(241,90,36,0.08);
}
```

------

## 六、主内容背景装饰

在主内容区域加入非常淡的画报式水印和小装饰，但不能影响阅读。

可以加入：

```text
CAPTURE SYSTEM
INNER KNOWLEDGE
ORGANIZE
```

要求：

- 超大字体
- 透明度 0.03 - 0.06
- 放在卡片背后
- pointer-events: none
- 不影响用户操作

CSS 参考：

```css
.main-content {
  position: relative;
  background: #EFEAE2;
  overflow: hidden;
}

.main-content::before {
  content: "CAPTURE SYSTEM";
  position: absolute;
  right: 48px;
  top: 360px;
  font-family: Impact, "Arial Black", sans-serif;
  font-size: 120px;
  letter-spacing: -0.06em;
  color: rgba(0,0,0,0.045);
  pointer-events: none;
  z-index: 0;
}

.main-content > * {
  position: relative;
  z-index: 1;
}
```

------

## 七、不能做的事情

请严格遵守：

1. 不要改变功能。
2. 不要改变页面主要布局。
3. 不要把页面做成纯海报，它仍然是一个 Web App。
4. 不要使用复杂 3D。
5. 不要使用难以落地的图片素材。
6. 不要过度发光。
7. 不要加入二维码、条形码。
8. 不要让背景装饰影响内容阅读。
9. 不要改掉左侧导航结构。
10. 不要删除快速录入和收录箱列表。

------

## 八、最终效果目标

最终页面应该像一个「可以实际使用的现代画报风知识工作台」：

- 顶部 Hero 有视觉冲击。
- WELCOME / HALO 具有强字体张力。
- 右侧大圆形几何色块形成记忆点。
- 快速录入区更像专业 Capture Console。
- 收录箱列表更像高级知识档案板。
- 整体有个人产品气质，而不是普通后台模板。
- 所有视觉效果都能用 HTML/CSS 实现。

```

```