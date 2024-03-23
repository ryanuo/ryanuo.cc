---
title: Deepin 相关（Liunx）
date: 2020-10-10 20:01
categories: Liunx
tags: [liunx]
plum: true
---

[[toc]]

## 如何安装
### 准备工作

准备一个u盘，用来制作deepin启动盘，在deepin官网安装镜像文件并制作u盘安装系统前，检查电脑是否有空闲的硬盘空间，大概需要25g ，没有要进行分盘操作

分盘方法/步骤

1.右键点击此电脑，点击管理。
2.点击磁盘管理。
3.鼠标右键点击你要进行分区的磁盘，点击压缩卷。
4.点击压缩（压缩大概102400MB）。
5.显示可用空间为100g即可，准备工作就完成了
点击完成即可。
制作U盘操作看官网[deepin官网](https://www.deepin.org/zh/download/)

如何安装？[点击](https://www.deepin.org/zh/installation/)

## 安装后遇到问题
### 无声音

1.检查电脑是否能够检测到声卡的输入输出

方法：设置里面-声音-高级设置-看是否有输出输入设备

2.确认声卡是否出现物理损坏导致的物理信息无法被系统读取。代码指令如下,(看是否有类似的声卡反馈)
```bash
sudo lspci | grep audio 
sudo lspci -v
```
3.修改grub文件里面的文件  添加一个指令即可
```bash
GRUB_CMDLINE_LINUX_DEFAULT="${这里你的原有配置不要动} snd_hda_intel.dmic_detect=0"
```
指令如下：
```bash
#进入root模式
su 
cd /etc/default/
vi grub
# 将此代码snd_hda_intel.dmic_detect=0 加入grub即可
# 1.按键盘i 进入插入模式，修改添加代码后
#2.【esc】然后 按【：】输入 【w！】
reboot #重启即可
```

### wifi 异常

1.网卡驱动的问题，无法链接wifi

需要删除 **iwlwifi.conf** 此文件（路径：/etc/modprobe.d/iwlwifi.conf）

```bash
#首先进入root模式,按顺序即可
su
cd /etc/modrobe.d/
rm -f iwlwifi.conf #强制删除文件
ls #检查文件是否删除
reboot #重启系统
```