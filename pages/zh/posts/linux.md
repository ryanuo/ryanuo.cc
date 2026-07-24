---
title: C语言底层IO与进程控制核心知识点
date: "2024-06-08 09:05:05"
description: 建议收藏！C语言底层IO与进程控制核心知识点
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

### lseek、fseek

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

### example

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

### fileno、fdopen

- open()：获得文件描述符（int fd）。
- fdopen()：把已有的 fd 包装成 FILE*。
- 使用场景：当 open()、socket()、pipe()、dup() 等系统调用返回 fd，但你希望使用 fgets()、fprintf()、fscanf() 等标准 I/O 函数时，就使用 fdopen()。

### fflush

- fflush()：刷新缓冲区。
- 将缓冲区中未写入的数据立即同步到目标（文件 / 终端 / 设备），或清空输出缓冲区（输入流行为未定义）。

### setvbuf

```c
setvbuf(stdout, NULL, _IONBF, 0);
```

- `_IOFBF`：满了再写（Full Buffer）
- `_IOLBF`：一行一写（Line Buffer）
- `_IONBF`：马上就写（No Buffer）

- 其中，`setvbuf()` 负责决定什么时候刷新缓冲区，而 `fflush()` 则负责立刻刷新当前缓冲区，两者经常配合使用。

## 文件夹操作

### opendir

```c
#include <sys/types.h>
#include <dirent.h>

int main()
{
    DIR *dir;
    dir = opendir(".");
    if (dir == NULL)
    {
        perror("opendir");
    }

    closedir(dir);
}
```

### readdir

```c
// d_type 的相关信息如下
enum
{
    DT_UNKNOWN = 0,       //未知
    DT_FIFO = 1,       //管道文件
    DT_CHR = 2,        //字符设备文件
    DT_DIR = 4,         //目录文件
    DT_BLK = 6,         //块设备文件
    DT_REG = 8,        //一般文件
    DT_LNK = 10,       //链接文件
    DT_SOCK = 12,    //套接字文件
    DT_WHT = 14       //???
};
```

注意： d_name 文件名最长255字符，
NAME_MAX 在limits.h 中定义的

### mkdir

- 创建目录

### rmdir

- 删除目录, 必须为空目录

### remove

- 删除文件、目录
- 删除一个文件或者目录，当pathname为一个文件则调用unlink来删除，如果是一个目录，则调用rmdir 来删除。

```
                              删除对象
                                 │
                     ┌───────────┴───────────┐
                     │                       │
                 普通文件                  空目录
                     │                       │
                  unlink()               rmdir()
                     │                       │
                     └───────────┬───────────┘
                                 │
                              remove()
```

### rename

- 重命名一个文件或者目录，如果 oldpath 和 newpath 所指向的路径不是同一级目录，就移动文件 注意移动的时候要重命名

## mmap、munmap

- mmap() 的本质是建立"文件（或匿名内存）↔ 虚拟地址空间"的映射，让程序可以像操作普通内存一样操作文件或共享内存；
- munmap() 则负责解除这种映射。

## stat、fstat

- 有路径，用 stat()。
- 有文件描述符，用 fstat()。
- 其中，fstat() 在系统编程中出现得更多，因为许多底层 API（如 open()、pipe()、socket()）返回的都是文件描述符。

- lstat：遇到符号链接（软链接）时，stat() 查看的是目标文件，lstat() 查看的是链接文件本身。

## strtol、atoi

- strtol 字符串转换进制类型的数值
- atoi 字符串转换成整型

## sprintf、snprintf

- sprintf 格式化输出字符串
- snprintf 格式化输出字符串，返回写入的字符数，指定的缓冲区大小

## getpwuid、getpwnam、getgrgid

- getpwuid() 函数返回一个指向 passwd 结构的指针，该结构包含用户信息，利用用户 ID 可以获取用户信息。
- getpwnam() 函数返回一个指向 passwd 结构的指针，该结构包含用户信息，利用用户名可以获取用户ID。
- getgrgid() 函数返回一个指向 group 结构的指针，该结构包含用户组信息，利用用户组 ID 可以获取用户组信息。

## strtok

- strtok() 函数将字符串分割成多个子字符串，并返回第一个子字符串。

## 进程
### fork、vfork

1.fork: 子进程拷贝父进程的数据段,代码段
  vfork: 子进程与父进程共享数据段和堆栈空间，所以子进程对变量修改和父进程会同步。
2.fork: 子进程和父进程运行次序不固定，由系统调度决定
  vfork: 子进程会先于父进程运行，父进程会阻塞，等待子进程运行完，再继续运行。

注意：
  vfork因为子进程运行完会将共享的虚拟内存回收
  因此如果父进程中还想要子进程中的那个变量值则需要在子进程最后加个终止函数exit()或者_exit();
  fork中因为一般子父进程不确定谁先谁后所以需要在父进程开始加上函数wait或者waitpid

