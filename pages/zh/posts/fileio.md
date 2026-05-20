---
title: C语言学习（文件）
date: 2026-05-19 14:08
---

[[toc]]

## 文件

### 文本文件

(ASCII文件)

### 二进制文件

(二进制文件)

## 文件操作

- fopen()函数打开文件，返回文件指针。
参数：const char *filename, const char *mode
- fclose()函数关闭文件。
参数：FILE *stream
- fgetc()函数从文件中读取一个字符。
参数：FILE *stream
- fputc()函数向文件中写入一个字符。
参数：int c, FILE *stream
- fgets()函数从文件中读取一行。
参数：char *str, int n, FILE *stream
- fputs()函数向文件中写入一行。
参数：const char *str, FILE *stream

- 文件mode列表

| 模式   | 含义     |
| ---- | ------ |
| "r"  | 只读     |
| "w"  | 只写（覆盖） |
| "a"  | 追加写    |
| "r+" | 读写     |
| "w+" | 读写（覆盖） |
| "a+" | 读写（追加） |
| "b"  | 二进制方式  |

## 核心机制

## 位置指针

- 文件指针：文件指针是一个指向文件位置的指针，用于记录当前文件操作的位置。
