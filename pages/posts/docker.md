---
title: Docker Learning
categories: docker
date: 2022-01-11 11:17:29
description: learn about docker images containers and repositories underlying principles and common commands
---

[[toc]]

## Docker

### 镜像（image）

- 一个模板，可以通过这个模块来创建容器服务

### 容器（container）

- 独立运行一个或者一个组应用,通过镜像来创建的
- 简易的Linux系统

### 仓库(repository)

- 仓库存放镜像的地方
- 分为公有仓库和私有仓库

## 底层原理

### 怎么工作的

- Client-Server结构的系统，Docker的守护进程运行再主机上
- DockerServer接受到Docker-Client的指令

## 命令

### 容器

`docker container my_command`
`create` — 从镜像创建容器
`start` — 启动现有容器
`run` —创建新容器并启动它
`ls` — 列出正在运行的容器
`inspect` — 查看有关容器的大量信息
`logs` — 打印日志
`stop` — 优雅地停止运行容器
`kill` — 突然停止容器中的主进程
`rm` — 删除已停止的容器

### 镜像

- 使用docker `image my_command`
  `build` — 生成镜像
  `push` — 将镜像推送到远程注册表
  `ls` — 列出镜像
  `history` — 请参阅中间镜像信息
  `inspect` — 查看大量有关镜像的信息，包括图层
  `rm` — 删除镜像

[docker语法](https://juejin.cn/post/6969877845531181086)
