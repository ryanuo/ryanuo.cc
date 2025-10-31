---
title: A Complete Guide to Creating a Custom Email with ForwardEmail
date: 2025-04-01 09:09:09
description: Learn how to quickly set up and use your own custom email address with the ForwardEmail service.
---

If you want to create your own email address and use the ForwardEmail service for forwarding, here are the detailed steps:

## What is ForwardEmail?

[ForwardEmail](https://forwardemail.net/) is an open-source email forwarding service that allows you to forward emails from a custom domain to an existing email address without hosting your own mail server.

## Prerequisites

1. A custom domain (e.g., `example.com`).
2. An existing email address (e.g., `yourname@gmail.com`).
3. Access to a ForwardEmail account.

## Configuration Steps

### 1. Sign Up and Log In to ForwardEmail

Visit [ForwardEmail](https://forwardemail.net/), sign up for an account, and log in.

### 2. Add Your Domain

In the ForwardEmail dashboard, click the **Add Domain** button and enter your domain (e.g., `example.com`).

### 3. Configure DNS Records

Follow the instructions provided by ForwardEmail to add the following DNS records in your domain registrar's control panel:

- **MX Records**: Set to `mx1.forwardemail.net` and `mx2.forwardemail.net` with priorities `10` and `20`, respectively.
- **TXT Record**: Used to verify domain ownership, with the value provided by ForwardEmail.

Save the changes and wait for the DNS records to propagate (this usually takes a few minutes to a few hours).

### 4. Set Up Forwarding Rules

In the ForwardEmail dashboard, set up forwarding rules for your domain. For example:

- Forward `hello@example.com` to `yourname@gmail.com`.
- Forward `info@example.com` to `anotheremail@gmail.com`.

### 5. Test Your Email

Send a test email to your custom email address (e.g., `hello@example.com`) and confirm that the email is successfully forwarded to the target address.

## Advantages

- **Free**: ForwardEmail offers a free plan.
- **Privacy Protection**: No need to host your own mail server.
- **Easy to Use**: Simply configure DNS records.

By following these steps, you can easily create and use your own email address!

## Reference

- [domain-email](https://antfu.me/posts/domain-email)
- [v2ex question](https://www.v2ex.com/t/889932)
