---
title: Yunshu (EagleYun) Mac 卸载指南
date: 2024-07-01
categories: 软件卸载
description: 本文详细介绍如何在 Mac 上彻底卸载 Yunshu/EagleYun 客户端，包括检测残留、手动卸载、自动化脚本及注意事项，帮助用户清理系统环境。
---

# Yunshu (EagleYun) Mac 卸载文档

## 1️⃣ 卸载目的
彻底移除 Yunshu/EagleYun 客户端及其后台服务，清理残留目录和配置文件，保证系统干净，不影响其他应用。

## 2️⃣ 检测 Yunshu 残留

### 2.1 检测脚本示例
```bash
#!/bin/bash
echo "=== 检测 Yunshu (EagleYun) 残留 ==="

echo ""
echo ">> 进程检查:"
ps aux | grep -i "yunshu\|eagleyun" | grep -v grep

echo ""
echo ">> 启动项 (LaunchDaemons / LaunchAgents):"
sudo grep -ril "yunshu\|eagleyun" /Library/LaunchDaemons /Library/LaunchAgents ~/Library/LaunchAgents 2>/dev/null

echo ""
echo ">> 应用目录:"
[ -d "/opt/.yunshu" ] && echo "/opt/.yunshu"
[ -d "/Library/Application Support/Yunshu" ] && echo "/Library/Application Support/Yunshu"
[ -d "/Library/Application Support/EagleCloud" ] && echo "/Library/Application Support/EagleCloud"

echo ""
echo ">> 日志目录:"
[ -d "/Library/Logs/com.eagleyun.sase.helper" ] && echo "/Library/Logs/com.eagleyun.sase.helper"

echo ""
echo ">> 用户偏好文件:"
ls ~/Library/Preferences | grep -i "eagleyun" 2>/dev/null
ls ~/Library/Preferences | grep -i "yunshu" 2>/dev/null

echo ""
echo "=== 检测完成 ==="
````

### 2.2 运行方式

```bash
chmod +x check_yunshu.sh
./check_yunshu.sh
```

### 2.3 检测结果说明

* **进程**：如有 `FWRunner`、`TBRunner`、`YunshuAgent` 等进程表示软件仍在运行
* **启动项**：包含 `com.eagleyun*.plist` 表示开机自启存在
* **应用目录**：`/opt/.yunshu`、`/Library/Application Support/Yunshu`、`/Library/Application Support/EagleCloud`
* **日志目录**：`/Library/Logs/com.eagleyun.sase.helper`
* **用户偏好文件**：`~/Library/Preferences/com.eagleyun.sase.plist`

## 3️⃣ 手动卸载步骤

### 3.1 停止后台进程

```bash
sudo kill -9 $(ps aux | grep -i "yunshu\|eagleyun" | grep -v grep | awk '{print $2}')
```

### 3.2 卸载启动项

```bash
sudo launchctl bootout system /Library/LaunchDaemons/com.eagleyun*.plist 2>/dev/null
sudo rm -f /Library/LaunchDaemons/com.eagleyun*.plist
rm -f ~/Library/LaunchAgents/com.eagleyun*
```

### 3.3 删除应用目录及日志

```bash
sudo rm -rf /opt/.yunshu
sudo rm -rf "/Library/Application Support/Yunshu"
sudo rm -rf "/Library/Application Support/EagleCloud"
sudo rm -rf "/Library/Logs/com.eagleyun.sase.helper"
rm -f ~/Library/Preferences/com.eagleyun.sase.plist
```

## 4️⃣ 卸载确认

再次运行检测脚本 `check_yunshu.sh` 或手动检查：

```bash
ps aux | grep -i "yunshu\|eagleyun" | grep -v grep
launchctl list | grep -i "yunshu\|eagleyun"
```

**确认输出为空**，说明卸载彻底。

## 5️⃣ 注意事项

1. **权限**：删除 `/opt/.yunshu` 和 `/Library` 下文件需要 `sudo` 权限
2. **系统完整性**：不要删除 `/System/Library` 下的文件，避免破坏 macOS
3. **备份**：卸载前若有重要数据，建议备份
4. **重启建议**：卸载完成后重启系统，确保后台服务全部清除

## 6️⃣ 自动化卸载脚本（可选）

如需一键卸载，可使用如下脚本：

```bash
#!/bin/bash
echo "=== 开始自动卸载 Yunshu (EagleYun) ==="

echo ">> 停止相关进程..."
sudo kill -9 $(ps aux | grep -i "yunshu\|eagleyun" | grep -v grep | awk '{print $2}') 2>/dev/null

echo ">> 卸载启动项..."
sudo launchctl bootout system /Library/LaunchDaemons/com.eagleyun*.plist 2>/dev/null
sudo rm -f /Library/LaunchDaemons/com.eagleyun*.plist
rm -f ~/Library/LaunchAgents/com.eagleyun*

echo ">> 删除应用目录及日志..."
sudo rm -rf /opt/.yunshu
sudo rm -rf "/Library/Application Support/Yunshu"
sudo rm -rf "/Library/Application Support/EagleCloud"
sudo rm -rf "/Library/Logs/com.eagleyun.sase.helper"
rm -f ~/Library/Preferences/com.eagleyun.sase.plist

echo "=== 卸载完成，请重启系统 ==="
```

**使用方法**：

1. 将上述内容保存为 `uninstall_yunshu.sh`
2. 赋予执行权限并运行：
   ```bash
   chmod +x uninstall_yunshu.sh
   ./uninstall_yunshu.sh
   ```

**注意**：自动化脚本会执行所有卸载步骤，请确保已备份重要数据，并关闭相关应用程序。
