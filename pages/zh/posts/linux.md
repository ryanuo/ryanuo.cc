---
title: Linux应用开发
date: "2026-06-08 09:05:05"
description: "Linux应用开发"
cate: 笔记
---

[[toc]]

## 文件操作

1. read 返回实际的字节数，文件结束时返回0，文件失败返回-1。
2. write 返回实际写入的字节数，文件失败返回-1。

- 读文件/网络数据：
    read(fd, buf, sizeof(buf))

- 读字符串：
   n = read(fd, buf, sizeof(buf)-1)
   buf[n] = '\0'

| fd    | FILE*  |
| ----- | ------ |
| 内核对象  | 用户态对象  |
| open  | fopen  |
| read  | fread  |
| write | fwrite |
| close | fclose |
| 无缓冲   | 有缓冲    |

### open

- open() 常用 Flags 表

| 宏           | 含义      | 说明                    |
| ----------- | ------- | --------------------- |
| O_RDONLY    | 只读      | 打开后只能读                |
| O_WRONLY    | 只写      | 打开后只能写                |
| O_RDWR      | 读写      | 可读可写                  |
| O_CREAT     | 创建文件    | 文件不存在则创建              |
| O_EXCL      | 独占创建    | 配合 O_CREAT 使用，文件存在则失败 |
| O_TRUNC     | 清空文件    | 打开时清空原内容              |
| O_APPEND    | 追加写     | 每次写都追加到末尾             |
| O_NONBLOCK  | 非阻塞     | 常用于管道、socket          |
| O_SYNC      | 同步写     | 写入立即同步到磁盘             |
| O_DSYNC     | 数据同步    | 只同步数据，不同步元数据          |
| O_CLOEXEC   | exec时关闭 | exec后自动关闭fd           |
| O_DIRECTORY | 必须是目录   | 不是目录则失败               |
| O_NOFOLLOW  | 不跟随软链接  | 防止符号链接攻击              |
| O_TMPFILE   | 临时匿名文件  | Linux高级特性             |

- 面试高频组合总结
```c
// 只读
open("a.txt", O_RDONLY);

// 读写
open("a.txt", O_RDWR);

// 创建
open("a.txt", O_RDWR | O_CREAT, 0664);

// 覆盖写
open("a.txt", O_WRONLY | O_CREAT | O_TRUNC, 0664);

// 追加写
open("a.txt", O_WRONLY | O_CREAT | O_APPEND, 0664);

// 独占创建
open("a.txt", O_WRONLY | O_CREAT | O_EXCL, 0664);
```

### lseek 和 fseek

- lseek 和 fseek 最大区别是什么
- lseek 操作 fd，fseek 操作 FILE*
- lseek 属于系统调用，fseek 属于标准库函数
- lseek 无缓冲，fseek 有缓冲

- 实际开发中：系统编程（进程、管道、网络、驱动）→ lseek,普通文件处理（文本、配置文件）→ fseek

### fcntl

- fcntl 是文件控制函数
- fcntl 的作用是获取或设置文件描述符的状态位
```c
#include <unistd.h>
#include <fcntl.h>

int fcntl(int fd, int cmd, ...);
```

| cmd             | 作用           | 常用程度  |
| --------------- | ------------ | ----- |
| F_GETFL         | 获取文件状态标志     | ⭐⭐⭐⭐⭐ |
| F_SETFL         | 设置文件状态标志     | ⭐⭐⭐⭐⭐ |
| F_GETFD         | 获取文件描述符标志    | ⭐⭐⭐⭐  |
| F_SETFD         | 设置文件描述符标志    | ⭐⭐⭐⭐  |
| F_DUPFD         | 复制fd         | ⭐⭐⭐   |
| F_DUPFD_CLOEXEC | 带CLOEXEC复制fd | ⭐⭐⭐   |
| F_GETLK         | 获取锁状态        | ⭐⭐    |
| F_SETLK         | 设置文件锁(非阻塞)   | ⭐⭐    |
| F_SETLKW        | 设置文件锁(阻塞)    | ⭐⭐    |

- F_GETFD/F_SETFD 管理 FD_CLOEXEC。
- F_GETFL/F_SETFL 管理 O_NONBLOCK、O_APPEND 等文件状态标志。

| 分类      | 命令                | 标志         |
| ------- | ----------------- | ---------- |
| 文件描述符标志 | F_GETFD / F_SETFD | FD_CLOEXEC |
| 文件状态标志  | F_GETFL / F_SETFL | O_NONBLOCK |
| 文件状态标志  | F_GETFL / F_SETFL | O_APPEND   |
| 文件状态标志  | F_GETFL / F_SETFL | O_SYNC     |
| 文件状态标志  | F_GETFL / F_SETFL | O_RDWR     |

