---
title: Yunshu (EagleYun) Mac Uninstall Guide
date: 2024-06-XX
categories: Software Uninstall
description: This article provides a complete guide to uninstalling Yunshu/EagleYun client on Mac, including residue detection, manual removal, automation script, and important notes.
---

# Yunshu (EagleYun) Mac Uninstall Guide

## 1️⃣ Purpose
Completely remove the Yunshu/EagleYun client and its background services, clean up residual directories and configuration files, and keep your system clean without affecting other applications.

## 2️⃣ Detect Yunshu Residue

### 2.1 Detection Script Example
```bash
#!/bin/bash
echo "=== Detecting Yunshu (EagleYun) Residue ==="

echo ""
echo ">> Process Check:"
ps aux | grep -i "yunshu\|eagleyun" | grep -v grep

echo ""
echo ">> Startup Items (LaunchDaemons / LaunchAgents):"
sudo grep -ril "yunshu\|eagleyun" /Library/LaunchDaemons /Library/LaunchAgents ~/Library/LaunchAgents 2>/dev/null

echo ""
echo ">> Application Directories:"
[ -d "/opt/.yunshu" ] && echo "/opt/.yunshu"
[ -d "/Library/Application Support/Yunshu" ] && echo "/Library/Application Support/Yunshu"
[ -d "/Library/Application Support/EagleCloud" ] && echo "/Library/Application Support/EagleCloud"

echo ""
echo ">> Log Directories:"
[ -d "/Library/Logs/com.eagleyun.sase.helper" ] && echo "/Library/Logs/com.eagleyun.sase.helper"

echo ""
echo ">> User Preferences:"
ls ~/Library/Preferences | grep -i "eagleyun" 2>/dev/null
ls ~/Library/Preferences | grep -i "yunshu" 2>/dev/null

echo ""
echo "=== Detection Complete ==="
```

### 2.2 How to Run

```bash
chmod +x check_yunshu.sh
./check_yunshu.sh
```

### 2.3 Detection Result Explanation

* **Process**: If you see `FWRunner`, `TBRunner`, `YunshuAgent`, etc., the software is still running.
* **Startup Items**: Files like `com.eagleyun*.plist` indicate auto-start entries exist.
* **Application Directories**: `/opt/.yunshu`, `/Library/Application Support/Yunshu`, `/Library/Application Support/EagleCloud`
* **Log Directories**: `/Library/Logs/com.eagleyun.sase.helper`
* **User Preferences**: `~/Library/Preferences/com.eagleyun.sase.plist`

## 3️⃣ Manual Uninstall Steps

### 3.1 Stop Background Processes

```bash
sudo kill -9 $(ps aux | grep -i "yunshu\|eagleyun" | grep -v grep | awk '{print $2}')
```

### 3.2 Remove Startup Items

```bash
sudo launchctl bootout system /Library/LaunchDaemons/com.eagleyun*.plist 2>/dev/null
sudo rm -f /Library/LaunchDaemons/com.eagleyun*.plist
rm -f ~/Library/LaunchAgents/com.eagleyun*
```

### 3.3 Delete Application Directories and Logs

```bash
sudo rm -rf /opt/.yunshu
sudo rm -rf "/Library/Application Support/Yunshu"
sudo rm -rf "/Library/Application Support/EagleCloud"
sudo rm -rf "/Library/Logs/com.eagleyun.sase.helper"
rm -f ~/Library/Preferences/com.eagleyun.sase.plist
```

## 4️⃣ Uninstall Confirmation

Run the detection script `check_yunshu.sh` again or manually check:

```bash
ps aux | grep -i "yunshu\|eagleyun" | grep -v grep
launchctl list | grep -i "yunshu\|eagleyun"
```

**If the output is empty**, the uninstall is complete.

## 5️⃣ Notes

1. **Permissions**: Removing files under `/opt/.yunshu` and `/Library` requires `sudo` privileges.
2. **System Integrity**: Do not delete files under `/System/Library` to avoid damaging macOS.
3. **Backup**: Backup important data before uninstalling.
4. **Restart Recommended**: Restart your system after uninstalling to ensure all background services are cleared.

## 6️⃣ Automated Uninstall Script (Optional)

For one-click uninstall, use the following script:

```bash
#!/bin/bash
echo "=== Starting Yunshu (EagleYun) Uninstall ==="

echo ">> Stopping related processes..."
sudo kill -9 $(ps aux | grep -i "yunshu\|eagleyun" | grep -v grep | awk '{print $2}') 2>/dev/null

echo ">> Removing startup items..."
sudo launchctl bootout system /Library/LaunchDaemons/com.eagleyun*.plist 2>/dev/null
sudo rm -f /Library/LaunchDaemons/com.eagleyun*.plist
rm -f ~/Library/LaunchAgents/com.eagleyun*

echo ">> Deleting application directories and logs..."
sudo rm -rf /opt/.yunshu
sudo rm -rf "/Library/Application Support/Yunshu"
sudo rm -rf "/Library/Application Support/EagleCloud"
sudo rm -rf "/Library/Logs/com.eagleyun.sase.helper"
rm -f ~/Library/Preferences/com.eagleyun.sase.plist

echo "=== Uninstall complete. Please restart your system. ==="
```

**How to use**:

1. Save the above content as `uninstall_yunshu.sh`
2. Make it executable and run:
   ```bash
   chmod +x uninstall_yunshu.sh
   ./uninstall_yunshu.sh
   ```

**Note**: The automation script will perform all uninstall steps. Make sure to backup important data and close related applications.
