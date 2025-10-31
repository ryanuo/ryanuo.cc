---
title: 'Comprehensive Guide to Git Commit Message Conventions'
date: 2023-01-04 15:07:09
tags: [git]
categories: git
description: The Git commit convention includes types, scopes, etc., facilitating clear collaboration and maintenance, recommended Conventional Commits, AngularJS convention for reference.
---

[[toc]]

## Introduction

In any version control software, proper commit messages are crucial for team collaboration and code maintenance. Git, as the most popular distributed version control system, benefits greatly from standardized commit messages. They help team members better understand the code history, speed up code reviews, and automate changelog generation. This article introduces some common Git commit message conventions.

## Importance of Git Commit Conventions

- **Improved Readability**: Clear commit messages allow team members to quickly understand the purpose and changes of a commit.
- **Ease of Tracking**: Standardized commits make it easier to search for specific changes in the history.
- **Support for Automation Tools**: Standardized commit messages can be used by various tools, such as automatically generating CHANGELOGs or analyzing code changes through scripts.

## Common Format of Git Commit Messages

A standardized Git commit message typically includes the following parts:

1. **Type**: The type of the commit, such as fixing a bug (`fix`) or adding a new feature (`feat`).
2. **Scope**: (Optional) The scope of the changes, such as a component or a module.
3. **Subject**: A brief description of the commit, not exceeding 50 characters.
4. **Body**: (Optional) A more detailed description, which can span multiple lines.
5. **Footer**: (Optional) Descriptions of related issues or breaking changes.

For example:

```
feat(login): add the remember me button

- Add a "remember me" checkbox in the login form
- Save the login state to local storage when checked

Closes #123
```

## Common Commit Types

Below are some common commit types and their meanings:

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **style**: Formatting (changes that do not affect code execution)
- **refactor**: Code refactoring (neither adding a feature nor fixing a bug)
- **test**: Adding tests
- **chore**: Changes to the build process or auxiliary tools

## Reference Articles

When defining your own Git commit conventions, you can refer to the following articles and resources:

- [Conventional Commits](https://www.conventionalcommits.org/)
- [AngularJS Git Commit Message Conventions](https://docs.angularjs.org/misc/contribute)
- [Semantic Versioning Specification (SemVer)](https://semver.org/)

The above outlines the basic Git commit conventions and some recommendations. You can customize your commit conventions based on your team's specific needs.
