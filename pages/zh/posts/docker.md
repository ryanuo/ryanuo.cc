---
title: Docker基础、命令和关键概念
categories: docker
date: 2022-01-11 11:17:29
description: Docker学习：镜像、容器、仓库；底层原理；常用命令。
---

[[toc]]

## Docker

### 镜像（Image）

- 一个模板，可以通过这个模板来创建容器服务。
- 镜像是不可变的，由多个层组成。
- 常用的基础镜像包括 `ubuntu`、`alpine` 和 `node`。

### 容器（Container）

- 独立运行一个或一组应用，由镜像创建。
- 一个简化的 Linux 系统。
- 容器轻量且可移植，非常适合微服务。

### 仓库（Repository）

- 存放镜像的地方。
- 分为公有仓库和私有仓库。
- 常见的公有仓库包括 Docker Hub 和 GitHub Container Registry。

## 底层原理

### 怎么工作的

- Client-Server 结构的系统，Docker 的守护进程运行在主机上。
- DockerServer 接收 Docker-Client 的指令。
- Docker 使用命名空间（namespaces）进行隔离，使用控制组（cgroups）进行资源管理。

### 核心组件

- **Docker Daemon**：运行在主机上，管理 Docker 对象。
- **Docker CLI**：用于与 Docker Daemon 交互的命令行界面。
- **Docker Compose**：用于定义和运行多容器应用的工具。

## 命令

### 容器

`docker container my_command`
`create` — 从镜像创建容器。
`start` — 启动现有容器。
`run` — 创建并启动新容器。
`ls` — 列出正在运行的容器。
`inspect` — 查看有关容器的详细信息。
`logs` — 打印日志。
`stop` — 优雅地停止运行的容器。
`kill` — 突然停止容器中的主进程。
`rm` — 删除已停止的容器。
`exec` — 在运行的容器中执行命令。
`cp` — 在容器和主机之间复制文件或目录。

### 镜像

- 使用 docker `image my_command`
  `build` — 构建镜像。
  `push` — 将镜像推送到远程注册表。
  `pull` — 从远程注册表下载镜像。
  `ls` — 列出镜像。
  `history` — 查看中间镜像信息。
  `inspect` — 查看有关镜像的详细信息，包括图层。
  `rm` — 删除镜像。
  `tag` — 为镜像打标签以便于引用。

### 网络

- 使用 docker `network my_command`
  `create` — 创建新网络。
  `ls` — 列出所有网络。
  `inspect` — 查看有关网络的详细信息。
  `rm` — 删除网络。
  `connect` — 将容器连接到网络。
  `disconnect` — 将容器从网络断开。

[docker语法](https://juejin.cn/post/6969877845531181086)
