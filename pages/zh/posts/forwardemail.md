---
title: 如何使自己的电子邮件使用forwardemail
date: 2025-04-01 09:09:09
description: 如何使自己的电子邮件使用forwardemail
---

如果你想创建自己的电子邮件地址并使用 ForwardEmail 服务进行转发，以下是详细步骤：

## 什么是 ForwardEmail？

[ForwardEmail](https://forwardemail.net/) 是一个开源的电子邮件转发服务，允许你将自定义域名的电子邮件转发到现有的电子邮件地址，而无需托管自己的邮件服务器。

## 准备工作

1. 一个自定义域名（例如 `example.com`）。
2. 一个现有的电子邮件地址（例如 `yourname@gmail.com`）。
3. 访问 ForwardEmail 的账户。

## 配置步骤

### 1. 注册并登录 ForwardEmail

访问 [ForwardEmail](https://forwardemail.net/) 网站，注册一个账户并登录。

### 2. 添加你的域名

在 ForwardEmail 的仪表板中，点击 **Add Domain** 按钮，输入你的域名（例如 `example.com`）。

### 3. 配置 DNS 记录

根据 ForwardEmail 提供的说明，在你的域名注册商的控制面板中添加以下 DNS 记录：

- **MX 记录**：设置为 `mx1.forwardemail.net` 和 `mx2.forwardemail.net`，优先级分别为 `10` 和 `20`。
- **TXT 记录**：用于验证域名所有权，内容为 ForwardEmail 提供的值。

保存更改后，等待 DNS 记录生效（通常需要几分钟到几小时）。

### 4. 设置转发规则

在 ForwardEmail 的仪表板中，为你的域名设置转发规则。例如：

- 将 `hello@example.com` 转发到 `yourname@gmail.com`。
- 将 `info@example.com` 转发到 `anotheremail@gmail.com`。

### 5. 测试电子邮件

发送一封测试邮件到你的自定义邮箱地址（例如 `hello@example.com`），确认邮件是否成功转发到目标邮箱。

## 优势

- **免费**：ForwardEmail 提供免费计划。
- **隐私保护**：无需托管自己的邮件服务器。
- **简单易用**：只需配置 DNS 记录即可。

通过以上步骤，你就可以轻松创建并使用自己的电子邮件地址了！

## 参考文章

- [domain-email](https://antfu.me/posts/domain-email)
- [v2ex question](https://www.v2ex.com/t/889932)
