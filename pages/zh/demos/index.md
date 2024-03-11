---
title: '演示 - Ryan CO'
description: '演示 - Ryan CO'
plum: true
display: 演示
demos:
  2024:
    - name: '个人主页'
      link: 'https://github.com/rr210/harry.me'
      desc: '我的个人网站包括个人简介、各种第三方平台链接、前端通用知识整理、博客文章、项目介绍以及演示展示。'
      img: '/demos/page-dark.png'
      readme: 'https://github.com/rr210/harry.me/blob/master/README.md'
      tags: ['Vue3','Markdown','UnoCSS']
  2023:
    - name: 'tv-data-ana'
      link: 'https://github.com/rr210/tv-data-ana'
      desc: '电视剧数据分析与可视化系统（基于豆瓣），包含多种可视化分析和集成的AI智能分析功能。'
      img: '/demos/tv.gif'
      readme: 'https://github.com/rr210/tv-data-ana/blob/master/README.md'
      tags: ['React','Django','Playwright','Echarts']
    - name: 'cat-data-ana'
      link: 'https://github.com/rr210/cat-data-ana'
      desc: '宠物猫网络中猫咪数据的可视化分析，集成了AI智能分析功能。'
      img: '/demos/cat.gif'
      readme: 'https://github.com/rr210/cat-data-ana/blob/master/README.md'
      tags: ['React','FastAPI','Echarts']

  2022:
    - name: 'Blazeb2'
      link: 'https://github.com/rr210/blazeB2'
      video: '//player.bilibili.com/player.html?bvid=BV1fv4y1T72e&amp;page=1&muted=true'
      desc: '📷 一款采用 backBlaze B2 API 与 ⚡ Cloudflare 开发的图片床工具，具备 CDN 加速功能' 
      img: './demos.png'
      readme: 'https://github.com/rr210/blazeB2/blob/master/README.md'
      tags: ['Vue2']
    - name: GIT提交3D图
      link: https://github.com/rr210/github_commit_echarts
      video: '//player.bilibili.com/player.html?bvid=BV1QS4y1R7rx&amp;page=1&muted=true'
      desc: 'GitHub开源项目提交次数的三维可视化图表'
      img: '/demos/git.gif'
      tags: ['GIT','Echarts3d']
    - name: 害虫识别
      link: https://github.com/rr210/bs2022
      video: '//player.bilibili.com/player.html?bvid=BV1UN4y137yk&amp;page=1&muted=true'
      desc:  '一个使用Flask框架开发的深度学习中药害虫识别系统'
      tags: [Flask,Vue3]
    - name: 'hexo-wx-api'
      link: https://github.com/rr210/hexo-wx-api
      desc: '一款个人博客微信小程序，通过配置Hexo插件生成JSON数据接口，适用于基于Hexo的各种主题版本'
      tags: ["wx",'Hexo']
      img: /demos/wx.png
    - name: 'hexo-generator-wxapi'
      link: 'https://www.npmjs.com/package/hexo-generator-wxapi?activeTab=readme'
      desc: '一款生成hexo-Api接口的npm包，基于hexo-generator-restful'
      img: '/demos/carbon.png'
      readme: 'https://github.com/rr210/hexo-generator-wxapi/blob/master/README_en.md'
      tags: ['Hexo','Npm']
      icon: 'demos'


  2021:
    - name: '教师评测表单'
      desc: '全校老师评测表单开发，部署内外服务，采用Vue2.0开发'
      img: '/demos/teacher.png'
      tags: ['Vue2', 'Element UI','私密']
      link: https://github.com/rr210/web_teacher
    - name: 商城后台
      link: https://github.com/rr210/vue2-shop
      desc: '该项目前端采用Vue CLI脚手架构建，并运用Element UI库来提升和组织项目结构。'
      img: /demos/admin-shop.png
      tags: ['Vue2', 'Element UI']
    - name: 文章降重助手
      link: https://github.com/rr210/de_repeat
      desc: '基于ECharts实现的文章重复度降低助手，可实时查看文章降重情况。'
      img: /demos/de.png
      tags: ['Vue3', 'Element Plus', 'Python']
    - name: 商城数据可视化
      desc: '该电商可视化平台以ECharts和Vue为基础构建，后端采用Koa.js开发。'
      img: '/demos/echart-shopping.png'
      link: 'https://github.com/rr210/echart_shop'
      tags: ["Vue2",'ECharts','Koa']
    - name: 简历模板
      link: 'https://github.com/rr210/resume'
      desc: '个人简历模板【待重构】'
      img: '/demos/remu.png'
      readme: 'https://github.com/rr210/resume/blob/master/README.md'
      tags: ['Vue2','Less']
    - name: 热搜-爬虫
      link: 'https://github.com/rr210/hot_search'
      desc: '包含微博热搜榜（参数wb）、百度热搜榜（参数bd）、360热点榜（参数360）及CSDN热榜接口（下方查看），并计划加入其他热搜功能。'
      img: '/demos/hot.png'
      tags: ['Python','requests',"BeautifulSoup"]

---

<Demos :demos="frontmatter.demos"/>