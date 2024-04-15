---
title: Tools | Ryan Co
display: Front Navigation
description: Front-end online tools are being organized and are continuously updated.
plum: true
isHidenTitle: true
projects:
  Commonly Used Tools:
    - name: Device Framed Screenshots
      link: https://deviceshots.com/app
      desc: A feature that presents app screenshots within realistic device models, enabling developers or marketers to achieve more professional and visually appealing app presentations.
      icon: i-ri-screenshot-2-line
    - name: Online Photo
      link: https://www.photopea.com/
      desc: A powerful online alternative that offers an editing experience comparable to Adobe Photoshop. Users can open and use it directly in their web browser without downloading or installing any software, allowing them to edit photos, apply effects, filters, add text, crop, resize images, and more. It supports a variety of formats such as PSD, XD, Sketch, XCF, and RAW, and includes real-time link status checking to ensure seamless access to this online photo editing service.
      icon: i-ri-mental-health-line
    - name: images-tools
      link: https://github.com/renzhezhilu/webp2jpg-online
      desc: Online image processing, batch conversion of images, batch compression of images, webp to jpg, video to gif, gif to webp.
      icon: i-ri-image-line
    - name: Cover Image Generator
      link: https://github.com/gezhaoyou/picprose
      desc: pic prose is a better cover image generator tool for medium you tube bili bili blog and more
      icon: i-dashicons-cover-image
      
  Quick Look:
    - name: Quick Reference
      link: https://wangchujiang.com/reference/index.html
      desc: Share quick reference cheat sheet for developers.
      icon: i-ri-tools-fill
      tags: ['Chinese']
    - name: reference
      link: https://github.com/Fechin/reference
      desc: Share quick reference cheat sheet for developers.
      icon: i-ri-pencil-ruler-2-line
      tags: ['English']
    - name: Excel Reference
      link: https://www.lanrenexcel.com/
      desc: "Excel Reference, a tool that helps you quickly find the Excel function you need."
      icon: i-ri-file-excel-2-line

  Google plugins:
    - name: react1s
      link: https://chromewebstore.google.com/detail/react1s/gpcoahaomdfmekggblkckofkgjggnjlp
      desc: "Click on page elements to jump to the editor, supports React project local development, Option(Alt)+Click on corresponding element on the page to jump to the editor's corresponding component line and column."
      image: https://lh3.googleusercontent.com/YYOfNcw9lrs9ZFAUNv1MRRXd68KsKJfnEG4cKjtURrjQ1uFYKmQ8ZRHIy6Zf1E5HeDzPv6tW4jOXZm7vPPEabooD0w=s60
    - name: react-developer-tools
      link: https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
      desc: React Developer Tools, used for debugging React applications.
      image: https://lh3.googleusercontent.com/TNijZW_Gp9MZ3eqXkve0YWDEiHV-a2IpSpD6IJzrV3Y76GJcLEyzX2regTLemXzBHbHVqkKuxnnWDT34Cp4sNh-Y=s60
    - name: Extension Manager
      link: https://chromewebstore.google.com/detail/%E6%89%A9%E5%B1%95%E7%AE%A1%E7%90%86%E5%99%A8%EF%BC%88extension-manager%EF%BC%89/gjldcdngmdknpinoemndlidpcabkggco
      desc: Chrome Extension Manager Which Is Used To Manage Chrome Extensions。
      image: https://lh3.googleusercontent.com/BzuzXt7QbWsNHbgaeEW-nFe1inyQS4CtcY2QdXBbsyuf5ywVt4BEl3M1gluUVD1PTFv5hLMZ-NZJy9_7Ype5Zg1H08s=s60
    - name: FeHelper
      link: https://chromewebstore.google.com/detail/fehelper前端助手/pkgccpejnmalmdinmhkkfafefagiiiad
      desc: JSON automatic formatting, manual formatting, support for sorting, decoding, downloading, and more features can be installed on demand in the configuration page!
      image: https://lh3.googleusercontent.com/6yzfaOya3iQTv5NMnEx98luxTT-1WdOUbTQXIg5w96FOXlH_LDswkrjzIYZRqG1JCpcJ9jd8rPZD33xM--7GMGzUAQ=s60
    - name: uBlock Origin
      link: https://chromewebstore.google.com/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm
      image: https://lh3.googleusercontent.com/rrgyVBVte7CfjjeTU-rCHDKba7vtq-yn3o8-10p5b6QOj_2VCDAO3VdggV5fUnugbG2eDGPPjoJ9rsiU_tUZBExgLGc=s60
      desc: Ad blocker, supports custom rules, can block ads and other disruptive content on websites.
    - name: Immersive Translation
      link: https://chromewebstore.google.com/detail/沉浸式翻译-双语对照网页翻译-pdf文档翻译/bpoadfkcbjbfhfodiogcnhhhpibjhbnh
      image: https://lh3.googleusercontent.com/FCCjGNQ3JhLebMSOBdTRV7UP5yMNa9lF5rsJxQ1B4gVcZy5V3vJIdIOh3DO7fCih1JfzIRbAHrxhhXjEUTMKtwdBDA=s60
      desc: Immersive translation, supports translating PDF files, can convert text in PDF files into speech for playback, and allows you to choose whether to read aloud.
  
  Other:
    - name: Worm Tribe
      link: https://search.chongbuluo.com/
      icon: i-ri-search-line
      desc: Quick search worm tribe exclusive debut products on the whole network for you to aggregate google baidu bing and other domestic and foreign comprehensive search and academic resource professional field knowledge and other vertical search accurate search convenient interaction it is your first stop for internet search
    - name: Navs Summary
      link: https://github.com/rr210/navs
      icon: i-ri-opera-line
      desc: Front End Navigation Backlink Summary

---
<!-- @layout-full-width -->

<NavsTabs :description="frontmatter.description" />

<NavsList :projects="frontmatter.projects" />