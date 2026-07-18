---
title: 位运算全解析：基础技巧、经典例题与嵌入式实战
date: "2026-07-18 08:55"
cate: 笔记
description: 六种位运算符、常用技巧速查（lowbit、位掩码、异或性质），配大量 LeetCode 经典例题的 C 语言实现，以及寄存器读改写、字节序转换等嵌入式实战场景。
---

[[toc]]

## 位运算基础

### 一、六种运算符

| 运算符 | 名称 | 规则 | 示例（8 位） |
|---|---|---|---|
| `&` | 按位与 | 两位都为 1 才为 1 | `0b1100 & 0b1010 = 0b1000` |
| `\|` | 按位或 | 有一位为 1 即为 1 | `0b1100 \| 0b1010 = 0b1110` |
| `^` | 按位异或 | 两位不同为 1 | `0b1100 ^ 0b1010 = 0b0110` |
| `~` | 按位取反 | 0 变 1，1 变 0 | `~0b0000_1111 = 0b1111_0000` |
| `<<` | 左移 | 低位补 0 | `0b0011 << 2 = 0b1100` |
| `>>` | 右移 | 无符号补 0；有符号通常补符号位 | `0b1100 >> 2 = 0b0011` |

三个核心运算的记忆口诀：

- `&`：**清零、取位、判断**（和掩码与，保留想要的位）
- `|`：**置位**（和掩码或，强制某些位为 1）
- `^`：**翻转、去重、无进位加法**

### 二、异或的性质（重点）

异或是位运算题的核心，四条性质务必烂熟：

```
x ^ 0 = x          （零元）
x ^ x = 0          （自反）
x ^ y = y ^ x      （交换律）
(x ^ y) ^ z = x ^ (y ^ z)   （结合律）
```

推论：**一堆数异或到一起，出现偶数次的数全部抵消**。这是「只出现一次的数字」系列题的根基。

### 三、避坑指南（C 语言）

写 C 的人必须知道的几个坑：

1. **优先级**：`&`、`|`、`^` 的优先级**低于** `==`、`!=`。
   ```c
   if (x & 1 == 0)     // 错！等价于 x & (1 == 0)，恒为 0
   if ((x & 1) == 0)   // 对，判断偶数
   ```
2. **移位量越界是 UB**：移位位数 ≥ 类型位宽（如 `x << 32`，x 为 32 位）是未定义行为。
3. **`1 << 31` 是 UB**：有符号 `int` 左移溢出未定义，操作最高位请用 `1u << 31`。
4. **负数右移是实现定义**：多数平台是算术右移（补符号位），但可移植代码不要依赖；需要逻辑右移时先转 `unsigned`。
   - 对于无符号，右移一位等于 `x >> 1` 除以2（向下取整）。
5. **负数按补码参与位运算**：`-1` 的二进制是全 1（`0xFFFFFFFF`），`~0 == -1`。
6. **整数提升**：`uint8_t` 参与运算会先提升为 `int`，`~` 一个 `uint8_t` 再比较时经常出意外，必要时强转回去。

## 常用技巧速查

以下技巧建议全部记住，面试和嵌入式开发使用频率极高。

### 一、单 bit 操作（嵌入式基本功）

```c
x |=  (1u << n);        // 置位：第 n 位置 1
x &= ~(1u << n);        // 清位：第 n 位清 0
x ^=  (1u << n);        // 翻转第 n 位
(x >> n) & 1u;          // 取第 n 位的值
```

### 二、算术类

```c
x & 1                   // 判断奇偶：1 奇 0 偶（比 x % 2 对负数更省心）
x << k                  // x * 2^k
x >> k                  // x / 2^k（非负数）
x & ((1u << k) - 1)     // x % 2^k（非负数），如 x & 15 即 x % 16
(x + 7) & ~7u           // 向上对齐到 8 的倍数（内存对齐常用）
(a & b) + ((a ^ b) >> 1)  // 平均值，不会像 (a+b)/2 那样溢出
```

### 三、lowbit 与 2 的幂

```c
x & (-x)                // lowbit：取出最低位的 1（树状数组核心）
x & (x - 1)             // 清除最低位的 1（Brian Kernighan）
(x > 0) && ((x & (x - 1)) == 0)   // 判断是否为 2 的幂
```

理解方式：`x - 1` 会把最低位的 1 变 0、其后的 0 全变 1，因此 `x & (x-1)` 恰好抹掉最低位的 1；`-x` 是补码（`~x + 1`），除最低位 1 及其后的 0 外全部取反，因此 `x & -x` 只剩最低位的 1。

```
x     = 0110 1000
x - 1 = 0110 0111
x&(x-1)=0110 0000   （抹掉最低位 1）
-x    = 1001 1000
x&(-x)= 0000 1000   （只留最低位 1）
```