### getpid、getppid

- getpid() 获取进程的进程号
- getppid() 获取进程的父进程号

### wait、waitpid

- wait() 阻塞等待子进程结束，返回子进程的进程号
- waitpid() 阻塞等待指定进程结束，返回子进程的进程号

### exit、_exit

- exit() 退出进程，返回0
- _exit() 退出进程，返回0

| 对比项                  | `exit()`     | `_exit()`  |
| -------------------- | ------------ | ---------- |
| 所属头文件                | `stdlib.h`   | `unistd.h` |
| 是否刷新 stdio 缓冲区       | ✅ 会          | ❌ 不会       |
| 是否调用 `atexit()` 注册函数 | ✅ 会          | ❌ 不会       |
| 是否关闭打开的文件描述符         | ✅ 会（最终由内核回收） | ✅ 会（内核回收）  |
| 是否释放进程资源             | ✅ 会          | ✅ 会        |
| 是否返回父进程状态码           | ✅ 会          | ✅ 会        |
| 是否立即退出               | ❌ 先做清理       | ✅ 立即退出     |

- exit() 是 C 标准库函数，会执行用户态清理工作（刷新 stdio 缓冲区、调用 atexit() 注册函数等），最后再调用 _exit() 结束进程。
- _exit() 是系统调用封装（直接进入内核），立即终止进程，不执行用户态清理，因此常用于 fork() 后子进程退出，避免重复刷新缓冲区等问题。

>使用场景
- 使用 exit()：适用于程序正常结束，希望完成所有清理工作。
- 使用 _exit()：适用于程序异常结束，希望快速退出，不执行清理工作。

## getenv

- name：要查找的环境变量名（如 "PATH"、"HOME"、"USER" 等系统预设环境变量，或自定义环境变量）

## exec

1. exec 系列为什么要以 NULL 结尾？

- `exec` 函数簇中的参数都是以 `NULL` 结尾的，这是为了避免参数列表中的最后一个参数为空字符串时，被系统认为是命令行参数，argv 是一个以 NULL 结尾的字符指针数组。

### execl

- execl 函数是 `exec` 函数簇中的第一个函数，用于替换当前进程，并执行指定的可执行文件。
- execlp 函数是 `exec` 函数簇中的第二个函数，用于替换当前进程，并执行指定的可执行文件，并搜索可执行文件路径。
- execle 函数是 `exec` 函数簇中的第三个函数，用于替换当前进程，并执行指定的可执行文件，并设置环境变量。

```c
#include <stdio.h>
#include <unistd.h>

int main()
{
    printf("Before execl\n");

    execl("/bin/ls",
          "ls",
          "-l",
          "/home",
          NULL);
    // lp 则是不需要写完整路径，自动搜索环境变量 PATH

     /**
    // le 则需要写完整的路径，并且新增环境变量 LD_LIBRARY_PATH char *const envp[ ]
      char *env[] = {
        "LANG=C",
        "MYNAME=Ryanuo",
        NULL
        };

    execle("/bin/ls",
           "ls",
           "-l",
           "/home",
           NULL,
           env);
     */

    perror("execl");
    return 0;
}
```

### execv

- execv 函数
```c
#include <unistd.h>

int main()
{
    char *argv[] = {
        "ls",
        "-l",
        "/home",
        NULL
    };

    execv("/bin/ls", argv);

    return 0;
}
```
- execvp 函数：自动搜索 PATH。

- execve 函数：可以自己指定环境变量
```c
#include <unistd.h>
char *argv[]={
    "env",
    NULL
};

char *env[]={
    "NAME=Ryanuo",
    "AGE=22",
    NULL
};

execve("/usr/bin/env",argv,env);
```

| 函数         | 参数传递方式 | 搜索 PATH | 指定环境变量    |
| ---------- | ------ | ------- | --------- |
| `execl()`  | 可变参数   | ❌       | ❌         |
| `execlp()` | 可变参数   | ✅       | ❌         |
| `execle()` | 可变参数   | ❌       | ✅         |
| `execv()`  | 数组     | ❌       | ❌         |
| `execvp()` | 数组     | ✅       | ❌         |
| `execve()` | 数组     | ❌       | ✅（底层系统调用） |

### system

>使用场景
1. 快速执行系统命令
2. 调用已有 shell 能力
3. 程序中触发外部工具
4. 简单进程控制

>本质流程

```
你的程序
   ↓
fork()
   ↓
/bin/sh -c "command"
   ↓
执行 shell 命令
   ↓
返回 exit code
```

- system() 适合“偷懒快速执行命令”，不适合“严肃工程级进程控制”。
