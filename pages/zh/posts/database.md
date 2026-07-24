---
title: MySQL核心知识点速查手册
date: "2024-07-07 09:00:00"
description: 数据库
cate: 笔记
---

[[toc]]

## 一、数据库基础概念

### 1.1 什么是数据库
- **数据库（Database）**：用来**存储和管理数据**的应用软件，同时给用户提供非常方便的数据操作接口。
- 用户访问数据必须通过 **DBMS（数据库管理系统）** 完成。

### 1.2 DBMS 提供的四类语言
| 缩写 | 全称 | 作用 |
|------|------|------|
| **DDL** | Data Definition Language | 数据定义语言（建库、建表、改结构） |
| **DML** | Data Manipulation Language | 数据操作语言（增、删、改） |
| **DQL** | Data Query Language | 数据查询语言（select） |
| **DCL** | Data Control Language | 数据控制语言（权限、事务） |

### 1.3 数据管理层级
```
数据库(database) ──> 数据表(table) ──> 数据(record/field)
```

### 1.4 核心术语
- **记录（record）**：表中的一**行**。
- **字段（field）**：表中的一**列**。


## 二、MySQL 基础操作

### 2.1 登录 / 退出
```bash
# 登录（远程加 -h IP）
mysql [-h targetIP] -u root -p

# 退出
mysql> quit;
mysql> exit;
```

## 三、库的操作（DDL）

```sql
-- 查看所有库
SHOW DATABASES;

-- 创建库（if not exists 避免重复创建报错）
CREATE DATABASE [IF NOT EXISTS] 库名;

-- 删除库（危险操作，if exists 避免不存在时报错）
DROP DATABASE [IF EXISTS] 库名;

-- 选择要操作的库
USE 库名;
```

## 四、表的操作（DDL）

### 4.1 查看 / 创建 / 删除 / 查看结构
```sql
SHOW TABLES;

CREATE TABLE [IF NOT EXISTS] 表名 (
    字段名1 类型 [约束],
    字段名2 类型 [约束],
    ...
);

DROP TABLE [IF EXISTS] 表名;

-- 查看表结构（两种写法等价）
DESCRIBE 表名;
DESC 表名;

-- 查看建表语句（更详细）
SHOW CREATE TABLE 表名;
```

### 4.2 MySQL 支持的数据类型
| 类别 | 示例 |
|------|------|
| 数值型 | `tinyint`、`int`、`float` |
| 字符串型 | `varchar`、`blob`、`text` |
| 时间日期型 | `date`、`time`、`datetime` |
| 空值型 | `NULL` |

### 4.3 六大关键约束
| 约束 | 关键字 | 作用 |
|------|--------|------|
| 主键约束 | `PRIMARY KEY` | 唯一标识一条记录 = 唯一 + 非空 |
| 自增约束 | `AUTO_INCREMENT` | 字段值自动 +1，只能修饰整数，通常配合主键 |
| 唯一约束 | `UNIQUE KEY` | 字段值不能重复，但可以为 NULL |
| 非空约束 | `NOT NULL` | 字段值不能为 NULL |
| 外键约束 | `FOREIGN KEY` | 约束两张关联表，防止垃圾数据 |
| 默认约束 | `DEFAULT` | 未插入数据时填入默认值 |

### 4.4 修改表结构（`ALTER TABLE`）

> 通用格式：`ALTER TABLE 表名 动作 参数;`

#### 4.4.1 表重命名
```sql
ALTER TABLE 原表名 RENAME 新表名;
```

#### 4.4.2 字段操作
```sql
-- 增加字段
ALTER TABLE 表名 ADD 字段名 类型 [位置];
-- 位置：缺省=末尾 | FIRST=头部 | AFTER 某字段=指定字段之后

-- 删除字段
ALTER TABLE 表名 DROP 字段名;

-- 修改字段类型
ALTER TABLE 表名 MODIFY 字段名 新类型;

-- 修改字段名称（必须同时指定新类型）
ALTER TABLE 表名 CHANGE 旧字段名 新字段名 新类型;

-- 调整字段顺序
ALTER TABLE 表名 MODIFY 字段名 类型 FIRST;
ALTER TABLE 表名 MODIFY 字段名 类型 AFTER 某字段;
```

#### 4.4.3 字符集（charset）
```sql
-- 建表时指定
CREATE TABLE 表名 (...) DEFAULT CHARSET=utf8;

-- 建表后修改
ALTER TABLE 表名 CONVERT TO CHARACTER SET utf8;
```

