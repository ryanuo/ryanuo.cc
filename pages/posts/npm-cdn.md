---
title: Frontend npm CDN Alternative Solutions Overview
date: 2024-02-01 15:30:00
description: Detailed Overview of Domestic Frontend npm CDN Alternative Solutions, including Classic Established CDN Acceleration, Domestic Available CDNs, and Comparatively Recommended CDNs, to assist developers in better choosing suitable CDN acceleration services.
---
[[toc]]

## 经典老牌的CDN加速
- [unpkg.com](https://unpkg.com)
- [cdn.jsdelivr.net](https://cdn.jsdelivr.net)
- [fastly.jsdelivr.net](https://fastly.jsdelivr.net)

使用方法：直接进官网，搜NPM包名使用。

缺点：有时候不是很稳定，而且国内有些地方没法访问。

## 国内能用的CDN
- [BootCDN](https://www.bootcdn.cn)
- [七牛云](https://www.staticfile.org)
- [360](http://cdn.baomitu.com)
- [字节跳动](https://cdn.bytedance.com)

使用方法：直接进官网，搜NPM包名使用。

缺点：这些CDN并不全，某些NPM包在这些CDN上找不到。

## 比较推荐的CDN
- 知乎: [unpkg.zhimg.com](https://unpkg.zhimg.com)
- [jsd.onmicrosoft.cn](https://jsd.onmicrosoft.cn) (回源jsDelivr)
- [npm.onmicrosoft.cn](npm.onmicrosoft.cn) (回源UNPKG)
- [cdnjs.onmicrosoft.cn](cdnjs.onmicrosoft.cn) (回源cdnjs)

使用方法：参考unpkg、jsdelivr等的使用方法，更换CDN的域名即可。

优点：CDN包更全一些，能搜到的NPM包与unpkg上的基本一致。
