---
title: Git 学习笔记
categories: 学习
date: '2020-12-18 14:00'
description: Git版本控制学习指南，涵盖配置、克隆、分支、合并、标签、远程仓库操作等基础指令。
---

[[toc]]

Git是一个开源的分布式版本控制系统，可以有效、高速地处理从很小到非常大的项目版本管理Git 是 [Linus Torvalds](https://zh.wikipedia.org/wiki/%E6%9E%97%E7%BA%B3%E6%96%AF%C2%B7%E6%89%98%E7%93%A6%E5%85%B9) 为了帮助管理 Linux 内核开发而开发的一个开放源码的版本控制软件。

<span class="inline-tag red">master：默认开发分支</span> <span class="inline-tag green ">orgin：默认远程版本分支 </span> <span class="inline-tag grey"> head：指向当前分支</span>

## git配置

- 设置用户名

```bash
git config --global user.name "username" //用户名为登录用户名
```

- 设置邮箱

```bash
git config --global user.email "注册时的邮箱"
```

## 代码指令

- 克隆github上的仓库源码到本地

```bash
git clone [url]
```

## git仓库的创建

git初始化

```bash
git init
```

查看文件是否变更

```bash
git status
```

添加文件到缓存区

```bash
git add .   // 或者git add filename
git rm . //删除缓存文件
```

`注`在指定文件夹使用git指令

添加备注

```bash
git commit -m "这里写备注内容"
```

推送文件到远程仓库master

```bash
git push origin master
```

查看历史记录

```bash
git log
```

回溯操作

```bash
git reset --head 目标版本号
```

查看文件具体更改内容

```bash
git diff
```

- 可查看修改了哪些内容

## 分支操作

查看分支

```bash
git branch
```

创建分支

```bash
git branch 分支名
```

删除分支

```bash
git branch -d 分支名
```

切换分支

```bash
git checkout 分支名
```

合并分支

```bash
git merge 分支名
```

## 远程仓库

解除远程仓库链接

```bash
git remote rm origin
```

链接到远程仓库

```bash
git remote add origin [url]
```

拉取远程内容

```bash
git fetch //或者
git pull
```

查看远程仓库与本地仓库关系

```bash
git remote show origin
```

## 标签指令

查看标签

```bash
git tag
```

添加标签

```bash
git tag [name]
```

添加标签tag，比如v1.0等
删除本地标签

```bash
git tag -d <tagname>
```

删除远程仓库标签

```bash
git push origin :refs/tags/<tagname>
```

上传单个tag

```bash
git push origin [tagname]
```

- 上传所有标签

```bash
git push origin --tags

```

## 参考

[Git的奇技淫巧](https://github.com/521xueweihan/git-tips)
