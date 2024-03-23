---
title: Convolutional Neural Network Learning
categories: python
date: 2022-04-15 12:50:59
description: convolutional network learning parameter reduction feature extraction edge detection filling step size 3 d convolution rgb processing network structure including convolution re lu pooling and fully connected layers
---
[[toc]]
## 为什么使用卷积运算

1. 使用卷积比全连接网络少很多参数，为了计算高分辨率的图片，很少的参数以便我们可以使用较小的训练集来训练，有利于预防过拟合
2. 使用卷积就是为了提取显著特征，减少特征维数，减少计算量。


## 边缘检测

1. * 表示卷积，使用3x3过滤器
2. 如图是垂直边缘检测器
![](https://cloud.mr90.top/hexo/4/20220415102757.png)

## 正边缘与负边缘

![](https://cloud.mr90.top/hexo/4/20220415103726.png)
![](https://cloud.mr90.top/hexo/4/20220415104101.png)

## 填充降维度

![](https://cloud.mr90.top/hexo/4/20220415104949.png)
公式：`nxn * fxf = (n-f+1)x(n-f+1)`
1. 缺陷：不希望每一步都缩小维度，使得图片丢失了许多边界的信息
2. 解决方法：填充图片扩大图片，给图片增加边框像素也就是 给一个padding为一像素
3. 公式就变成了：`n+2p-f+1=n`如果让填充后的图片进行卷积等于原来图片的大小 `p=(f-1)/2` 并且过滤器建议使奇数

## 带步长的卷积

1. 公式：`(n+2p-f)/s+1` 带步长卷积后的维度大小，除不尽可以向下取整`floor=⌊ ⌋`
2. 总结公式：`⌊(n+2p-f)/s+1⌋ * ⌊(n+2p-f)/s+1⌋`

## 三维卷积

1. 使用rgb图片 则是三通道（red,green,blue）
![](https://cloud.mr90.top/hexo/4/20220415111153.png)

## 卷积神经网络结构

1. 卷积神经网络主要由这几类层构成：输入层、卷积层，ReLU层、池化（Pooling）层和全连接层（全连接层和常规神经网络中的一样）。