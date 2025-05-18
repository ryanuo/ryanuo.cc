---
title: 在 Mac 上使用 Ollama 和 Open-WebUI 进行本地化部署指南
date: 2025-02-01 15:30:00
description: 本指南详细介绍如何在 Mac 系统上，通过 Ollama 和 Open-WebUI 进行大模型本地化部署，涵盖安装、模型下载、配置及使用全流程，助力你快速搭建本地 AI 交互环境。
---

## 为什么？

高效便捷：整合部署流程，一次执行即可完成 Ollama、OpenWebUI 启动及浏览器打开，相比手动操作大幅提升效率。

## 部署准备

### 系统环境要求

系统环境要求：建议使用最新版本的 macOS 系统，以确保软件兼容性和性能优化。
硬件要求：为了流畅运行模型，推荐至少 8GB 内存。若要使用 GPU 加速（可选），需要 Mac 支持相应的 GPU，如某些 MacBook Pro 机型配备的 AMD Radeon Pro 系列 GPU 。
网络连接：稳定的网络连接，因为在部署过程中需要下载 Ollama、模型文件以及 Open-WebUI 相关资源。

必备软件安装（Ollama、OpenWebUI、Shell 运行环境：

1. Python3.11~3.12
2. Ollama, [官方下载](https://ollama.com/download/mac)
3. OpenWebUI

```zsh
pip install open-webui
```

### 模型准备

```bash
ollama pull qwen3:8b
```

[模型下载](https://ollama.com/search)

## 快速启动

### 创建保存脚本

保持在mac系统的任意位置，如：/Users/username/Desktop/ollama_start.sh

```sh
# 配置端口
PORT=11434
WEB_PORT=9790

# 启动Ollama服务
start_ollama() {
  echo "正在启动 Ollama..."
  ollama serve &
  OLLAMA_PID=$!
  echo "Ollama 进程ID: $OLLAMA_PID"
}

# 启动OpenWebUI
start_webui() {
  echo "正在启动 OpenWebUI..."
  open-webui serve --port "$WEB_PORT" &
  WEBUI_PID=$!
  echo "OpenWebUI 进程ID: $WEBUI_PID"
}

# 自动打开浏览器
open_browser() {
  echo "正在打开浏览器..."
  # 支持macOS/Windows/Linux通用格式
  case "$(uname -s)" in
    Darwin) open "http://localhost:$WEB_PORT" ;;
    Linux) xdg-open "http://localhost:$WEB_PORT" ;;
    Windows) start "http://localhost:$WEB_PORT" ;;
    *) echo "不支持的操作系统，无法自动打开浏览器" ;;
  esac
}

# 主流程
start_ollama
sleep 5  # 等待Ollama服务启动（根据模型大小可调整时间）
start_webui
sleep 5  # 等待WebUI启动
open_browser  # 自动打开浏览器

# 输出访问信息
echo -e "\nOllama 服务运行在：http://localhost:$PORT"
echo -e "OpenWebUI 运行在：\033[32mhttp://localhost:$WEB_PORT\033[0m"
echo "按 Ctrl+C 停止所有服务"

# 终止信号处理
trap "echo '停止服务...'; kill -9 $OLLAMA_PID $WEBUI_PID 2>/dev/null; wait; echo '服务已停止'." SIGINT SIGTERM

# 等待进程结束
wait
```

### 配置快速启动别名

创建一个名为ollama_start.sh的shell脚本，并添加以下内容：

```sh
# alias ollama_start='/Users/username/Desktop/ollama_start.sh'
echo "alias ollama_start='/Users/username/Desktop/ollama_start.sh'" >> ~/.zshrc
source ~/.zshrc
ollama_start # 启动服务
```

### 脚本详解

1. 配置端口：脚本中定义了两个端口，分别用于Ollama和OpenWebUI。默认端口为11434和9790，可以根据需要修改。
2. 启动Ollama服务：使用ollama serve命令启动Ollama服务，并保存进程ID。
3. 启动OpenWebUI：使用open-webui serve命令启动OpenWebUI服务，并保存进程ID。
4. 自动打开浏览器：根据操作系统的不同，使用不同的命令打开浏览器，并指定访问地址。
5. 主流程：启动Ollama和OpenWebUI服务，并等待它们启动。然后自动打开浏览器，并输出访问信息。
6. 输出访问信息：输出Ollama和OpenWebUI的访问地址，并提示按Ctrl+C停止服务。

## 参考文章

- [ollama](https://ollama.com/)
- [open-webui](https://github.com/jmorganca/ollama)
