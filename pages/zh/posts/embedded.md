---
title: 嵌入式学习（linux模块）
categories: embedded、linux
date: 2026-04-21 11:17:29
---

[[toc]]

## 嵌入式开发软件分层

嵌入式分为应用层、内核层、硬件层

## 开发技术栈
1. 储备知识:  Linux系统基础
   主要内容:
  1.Linux 文件系统结构
  2.常用的shell系统指令
  3.用户与权限管理
  4.VIM文本编译
  5.共享环境搭建
2. Linux C语言程序设计

基础：
数据类型、数据表现形式、运算符、表达式、语句、
三大设计结构：顺序结构、选择结构、循环结构
核心：
函数、数组、指针
进阶：
构造类型、预处理、标准文件流、库文件、位运算
高级
数据结构、算法、工程管理、工程调试、版本控制

## mac 版本安装虚拟机镜像iso遇到的问题

按照server 镜像版本地址：https://old-releases.ubuntu.com/releases/ 安装最新版本的 不会存在屏幕适配的问题

先安装server版本的ubuntu，然后使用 `sudo apt install ubuntu-desktop` 桌面版的，执行完之后 使用 `sudo reboot` 重启

mac arm版本无法使用vmware 3d硬件加速。

## Linux基础

### 文件结构

linux 系统的文件结构:
/bin :  主要存放基础指令（所有用户都能执行的指令）
/sbin:  主要存放特权指令（超级用户(root)能执行的指令）
/dev:   主要存放硬件设备
/etc:   主要存放系统或者应用程序的配置文件
/home:  主要存放用户的主目录/家目录 ，当系统中创建一个用户时，系统往往默认在/home中创建一个和用户同名的目录，将这个目录作为用户的主目录/家目录
/lib:   主要存放程序赖以运行的库文件
/mnt:   主要是系统外文件的挂载目录
/proc:  主要存放正在运行的程序的信息文件
/root:  超级用户(root)的主目录
/usr:   应用程序默认的安装路径（类似于：C://program files）

### 命令指令

速查表：https://wangchujiang.com/reference/docs/linux-command.html

1. ls -a 显示所有文件
2. ls -l 显示文件详细信息
   文件类型：d 目录 l 链接（快捷方式） s 套接字链接 b 块设备 i 索引 p 管道 c 字符设备
3. cd - 退回上一级目录
4. mkdir -p 创建目录 递归创建
5. touch 创建文件 修改文件时间 创建多个文件使用{} 使用,隔开{1..10}
6. rm -rf 删除文件  -i 删除前询问
   rmdir -p 删除目录
7. cp -R 复制目录 -r 复制 -f 强制覆盖 -i 询问

### 文件操作

1.  cat catch 读取文件内容
    -n 显示行号
2. more 查看文件内容 空格翻页 enter 下一行 q 退出
3. less 查看文件内容
4. head -n 10 显示文件前10行
5. tail -n 10 显示文件最后10行
6. cat > hello.txt 创建文件  cat hello.txt 读取文件内容 追加：cat >> hello.txt

写：
1. echo "hello world" > hello.txt
2. echo "hello world" >> hello.txt

查：
1. grep "hello" hello.txt
   -n 显示行号 -c 显示匹配行数 -i 忽略大小写
2. find . -name "*.txt"
   -name "*.txt" 匹配文件名·
   -size +10M 显示大于10M的文件
   -type 七个文件类型： d 目录  f 文件  l 链接  p 管道  s 套接字  b 字节设备  c 字符设备
3. locate hello.txt