#### 4.4.4 约束的添加与删除
```sql
-- ========== 添加约束 ==========
-- 主键 / 唯一
ALTER TABLE 表名 ADD 约束 (字段名);

-- 非空 / 自增
ALTER TABLE 表名 MODIFY 字段名 类型 约束;

-- 默认
ALTER TABLE 表名 ALTER 字段名 SET DEFAULT '值';

-- 外键
ALTER TABLE 表名 ADD CONSTRAINT 外键名
    FOREIGN KEY(字段) REFERENCES 主表名(主键字段)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- ========== 删除约束 ==========
-- 主键 / 外键
ALTER TABLE 表名 DROP PRIMARY KEY / FOREIGN KEY 外键名;

-- 非空 / 自增
ALTER TABLE 表名 MODIFY 字段名 类型;

-- 默认
ALTER TABLE 表名 ALTER 字段名 DROP DEFAULT;

-- 唯一
ALTER TABLE 表名 DROP INDEX 字段;
```

## 五、数据操作（DML + DQL）

### 5.1 数据增加（INSERT）
```sql
INSERT INTO 表名 [(字段1, 字段2, ...)] VALUES (值1, 值2, ...);

-- 一次插入多条
INSERT INTO 表名 [(字段1, 字段2, ...)]
VALUES (值11, 值12, ...), (值21, 值22, ...), ...;
```

### 5.2 数据删除（DELETE）
```sql
-- ⚠️ 删除表中所有数据，危险操作
DELETE FROM 表名;

-- 推荐：带条件删除
DELETE FROM 表名 WHERE 条件;
```

> 📝 原始笔记里写的是 `delete form`，这是**笔误**，正确的是 `DELETE FROM`。

### 5.3 数据更新（UPDATE）
```sql
-- 更新某字段所有数据
UPDATE 表名 SET 字段1 = 值1, 字段2 = 值2, ...;

-- 带条件更新（推荐）
UPDATE 表名 SET 字段1 = 值1, 字段2 = 值2, ... WHERE 条件;
```

### 5.4 SQL 条件构建
- **比较运算符**：`>` `<` `>=` `<=` `!=` `=`
- **逻辑运算符**：`&&`（AND） `||`（OR） `!`（NOT） `XOR`


## 六、数据查询（DQL：SELECT）

### 6.1 基础查询
```sql
-- 1. 查询所有数据
SELECT * FROM 表;

-- 2. 指定字段
SELECT 字段1, 字段2 FROM 表;

-- 3. 去重
SELECT DISTINCT 字段1, 字段2 FROM 表;

-- 4. 四则运算
SELECT 字段1 + 10, 字段2 * 2 FROM 表;

-- 5. 带条件
SELECT 字段1, 字段2 FROM 表 WHERE 条件;
SELECT 字段1, 字段2 FROM 表 WHERE 条件1 AND 条件2;

-- 6. 范围查询
SELECT 字段1 FROM 表 WHERE 字段 BETWEEN 值1 AND 值2;
SELECT 字段1 FROM 表 WHERE 字段 NOT BETWEEN 值1 AND 值2;

-- 7. 集合查询
SELECT 字段1 FROM 表 WHERE 字段 IN (值1, 值2, ...);
SELECT 字段1 FROM 表 WHERE 字段 NOT IN (值1, 值2, ...);

-- 8. 空值查询
SELECT 字段1 FROM 表 WHERE 字段 IS NULL;
SELECT 字段1 FROM 表 WHERE 字段 IS NOT NULL;

-- 9. 模糊查询（% 匹配任意多个字符，_ 匹配单个字符）
SELECT 字段1 FROM 表 WHERE 字段 LIKE '%关键字%';

-- 10. 排序查询
SELECT 字段1 FROM 表 ORDER BY 字段1 ASC, 字段2 DESC;
-- ASC 升序（默认）| DESC 降序

-- 11. 分组查询
SELECT 字段1 FROM 表 GROUP BY 字段 HAVING 条件;
-- ⚠️ 分组后的过滤用 HAVING，不能用 WHERE

-- 12. 分页查询
SELECT 字段1 FROM 表 LIMIT [start,] num;
-- start 默认为 0（从第一条开始）
```

### 6.2 多表联查

> 核心思想：将多张表连接成一张临时"大表"，把多表查询转为单表查询。

#### 6.2.1 内连接（INNER JOIN）
- 只保留**满足连接条件**的记录。
```sql
SELECT 字段1, ...
FROM 表1 [INNER] JOIN 表2 ON 条件
               JOIN 表3 ON 条件 ...;
```

#### 6.2.2 外连接（OUTER JOIN）
```sql
-- 左外连接：保留左表所有记录，不满足条件的右边填 NULL
SELECT 字段1, ...
FROM 表1 LEFT JOIN 表2 ON 条件
              LEFT JOIN 表3 ON 条件 ...;

-- 右外连接：保留右表所有记录，不满足条件的左边填 NULL
SELECT 字段1, ...
FROM 表1 RIGHT JOIN 表2 ON 条件
               RIGHT JOIN 表3 ON 条件 ...;

-- 全外连接：保留左右两表所有记录
-- ⚠️ MySQL 不支持 FULL JOIN，可用 LEFT JOIN UNION RIGHT JOIN 模拟
```

### 6.3 子查询（嵌套查询）

> 在一个查询语句内部嵌套另一个完整查询，内层结果作为外层条件。

