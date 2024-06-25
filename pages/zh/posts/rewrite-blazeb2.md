---
title: "使用 Next.js 重写 BlazeB2 图像托管服务"
categories: [next]
date: "2024-06-25 20:00:00"
description: "使用 Next.js 重写 BlazeB2 图像托管服务"
---

[[toc]]

| Old page view                                                                | New page view                                                                |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| ![](https://cloud.ryanuo.cc/hexo/2/7039c267-f161-4cf2-ab4b-754159d8e2e3.png) | ![](https://cloud.ryanuo.cc/hexo/2/7039c267-f161-4cf2-ab4b-754159d8e2e3.png) |

Due to the fact that the frame is older, I decided to rewrite it using Next.js. It also has a lot of features that I want to add, and easy to maintain.

## Technical Selection

1. Next.js
2. Tailwind CSS
3. shadcn/ui

## Plan Design Features

1. support config(config.json).
2. support upload(drag、paste、click、select).
3. support download (download once、download selected).
4. support delete (delete once、delete selected).
5. support sort (name、size、time).
6. support preview (image、video、audio).
7. support copy markdown link or html link.
8. support pwa (offline support).
9. support dark mode.
10. support multi-language.
11. support image masonry Layouts or gird Layouts.
12. support image watermark/compress.
13. support and so on ...

## Design Inspiration Source

- [File manager UI](https://dribbble.com/shots/22846049-File-manager-UI)
- [Photo Management](https://dribbble.com/shots/18526739-Photo-Management)

## Development
