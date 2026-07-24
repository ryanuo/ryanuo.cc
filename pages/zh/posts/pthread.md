---
title: Linux 并发编程全解析：从线程同步到 I/O 多路复用
date: "2024-07-05 14:08"
cate: 笔记
description: 线程I/O\线程同步I/O 多路复用
---

[[toc]]

# 线程

## 一、线程基础

### 1.1 线程是什么？

- **进程**：操作系统分配资源（内存空间、文件描述符、信号表...）的最小单位。
- **线程**：操作系统**调度执行**的最小单位。同一进程的多个线程共享：
  - 虚拟内存、代码段、数据段、堆
  - 文件描述符表、信号处理、工作目录、用户/组 id
  - 但每个线程**独立拥有**：线程 id、栈、寄存器、信号掩码、`errno`、线程私有数据（`pthread_key`）

直观对比：

| 项目 | 多进程 | 多线程 |
|---|---|---|
| 资源共享 | 独立的地址空间，天然隔离 | 共享地址空间，天然共享内存 |
| 上下文切换 | 更重（切换页表、刷新 TLB、刷新 caches 的概率大） | 较轻（共享页表） |
| 通信方式 | 复杂：管道、FIFO、mmap、socket、信号 | 天然的共享内存 + 同步原语 |
| 可靠性 | 一个进程 crash 不影响其他进程 | 一个线程 crash 通常会把整个进程带走 |
| 安全边界 | 强隔离，不易误操作 | 强耦合，需要严格同步 |

### 1.2 基本 lifecycle

```c
#include <pthread.h>
#include <stdio.h>
#include <unistd.h>

// 推荐用法：函数指针写法
static void *worker(void *arg) {
    int id = *(int *)arg;
    printf("thread %d start\n", id);
    usleep(100 * 1000);
    printf("thread %d end\n", id);

    // 方式一：返回值；主线程通过 pthread_join 获取
    // 注意：只能返回永存的值；静态、malloc 或 (void*)(long)
    static int ret = 42;
    return (void *)(long)ret;
}

int main(void) {
    pthread_t tid;
    int id = 1;

    // 创建线程
    pthread_create(&tid, NULL, worker, &id);

    // 回收线程
    void *ret = NULL;
    pthread_join(tid, &ret);
    printf("thread returned %ld\n", (long)ret);

    return 0;
}
```

几个易踩坑的点：

- `arg` 的生命周期必须长于线程。不要传栈地址给不 `join` 的线程，除非你保证栈还在。
- `pthread_join` 会阻塞等待指定线程结束；不调用会变成 **"zombie 线程"**，资源和 PID 不回收。
- `pthread_detach` 告诉系统"我不管这个线程了，它结束就自动回收"。例如：`pthread_detach(pthread_self)`。
- 线程函数里不要做 `return &main_stack_value`，应该 `malloc` 一个、或返回全局/静态变量、或强转 `(void*)(long)`。

### 1.3 线程的数据类型

| 作用 | 类型 |
|---|---|
| 线程句柄 | `pthread_t` |
| 一次性初始化控制 | `pthread_once_t`（常 `PTHREAD_ONCE_INIT`） |
| 互斥锁 | `pthread_mutex_t` |
| 读写锁 | `pthread_rwlock_t` |
| 条件变量 | `pthread_cond_t` |
| 自旋锁 | `pthread_spinlock_t` |
| 线程私有键 | `pthread_key_t` |
| 信号量 | `sem_t`（`<semaphore.h>`） |
| 栅栏 | `pthread_barrier_t` |

### 1.4 Cancel 与 Cleanup

```c
// 主线程中取消子线程
pthread_cancel(tid);

// 子线程定义清理动作（被 cancel 时自动调用）
// push / pop 必须是配对出现在同一函数、同一大括号的"宏"
pthread_cleanup_push(cleanup_handler, arg);
// ...
pthread_cleanup_pop(execute);       // 0: 只弹出; 非 0: 调用 handler
```

