---
title: Comprehensive and Detailed Study Notes on Pinia
tags: [Study Notes, Pinia]
date: 2022-06-14 15:22:58
description: Pinia study notes, advantages and disadvantages of Pinia, introduction to usage, initializing the store repository, several ways to modify values, destructuring state, getters and actions, Pinia plugins
---

[[toc]]

## Advantages and Disadvantages of Vuex and Pinia

### Advantages of Pinia

- Full TypeScript support: Adding TypeScript is easier compared to Vuex.
- Extremely lightweight (about 1KB in size).
- Store actions are dispatched as regular function calls instead of using the dispatch method or MapAction helper functions, which are common in Vuex.
- Supports multiple stores, Vue devtools, SSR, and webpack code splitting.

### Disadvantages of Pinia

- Does not support debugging features like time travel and editing.

### Advantages of Vuex

- Supports debugging features such as time travel and editing.
- Suitable for large, highly complex Vue.js projects.

### Disadvantages of Vuex

- Starting from Vue 3, the results of getters are no longer cached like computed properties.
- Vuex 4 has some issues related to type safety.

## Introduction to Pinia

- Pinia.js has the following features:

- Full TypeScript support;
- Lightweight, with a compressed size of only about 1KB;
- Removes mutations, leaving only state, getters, and actions;
- Actions support both synchronous and asynchronous operations;
- Flat code structure without module nesting, only the concept of stores, and stores can be freely used with each other. Each store is independent;
- No need to manually add stores; once a store is created, it is automatically added;
- Supports both Vue 3 and Vue 2;

[Introduction to Pinia Usage](https://blog.csdn.net/qq1195566313/article/details/123338137)

## Initializing the Pinia Store Repository

- [Store Repository](https://blog.csdn.net/qq1195566313/article/details/123342785)

## Several Ways to Modify Values in Pinia

- [Ways to Modify Values](https://blog.csdn.net/qq1195566313/article/details/123360349)

## Destructuring State

- Directly destructuring state does not achieve reactivity.
- Use storeToRefs to achieve reactivity for destructured data on the page.

## Actions and Getters in Pinia

- [Getters and Actions](https://blog.csdn.net/qq1195566313/article/details/123376269)

## Pinia Plugins

- [Pinia Caching Plugin](https://blog.csdn.net/qq1195566313/article/details/123431769)
