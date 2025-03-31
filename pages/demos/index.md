---
title: 'Demos | Ryan uo'
description: 'Demos | Ryan uo'
plum: true
isHidenTitle: true
demos:
  2024:
    - name: 'Markdown-It-Diagram'
      link: 'https://github.com/ryanuo/markdown-it-diagram'
      desc: 'markdown-it-diagram is a markdown-it plugin for diagram. It supports mermaid, plantuml. It supports contorls like zoom, move.'
      img: '/demos/m-it-d.png'
      tag: ['markdown-it', 'mermaid', 'plantuml']
      readme: 'https://github.com/ryanuo/markdown-it-diagram/blob/main/README.md'
    - name: 'Own Cover'
      link: 'https://github.com/ryanuo/own-cover'
      desc: 'This is a simple web app that allows you to upload an image and get a cover of your choice.'
      readme: 'https://github.com/ryanuo/own-cover/blob/master/README.md'
      img: '/demos/own-cover.png'
      tags: [nuxt]
    - name: 'My Website'
      link: 'https://github.com/ryanuo/harry.me'
      desc: 'My personal website includes personal introduction, various third-party platforms, front-end common knowledge organization, blog, project introduction, and demo display,designed by Antfu Boss'
      img: '/demos/page-dark.png'
      readme: 'https://github.com/ryanuo/harry.me/blob/master/README.md'
      tags: ['Vue3','Markdown','UnoCSS']
    - name: Auto Navs
      link: https://github.com/ryanuo/navs
      desc: Summary of front-end navigation external links,automatic link status check is supported
      img: '/demos/navs.png'
      readme: 'https://github.com/ryanuo/navs/blob/master/README.md'
      tags: ['Python','Github Action','Yaml']
  2023:
    - name: 'Tv-Data-Ana'
      link: 'https://github.com/ryanuo/tv-data-ana'
      desc: 'TV series data analysis and visualization system (Douban), including many visual analysis and integrated AI intelligent analysis.'
      img: '/demos/tv.gif'
      readme: 'https://github.com/ryanuo/tv-data-ana/blob/master/README.md'
      tags: ['React','Django','Playwright','Echarts']
    - name: 'cat-data-ana'
      link: 'https://github.com/ryanuo/cat-data-ana'
      desc: 'Visualization analysis of cat data on the Pet Cat Network and integrated AI intelligent analysis.'
      img: '/demos/cat.gif'
      readme: 'https://github.com/ryanuo/cat-data-ana/blob/master/README.md'
      tags: ['React','FastAPI','Echarts']
  2022:
    - name: 'Blazeb2'
      link: 'https://github.com/ryanuo/blazeB2'
      video: '//player.bilibili.com/player.html?bvid=BV1fv4y1T72e&amp;page=1&muted=true'
      desc: '📷 A picture bed tool developed with backBlazeb2 API & ⚡ Cloudflare, featuring CDN acceleration.'
      img: '/demos/blazeb2.png'
      readme: 'https://github.com/ryanuo/blazeB2/blob/master/README.md'
      tags: ['Vue2','Python','Docker']
    - name: 'Git Commit Echarts'
      link: https://github.com/ryanuo/github_commit_echarts
      video: '//player.bilibili.com/player.html?bvid=BV1QS4y1R7rx&amp;page=1&muted=true'
      desc: 'A 3D visualization chart for the number of commits to open source projects on GitHub'
      img: '/demos/git.gif'
      tags: ['GIT','Echarts3d']
    - name: 'Pest Identification'
      link: https://github.com/ryanuo/bs2022
      video: '//player.bilibili.com/player.html?bvid=BV1UN4y137yk&amp;page=1&muted=true'
      desc: 'A deep learning-based Chinese herbal medicine pest identification system, developed using the Flask framework'
      tags: [Flask,Vue3]
    - name: 'hexo-wx-api'
      link: https://github.com/ryanuo/hexo-wx-api
      desc: 'A personal blog WeChat Mini Program that configures Hexo plugin to generate JSON data interface, compatible with various theme versions based on Hexo'
      tags: ["wx",'Hexo']
      img: /demos/wx.png
    - name: 'hexo-generator-wxapi'
      link: 'https://www.npmjs.com/package/hexo-generator-wxapi?activeTab=readme'
      desc: 'A npm package that generates Hexo API interfaces, based on hexo-generator-restful.'
      img: '/demos/carbon.png'
      readme: 'https://github.com/ryanuo/hexo-generator-wxapi/blob/master/README_en.md'
      tags: ['Hexo','Npm']
      icon: 'demos'

  2021:
    - name: 'Assessment Form'
      desc: 'the whole school teacher evaluation form development deployment of internal and external services using vue2 0 development'
      img: '/demos/teacher.png'
      tags: ['Vue2', 'Element UI','Private']
      link: https://github.com/ryanuo/web_teacher
    - name: 'Article Assistant'
      link: https://github.com/ryanuo/de_repeat
      desc: 'An article redundancy reduction assistant based on ECharts, which allows for real-time monitoring of the article plagiarism reduction status.'
      img: /demos/de.png
      tags: ['Vue3', 'Element Plus', 'Python']
    - name: 'Echart-Shopping'
      desc: 'The e-commerce visualization platform is built upon ECharts and Vue, with the backend developed using Koa.js.'
      img: '/demos/echart-shopping.png'
      link: 'https://github.com/ryanuo/echart_shop'
      tags: ["Vue2",'ECharts','Koa']
    - name: 'resume'
      link: 'https://github.com/ryanuo/resume'
      desc: 'Resume template'
      img: '/demos/remu.png'
      readme: 'https://github.com/ryanuo/resume/blob/master/README.md'
      tags: ['Vue2','Less']
    - name: Hot Search
      link: 'https://github.com/ryanuo/hot_search'
      desc: 'Includes Weibo Hot Search List, parameter wb for Weibo, Baidu Hot Search List with parameter bd, 360 Hot Topics using parameter 360, CSDN Hot Rankings interface to be viewed below, and other hot searches to be added.'
      img: '/demos/hot.png'
      tags: ['Python','requests',"BeautifulSoup"]

---

<!-- @layout-full-width -->

<Demos :demos="frontmatter.demos"/>
