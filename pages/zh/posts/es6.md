---
title: ES6模块化-Promise-高级用法
date: '2021-9-12 00:00'
categories: JavaScript
tags: [ESModules]
plum: true
---

[[toc]]

## 前端模块化规范

- `AMD` `CMD` `CommonJS`
- ES6模块化规范取代之前的非标准语法, 导入使用`import` 共享使用`export`
- 配置package.json 加入 `type:"module"`

## es6模块化三种用法

### 默认导出, 默认导入

- 默认导出

```js
const n1 = 10
const n2 = 20

function show() {
  console.log(1)
}

export default {
  n1,
  show
}
```

- 默认导入

```js
import m1 from './index.js'
console.log(m1)
```

### 按需导出导入

- 名称保持一致
- 可以使用 `as` 重新命名
- 可以和默认导出配合使用

```js
// 按需导出
export const n1 = 'aaa'
export const n2 = 'vcv'
export function say() {}

export default {
  a: 20
}
```

```js
// 按需导入,info 表示默认导出
import info, { n1 } from './index.js'
console.log(n1)
```

### 直接导入

- 直接使用import, 直接导入执行模块中的代码

## Promise

- 解决回调地狱的问题, 构造函数
- 使用promise读取文件

```js
import thenfs from 'then-fs'

thenfs.readFile('./1.txt', 'utf-8').then((res) => {
  console.log(res)
  return thenfs.readFile('./2.txt', 'utf-8')
}).then((res) => {
  console.log(res)
  return thenfs.readFile('./3.txt', 'utf-8')
}).then((res) => {
  console.log(res)
})
```

- 使用.catch 捕获错误 如果放到最后, 前面如果发生错误, 无法执行其他正确的程序;

### 使用promise.all方法

- 等待所有的异步操作完成后执行

```js
import thenfs from 'then-fs'
const promiseArr = [
  thenfs.readFile('./1.txt', 'utf-8'),
  thenfs.readFile('./2.txt', 'utf-8'),
  thenfs.readFile('./3.txt', 'utf-8'),
]
Promise.all(promiseArr).then((res) => {
  console.log(res)
})
```

### 使用promise.race方法

- 返回执行速度最快的promise

```js
import thenfs from 'then-fs'
const promiseArr = [
  thenfs.readFile('./1.txt', 'utf-8'),
  thenfs.readFile('./2.txt', 'utf-8'),
  thenfs.readFile('./3.txt', 'utf-8'),
]
Promise.race(promiseArr).then((res) => {
  console.log(res)
})
```

### 创建异步操作

- 失败的回调函数可以省略不写, 使用.catch来捕获

```js
import fs from 'node:fs'

function getFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(fpath, 'utf8', (err, datastr) => {
      if (err)
        return reject(err)
      resolve(datastr)
    })
  })
}

getFile('./111.txt').then((res) => {
  console.log(res)
}, (err) => {
  console.log(err.message)
})
```

### 使用async/await获取返回值

```js
async function getfile() {
  const a = await thenfs.readFile('./1.txt', 'utf-8')
  console.log(a)
}

getfile()
```

- 注意事项
- 使用await必须使用async来修饰
- 在await第一次出现之前的代码都是同步执行, 之后的都是等待异步执行完成后执行

## 同步任务和异步任务

## EventLoop

## 宏任务 微任务

- 宏任务

1. 异步Ajax请求
2. setTimeout,setInterval
3. 文件操作
4. 其他宏任务

- 微任务

1. Promise.then .catch,.finally
2. process.nextTick
3. 其他微任务

- 每一个宏任务执行完之后, 都会进行一次判断微任务队列中是否存在未执行的微任务, 如果存在微任务 需要将所有的微任务执行完成后在继续执行下一个宏任务

## try catch 捕获错误

- 使用try catch 来捕获错误, 并且在catch中进行处理

```js
import db from '../db/index.js'

export async function getAlluser(req, res) {
  try {
    const [rows] = await db.query('select age,username from ev_users')
    res.send({
      status: 200,
      data: rows,
      message: '数据获取成功'
    })
  }
  catch (error) {
    res.send({
      status: -1,
      message: '请求出错'
    })
  }
}
```