### 四、异或类

```c
a ^= b; b ^= a; a ^= b;   // 交换两数（注意：a、b 是同一变量时会清零，实战别炫技）
(x ^ y) < 0               // 判断两数是否异号（无溢出风险）
c ^ 32                    // 字母大小写互转（'A'^32='a'，'a'^32='A'）
```

### 五、向上取整到 2 的幂

哈希表扩容、环形缓冲区容量常用：

```c
uint32_t next_pow2(uint32_t v)
{
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    return v + 1;   // next_pow2(17) = 32, next_pow2(32) = 32
}
```

原理：`v--` 后不断「或自身右移」，把最高位 1 以下全部刷成 1，最后 +1 进位。

## 经典例题

以下题目按套路分组，全部给出 C 实现。每题先一句话点破思路。

### 一、统计二进制中 1 的个数（LC191）

**思路：`x & (x-1)` 每次抹掉一个 1，有几个 1 循环几次。**

```c
int hammingWeight(uint32_t n)
{
    int cnt = 0;
    while (n) {
        n &= n - 1;   // 抹掉最低位的 1
        cnt++;
    }
    return cnt;
}
```

进阶：无循环的 **SWAR popcount**（并行分治，先 2 位一组求和，再 4 位、8 位……）：

```c
int popcount(uint32_t x)
{
    x = x - ((x >> 1) & 0x55555555);                  // 每 2 位内统计
    x = (x & 0x33333333) + ((x >> 2) & 0x33333333);   // 每 4 位内统计
    x = (x + (x >> 4)) & 0x0F0F0F0F;                  // 每 8 位内统计
    return (x * 0x01010101) >> 24;                    // 四个字节求和
}
```

实战直接用编译器内建 `__builtin_popcount(x)`（GCC/Clang），会编译成硬件 `popcnt` 指令。

### 二、比特位计数（LC338）

求 0..n 每个数的二进制 1 的个数。**思路：DP，`i` 的 1 个数 = `i>>1` 的 1 个数 + 最低位。**

```c
int *countBits(int n, int *returnSize)
{
    int *dp = malloc((n + 1) * sizeof(int));
    dp[0] = 0;
    for (int i = 1; i <= n; i++)
        dp[i] = dp[i >> 1] + (i & 1);
        // 等价写法：dp[i] = dp[i & (i - 1)] + 1;
    *returnSize = n + 1;
    return dp;
}
```

### 三、只出现一次的数字（LC136）

其余数都出现两次。**思路：全员异或，成对的抵消，剩下的就是答案。**

```c
int singleNumber(int *nums, int numsSize)
{
    int ans = 0;
    for (int i = 0; i < numsSize; i++)
        ans ^= nums[i];
    return ans;
}
```

### 四、只出现一次的数字 III（LC260）

**两个**数出现一次，其余出现两次。**思路：全员异或得 `x^y`，取其 lowbit 把数组分成两组，组内各自异或。**

```c
int *singleNumber(int *nums, int numsSize, int *returnSize)
{
    unsigned xorall = 0;
    for (int i = 0; i < numsSize; i++)
        xorall ^= (unsigned)nums[i];

    unsigned lsb = xorall & (~xorall + 1);   // lowbit；用 unsigned 规避 INT_MIN 取负的 UB

    int *ans = calloc(2, sizeof(int));
    for (int i = 0; i < numsSize; i++) {
        if ((unsigned)nums[i] & lsb)
            ans[0] ^= nums[i];   // 该位为 1 的一组
        else
            ans[1] ^= nums[i];   // 该位为 0 的一组
    }
    *returnSize = 2;
    return ans;
}
```

关键：`x^y != 0`，它的任意一个为 1 的位都能把 x、y 分开，而成对的数必然进同一组。

### 五、只出现一次的数字 II（LC137）

其余数出现**三次**。**思路：逐位统计 1 的个数，对 3 取模，余数就是答案在该位的值。**

```c
int singleNumber(int *nums, int numsSize)
{
    unsigned ans = 0;
    for (int bit = 0; bit < 32; bit++) {
        int sum = 0;
        for (int i = 0; i < numsSize; i++)
            sum += (((unsigned)nums[i]) >> bit) & 1;
        if (sum % 3)
            ans |= 1u << bit;
    }
    return (int)ans;
}
```

该解法可推广到「其余数出现 k 次」：对 k 取模即可。

### 六、丢失的数字（LC268）

0..n 中缺一个。**思路：把下标和数值全部异或，成对抵消，剩下缺的那个。**

```c
int missingNumber(int *nums, int numsSize)
{
    int ans = numsSize;              // 先补上下标 n
    for (int i = 0; i < numsSize; i++)
        ans ^= i ^ nums[i];
    return ans;
}
```