Cancel 实际上是"请求"，不是强制。默认是 **deferred cancel**：只在遇到取消点函数（`read`、`write`、`pthread_cond_wait`、`sleep`、`sem_wait`...）时才退出。可以用 `pthread_setcanceltype(PTHREAD_CANCEL_ASYNCHRONOUS, NULL)` 改为异步，但**容易在持有锁时被杀死**，导致后续所有阻塞在该锁上的线程永久卡住。

> 工程实践里我更偏爱"主动退出"替代 cancel：让线程轮询一个 `atomic` flag，看到就主动退出、统一走清理逻辑。这样可以避免异步 cancel 的资源泄漏和锁遗留问题。

## 二、同步原语（Synchronization Primitives）

### 2.1 为什么需要同步

共享内存天生可见，但**可见性、原子性、顺序性**三个问题会导致：

- **竞态**（race condition）：两个线程同时读写同一变量，典型如 `counter++`
- **数据撕裂**（torn read/write）：写操作被中断，对方读到一半旧一半新
- **编译器重排**：优化后实际执行顺序不一定是你写的顺序
- **CPU 重排**：弱内存序架构（ARM/Power）上观察到的顺序和你写的完全不同

C11 `stdatomic.h`、C23 atomic、GCC `__atomic_*` / `__sync_*` 都能帮你解决可见性 + 原子 + memory-order 问题。但在"同步原语"这个话题里，我们通常把"互斥锁 / 条件变量 / 读写锁 / 信号量 / 自旋锁 / 栅栏"这些负责"协调与等待"的机制称作同步原语。

### 2.2 互斥锁 `pthread_mutex_t`

```c
// 静态初始化（PTHREAD_MUTEX_INITIALIZER）
static pthread_mutex_t mtx = PTHREAD_MUTEX_INITIALIZER;

// 或者运行时初始化（推荐用于动态分配的锁 / 需要设置属性的锁）
pthread_mutexattr_t attr;
pthread_mutexattr_init(&attr);
pthread_mutexattr_settype(&attr, PTHREAD_MUTEX_ERRORCHECK); // 或 RECURSIVE / NORMAL
pthread_mutex_init(&mtx, &attr);
pthread_mutexattr_destroy(&attr);

pthread_mutex_lock(&mtx);
// 临界区
pthread_mutex_unlock(&mtx);
// 用完销毁
pthread_mutex_destroy(&mtx);
```

典型模式：

```c
static pthread_mutex_t mtx = PTHREAD_MUTEX_INITIALIZER;
static int counter = 0;

int inc(void) {
    pthread_mutex_lock(&mtx);
    int new_val = ++counter;                // 锁住 Read-Modify-Write
    pthread_mutex_unlock(&mtx);
    return new_val;
}

// 易错点：在锁外直接读 counter 拿到的可能是过期值；只在锁内保证可见性
```

类型：

- `PTHREAD_MUTEX_NORMAL`：非递归锁，同线程加锁两次立刻死锁
- `PTHREAD_MUTEX_RECURSIVE`：递归锁，支持同一线程重复加锁（内部维护锁计数 + owner）
- `PTHREAD_MUTEX_ERRORCHECK`：加锁两次立刻返回 `EDEADLK`，项目 debug 期首选

适用场景：

- 临界区短、争用低：直接 mutex 是最稳的选择
- 临界区长、争用高、并发读远大于写：考虑读写锁

### 2.3 读写锁 `pthread_rwlock_t`

```c
static pthread_rwlock_t rw = PTHREAD_RWLOCK_INITIALIZER;

// 读锁：多个线程可以同时持有
pthread_rwlock_rdlock(&rw);
/* 读共享数据 */
pthread_rwlock_unlock(&rw);

// 写锁：独占
pthread_rwlock_wrlock(&rw);
/* 修改共享数据 */
pthread_rwlock_unlock(&rw);
```

适用场景：读 >> 写，例如**缓存表**、**路由表**、**全局 lookup 表**。

缺点：

