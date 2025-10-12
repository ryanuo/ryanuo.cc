---
title: 用 TypeScript 在 10 分钟内构建你的第一个 MCP 服务器
date: '2025-07-12 10:19'
categories: AI
description: 快速上手 Model Context Protocol (MCP)，使用 TypeScript 构建你的第一个 MCP 服务器，让 Claude 等 AI 主机直接调用你的工具。
plum: true
---

[[toc]]

## 什么是 MCP？

*MCP（模型上下文协议，Model Context Protocol） 是一个让智能体轻松连接各种工具的协议*。
它主要由三个核心组件组成：

### 1. MCP 服务器（MCP Servers）
充当桥梁，用于连接 API、数据库或代码，并将这些数据源公开为工具。可使用 Python 或 TypeScript SDK 构建。

### 2. MCP 客户端（MCP Clients）
这些客户端使用 MCP 协议与 MCP 服务器通信，也可以用 Python 或 TypeScript SDK 进行开发。

### 3. MCP 主机（MCP Hosts）
在服务器和客户端之间进行数据交换，确保通信顺畅。目前流行的 MCP 主机包括 Claude Desktop、Zed 和 Sourcegraph Cody。

### MCP 服务器的作用
MCP 服务器能够提供各种工具，任何 MCP 主机都可以访问它们。这意味着开发者可以快速将智能体连接到新的工具，而无需为每种工具都写一遍集成代码。

## 如何搭建 MCP 服务器？

下面是一个使用 TypeScript SDK 来构建 MCP 服务器，并用 Claude Desktop 作为测试主机的完整示例。

### 步骤 1：安装依赖

首先，创建一个新项目，并初始化 `npm` 包。然后安装 MCP 服务器所需的依赖项，并配置 `package.json` 和 `tsconfig.json`。

**创建项目目录：**

```bash
mkdir mcp-server
cd mcp-server
````

**创建 `package.json`：**

```json
{
  "name": "mcp-server",
  "version": "0.1.0",
  "description": "Model Context Protocol 服务器示例",
  "private": true,
  "type": "module",
  "bin": {
    "mcp-server": "./build/index.js"
  },
  "files": [
    "build"
  ],
  "scripts": {
    "build": "tsc && node -e \"require('fs').chmodSync('build/index.js', '755')\"",
    "prepare": "npm run build",
    "watch": "tsc --watch",
    "inspector": "npx @modelcontextprotocol/inspector build/index.js"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "0.6.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.24",
    "typescript": "^5.3.3"
  }
}
```

**创建 `tsconfig.json`：**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

然后执行：

```bash
npm install
```

### 步骤 2：编写基础代码

在 `src` 目录下创建 `index.ts`，并添加以下内容：

```ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js'

const server = new Server(
  {
    name: 'mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {}
    }
  }
)

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: [] }
})

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'name_of_tool') {
    return {}
  }
  throw new McpError(ErrorCode.ToolNotFound, '工具未找到')
})

const transport = new StdioServerTransport()
await server.connect(transport)
```

### 步骤 3：定义并添加 MCP 工具

接下来我们定义一个简单工具，比如 “计算两个数的和”：

```ts
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'calculate_sum',
        description: '计算两个数的总和',
        inputSchema: {
          type: 'object',
          properties: {
            a: { type: 'number' },
            b: { type: 'number' }
          },
          required: ['a', 'b']
        }
      }
    ]
  }
})

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'calculate_sum') {
    const { a, b } = request.params.arguments
    return { toolResult: a + b }
  }
  throw new McpError(ErrorCode.ToolNotFound, '工具未找到')
})
```

### 步骤 4：将 MCP 服务器集成到 Claude/Cursor Desktop

在 `claude_desktop_config.json` 中注册 MCP 服务器：

```json
{
  "mcpServers": {
    "mcp-server": {
      "command": "node",
      "args": [
        "/Users/YOUR_USER/mcp-server/build/index.js"
      ]
    }
  }
}
```

重启 Claude/Cursor，你应该能在工具列表里看到 `calculate_sum`！

### 步骤 5：调用 REST API 作为 MCP 工具

你也可以让 MCP 工具帮你调用外部 REST API，例如：

```ts
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'httpbin_json') {
    try {
      const response = await fetch('https://httpbin.org/json', {
        method: 'GET',
        headers: {
          accept: 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP 错误！状态码：${response.status}`)
      }
      const data = await response.json()
      return { toolResult: data }
    }
    catch (e) {
      throw new Error('请求失败')
    }
  }
})
```
