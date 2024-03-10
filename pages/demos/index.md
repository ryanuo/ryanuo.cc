---
title: 'Demos - Ryan CO'
description: 'Demos - Ryan CO'
plum: true
display: Demos
demos:
  - name: 'Blazeb2'
    link: 'https://github.com/rr210/blazeB2'
    video: '//player.bilibili.com/player.html?bvid=BV1fv4y1T72e&amp;page=1&muted=true'
    desc: '📷 A picture bed tool developed with backBlazeb2 API & ⚡ Cloudflare, featuring CDN acceleration.'
    img: './demos.png'
    readme: 'https://github.com/rr210/blazeB2/blob/master/README.md'
    tags: ['Vue2','Python','Docker']
    icon: 'demos'
  - name: 'hexo-generator-wxapi'
    link: 'https://www.npmjs.com/package/hexo-generator-wxapi?activeTab=readme'
    desc: 'A npm package that generates Hexo API interfaces, based on hexo-generator-restful.'
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