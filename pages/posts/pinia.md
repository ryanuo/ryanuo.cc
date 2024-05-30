---
title: Pinia Study Notes
tags: [学习笔记,pinia]
date: 2022-06-14 15:22:58
description: pinia study notes advantages and disadvantages of pinia introduction to use initializing the store repository several ways to modify values destructuring state getters and actions pinia plugins
---

[[toc]]

## Vuex 和 Pinia 的优缺点

### Pinia的优点

- 完整的 TypeScript 支持：与在 Vuex 中添加 TypeScript 相比，添加 TypeScript 更容易极其轻巧(体积约 1KB);store 的 action 被调度为常规的函数调用，而不是使用 dispatch 方法或 MapAction 辅助函数，这在 Vuex 中很常见支持多个Store,支持 Vue devtools、SSR 和 webpack 代码拆分。

### Pinia的缺点

- 不支持时间旅行和编辑等调试功能

### Vuex的优点

- 支持调试功能，如时间旅行和编辑
- 适用于大型、高复杂度的Vue.js项目

### Vuex的缺点

- 从 Vue 3 开始，getter 的结果不会像计算属性那样缓存
- Vuex 4有一些与类型安全相关的问题

## pinia介绍

- Pinia.js 有如下特点：

- 完整的 ts 的支持；
- 足够轻量，压缩后的体积只有1kb左右;
- 去除 mutations，只有 state，getters，actions；
- actions 支持同步和异步；
- 代码扁平化没有模块嵌套，只有 store 的概念，store 之间可以自由使用，每一个store都是独立的
- 无需手动添加 store，store 一旦创建便会自动添加；
- 支持Vue3 和 Vue2；

[pinia使用介绍](https://blog.csdn.net/qq1195566313/article/details/123338137)

## pinia初始化store仓库

- [store仓库](https://blog.csdn.net/qq1195566313/article/details/123342785)

## pinia修改值的几种方式

- [修改值的几种方式](https://blog.csdn.net/qq1195566313/article/details/123360349)

## 解构state

- 直接解构state无法实现响应式
- 使用storeToRefs将解构后 实现页面数据的响应式

## pinia中的actions和getters

- [getter和actions](https://blog.csdn.net/qq1195566313/article/details/123376269)

## pinia插件

- [pinia缓冲插件](https://blog.csdn.net/qq1195566313/article/details/123431769)
