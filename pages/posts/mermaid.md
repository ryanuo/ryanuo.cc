---
title: "Integrating Text Rendering Flowchart Plugins"
date: 2024-03-01 15:30:00
description: Plant Uml Mermaid
---

[[toc]]

<style>
  img[alt="uml diagram"] {
            border: 1px dashed #000;
            max-width: 30%;
            height: auto;
            display: block;
            margin: 20px auto;
          border-radius: 6px;
 }
 .mermaid svg{
   margin: 20px auto;
 }
</style>

## 是什么？

Mermaid 是一个基于JavaScript的图表和图表工具，可呈现Markdown启发的文本定义以动态创建和修改图表。[Docs](https://mermaid.js.org/intro/)

PlantUML 是一个多功能组件，可快速、直接地创建图表。[PDF](https://plantuml.com/zh/guide)

## 调研选择

### markdown-it-plantuml

[github](https://www.npmjs.com/package/markdown-it-plantuml)

```ts
import plantuml from 'markdown-it-plantuml'
import Markdown from 'unplugin-vue-markdown/vite'
export default defineConfig({
  plugins: [
    Markdown({
      async markdownItSetup(md) {
        md.use(plantuml, {
          server: 'http://www.plantuml.com/plantuml',
        })
      },
    }),
  ],
})
```

这样就部署好了。
但是因为这个插件是将PlantUML代码发送到PlantUML服务器，考虑到远程服务器可能会增加渲染图表的时间，并且服务器部署在国外（国内用户访问较慢，实际的体验不是很好）。
想折腾可部署一个在线服务，使用[docker](https://plantuml.com/zh/starting)部署

### markdown-it-textual-uml

<span style="color:#28437e">[推荐]</span>

用于基于plantuml，mermaid等从文本创建uml图。[地址](https://github.com/manastalukdar/markdown-it-textual-uml)
Mermaid相对于PlantUML而言，更简单易用且无需服务器，适合快速创建各种图表。

```ts
import textualUml from 'markdown-it-textual-uml'
import Markdown from 'unplugin-vue-markdown/vite'
export default defineConfig({
  plugins: [
    Markdown({
      async markdownItSetup(md) {
        md.use(textualUml)
      },
    }),
  ],
})
```

````
```plantuml
Bob -> Alice : hello
```
````

```plantuml
Bob -> Alice : hello
```

使用**mermaid**的注意事项。[Here](https://github.com/manastalukdar/markdown-it-textual-uml?tab=readme-ov-file#additional-steps-for-mermaid)

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