- **写饥饿**：很多实现偏向读锁，如果读线程一直涌来，写线程可能长期得不到锁
- 成本：实现比 mutex 更复杂，**在短临界区或 write 频繁的场景，反而比 mutex 慢**

工程建议：先上 mutex，性能出现瓶颈且 profiling 证实是读争用主导，再改用读写锁。

### 2.4 条件变量 `pthread_cond_t`

条件变量**没有状态**，它只做一件事：**让线程等待，直到另一个线程通知它"条件可能变了"**。

```c
static pthread_mutex_t mtx = PTHREAD_MUTEX_INITIALIZER;
static pthread_cond_t  cond = PTHREAD_COND_INITIALIZER;
static int done = 0;

// 等待者
pthread_mutex_lock(&mtx);
while (!done) {                          // 必须是 while：避免虚假唤醒
    pthread_cond_wait(&cond, &mtx);      // 解锁并睡；醒来前重新加锁
}
/* 这时可以安全地访问 done 和共享数据 */
pthread_mutex_unlock(&mtx);

// 通知者
pthread_mutex_lock(&mtx);
done = 1;
pthread_cond_broadcast(&cond);           // 唤醒所有等待者
// 或: pthread_cond_signal(&cond);      // 唤醒一个等待者
pthread_mutex_unlock(&mtx);
```

要点：

- `while(!cond)` 不是 `if(!cond)`：避免**虚假唤醒**（spurious wake-up）和**信号被偷吃**（偷跑线程在 `signal` 之后一把抢到锁）
- `pthread_cond_wait` 会把提供的 mutex **解锁+挂起**，归来时**重新带着锁**
- `signal` vs `broadcast`：
  - `signal`：唤醒一个等待者；适合多消费者等一个资源
  - `broadcast`：唤醒所有；适合等待"任务队列非空"的 worker 池

### 2.5 信号量 `sem_t`

更泛化的同步原语：有 N 个 permits，`sem_wait` 申请一个，`sem_post` 释放一个。

- 可以当互斥锁用：`sem_init(&sem, 0, 1)`
- 也可以当条件变量用：配合 mutex 表示"事件计数"
- 特别契合生产者-消费者；最大好处是**没有 owner 概念**，任何线程都能 `post`

```c
sem_t sem;
sem_init(&sem, 0, 0);            // pshared=0 表示线程间共享；value=0 表示初始没有资源

// 生产
sem_post(&sem);

// 消费（阻塞直到有资源）
sem_wait(&sem);
```

### 2.6 自旋锁 `pthread_spinlock_t`

```c
pthread_spinlock_t spin;
pthread_spin_init(&spin, PTHREAD_PROCESS_PRIVATE);
pthread_spin_lock(&spin);
/* 临界区极短 */
pthread_spin_unlock(&spin);
pthread_spin_destroy(&spin);
```

和 mutex 的区别：mutex 会 syscall futex、阻塞唤醒让出 CPU；spinlock 只在用户态 CAS / lock cmpxchg 循环空转。

适用场景：

- 临界区**极短**（几行、小于几十个 CPU 指令）
- 不舍得付出**上下文切换的开销**（通常 1-10us）
- **单核慎用**：等待者占住 CPU，持有者反而得不到调度

### 2.7 栅栏 `pthread_barrier_t`

让一组线程**都到达某一阶段后一起出发**，典型的分阶段算法 / 多线程 benchmark。

```c
pthread_barrier_t barrier;
pthread_barrier_init(&barrier, NULL, N); // 需要 N 个线程到达

// 在所有 worker 的阶段交界处
pthread_barrier_wait(&barrier);
```

例如 `map`-`reduce`：N 个 map worker 把数据分片并行处理，到 `reduce` 阶段必须等所有 map 完成。

### 2.8 一次性初始化 `pthread_once`

```c
static pthread_once_t once = PTHREAD_ONCE_INIT;
static struct config *global_cfg;

static void init_cfg(void) { global_cfg = load_config("/etc/app.conf"); }

struct config *get_cfg(void) {
    pthread_once(&once, init_cfg);
    return global_cfg;
}
```

