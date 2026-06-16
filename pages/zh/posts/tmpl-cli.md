---
title: Template CLI：高效管理项目模板的工具
date: "2025-03-10 20:00:00"
description: 一款高效的项目模板管理工具，支持从 Git 仓库快速克隆模板并灵活配置
cate: 技术
---

# Template CLI 🚀

便捷的项目模板管理工具，从 Git 仓库快速克隆模板

## 特性

- ✅ 交互式模板选择
- ✅ 命令行参数灵活配置
- ✅ 智能缓存配置管理
- ✅ 支持分支指定和目录重命名
- ⚡ 支持原生 JSON 项目选择模式

## 安装

### 通过 Cargo 安装

```bash
cargo install --path .
```

### 手动构建

```bash
git clone https://github.com/your-repo/project-template.git
cd project-template
cargo build --release
```

## 使用指南

### 基础命令结构

```bash
template-cli [参数选项]
```

### 快速开始示例

```bash
# 克隆模板项目（交互式选择）
template-cli https://github.com/my-repo/templates

# 指定参数下载
template-cli -r https://github.com/my-repo -b dev -d ./new-project -t my_template

# 查看缓存配置
template-cli -x

# 使用原生项目选择模式
template-cli --original https://github.com/my-repo.json
```

## 参数说明

| 参数                | 描述                       | 默认值     |
| ------------------- | -------------------------- | ---------- |
| `-r, --repo`        | 需要克隆的 Git 仓库地址    | -          |
| `-b, --branch`      | Git 分支名称               | main       |
| `-d, --target-dir`  | 模板保存的目标目录         | 当前目录   |
| `-t, template`      | 需要使用的具体模板名称     | 交互式选择 |
| `-o, --original`    | 使用原生 JSON 配置文件来源 | -          |
| `-c, --clear-cache` | 清除配置缓存               | -          |
| `-x, --check-cache` | 查看已保存的配置缓存       | -          |

### 进阶参数

- **智能缓存**：
  自动保存最近使用的仓库、分支等配置，再次使用时会优先读取缓存

  - 查看缓存：`template-cli -x`
  - 清除缓存：`template-cli -c`

- **原生项目选择模式**：
  使用 `--original` 参数指定 JSON 配置文件地址，会展示类似这样的界面进行选择：

  ```bash
  Category：
  1. Frontend Projects
  2. Backend Projects

  Select a category (default: Frontend Projects):
  ```

## 工作流程

1. 用户输入参数或选择交互模式
2. 根据参数/缓存确定需要克隆的仓库信息
3. 从指定分支克隆仓库到临时目录
4. 展示可用模板列表供用户选择
5. 将选择的模板复制到目标路径
6. 自动清理临时文件并输出成功提示

## 常见问题

**Q: 缓存存储在哪儿？**

```bash
~/.tmpl-cli/{.template_cli_cache.json}
```

**Q: 如何完全重置配置？**

```bash
rm -rf ~/.tmpl-cli && template-cli --clear-cache
```

**Q: 支持的模板仓库结构？**

```
<repository>/
├── template1/
├── template2/
└── .gitignore
```

## 开发者指南

### 代码结构

```
src/
├── cache.rs    # 缓存模块
├── cli.rs      # 命令行解析
├── errors.rs   # 错误处理
├── git.rs      # Git操作
├── original.rs # 原生模式实现
├── utils.rs    # 通用方法
└── template.rs # 模板处理核心
```

### 贡献指南

1. Fork 本项目
2. 创建功能分支：`git checkout -b feature/X`
3. 实现功能并测试
4. 创建 Pull Request
