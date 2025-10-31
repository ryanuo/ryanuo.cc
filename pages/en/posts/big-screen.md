---
title: Adaptive large screen web page design solution
description: in responsive web design there are various ways to ensure that elements are adaptable across different resolutions and devices
date: 2024-02-15 20:38:09
---

> 在响应式Web设计中，有多种方法可以确保元素在不同分辨率和设备上的适应性。以下是三种流行的设计方案和它们的实现方法：

## 方案一：使用vw和vh单位

### 基本概念

- `vw` (viewport width) 是相对于视口宽度的单位，100vw 等于视口宽度的100%。
- `vh` (viewport height) 是相对于视口高度的单位，100vh 等于视口高度的100%。

### 实现方法

以设计稿尺寸为 `1920x1080` 为例，要把px单位转化为vw或vh，公式如下：

```
vwDiv = (300px / 1920px) * 100vw
vhDiv = (200px / 1080px) * 100vh
```

### 注意事项

- 需要对屏幕尺寸的变化进行监听，并在变化时重新计算元素的大小。
- 在Vue项目中，可以使用`element-resize-detector`或自定义的resize指令，帮助自动管理尺寸变化。

## 方案二：使用CSS的scale属性

### 核心思路

通过CSS的`transform: scale(x)`属性对页面进行等比缩放。

### 实现逻辑

- 当屏幕尺寸保持16:9时，内容全屏显示。
- 当屏幕宽高比小于16:9时，页面上下留白，内容比例为16:9。
- 当屏幕宽高比大于16:9时，页面左右留白，内容比例为16:9。

## 方案三：结合rem单位和vw/vh单位

### 实施步骤

1. 确定rem的基准值。
2. 编写JavaScript代码动态地设置`html`元素的`font-size`。
3. 监听屏幕尺寸变化，确保元素随着屏幕大小自动调整以及字体，间距，和位移等的自适应性。

### 示例代码

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const baseWidth = 1920 // 设计稿宽度
  const baseFontSize = 100 // 基准font-size
  const scale = document.documentElement.clientWidth / baseWidth
  document.documentElement.style.fontSize = `${baseFontSize * scale}px`
})

window.addEventListener('resize', () => {
  // 重新计算并设置 font-size
})
```

## 解决大屏问题的库

[fit-screen](https://github.com/jp-liu/fit-screen)