### 七、颠倒二进制位（LC190）

**思路：分治蝶式交换——先交换高低 16 位，再 8 位、4 位、2 位、1 位。**

```c
uint32_t reverseBits(uint32_t n)
{
    n = (n >> 16) | (n << 16);
    n = ((n & 0xFF00FF00u) >> 8) | ((n & 0x00FF00FFu) << 8);
    n = ((n & 0xF0F0F0F0u) >> 4) | ((n & 0x0F0F0F0Fu) << 4);
    n = ((n & 0xCCCCCCCCu) >> 2) | ((n & 0x33333333u) << 2);
    n = ((n & 0xAAAAAAAAu) >> 1) | ((n & 0x55555555u) << 1);
    return n;
}
```

嵌入式里做 CRC 反射（reflect）就是这套操作。

### 八、2 的幂 / 4 的幂（LC231 / LC342）

```c
bool isPowerOfTwo(int n)
{
    return n > 0 && (n & (n - 1)) == 0;
}

bool isPowerOfFour(int n)
{
    // 先是 2 的幂，且唯一的 1 落在偶数位（bit 0/2/4...）
    return n > 0 && (n & (n - 1)) == 0 && (n & 0x55555555) != 0;
}
```

### 九、汉明距离（LC461）

两数二进制中不同位的个数。**思路：异或后数 1。**

```c
int hammingDistance(int x, int y)
{
    return __builtin_popcount(x ^ y);
}
```

### 十、不用加号做加法（LC371）

**思路：`a ^ b` 是无进位和，`(a & b) << 1` 是进位，循环到进位为 0。**

```c
int getSum(int a, int b)
{
    while (b != 0) {
        unsigned carry = ((unsigned)(a & b)) << 1;   // unsigned 规避左移溢出 UB
        a = a ^ b;
        b = (int)carry;
    }
    return a;
}
```

这就是硬件加法器（半加器/全加器）的软件写法。

### 十一、数字范围按位与（LC201）

求 [left, right] 区间所有数的 AND。**思路：结果是 left 和 right 的公共二进制前缀，后面全为 0。**

```c
int rangeBitwiseAnd(int left, int right)
{
    int shift = 0;
    while (left < right) {   // 不断抹低位，直到剩公共前缀
        left >>= 1;
        right >>= 1;
        shift++;
    }
    return left << shift;
}
```

理解：只要区间长度跨过某位的进位，该位必然出现过 0，AND 后即为 0。

### 十二、格雷编码（LC89）

相邻数只差一位的编码序列。**结论：第 i 个格雷码 = `i ^ (i >> 1)`。**

```c
int *grayCode(int n, int *returnSize)
{
    int size = 1 << n;
    int *ans = malloc(size * sizeof(int));
    for (int i = 0; i < size; i++)
        ans[i] = i ^ (i >> 1);
    *returnSize = size;
    return ans;
}
```

格雷码在旋转编码器、异步 FIFO 跨时钟域中广泛使用——一次只变一位，杜绝采样毛刺。

### 十三、最大单词长度乘积（LC318）

求两个不含公共字母的单词的最大长度积。**思路：每个单词压成 26 位掩码，`mask[i] & mask[j] == 0` 即无公共字母。**

```c
int maxProduct(char **words, int wordsSize)
{
    int *mask = calloc(wordsSize, sizeof(int));
    int *len  = calloc(wordsSize, sizeof(int));

    for (int i = 0; i < wordsSize; i++) {
        for (char *p = words[i]; *p; p++)
            mask[i] |= 1 << (*p - 'a');
        len[i] = strlen(words[i]);
    }

    int ans = 0;
    for (int i = 0; i < wordsSize; i++)
        for (int j = i + 1; j < wordsSize; j++)
            if ((mask[i] & mask[j]) == 0 && len[i] * len[j] > ans)
                ans = len[i] * len[j];

    free(mask);
    free(len);
    return ans;
}
```

「集合压缩成整数、集合运算变位运算」是状态压缩类题（旅行商、状压 DP）的通用套路：交集 `&`、并集 `|`、差集 `a & ~b`、含于 `(a & b) == a`。

### 十四、判定字符是否全都不同（面试题 01.01）

字符串仅小写字母，不用额外数据结构。**思路：26 位掩码当 bool 数组。**

```c
bool isUnique(char *astr)
{
    int mask = 0;
    for (char *p = astr; *p; p++) {
        int bit = 1 << (*p - 'a');
        if (mask & bit)
            return false;
        mask |= bit;
    }
    return true;
}
```

### 十五、位掩码枚举子集（LC78）

n 个元素的所有子集 = 0 .. 2^n - 1 的所有二进制数，第 i 位为 1 表示选第 i 个元素。

