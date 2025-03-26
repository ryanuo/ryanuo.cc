---
title: 记一次使用swiper遇到的问题
date: 2024-03-01 17:08:00
description:  Swiper拦截了点击事件，解决方法是调整Swiper的配置，防止Swiper拦截Select组件的点击事件。
---

## 问题描述

在使用Swiper实现内容滑动的Web应用中，Ant Design（antd）的Select组件下拉框无法被触发。

## 问题复现

1. 在Web页面中引入Swiper和Ant Design组件库。
2. 在Swiper组件中添加Select组件。
3. 尝试点击Select以展开下拉列表。

```tsx
<Swiper>
  <SwiperSlide>
    <Select>
      <Select.Option value="1">选项1</Select.Option>
      <Select.Option value="2">选项2</Select.Option>
    </Select>
  </SwiperSlide>
</Swiper>
```

<iframe src="https://codesandbox.io/p/devbox/ancient-rain-z75sgv?file=%2Fsrc%2FApp.tsx&embed=1"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="ancient-rain"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 发生原因

- Swiper拦截了点击事件。

## 解决方法

调整Swiper的配置
防止Swiper拦截Select组件的点击事件。

```ts
const swiper = new Swiper('.swiper-container', {
  simulateTouch: false,
  // 其他必要配置...
})
```

### 参考文档

[Swiper simulateTouch](https://www.swiper.com.cn/api/touch/56.html)

[swiper plugin causes select can not pop drop-down box](https://stackoverflow.com/questions/16997628/swiper-plugin-causes-select-can-not-pop-drop-down-box)
