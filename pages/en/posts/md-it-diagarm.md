---
title: "Markdown-it Diagram: A Powerful Plugin for Flowcharts"
date: 2024-06-08 21:01
tags: [markdown, plugin]
categories: markdown
description: "A control plugin for drawing flowcharts in markdown syntax"
---

| [![npm version][npm-version-src]][npm-version-href] | [![npm downloads][npm-downloads-src]][npm-downloads-href] | [![bundle][bundle-src]][bundle-href] | [![JSDocs][jsdocs-src]][jsdocs-href] | [![License][license-src]][license-href] |
| --------------------------------------------------- | --------------------------------------------------------- | ------------------------------------ | ------------------------------------ | --------------------------------------- |

`markdown-it-diagram `is a markdown-it plugin for creating diagrams in Markdown documents. It supports mermaid and plantuml, and also provides control functions such as zooming and moving.

[npm-version-src]: https://img.shields.io/npm/v/markdown-it-diagram?style=flat&colorA=080f12&colorB=5e5e5e
[npm-version-href]: https://npmjs.com/package/markdown-it-diagram
[npm-downloads-src]: https://img.shields.io/npm/dm/markdown-it-diagram?style=flat&colorA=080f12&colorB=5e5e5e
[npm-downloads-href]: https://npmjs.com/package/markdown-it-diagram
[bundle-src]: https://img.shields.io/bundlephobia/minzip/markdown-it-diagram?style=flat&colorA=080f12&colorB=5e5e5e&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=markdown-it-diagram
[license-src]: https://img.shields.io/github/license/rr210/markdown-it-diagram.svg?style=flat&colorA=080f12&colorB=5e5e5e
[license-href]: https://github.com/ryanuo/markdown-it-diagram/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=5e5e5e
[jsdocs-href]: https://www.jsdocs.io/package/markdown-it-diagram

## UML 示例

Markdown supports：[plantuml](https://plantuml.com/)、[mermaid](https://github.com/mermaid-js/mermaid)、[dot](https://graphviz.gitlab.io/doc/info/lang.html)、[ditaa](https://ditaa.sourceforge.net/)

## Features

- Support PlantUML、Mermaid、Dot、Ditaa syntax;
- Support zoom、move、rough、download、copy origin code and soon contorls;
- Support Shift and mouse wheel to zoom in or out;
- Support modal preview;
- Support long press mouse click to drag the chart

### PlantUML

[try it](https://www.plantuml.com/plantuml/uml/)

````
```plantuml
Bob -> Alice : Chào cô, chúc cô buổi trưa vui vẻ!
```
````

```plantuml
Bob -> Alice : Chào cô, chúc cô buổi trưa vui vẻ!
```

### DOT

````
```dot
digraph example1 {
    1 -> 2 -> { 4, 5 };
    1 -> 3 -> { 6, 7 };
}
```
````

```dot
digraph example1 {
    1 -> 2 -> { 4, 5 };
    1 -> 3 -> { 6, 7 };
}
```

### ditaa

> **Warning**: In PlantUML, only PNG, ASCII Art image generation is supported.

````
```ditaa
+--------+   +-------+    +-------+
    |        | --+ ditaa +--> |       |
    |  Text  |   +-------+    |diagram|
    |Document|   |!magic!|    |       |
    |     {d}|   |       |    |       |
    +---+----+   +-------+    +-------+
        :                         ^
        |       Lots of work      |
        +-------------------------+
```
````

```ditaa
+--------+   +-------+    +-------+
    |        | --+ ditaa +--> |       |
    |  Text  |   +-------+    |diagram|
    |Document|   |!magic!|    |       |
    |     {d}|   |       |    |       |
    +---+----+   +-------+    +-------+
        :                         ^
        |       Lots of work      |
        +-------------------------+
```

### mermaid

````
```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
````

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

## Installation

```bash
npm install markdown-it-diagram --save
```

## Usage

### Vite Configuration

```ts
// vite.config.ts
import MarkdownItDiagrams from 'markdown-it-diagram'
import Markdown from 'unplugin-vue-markdown/vite'

export default defineConfig({
  plugins: [
    Markdown({
      markdownItSetup(md) {
        md.use(MarkdownItDiagrams, {
          showController: true, // show controller,default:false
          /**
           * PlantUML options
           * ditaa:imageFormat 'png| txt'
           * plantuml: imageFormat'png| svg| txt'
           * dot: imageFormat'png| svg| txt'
           */
          // imageFormat: 'svg', // image format:svg|png|txt,default:svg
          // server: '', // plantuml server,default:http://www.plantuml.com/plantuml
          // ditaa: {
          // imageFormat: 'svg', // image format:png|txt,default:svg
          // server: '', // plantuml server,default:http://www.plantuml.com/plantuml
          // }
        })
      }
    })
  ]
})
```

If you open the controller, you need to import the script in the initialization.
vue3 example:

```vue
<script setup lang="ts">
import { markdownItDiagramDom } from 'markdown-it-diagram/dom'
import { onMounted } from 'vue'

onMounted(async () => {
  // if you want to use mermaid, you need to install mermaid.js
  // npm install mermaid
  // import mermaid from 'mermaid'
  mermaid.initialize({ startOnLoad: false })
  await mermaid.run()
  // initialize markdown-it-diagram/dom script
  await markdownItDiagramDom()
})
</script>
```