```c
void enumerate(int *nums, int n)
{
    for (int s = 0; s < (1 << n); s++) {        // 每个 s 是一个子集
        for (int i = 0; i < n; i++) {
            if ((s >> i) & 1)
                printf("%d ", nums[i]);          // 第 i 个元素被选中
        }
        printf("\n");
    }
}
```

进阶：**枚举某个掩码 mask 的全部子集**（状压 DP 高频套路），复杂度 O(3^n)：

```c
for (int sub = mask; sub; sub = (sub - 1) & mask) {
    // 处理非空子集 sub
}
// 需要空集则循环后单独处理一次 0
```

原理：`sub - 1` 会产生低位借位，再 `& mask` 把借出的位限制回 mask 内，恰好按降序遍历所有子集。

## 嵌入式实战

### 一、寄存器读-改-写

操作外设寄存器的标准姿势——**永远不要直接赋值整个寄存器，先读出、改目标位、再写回**：

```c
#define BIT(n)               (1u << (n))
#define SET_BIT(reg, n)      ((reg) |=  BIT(n))
#define CLEAR_BIT(reg, n)    ((reg) &= ~BIT(n))
#define TOGGLE_BIT(reg, n)   ((reg) ^=  BIT(n))
#define READ_BIT(reg, n)     (((reg) >> (n)) & 1u)

/* 多位字段：先清掩码区域，再或上新值 */
#define MODIFY_FIELD(reg, mask, shift, val) \
    ((reg) = ((reg) & ~(mask)) | (((uint32_t)(val) << (shift)) & (mask)))

/* 例：设置波特率分频字段 [7:4] 为 0x5 */
MODIFY_FIELD(UART->CR, 0xF0u, 4, 0x5);
```

注意：寄存器变量必须声明为 `volatile`，读-改-写非原子，中断和主循环同改一个寄存器时需要关中断或用硬件提供的原子置位/清位寄存器（如 STM32 的 BSRR）。

### 二、大小端判断与字节序转换

```c
int is_little_endian(void)
{
    uint16_t x = 1;
    return *(uint8_t *)&x == 1;   // 低地址存的是低字节 → 小端
}

uint32_t bswap32(uint32_t x)      // 网络字节序（大端）互转
{
    return ((x & 0xFF000000u) >> 24) |
           ((x & 0x00FF0000u) >>  8) |
           ((x & 0x0000FF00u) <<  8) |
           ((x & 0x000000FFu) << 24);
}
```

实战优先用 `htonl/ntohl` 或 GCC 的 `__builtin_bswap32`，会编译成单条 `bswap`/`rev` 指令。

### 三、用位图（bitmap）省内存

1 个字节当 8 个布尔用，管理 1024 个资源只需 128 字节：

```c
uint8_t bitmap[128];

static inline void bm_set(int id)   { bitmap[id >> 3] |=  (1u << (id & 7)); }
static inline void bm_clear(int id) { bitmap[id >> 3] &= ~(1u << (id & 7)); }
static inline int  bm_test(int id)  { return (bitmap[id >> 3] >> (id & 7)) & 1; }
```

`id >> 3` 即 `id / 8`，`id & 7` 即 `id % 8`——除法取模全部退化成位运算。内核里的 fd 表、内存页分配器都是这个玩法。

## 速查小结

| 需求 | 写法 |
|---|---|
| 判断奇偶 | `x & 1` |
| 乘/除 2^k | `x << k` / `x >> k` |
| 模 2^k | `x & ((1u << k) - 1)` |
| 置位 / 清位 / 翻转 / 取位 | `x \|= 1u<<n` / `x &= ~(1u<<n)` / `x ^= 1u<<n` / `(x>>n) & 1` |
| 取最低位 1（lowbit） | `x & -x` |
| 抹掉最低位 1 | `x & (x - 1)` |
| 判断 2 的幂 | `x > 0 && (x & (x-1)) == 0` |
| 判断异号 | `(x ^ y) < 0` |
| 大小写互转 | `c ^ 32` |
| 防溢出平均值 | `(a & b) + ((a ^ b) >> 1)` |
| 无进位加法 | `a ^ b`，进位 `(a & b) << 1` |
| 集合交 / 并 / 差 / 包含 | `a & b` / `a \| b` / `a & ~b` / `(a & b) == a` |
| 枚举 mask 的子集 | `sub = (sub - 1) & mask` |
| 第 i 个格雷码 | `i ^ (i >> 1)` |

一句话总结：位运算的核心套路就三条——**掩码（& 取、| 置、^ 翻）、lowbit 家族（`x&-x`、`x&(x-1)`）、异或抵消**，配合「整数当集合用」的状态压缩思想，能覆盖绝大多数题目和底层开发场景。
