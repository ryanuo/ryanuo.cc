---
title: Local Deployment Guide for Ollama and Open-WebUI on Mac
date: 2025-02-01 15:30:00
description: This comprehensive guide details how to deploy large language models locally on Mac systems using Ollama and Open-WebUI, covering installation, model downloads, configuration, and usage workflows to help you quickly set up a local AI interaction environment.
---

## Why?

Efficiency and Convenience: The integrated deployment process allows you to complete Ollama setup, OpenWebUI launch, and browser opening with a single execution, significantly improving efficiency compared to manual operations.

## Deployment Preparation

### System Requirements

- OS Requirements: Recommended to use the latest version of macOS for optimal software compatibility and performance.
- Hardware Requirements: Minimum 8GB RAM for smooth model operation. For optional GPU acceleration, your Mac needs to support compatible GPUs (e.g., AMD Radeon Pro series in some MacBook Pro models).
- Network: Stable internet connection required for downloading Ollama, model files, and Open-WebUI resources.

### Essential Software Installation (Ollama, OpenWebUI, Shell environment):

1. Python 3.11~3.12
2. Ollama [Official Download](https://ollama.com/download/mac)
3. OpenWebUI

```zsh
pip install open-webui
```

### Model Preparation

```bash
ollama pull qwen3:8b
```

[Model Download](https://ollama.com/search)

## Quick Start

### Create Startup Script

Save the script anywhere on your Mac, e.g.: /Users/username/Desktop/ollama_start.sh

```sh
# Configure ports
PORT=11434
WEB_PORT=9790

# Start Ollama service
start_ollama() {
  echo "Starting Ollama..."
  ollama serve &
  OLLAMA_PID=$!
  echo "Ollama Process ID: $OLLAMA_PID"
}

# Start OpenWebUI
start_webui() {
  echo "Starting OpenWebUI..."
  open-webui serve --port "$WEB_PORT" &
  WEBUI_PID=$!
  echo "OpenWebUI Process ID: $WEBUI_PID"
}

# Auto-open browser
open_browser() {
  echo "Opening browser..."
  # Cross-platform support
  case "$(uname -s)" in
    Darwin) open "http://localhost:$WEB_PORT" ;;
    Linux) xdg-open "http://localhost:$WEB_PORT" ;;
    Windows) start "http://localhost:$WEB_PORT" ;;
    *) echo "Unsupported OS, cannot auto-open browser" ;;
  esac
}

# Main workflow
start_ollama
sleep 5  # Wait for Ollama to start (adjust time based on model size)
start_webui
sleep 5  # Wait for WebUI to start
open_browser  # Auto-open browser

# Display access info
echo -e "\nOllama service running at: http://localhost:$PORT"
echo -e "OpenWebUI running at: \033[32mhttp://localhost:$WEB_PORT\033[0m"
echo "Press Ctrl+C to stop all services"

# Handle termination signals
trap "echo 'Stopping services...'; kill -9 $OLLAMA_PID $WEBUI_PID 2>/dev/null; wait; echo 'Services stopped'." SIGINT SIGTERM

# Wait for processes
wait
```

### Configure Quick-Start Alias

Create a shell script named ollama_start.sh and add:

```sh
# alias ollama_start='/Users/username/Desktop/ollama_start.sh'
echo "alias ollama_start='/Users/username/Desktop/ollama_start.sh'" >> ~/.zshrc
source ~/.zshrc
ollama_start # Launch services
```

### Script Explanation

1. Port Configuration: Defines two ports for Ollama and OpenWebUI (default: 11434 and 9790, customizable).
2. Start Ollama: Launches Ollama service with `ollama serve` and records process ID.
3. Start OpenWebUI: Launches OpenWebUI with `open-webui serve` and records process ID.
4. Auto-open Browser: Opens browser automatically with OS-appropriate commands.
5. Main Workflow: Starts services sequentially with delays, then opens browser and displays access info.
6. Termination Handling: Gracefully stops services when receiving Ctrl+C.

## References

- [ollama](https://ollama.com/)
- [open-webui](https://github.com/jmorganca/ollama)
