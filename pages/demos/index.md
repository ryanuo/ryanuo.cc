---
title: 'Demos - Ryan CO'
description: 'Demos - Ryan CO'
plum: true
display: Demos
demos:
  2024:
    - name: 'My Website'
      link: 'https://github.com/rr210/harry.me'
      desc: 'My personal website includes personal introduction, various third-party platforms, front-end common knowledge organization, blog, project introduction, and demo display.'
      img: '/demos/page-dark.png'
      readme: 'https://github.com/rr210/harry.me/blob/master/README.md'
      tags: ['Vue3','Markdown','UnoCSS']
  2023:
    - name: 'tv-data-ana'
      link: 'https://github.com/rr210/tv-data-ana'
      desc: 'TV series data analysis and visualization system (Douban), including many visual analysis and integrated AI intelligent analysis.'
      img: '/demos/tv.gif'
      readme: 'https://github.com/rr210/tv-data-ana/blob/master/README.md'
      tags: ['React','Django','Playwright','Echarts']
    - name: 'cat-data-ana'
      link: 'https://github.com/rr210/cat-data-ana'
      desc: 'Visualization analysis of cat data on the Pet Cat Network and integrated AI intelligent analysis.'
      img: '/demos/cat.gif'
      readme: 'https://github.com/rr210/cat-data-ana/blob/master/README.md'
      tags: ['React','FastAPI','Echarts']
  2022:
    - name: 'Blazeb2'
      link: 'https://github.com/rr210/blazeB2'
      video: '//player.bilibili.com/player.html?bvid=BV1fv4y1T72e&amp;page=1&muted=true'
      desc: '📷 A picture bed tool developed with backBlazeb2 API & ⚡ Cloudflare, featuring CDN acceleration.'
      img: './demos.png'
      readme: 'https://github.com/rr210/blazeB2/blob/master/README.md'
      tags: ['Vue2','Python','Docker']
    - name: 'Git Commit Echarts'
      link: https://github.com/rr210/github_commit_echarts
      video: '//player.bilibili.com/player.html?bvid=BV1QS4y1R7rx&amp;page=1&muted=true'
      desc: 'A 3D visualization chart for the number of commits to open source projects on GitHub'
      img: '/demos/git.gif'
      tags: ['GIT','Echarts3d']
    - name: 'Pest Identification'
      link: https://github.com/rr210/bs2022
      video: '//player.bilibili.com/player.html?bvid=BV1UN4y137yk&amp;page=1&muted=true'
      desc: 'A deep learning-based Chinese herbal medicine pest identification system, developed using the Flask framework'
      tags: [Flask,Vue3]
    - name: 'hexo-wx-api'
      link: https://github.com/rr210/hexo-wx-api
      desc: 'A personal blog WeChat Mini Program that configures Hexo plugin to generate JSON data interface, compatible with various theme versions based on Hexo'
      tags: ["wx",'Hexo']
      img: /demos/wx.png
    - name: 'hexo-generator-wxapi'
      link: 'https://www.npmjs.com/package/hexo-generator-wxapi?activeTab=readme'
      desc: 'A npm package that generates Hexo API interfaces, based on hexo-generator-restful.'
      img: '/demos/carbon.png'
      readme: 'https://github.com/rr210/hexo-generator-wxapi/blob/master/README_en.md'
      tags: ['Hexo','Npm']
      icon: 'demos'

  2021:
    - name: 'Assessment Form'
      desc: 'the whole school teacher evaluation form development deployment of internal and external services using vue2 0 development'
      img: '/demos/teacher.png'
      tags: ['Vue2', 'Element UI','Private']
      link: https://github.com/rr210/web_teacher
    - name: 'Shop Background'
      link: https://github.com/rr210/vue2-shop
      desc: 'The frontend is built using the Vue CLI scaffolding tool, and Element UI library is utilized to enhance and structure the project.'
      img: /demos/admin-shop.png
      tags: ['Vue2', 'Element UI']
    - name: 'Article Assistant'
      link: https://github.com/rr210/de_repeat
      desc: 'An article redundancy reduction assistant based on ECharts, which allows for real-time monitoring of the article plagiarism reduction status.'
      img: /demos/de.png
      tags: ['Vue3', 'Element Plus', 'Python']
    - name: 'Echart-Shopping'
      desc: 'The e-commerce visualization platform is built upon ECharts and Vue, with the backend developed using Koa.js.'
      img: '/demos/echart-shopping.png'
      link: 'https://github.com/rr210/echart_shop'
      tags: ["Vue2",'ECharts','Koa']
    - name: 'resume'
      link: 'https://github.com/rr210/resume'
      desc: 'Resume template'
      img: '/demos/remu.png'
      readme: 'https://github.com/rr210/resume/blob/master/README.md'
      tags: ['Vue2','Less']
    - name: Hot Search
      link: 'https://github.com/rr210/hot_search'
      desc: 'Includes Weibo Hot Search List, parameter wb for Weibo, Baidu Hot Search List with parameter bd, 360 Hot Topics using parameter 360, CSDN Hot Rankings interface to be viewed below, and other hot searches to be added.'
      img: '/demos/hot.png'
      tags: ['Python','requests',"BeautifulSoup"]

---

<Demos :demos="frontmatter.demos"/>