- 设置非阻塞
```c
int flags;

flags = fcntl(fd, F_GETFL);

fcntl(
    fd,
    F_SETFL,
    flags | O_NONBLOCK
);
```

- 恢复阻塞

```c
int flags;

flags = fcntl(fd, F_GETFL);

flags &= ~O_NONBLOCK;

fcntl(
    fd,
    F_SETFL,
    flags
);
```

- F_GETFL -> 获取文件状态
- F_SETFL -> 设置文件状态
- F_GETFD -> 获取描述符标志
- F_SETFD -> 设置描述符标志
- | -> 添加属性
- &~ -> 删除属性
- O_NONBLOCK -> 非阻塞
- FD_CLOEXEC -> exec自动关闭

### 案例： 复制文件
```c
#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>
#include <stdlib.h>

int main(void)
{
    // 打开源文件
    int src = open("a.txt", O_RDONLY);

    if(src == -1)
    {
        perror("open src");
        return -1;
    }

    // 打开目标文件
    int dst = open(
        "b.txt",
        O_WRONLY | O_CREAT | O_TRUNC,
        0664
    );

    if(dst == -1)
    {
        perror("open dst");
        close(src);
        return -1;
    }

    char buf[4096];
    ssize_t n;

    while((n = read(src, buf, sizeof(buf))) > 0)
    {
        write(dst, buf, n);
    }

    if(n == -1)
    {
        perror("read");
    }

    close(src);
    close(dst);

    printf("copy success!\n");

    return 0;
}
```

## exec 函数簇

1. exec 系列为什么要以 NULL 结尾？

- `exec` 函数簇中的参数都是以 `NULL` 结尾的，这是为了避免参数列表中的最后一个参数为空字符串时，被系统认为是命令行参数，argv 是一个以 NULL 结尾的字符指针数组。

## IPC 通讯

> 目的：数据传输、进程间控制、进程同步、事件通知

### 通讯方式

#### 1. 管道
- (匿名管道，命名管道，标准流管道)

#### 2. 共享内存
- 两大类 System V 和 POSIX 共享内存
- 申请内存映射： `shmget()`
- `ipcs -m` 是指 显示所有共享内存
- `ipcrm -m shmid` 删除共享内存
- 连接共享内存： `shmat()`
- 断开共享内存： `shmdt()`
- 共享内存回收： `shmctl()` 参数 IPC_RMID、IPC_STAT、IPC_SET
- P操作：必须考虑SEM_UNDO，防止崩溃后资源泄漏。
- V操作：永远不要设置SEM_UNDO，它不是为释放操作设计的。

#### 3. 消息队列
- 一条消息队列，最大容量是 16384字节(16K)；一条消息最大长度为8192字节(8K).
>核心API与流程
- 生成键值 (ftok)：通过文件路径和项目ID生成一个唯一的 key_t 键值，用于标识消息队列。
- 创建/获取队列 (msgget)：根据键值创建新的消息队列或获取已存在的队列，需指定权限（如 IPC_CREAT | 0666）。
- 发送消息 (msgsnd)：将消息写入队列。消息结构体必须以 long mtype（消息类型，必须大于0）开头，后面跟着消息正文。
- 接收消息 (msgrcv)：从队列读取消息并自动将其从队列中删除。其最大特点是支持按类型过滤接收：
msgtyp = 0：按FIFO顺序接收第一条消息；msgtyp > 0：只接收指定类型的第一条消息；msgtyp < 0：接收类型值小于等于其绝对值的最小类型消息。
- 控制队列 (msgctl)：用于删除队列（IPC_RMID）、获取状态信息（IPC_STAT）或修改权限（IPC_SET）。
>开发避坑指南
- System V 的残留问题：System V 消息队列是随内核持续的，如果程序异常退出且未调用 msgctl(IPC_RMID) 删除队列，消息队列会残留在系统中。需使用 ipcs -q 查看并用 ipcrm -q 手动清理。
- 内存泄漏防范：在自定义消息队列中，出队（mq_pop）后务必 free 掉消息体（body）、消息结构体（msg）以及队列节点（node），防止内存泄漏。
- 销毁队列的规范：销毁内存队列时，不仅要销毁互斥锁和条件变量，还要遍历链表释放所有残留的消息节点。

#### 4. 信号量
- 含义：内核变量
- 创建信号量： `semget()`
- semop 操作： `semop()`

#### 5. 信号

#### 6. 套接字