```sql
-- 带 ANY/SOME：满足子查询结果中任意一个即可（逻辑 OR）
SELECT * FROM 表 WHERE 字段 > ANY (SELECT ... FROM 表);

-- 带 ALL：必须满足子查询结果中所有值（逻辑 AND）
SELECT * FROM 表 WHERE 字段 > ALL (SELECT ... FROM 表);

-- 带 IN：等价于集合查询
SELECT * FROM 表 WHERE 字段 IN (SELECT ... FROM 表);

-- 带 EXISTS：子查询只判断"有没有结果"，有则执行外层
SELECT * FROM 表 WHERE EXISTS (SELECT ... FROM 表);

-- 带运算符：子查询结果必须唯一
SELECT * FROM 表 WHERE 字段 = (SELECT ... FROM 表);
```

## 七、MySQL 备份与恢复

### 7.1 备份（mysqldump）
```bash
mysqldump -u root -p 待备份的库名 > 目标文件.sql
```

### 7.2 恢复
```sql
-- 1. 先创建新库
CREATE DATABASE IF NOT EXISTS newdatabase;

-- 2. 方式一：系统命令行导入
-- mysql -u root -p 新库名 < 目标备份文件.sql

-- 3. 方式二：MySQL 内 source
-- USE 新库名;
-- SOURCE 目标备份文件.sql;
```

## 八、MySQL C API 编程

### 8.1 核心数据类型
| 类型 | 用途 |
|------|------|
| `MYSQL` | 连接对象 |
| `MYSQL_RES` | 结果集 |
| `MYSQL_FIELD` | 字段信息 |
| `MYSQL_ROW` | 记录数据（字符指针数组） |
| `my_ulonglong` | 记录数量 |

### 8.2 编程流程（四步）

```
初始化连接句柄 → 连接数据库 → 执行 SQL → 关闭连接
```

#### 8.2.1 初始化连接句柄
```c
MYSQL *mysql = mysql_init(NULL);
```
- 传 `NULL` 时，内部自动申请并初始化，返回句柄地址。

#### 8.2.2 连接数据库
```c
MYSQL *mysql_real_connect(
    MYSQL *mysql,           // 已初始化的句柄
    const char *host,       // 主机名，NULL 或 "localhost" 代表本地
    const char *user,       // 用户名
    const char *passwd,     // 密码
    const char *db,         // 库名，NULL 代表默认库
    uint16_t port,          // 端口，0 代表默认
    const char *unix_socket,// 一般写 NULL
    uint64_t client_flag    // 一般写 0，或 CLIENT_MULTI_STATEMENTS
);
```
- 成功返回第一个参数（句柄地址），失败返回 `NULL`。

#### 8.2.3 执行 SQL
```c
int mysql_real_query(MYSQL *mysql, const char *sql, size_t sqllen);
```
- 返回 `0` 表示成功，非 `0` 表示失败。

#### 8.2.4 查询结果处理（仅 SELECT / SHOW / DESCRIBE）
```c
// 1. 存储结果集到本地
MYSQL_RES *res = mysql_store_result(mysql);

// 2. 获取字段数和记录数
uint32_t fields = mysql_num_fields(res);
my_ulonglong rows = mysql_num_rows(res);

// 3. 逐行获取记录（游标自动下移）
MYSQL_ROW row;
while ((row = mysql_fetch_row(res)) != NULL) {
    // row[i] 是第 i 个字段的字符串值
}

// 4. 获取字段信息
MYSQL_FIELD *fields_info = mysql_fetch_fields(res);
// fields_info[i].name 等

// 5. 释放结果集
mysql_free_result(res);
```

#### 8.2.5 关闭连接
```c
mysql_close(mysql);
```

### 8.3 完整编程流程图
```
mysql_init(NULL)
    ↓
mysql_real_connect(...)
    ↓
mysql_real_query(...)  ← 循环执行多条 SQL
    ↓
如果是查询 → mysql_store_result → mysql_num_fields/rows → mysql_fetch_row → mysql_free_result
    ↓
mysql_close(...)
```

## 九、易错点 & 注意事项速查

| 场景 | 易错点 | 正确做法 |
|------|--------|----------|
| 分组过滤 | 用 `WHERE` 过滤分组后结果 | 用 `HAVING` |
| 模糊查询 | 忘记通配符 | `%` 任意多字符，`_` 单个字符 |
| 外连接 | MySQL 没有 `FULL JOIN` | 用 `LEFT JOIN UNION RIGHT JOIN` 模拟 |
| 子查询 + 运算符 | 子查询返回多行会报错 | 确保子查询结果唯一，或改用 `IN` / `ANY` / `ALL` |
| 修改字段名 | 用 `MODIFY` 改名 | 必须用 `CHANGE 旧名 新名 新类型` |
| C API 结果集 | 忘记 `mysql_free_result` | 每次查询完都要释放，否则内存泄漏 |
| C API 多语句 | `CLIENT_MULTI_STATEMENTS` 需要逐一处理结果集 | 循环 `mysql_next_result` 处理 |