等价于 C11 的 `call_once`，非常适合全局单例的"懒初始化"。

### 2.9 避免 deadlock 的铁律

- **固定的全局加锁顺序**：所有线程以相同顺序加 A->B->C 锁；反过来会死锁
- **设置超时**：`pthread_mutex_timedlock`、`sem_timedwait`
- **用 lock hierarchy**：把锁编号，文档 + 代码层面保持一致
- **优先使用细粒度锁 / 减少持锁时长**
- **避免在持锁时调用外部代码**（可能触发新的加锁）
- **静态分析工具**：`helgrind` / `TSan` 能检测数据竞争与死锁

## 三、三个经典问题（面试"三件套"）

### 3.1 生产者-消费者（Bounded Buffer）

```c
#define N 16
static int buffer[N];
static int head = 0, tail = 0, count = 0;
static pthread_mutex_t mtx = PTHREAD_MUTEX_INITIALIZER;
static pthread_cond_t not_full  = PTHREAD_COND_INITIALIZER;
static pthread_cond_t not_empty = PTHREAD_COND_INITIALIZER;

void produce(int value) {
    pthread_mutex_lock(&mtx);
    while (count == N) pthread_cond_wait(&not_full, &mtx);   // 满则等待
    buffer[head] = value;
    head = (head + 1) % N;
    count++;
    pthread_cond_signal(&not_empty);                         // 通知消费者
    pthread_mutex_unlock(&mtx);
}

int consume(void) {
    pthread_mutex_lock(&mtx);
    while (count == 0) pthread_cond_wait(&not_empty, &mtx);
    int v = buffer[tail];
    tail = (tail + 1) % N;
    count--;
    pthread_cond_signal(&not_full);
    pthread_mutex_unlock(&mtx);
    return v;
}
```

要点：
- 锁保护**判断**和**入队/出队**，保护判定和状态修改的原子性
- `while` 而非 `if`：防止虚假唤醒和信号被偷吃
- 每个条件变量绑定对应的**状态含义**：`not_full`=有空间，`not_empty`=有数据

### 3.2 读者-写者

```c
// 读者优先版
static pthread_mutex_t mtx = PTHREAD_MUTEX_INITIALIZER;
static pthread_cond_t  write_ok = PTHREAD_COND_INITIALIZER;
static int readers_active = 0;
static int writer_waiting = 0;
static int writers_active = 0;

void read_lock(void) {
    pthread_mutex_lock(&mtx);
    while (writers_active || writer_waiting)
        pthread_cond_wait(&write_ok, &mtx);
    readers_active++;
    pthread_mutex_unlock(&mtx);
}

void write_lock(void) {
    pthread_mutex_lock(&mtx);
    writer_waiting++;
    while (readers_active || writers_active)
        pthread_cond_wait(&write_ok, &mtx);
    writer_waiting--;
    writers_active = 1;
    pthread_mutex_unlock(&mtx);
}

void read_unlock(void) {
    pthread_mutex_lock(&mtx);
    readers_active--;
    if (readers_active == 0) pthread_cond_broadcast(&write_ok);
    pthread_mutex_unlock(&mtx);
}

void write_unlock(void) {
    pthread_mutex_lock(&mtx);
    writers_active = 0;
    pthread_cond_broadcast(&write_ok);
    pthread_mutex_unlock(&mtx);
}
```

可以改造为"写者优先"或"公平版"：核心差异在于 **reads_active 和 writes_active 上的等待策略**。

### 3.3 哲学家就餐

```c
#define P 5
static pthread_mutex_t chopsticks[P];

void philosopher(int i) {
    int l = i, r = (i + 1) % P;
    // 打破死锁的方法之一：统一先拿较小编号的筷子
    if (l > r) { int tmp = l; l = r; r = tmp; }
    pthread_mutex_lock(&chopsticks[l]);
    pthread_mutex_lock(&chopsticks[r]);
    eat();
    pthread_mutex_unlock(&chopsticks[r]);
    pthread_mutex_unlock(&chopsticks[l]);
}
```

