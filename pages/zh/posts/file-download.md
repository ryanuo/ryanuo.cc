---
title: Chrome下载文件时文件后缀问题
date: 2023-10-01 09:09:09
description: Chrome下载文件时文件后缀问题
---
[[toc]]

### 问题描述

在处理Blob文件并触发下载时,如果在指定下载文件的名称时未包含文件后缀，可能会导致下载的文件缺失扩展名，从而影响文件的可识别性和可用性。

### 浏览器的默认行为
- 当浏览器在下载文件时识别到文件名中包含后缀，它通常不会对文件名进行任何修改或处理。
- 浏览器判断文件名是否包含后缀的依据是检查文件名中是否存在点（.）后的小数位（即文件扩展名）。如果文件名中已经包含此类小数位，则浏览器不会自动添加后缀。

在没有明确文件后缀的情况下，浏览器可能根据以下几种情况自动为文件名拼接后缀：
1. HTTP响应的Content-Disposition头部
   如果服务器通过Content-Disposition头部明确指定了文件名和后缀，浏览器将采用该名称。 

   `Content-Disposition: attachment; filename="report.pdf"`
2. 响应的Content-Type头部
   根据响应的MIME类型，某些浏览器可能会尝试分配一个合适的文件后缀。

   `Content-Type: application/pdf`
3. URL路径包含文件名
   如果下载的URL路径看起来像是包含文件名和后缀，浏览器可能会使用该部分作为下载的文件名。

   `https://example.com/download/receipt.pdf`
4. 下载链接的文本或标签属性
   在HTML中，下载链接（比如`<a>`元素）的download属性可以指定下载的文件名。如果提供了文件名和后缀，浏览器会使用该名称进行下载。

### 推荐措施
为了确保文件下载时包含正确的后缀，建议采取以下措施：
- 在服务器端设置Content-Disposition和Content-Type头部，确保文件名和MIME类型被明确指定。
- 在客户端，通过JavaScript生成Blob文件并创建下载链接时，确保在设置下载属性时包含了文件后缀名。

示例代码
```javascript
// 假设你有一些要下载的数据
const data = // ...;

// 创建一个表示该数据的Blob对象，并指定MIME类型
const blob = new Blob([data], { type: 'application/pdf' });

// 生成一个指向该Blob的URL
const url = URL.createObjectURL(blob);

// 创建一个用于下载的链接元素，并设置文件名及后缀
const link = document.createElement('a');
link.href = url;
link.download = 'example.pdf'; // 确保文件名包含后缀
document.body.appendChild(link);

// 触发下载
link.click();

// 清理：移除链接元素，释放Blob URL
document.body.removeChild(link);
URL.revokeObjectURL(url);
```