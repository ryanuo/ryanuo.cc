---
title: Deepin Related (Linux)
date: 2020-10-10 20:01
categories: Linux
tags: [Linux]
plum: true
---

[[toc]]

## How to Install
### Preparation

Prepare a USB drive to create a Deepin boot disk. Before installing the system with the Deepin image from the official website, check if there is free disk space on the computer, typically requiring about 25 GB. If not, partition the disk.

Partitioning Method/Steps

1.Right-click on "This PC" and select "Manage".
2.Click on "Disk Management".
3.Right-click on the disk you want to partition and select "Shrink Volume".
4.Click "Shrink" (shrink by approximately 102400MB).
5.The available space should show as 100 GB, indicating that the preparation is complete.
Click "Finish".

For instructions on creating a bootable USB drive, visit the official [Deepin website](https://www.deepin.org/en/download/).

How to Install? [Click here](https://www.deepin.org/en/installation/)

## Troubleshooting After Installation
### No Sound

1.Check if the computer can detect the input and output of the sound card.

Method: Settings > Sound > Advanced Settings - Check for available output and input devices.

2.Verify if the sound card is physically damaged, causing the system to be unable to read physical information. Use the following commands to check for similar feedback related to the sound card:
```bash
sudo lspci | grep audio 
sudo lspci -v
```

3.Modify the grub file to add an instruction:
```bash
GRUB_CMDLINE_LINUX_DEFAULT="${your_existing_configuration_here} snd_hda_intel.dmic_detect=0"
```

Instruction:
```bash
# Enter root mode
su 
cd /etc/default/
vi grub
# Add the code snd_hda_intel.dmic_detect=0 to the grub file
# 1. Press "i" on the keyboard to enter insert mode, modify and add the code
# 2. Press "esc" and then type ":wq!" to save the changes
reboot # Restart the system
```

### Wi-Fi Issue
Problem with the network card driver, unable to connect to Wi-Fi
Delete the file iwlwifi.conf (path: /etc/modprobe.d/iwlwifi.conf)

```bash
# First, enter root mode in sequence
su
cd /etc/modprobe.d/
rm -f iwlwifi.conf # Forcefully delete the file
ls # Check if the file is deleted
reboot # Reboot the system
```