其他常见解法：资源分级、仲裁者（master 限制 N-1 人同时拿筷子）、奇偶侧策略。

## 四、服务器场景下的线程与同步

### 4.1 服务器架构的演化脉络

```
blocking I/O + one-thread-per-connection (PREFORK)
        |  成千上万连接时上下文切换爆炸，栈内存放大
        v
multi-process: prefork (Apache httpd)
        |  进程重量大，共享内存麻烦
        v
I/O multiplexing + single-threaded loop (Redis / Nginx 简化版)
        |  CPU 密集型处理阻塞 loop，不友好超线程
        v
I/O multiplexing + thread pool (主流现代方案)
        |
        v
io_uring + io_workqueue  (较新路线，更快但生态年轻)
```

### 4.2 模式对比

| 架构 | 优点 | 缺点 | 典型场景 |
|---|---|---|---|
| 阻塞 + 每连接一线程 | 编码直白、顺序思维 | 线程数爆炸；10k conns 困难 | 少量连接 + 单连接处理较重 |
| 线程池 + Reactor 分发 | 线程数可控，拥抱多核 | 任务拆分要仔细；临界区较多 | **主流 Web / RPC** |
| 单线程事件驱动 | 少锁、高吞吐 I/O | CPU 密集任务会卡 loop | Redis、memcached、DNS |
| epoll/Reactor + 线程池 | 兼具两者优点 | 结构较复杂 | 现代高性能服务器 |
| io_uring ring | 极简异步、少 syscall | Linux 5.1+ 较新，生态年轻 | 高性能存储 / proxy |

### 4.3 为什么服务器场景必须考虑同步

| 典型模块 | 推荐的同步机制 |
|---|---|
| 全局统计（qps、活跃连接） | 小规模 atomic / 短锁 |
| 连接表 lookup | rwlock 或 分段锁 |
| 写日志 | mutex 或 lock-free ring |
| 配置热加载 | RCU / rwlock + once |
| 任务队列、资源池 | 经典 prod-cons |
| Timer heap | mutex + cond 或 短 spinlock |
| 全局资源（连接池、worker 池） | 合适的组合 |

### 4.4 经典"主线程 accept + 工作线程处理"

```c
#include <pthread.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <netinet/in.h>
#include <sys/socket.h>

#define PORT 8080
#define THREADS 4

static int listen_fd;
static pthread_t workers[THREADS];

static void *worker(void *arg) {
    (void)arg;
    for (;;) {
        // accept 在单 listen_fd 上是线程安全的（kernel 内会串行化并避免 thundering-herd）
        int fd = accept(listen_fd, NULL, NULL);
        if (fd < 0) continue;

        char buf[4096];
        ssize_t n;
        while ((n = read(fd, buf, sizeof(buf))) > 0) {
            write(fd, buf, n); // echo
        }
        close(fd);
    }
    return NULL;
}

int main(void) {
    listen_fd = socket(AF_INET, SOCK_STREAM, 0);
    int opt = 1;
    setsockopt(listen_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
    struct sockaddr_in a = {
        .sin_family = AF_INET,
        .sin_port = htons(PORT),
        .sin_addr.s_addr = htonl(INADDR_ANY),
    };
    bind(listen_fd, (struct sockaddr *)&a, sizeof(a));
    listen(listen_fd, 128);

    for (int i = 0; i < THREADS; i++)
        pthread_create(&workers[i], NULL, worker, NULL);

    for (int i = 0; i < THREADS; i++)
        pthread_join(workers[i], NULL);
}
```

这个模式有两个明显瓶颈：

1. 突发流量：某个 Worker 被**长连接或慢连接** block，其他 Worker 闲置——线程模型对**长尾不均**非常敏感。
2. 高并发下 kernel 内 `listen_lock` 争用：`accept()` 本身有 listen 锁，高接受率时成为热点（可引入 `SO_REUSEPORT` 多 listen socket 分摊）。

可改进的方向：

