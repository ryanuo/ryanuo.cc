---
title: Git Commit 规范
date: 2023-01-04 15:07:09
tags: [git]
categories: git
description: Git提交规范包括类型、范围等，助力清晰协作与维护，推荐Conventional Commits、AngularJS规范参考。
---

[[toc]]

## 前言

在任何版本控制软件中，合理的提交（commit）信息对于团队合作和代码维护来说都是至关重要的。Git，作为目前最流行的分布式版本控制系统，其提交信息的规范化可以帮助团队成员更好地了解代码历史，加快代码审查过程，以及自动化生成变更日志。本文将介绍一些常见的 Git 提交信息规范。

## Git Commit 规范的重要性

- **提高可读性**：清晰的提交信息可以让其他团队成员快速了解这次提交的目的和改动内容。
- **方便追踪**：规范化的提交便于在历史记录中搜索特定的更改。
- **自动化工具支持**：规范的提交信息可以被各种工具所使用，比如自动生成 CHANGELOG，或者通过脚本分析代码变更情况。

## Git Commit 规范的常见格式

一个规范化的 Git 提交信息通常包括以下几个部分：

1. **类型（Type）**: 这次提交的类型，比如是修复一个 Bug（fix），还是添加一个新功能（feat）。
2. **范围（Scope）**: （可选）改动影响的范围，比如一个组件或者一个功能模块。
3. **主题（Subject）**: 提交的简短描述，不超过50个字符。
4. **正文（Body）**: （可选）更详细的描述，可以分成多行。
5. **页脚（Footer）**: （可选）相关联的 issue 或者 breaking changes 的描述。

例如：

```
feat(login): add the remember me button

- Add a "remember me" checkbox in the login form
- Save the login state to local storage when checked

Closes #123
```

## 常用的提交类型

以下是一些常用的提交类型以及它们的含义：

- **feat**: 新功能（feature）
- **fix**: 修补bug
- **docs**: 文档（documentation）
- **style**: 格式（不影响代码运行的变动）
- **refactor**: 重构（即不是新增功能，也不是修改bug的代码变动）
- **test**: 增加测试
- **chore**: 构建过程或辅助工具的变动

## 参考文章

在制定自己的 Git Commit 规范时，可以参考以下文章和资源：

- [Conventional Commits](https://www.conventionalcommits.org/)
- [AngularJS Git Commit Message Conventions](https://docs.angularjs.org/misc/contribute)
- [Semantic Versioning Specification (SemVer)](https://semver.org/)

以上是 Git Commit 的基本规范和一些建议，你可以根据团队的实际需求定制自己的提交规范。
