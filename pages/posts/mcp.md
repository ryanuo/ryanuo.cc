---
title: Build Your First MCP Server in TypeScript in 10 Minutes
date: '2025-07-12 10:19'
categories: AI
description: Quickly get started with the Model Context Protocol (MCP) by building your first MCP server in TypeScript, allowing AI hosts like Claude or Cursor Desktop to directly call your tools.
plum: true
---

[[toc]]

## What is MCP?

*MCP (Model Context Protocol) is a protocol that allows AI agents to easily connect with various tools.*
It consists of three core components:

### 1. MCP Servers
They act as a bridge to connect APIs, databases, or code, exposing them as tools. MCP servers can be built using Python or TypeScript SDKs.

### 2. MCP Clients
Clients use the MCP protocol to communicate with MCP servers. They can also be built using Python or TypeScript SDKs.

### 3. MCP Hosts
These hosts manage data exchange between servers and clients. Popular MCP hosts include Claude Desktop, Cursor Desktop, Zed, and Sourcegraph Cody.

### Role of MCP Servers
MCP servers provide tools that any MCP host can access. This allows developers to quickly connect AI agents to new tools without writing integration code for each one.

## How to Build an MCP Server

Below is a complete example of building an MCP server using the TypeScript SDK, with Claude or Cursor Desktop as the test host.

### Step 1: Install Dependencies

Create a new project and initialize npm. Then install the dependencies for the MCP server and configure `package.json` and `tsconfig.json`.

**Create project directory:**

```bash
mkdir mcp-server
cd mcp-server
````

**Create `package.json`:**

```json
{
  "name": "mcp-server",
  "version": "0.1.0",
  "description": "Model Context Protocol server example",
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

**Create `tsconfig.json`:**

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

Then run:

```bash
npm install
```

### Step 2: Write Basic Code

Create `src/index.ts` and add the following:

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
  throw new McpError(ErrorCode.ToolNotFound, 'Tool not found')
})

const transport = new StdioServerTransport()
await server.connect(transport)
```

### Step 3: Define and Add MCP Tools

Here we define a simple tool, e.g., **calculating the sum of two numbers**:

```ts
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'calculate_sum',
        description: 'Calculates the sum of two numbers',
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
  throw new McpError(ErrorCode.ToolNotFound, 'Tool not found')
})
```

### Step 4: Integrate MCP Server into Claude or Cursor Desktop

Register the MCP server in `claude_desktop_config.json` or `cursor_desktop_config.json`:

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

Restart Claude or Cursor Desktop, and you should see `calculate_sum` in the tool list!

### Step 5: Call External REST API as an MCP Tool

You can also create tools that fetch external APIs:

```ts
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'httpbin_json') {
    try {
      const response = await fetch('https://httpbin.org/json', {
        method: 'GET',
        headers: { accept: 'application/json' }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      return { toolResult: data }
    }
    catch (e) {
      throw new Error('Request failed')
    }
  }
})
```