- `SO_REUSEPORT` 让多个线程各自 listen 自己的 socket 分摊 accept
- epoll + non-blocking + edge-triggered 替代阻塞模型
- 结合 `eventfd` + 派发队列实现 **Reactor + worker pool**

### 4.5 epoll + eventfd + worker pool（较高级的现代骨架）

```
                        main thread (Reactor)
┌──────────────────────────────────────────────────────────────────────┐
│  epoll_wait(listen_fd, clientfd*, eventfd, timerfd, signalfd...)    │
│     │ new conn      : accept -> epoll_add                           │
│     │ client ready  : read request -> task_enqueue(worker_pool)     │
│     │ timerfd fired : run scheduled tasks                           │
│     │ eventfd       : worker 上报完成，主线程集中 epoll_mod OUT     │
└──────────────────────────────────────────────────────────────────────┘
                              |
                              v  task queue + broadcast/eventfd
┌──────────────────────────────────────────────────────────────────────┐
│                    worker threads (business logic)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ worker 0 │ │ worker 1 │ │ worker 2 │ │ worker 3 │ ...          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘              │
└──────────────────────────────────────────────────────────────────────┘
```

这样拆分后：

- Reactor 只负责**I/O + 事件调度**，不被 CPU 密集任务卡住
- Worker 只负责**业务逻辑**，可与 CPU 核心数线性扩展
- 临界区只在跨线程队列上（经典的 prod-cons）

这是经典的 **Leader/Followers + Reactor** 组合，也是很多真实系统的骨干。

## 五、I/O 多路复用：select / poll / epoll

### 5.1 为什么需要多路复用

普通阻塞模型下一个线程只能处理一个 fd；要做到"一个线程管理多个 fd"，只有三条路：

- 开 N 个线程（C10K 场景开销爆炸）
- 非阻塞 + 主动轮询（空转 CPU 浪费）
- **请操作系统在任意 fd 就绪时通知你** → 多路复用

典型三段式：**注册兴趣 fd** → **阻塞等待任意就绪** → **迭代就绪集并处理**

| 维度 | select | poll | epoll |
|---|---|---|---|
| 最大 fd 数 | `FD_SETSIZE`，通常 1024 | 无限制 | 无限制 |
| 增长能力 | 每次重置 fd_set，O(n) 扫描 | O(n) 扫描整个数组 | O(1)（红黑树 + 就绪链表） |
| 适用量级 | < 100 fd | < 1000 fd | **≥ 1000 fd，主流** |
| 触发模式 | 仅 Level Triggered | 仅 Level Triggered | LT + Edge Triggered |
| 跨平台 | POSIX 通用 | 高 | Linux only |

### 5.2 `select()` 快速上手

```c
#include <sys/select.h>
#include <unistd.h>
#include <stdio.h>

int main(void) {
    fd_set rfds;
    while (1) {
        FD_ZERO(&rfds);
        FD_SET(STDIN_FILENO, &rfds);

        struct timeval tv = { .tv_sec = 5, .tv_usec = 0 };

        int ret = select(STDIN_FILENO + 1, &rfds, NULL, NULL, &tv);
        if (ret < 0) { perror("select"); break; }
        if (ret == 0) { printf("timeout\n"); continue; }

        if (FD_ISSET(STDIN_FILENO, &rfds)) {
            char buf[256];
            ssize_t n = read(STDIN_FILENO, buf, sizeof(buf));
            printf("got %zd bytes\n", n);
        }
    }
    return 0;
}
```

### 5.3 `poll()`——只是稍微好了点

```c
#include <poll.h>
#include <stdio.h>
#include <unistd.h>

int main(void) {
    struct pollfd fds[2] = {
        { .fd = STDIN_FILENO, .events = POLLIN },
        { .fd = sock_fd,      .events = POLLIN },
    };
    while (1) {
        int ret = poll(fds, 2, 5000);       // 5 秒超时
        if (ret > 0) {
            for (int i = 0; i < 2; i++) {
                if (fds[i].revents & POLLIN) {
                    char buf[256];
                    ssize_t n = read(fds[i].fd, buf, sizeof(buf));
                    printf("[%d] got %zd bytes\n", fds[i].fd, n);
                }
            }
        }
    }
}
```

