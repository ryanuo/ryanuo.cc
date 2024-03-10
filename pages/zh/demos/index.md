---
title: '演示 - Ryan CO'
description: '演示 - Ryan CO'
plum: true
display: 演示
demos:
  - name: 'Blazeb2'
    link: 'https://github.com/rr210/blazeB2'
    video: '//player.bilibili.com/player.html?bvid=BV1fv4y1T72e&amp;page=1&muted=true'
    desc: '📷 一款采用 backBlaze B2 API 与 ⚡ Cloudflare 开发的图片床工具，具备 CDN 加速功能' 
    img: './demos.png'
    readme: 'https://github.com/rr210/blazeB2/blob/master/README.md'
    tags: ['Vue2']
    icon: 'demos'
  - name: 'hexo-generator-wxapi'
    link: 'https://www.npmjs.com/package/hexo-generator-wxapi?activeTab=readme'
    desc: '一款生成hexo-Api接口的npm包，基于hexo-generator-restful'
    img: '/demos/carbon.png'
    readme: 'https://github.com/rr210/hexo-generator-wxapi/blob/master/README_en.md'
    tags: ['Hexo','Npm']
    icon: 'demos'
  - name: 'Demos2'
    link: '/demos'
    video: './demos.mp4'
    desc: 'Demos'
    img: './demos.png'
    readme: './demos.md'
    tags: ['demos']
    icon: 'demos'
  - name: 'Demos3'
    link: '/demos'
    video: './demos.mp4'
    desc: 'Demos'
    img: './demos.png'
    readme: './demos.md'
    tags: ['demos']
    icon: 'demos'
---

<Demos :demos="frontmatter.demos"/>