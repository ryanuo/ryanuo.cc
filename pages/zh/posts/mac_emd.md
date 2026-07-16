---
title: 如何在Mac(M芯片)上进行嵌入式开发
date: "2026-06-08 09:05:05"
description: mac电脑串口开发
cate: 技术
---

[[toc]]

## 通过 CH340 串口转接器连接

1. 获取 CH340 串口转接器

macOS 下，CH340 串口转接器一般会以 `/dev/tty.usbserial-*` 的形式显示。

```zsh
ls /dev/tty.*  # /dev/tty.wchusbserial1110
```

- 一般第一次连接无法识别，需要安装驱动才行。

2. 安装驱动

- 下载驱动：[ch34xser_macos](https://github.com/WCHSoftGroup/ch34xser_macos)
- 安装后再次检测串口设备

## 通过串口调试工具连接

- 下载mac版本的 secureCRT macos [secureCRT](https://www.52pojie.cn/thread-1809746-1-1.html)
- 后面的操作就和windows secureCRT一样了

- 或者使用 [termius](https://appstorrent.ru/2655-termius.html)

## 交叉编译问题

### 方案一

1. 可能会遇到编译链的版本比较高，开发板的 glibc 版本过低问题
- 解决方法：
- M芯片的 内核版本是 aarch64 有些开发板的内核版本是 armv7l，需要我们进行交叉编译的话，需要将交叉编译链的版本改为 armv7l，使用
`sudo apt-get install gcc-arm-linux-gnueabihf`，这里有个点要注意，需要看开发板的glibc版本，然后去下载对应的编译环境。
- 获取开发板的 glibc 版本：
`ldd --version` 或者 `/lib/libc.so.6`

2. 可以使用 docker 镜像解决交叉编译问题
- 推荐在虚拟机 ubuntu下安装docker，然后使用 docker 镜像进行交叉编译。
- 安装成功后使用命令进入你要编译的文件下

```
docker run -it --rm \
  -v /home/ry2/base:/workspace \
  -w /workspace \
  ubuntu:16.04 \
  /bin/bash
```

```
docker ps
docker start glib-build
docker exec -it glib-build bash
pwd
ls /workspace
```

- 配置镜像源

```bash
sudo vim /etc/docker/daemon.json
# 使用命令
sudo tee /etc/docker/daemon.json << 'EOF'
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://hub.rat.dev",
    "https://dockerproxy.com"
  ]
}
EOF
```

- 启动一个 Ubuntu 16.04 的临时 Docker 容器，并把宿主机的 /home/ry2/base 映射到容器里的 /workspace，然后进入 Bash。

- 安装交叉编译工具链

```bash
apt-get install -y build-essential wget pkg-config libffi-dev zlib1g-dev gcc-arm-linux-gnueabihf
```

`arm-linux-gnueabihf-gcc --version` 输出：arm-linux-gnueabihf-gcc (Ubuntu/Linaro 7.5.0-3ubuntu1~18.04) 7.5.0

编译好程序后可以使用`strings lib/touch | grep GLIBC` 查看链接的库版本是否符合开发板的要求
还可以使用 file 命令查看链接的库版本

### 方案二

- 使用 mac container 运行交叉编译

```bash
container run -it \
  --name my-compiler \
  --dns 8.8.8.8 \
  --dns 114.114.114.114 \
  -v $(pwd):/workspace \
  -w /workspace \
  ubuntu:16.04 \
  bash -c "sed -i 's/ports.ubuntu.com/mirrors.tuna.tsinghua.edu.cn/g' /etc/apt/sources.list && apt-get update && apt-get install -y build-essential wget pkg-config libffi-dev zlib1g-dev gcc-arm-linux-gnueabihf file && echo 'alias algg=\"arm-linux-gnueabihf-gcc\"' >> ~/.bashrc && /bin/bash"
  ```
- 退出后重新进入
```
container start -ai my-compiler
```