`poll` 没有 1024 限制，但仍是线性扫描。数千 fd 时已经吃力，数万 fd 后 O(n) 让吞吐量雪崩。

### 5.4 `epoll`——Linux 下的"主流王"

```c
#include <sys/epoll.h>
#include <unistd.h>
#include <stdio.h>

#define MAX_EVENTS 1024

int main(void) {
    int epfd = epoll_create1(EPOLL_CLOEXEC);
    if (epfd < 0) { perror("epoll_create1"); return 1; }

    struct epoll_event ev = {
        .events = EPOLLIN,                             // 默认 LT；加 EPOLLET 切换到 edge
        .data.fd = STDIN_FILENO,
    };
    epoll_ctl(epfd, EPOLL_CTL_ADD, STDIN_FILENO, &ev);

    struct epoll_event events[MAX_EVENTS];
    while (1) {
        int n = epoll_wait(epfd, events, MAX_EVENTS, -1);
        for (int i = 0; i < n; i++) {
            int fd = events[i].data.fd;
            if (events[i].events & (EPOLLERR | EPOLLHUP)) {
                close(fd); continue;
            }
            char buf[4096];
            ssize_t len;
            while ((len = read(fd, buf, sizeof(buf))) > 0) {
                printf("got %zd bytes\n", len);
            }
        }
    }
    close(epfd);
    return 0;
}
```

### 5.5 LT vs ET

| 触发模式 | 含义 | 优点 | 缺点 |
|---|---|---|---|
| Level Triggered (LT) | 只要处于可读/可写状态，`epoll_wait` 就一直报告默认行为 | 不容易丢事件；读不完留着下次再读；简单稳健 | 每次就绪都报告，唤醒次数多 |
| Edge Triggered (ET) | **状态从未就绪→就绪时**才报告一次 | 唤醒次数更少，吞吐更高 | 必须一次**读/写到 EAGAIN**；否则后续事件消失；必须搭配 non-blocking |

经验：默认用 LT。当你已经做到以下三点时再切 ET：

1. fd 全部设为 `O_NONBLOCK`
2. `while(read/write) 直到 EAGAIN`
3. 能用 `EPOLLONESHOT` 的多线程安全共享

### 5.6 epoll 经典使用场景

#### 场景 1：聊天室 / websocket bridge

单线程 epoll 主循环负责**读写 + 广播**；CPU 密集任务（json、cpu 编码）走 worker pool。主循环之内没有锁，天然清爽。

#### 场景 2：反向代理 / VPN 转发

clientfd 与 upstreamfd 分别注册 epoll，在**双向就绪驱动**下做数据搬运：

```
[ clientfd readable ] -> write to upstreamfd
[ upstreamfd readable ] -> write to clientfd
```

epoll 天然支撑**"代理服务" = 双向就绪驱动**。

#### 场景 3：数据库 / KV 客户端

- MySQL client / libpq 都支持 non-blocking
- Redis、memcached、leveldb、rocksdb 的 NIO 客户端几乎都基于 epoll 驱动

#### 场景 4：混合事件源（都是 fd）

把 `eventfd`（跨线程通知）、`timerfd`（高精度定时）、`signalfd`（把信号变成 fd 事件）也挂在 epoll 下，就能形成**统一事件驱动的异步主循环**：

```c
// listen_fd, client_fds, eventfd, timerfd, signalfd 全部走同一个 epoll_wait
```

这是高性能服务器"少锁、多核、多连接"的关键魔法之一。

### 5.7 select / poll / epoll 选型建议

- < 100 fd、跨平台刚需：`select`
- < 1000 fd、不想绑定 Linux：`poll`
- Linux 高并发：`epoll`（默认选择）
- 想尝鲜 + Linux 5.1+：`io_uring`
- 现代 C++ / Rust：直接用 `libevent`、`libev`、`libuv`、`boost.asio`（它们内部也是 select / poll / epoll / kqueue / iocp）

## 六、"多路复用 + 多线程"：现代高性能服务器骨架

### 6.1 Reactor + Worker Pool

关键点：

- **1 个 Reactor 线程**（也有 ≥ 1，绑定不同核）：管理 epoll，**只做 I/O + 事件调度**
- **N 个 Worker 线程**：负责**业务逻辑**（CPU 密集或短阻塞）
- 通信：**Task Queue（prod-cons）** + `eventfd` 跨线程唤醒 epoll

```
Reactor thread:
┌─────────────────┐
│ epoll_wait ...  │
│  new_conn   -> accept & epoll_add
│  read req   -> task_enqueue(worker_pool)
│  writable   -> flush response
└─────────────────┘
           |
           v  task queue
┌──────────────────────────────────────────────┐
│             worker threads                    │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│  │  T0  │ │  T1  │ │  T2  │ │  T3  │ ...    │
│  └──────┘ └──────┘ └──────┘ └──────┘        │
└──────────────────────────────────────────────┘
```

这样一种服务器**同时拥有**：

- I/O 密集部分 = 多连接 epoll（线性扩展到 1w+ 连接）
- CPU 密集部分 = 多 Worker（线性利用多核）
- 临界区只有"task 入队 / 出队"

### 6.2 多 Reactor（SubReactor）

多线程同时 epoll（通常配合 `SO_REUSEPORT` 让内核把连接亲和绑定到某线程）：

- I/O 线程按比例接收连接
- 每个 Reactor 固定负责自己的一组连接（线程封闭）
- 跨 Reactor 的消息走 **lock-free ring**（DPDK `rte_ring`、LMAX Disruptor 风格的 ring buffer）

典型用途：高吞吐网关、金融交易、CDN 边缘缓存。

### 6.3 Thread-per-core + DPDK（了解）

某些极致场景（10G+ / 100G 网卡、低延迟交易）：彻底不用内核协议栈 + epoll，自己绑核、用户态 TCP/IP（DPDK、mTCP、F-Stack）。思路核心：

- **每核独占一组资源**（run-to-completion，cache 友好）
- 零锁、零上下文切换
- 用 polling 替代 interrupt 驱动（CPU burn 换延迟）

代价：开发复杂度、兼容性、可调试性都大幅升高，适合"吞吐指标远超一般业务"的细分领域。

## 七、线程 + 多路复用联合下的易错点

| 错误 | 后果 | 正确做法 |
|---|---|---|
| Reactor 线程做 CPU 密集运算 | 整个 loop 卡死，事件饿死 | 把计算丢到 worker pool |
| 线程 A 的 fd 被线程 B 直接 `epoll_ctl` | race，`EPOLL_CTL_MOD` 在历史上非原子 | 把 DEL/ADD 操作收拢到 Reactor 线程统一执行 |
| 多线程同时 epoll_wait 监听同一组 fd | **thundering herd** 多个线程被同一事件唤醒又多数空跑 | `EPOLLEXCLUSIVE`（Linux 4.5+）或单 Reactor 模式 |
| ET 模式 + blocking I/O | 永远阻塞在 `read`，等不到后续事件 | 强制 non-blocking，并读到 `EAGAIN` / 写到 `EAGAIN` |
| 多线程写同一 socket | 数据交叉、长度错误 | 唯一写 owner，或加锁保护写操作，或 IO 线程统一写 |

## 八、调试 / 性能工具小抄

| 工具 | 用途 |
|---|---|
| `perf top` / `perf record` | 找热点函数、LBR 回溯 |
| `strace -c -p <pid>` | 看系统调用分布和耗时 |
| `valgrind --tool=helgrind` | 数据竞争 + 死锁检测 |
| `valgrind --tool=drd` | 竞争 + 度量 |
| `ThreadSanitizer (TSan)` | 更高的性能竞争检测（`-fsanitize=thread`） |
| `bpftrace` / `bcc + offcputime` | 观察线程锁等待时长 |
| `htop` / `pidstat -t` | 看 CPU 热门的线程 |