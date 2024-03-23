---
title: Regular Expressions Js
date: '2021-7-29 08:50'
tags: [web,Javascript]
desscription: java script regular expressions number extraction variable application substitution rules boundary delimiting character classes global search
---

## 正则字符串提取数字

1. 使用\d将数字匹配出来 /g全局匹配

```js
let hd = 'daw21321dasda23123123';
// 不使用正则表达式写一个方法
// console.log(Number.isNaN(parseInt('1')));
// ...将字符串转换成数组形式 Array.from()方法也可以 使用isNaN判断是否为非数字
// let news = [...hd].filter(v=>!Number.isNaN(parseInt(v)));
// 使用join方法连接
// 使用正则表达式
let news = hd.match(/\d/g).join("")
console.log(news);
```


## 正则字变量

1. 使用eval()方法
2. 使用test()方法返回的是布尔值



```js
let hd = 'daw21321dasda23123123';
let a = '1';
let news = eval(`/${a}/`).test(hd)  // true
console.log(news);
```


## 使用对象创建

1. 替换字符串中匹配到的字符

```html
<div class="content">mr90.top</div>
<script>
let div = document.querySelector('.content')
let a = prompt('输入字符');
let regs = new RegExp(a,"g");
div.innerHTML = div.innerHTML.replace(regs,search=>{
    return `<span style="color:red">${search}</span>`
})
</script>
```

## 选择符 |

1. 匹配左右两侧的条件
2. 原子组()  原子表[]

```js
let tel = '023-2312322'
console.log(/(023|020)\-\d{7,8}/.test(tel)); // true
// 重复的条件使用原子组的方法{7，8}表示 7-8位的数字 \- 表示转义
let reg = /(12|34)/;
let hd = '31w231';
console.log(hd.match(reg)); // null
```

## 转义

1. 在字面量里面 使用`\d \.` 将字符可实现转义
2. 在构造函数中`\d \.` 表示的是该字符 所以 必须再加一个转义符 `\\d \\.`

```js
let price = '12@21';
// . 除换行外的任何字符
console.log(/\d+.\d/.test(price)); //true
let reg = new RegExp('\\d+\\.\\d+')
// \\ 双转义
console.log(reg.test(price)); //false

// 网址
let url = 'https://u.mr90.top'
let reg = new RegExp(/https?:\/\/\w+\.\w+\.\w+/)
console.log(reg.test(url)); //true
console.log(/https?:\/\/\w+\.\w+/.test(url)); //true
```

## 字符边界符

1. 边界符表示开始和结尾必须满足条件 `/^[a-z]$/`
2. `{3,6}` 加入边界字符 才能控制其数量范围

```html
<input type="text" value="" name="user">
<script>
    document.querySelector("[name='user']")
    .addEventListener('keyup',function(){
        let flag = this.value.match(/^[a-z]{3,6}$/)
        console.log(flag);
    })
</script>
```

## 数值与空白元字符

1. `\d` 匹配数字 `\D` 匹配非数字
2. 在原子表中首页`^`表示非的意思`/[^]/`
3. `\s` 表示匹配空白和换行 `\S` 非空白

```js
let hd = '张三:021-9999299,李四:022-2122122'
// 匹配所有的数字号码
console.log(hd.match(/\d{3}\-\d{7,8}/g)); //["021-9999299", "022-2122122"]
// 匹配姓名 + 表示匹配相邻的符合条件的
console.log(hd.match(/[^:\d,-\s]+/g)); // ["张三", "李四"]
```

## w和W元字符

1. `\w` 匹配字母和数字 下划线
2. `\W`与之相反

## 点字符的使用

1. 匹配所有字符默认模式下，它匹配除了换行符以外的任意字符。

```js
let hd = `wad\nawd\n`
console.log(hd.match(/.+/g)); // [wad,awd]
```

## 匹配所有字符

1. 在原子组中`[\s\S]` 或者`[\d\D]`
2. 匹配标签使用 `/<span>[\s\S]+</span>/`

## i和g 模式修正

1. `g`全局匹配 `i`不区分大小写

```js
let hd = `
#1 js,200元 #
#2 php,300元 #
#9 mr90.top # 你好
#3 node.js,180元 #
`
let lessons = hd.match(/^\s*#\d+\s+.+\s+#$/gm).map(v => {
    v = v.replace(/\s*#\d+\s*/, '').replace(/\s+#/, '')
    let [name, price] = v.split(',')
    return { name, price }
})
console.log(lessons);
/*
0: {name: "js", price: "200元"}
1: {name: "php", price: "300元"}
2: {name: "node.js", price: "180元"}
length: 3*/
```

## 汉字与字符属性

1. `\p`表示匹配字符
2. `\P` 相反

## lastIndex

1. lastIndex 属性用于规定下次匹配的起始位置
2. `exec()` 方法用于检索字符串中的正则表达式的匹配。

```js
let hd = 'dawdaw31';
let reg = /\w/g;
console.log(reg.exec(hd));
console.log(reg.lastIndex); // lastIndex 属性用于规定下次匹配的起始位置
// 将匹配到的值赋值给res 有值打印数据 否则返回null 不满足循环条件 循环
while(res=reg.exec(hd)){
    console.log(res);
}
```

## y模式

1. 后一次匹配都是从上一次匹配成功的下一个位置开始

```js
let hd =`你好世界大王大大:11111111,1111231,213123212,
达瓦达,网站:u.mr90.top`
let reg = /(\d+),?/y
reg.lastIndex = 9
let qq = []
// console.log(reg.exec(hd)); 
while(res=reg.exec(hd)) qq.push(res[1])
console.log(qq);
```

## 原子表

1. `[]` 匹配中括号内的所有条件
2. 原子组和原子表搭配使用

```js
let times = '2020-02/21'
console.log(times.match(/^\d{4}[-\/]\d{2}[-\/]\d{2}$/)); // 2020/02-21
console.log(times.match(/^\d{4}([-\/])\d{2}\1\d{2}$/)); // null
console.log(times.match(/^\d{4}([-\/])\d{2}\1\d{2}$/)); // 2020/02/21
```

## 区间匹配

1. 数字区间`[0-9]+` 加号表示贪婪模式
2. 字母区间`[a-z]`

## 排除匹配

1. `[^]` 表示排除匹配
2. `\p`表示匹配满足`{}`内的字符

```js
// let hd = 'u.mr90.top'
// console.log(hd.match(/[^u]/gi)); //[".", "m", "r", "9", "0", ".", "t", "o", "p"]
let hd = `张三:231-23123123,李四#:123-312313;`
console.log(hd.match(/[^:\w-,#;]+/g)); // 贪婪模式下的排除匹配
console.log(hd.match(/\p{sc=Han}+/gu)); // ["张三", "李四"]
```

## 原子表字符不解析

1. `[.+]` `[()]` 仅表示原来字符的意思

## 原子表匹配

1. `s`忽略换行符 `*`表示0个或者多个
2. `[\d\D] [\s\S]` 匹配所有字符

```html
<body>
    <h1>ddawd
        dawd
    </h1>
    <h2>dwad

    </h2>
    <span>dasdwa
        adaw
    </span>
</body>
<script>
    let body = document.body;
    // let reg = /<(\w+)>[^]+<\/\1>/gi // 注意贪婪模式
    let reg = /<(h[1-6])>[^]*<\/\1>/gi // 注意贪婪模式 *表示0个或者多个
    body.innerHTML = body.innerHTML.replace(reg,'')
</script>
```

## 原子组

1. `()` 表示一个整体
2. 可进行别名的编号
3. 使用原子组实现标签的替换
4. 在原子组回调函数中,各个参数表示的是 第一个是满足条件的所有内容 其他参数 依次为定义的满足原子组条件的内容

```html
<body>
    <h1>ddawd
        dawd
    </h1>
    <h5></h5>
    <h2>dwad

    </h2>
    <span>dasdwa
        adaw
    </span>
</body>
<script>
    // 原子组替换
    let body = document.body
    // body.innerHTML = body.innerHTML.replace(/<(h[1-6]+)>([^]*)<\/\1>/g,`<p>$2</p>`) // 直接表示
    body.innerHTML= body.innerHTML.replace(/<(h[1-6]+)>([^]*)<\/\1>/g,(f0,f1,f2)=>{
        // console.log(f0);  // 输入满足条件的所有
        // console.log(f1); // 输出第一个原子组匹配的内容
        // console.log(f2);// 输出第二个原子组匹配的内容
        return `<p>${f2}</p>`
    }) // 函数表示
</script>
```

## 不记录分组

1. 使用不记录分组,就是使用原子组后 无法再去使用函数参数去调用

```js
   let url = `https://u.mr90.top
    http://github.com
    httpS://mr90.top`
    // 使用不记录分组,就是使用原子组后 无法再去使用函数参数去调用
   let reg = /https?:\/\/((?:\w+\.)?\w+\.(?:com|top))/gi
   console.log(reg.test(url)); //true // 有满足条件的内容
   console.log(url.match(reg)); // ["https://u.mr90.top", "http://github.com", "httpS://mr90.top"]
//    console.log(reg.exec(url)); // 返回满足条件的第一个内容
//    console.log(reg.lastIndex); // 记录下次开始时的索引位置
   let urlA = [];
   while(res=reg.exec(url)) urlA.push(res[1])
   console.log(urlA);
```

## 重复匹配

1. `+`  一个或者多个 `{1,}` 类似与加号
2. `*` 0个或者多个 `{0,}` 类似与*号
3. `?` 0个或者1个

## 批量使用正则完成密码的验证

```js
// 对表单输入的值进行验证
document.querySelector('[name=pwd')
    .addEventListener('keyup', (e) => {
        // console.log();
        let value = e.target.value
        let reg = [
            /^[a-z0-9]{5,7}$/i,
            /[A-Z]/, /[\d]/
        ]
        let state = reg.every(v=>v.test(value))
        console.log(state?'正确':'错误');
    })
```

## 禁止贪婪

1. `{2,}?` 限制贪婪
2. `*?` 禁止贪婪

```html
<body>
    <main>
        <span>u.mr90.top1</span>
        <span>u.mr90.top2</span>
        <span>u.mr90.top3</span>
    </main>
</body>
<script>
    let main = document.querySelector('main')
    let reg = /<span>([^]+?)<\/span>/g // ?加上问号 并且写到原子组中为了将贪婪的范围缩小到每一行上
    main.innerHTML = main.innerHTML.replace(reg,(p0,p1)=>{
        console.log(p0);
        return `<h2 style="color:red">${p1}</h2>`
    })
</script>
```

## matchAll 全局匹配

```html
<body>
    <main>
        <span>u.mr90.top1</span>
        <span>u.mr90.top2</span>
        <span>u.mr90.top3</span>
    </main>
</body>
<script>
    // 不使用matchAll方法
    let main = document.querySelector('main')
    let reg = /<span>([^]+?)<\/span>/g // ?加上问号 并且写到原子组中为了将贪婪的范围缩小到每一行上
    let content = [];
    // main.innerHTML = main.innerHTML.replace(reg,(p0,p1)=>{
    //     content.push(p1)
    //     return `<h2 style="color:red">${p1}</h2>`
    // })
    // console.table(content)

    // 使用matchAll方法
    let hd = main.innerHTML.matchAll(reg)
    // console.log(main.innerHTML.matchAll()); // 遍历迭代
    for (const i of hd) {
        content.push(i[1])
        // console.log(i);
    }
    console.table(content);
</script>
```

## exec 全局匹配

1. 匹配时 `g`不能缺少
2. `search` 返回匹配的索引值

```js
// exec方法 匹配全局
let main = document.querySelector('main')
let reg = /<span>([^]+?)<\/span>/g // ?加上问号 并且写到原子组中为了将贪婪的范围缩小到每一行上
function fn(string, reg) {
    let content = [];
    while (res = reg.exec(string)) {
        content.push(res)
    } return content
}
console.log(fn(main.innerHTML, reg));
// exec方法 匹配全局
let main = document.querySelector('main')
let reg = /<span>([^]+?)<\/span>/g // ?加上问号 并且写到原子组中为了将贪婪的范围缩小到每一行上
let content = [];
function fn(string, reg) {
    while (res = reg.exec(string)) content.push(res)
}
fn(main.innerHTML, reg)
console.log(content);
```

## $符

1. <code>$`</code> 匹配开头的第一个字符 
2. `$'` 匹配结尾字符
3. `$&` 匹配自身

```js
    // let tel = '2020/12/23'
    // console.log(tel.replace(/\//g,'-')); // 2020-12-23
    // let tel = '(021)9999999 (023)4444444'
    // console.log(tel.replace(/[(]+(\d{3})[)](\d{7})/g,'$1-$2')); //021-9999999 023-4444444
    let tel = '%Harry='
    console.log(tel.replace(/\w+/g,'$`')); // $` 匹配开头的第一个字符 %%=
    console.log(tel.replace(/\w+/g,"$'")); // $' 匹配结尾字符 %==
    console.log(tel.replace(/\w+/g,"$&")); // $& 匹配自身
    console.log(tel.replace(/\w+/g,"$`$`$&$'$'")); // $& 匹配自身
```

## 原子组的别名

1. 格式 `?<别名>` 
2. 调用 `<别名>`

```html
<body>
    <main>
        <a href="http://u.mr90.top">博客</a>
        <a href='https://baidu.com'>百度</a>
        <a href="https://github.com">Github</a>
    </main>
</body>
<script>
    let main = document.querySelector('main')
    let reg = /<a.*?href=(['"])(?<link>.*?)\1>(?<title>.*?)<\/a>/gi
    // 进行迭代遍历
    for (const i of main.innerHTML.matchAll(reg)) {
        // console.log(i);
        console.table(i.groups)
    }
</script>
```

## 断言匹配 ?=

1. `(?=)` 表示在之前条件的后面满足该断言匹配的内容
2. `(?<=)` 表示前面是条件的匹配内容
3. `(?!)` 表示后面不是某个条件的内容
4. `(?<!)` 表示前面不是某个条件的内容

```html
<body>
    <main>
        <a href="http://u.mr90.top">博客</a>
        <a href='https://baidu.com'>百度</a>
        <a href="https://github.com">Github</a>
    </main>
</body>
<script>
    let main = document.querySelector('main')
    let reg = /(?<=href=(['"]))(.*?)(?=\1>)/gi
    main.innerHTML = main.innerHTML.replace(reg,'https://mr90.top')
</script>
```

### 手机号码断言隐藏

```js
let users = `
李四：12323212232
张三：12322131122
`
let reg = /(?<=\d{7})\d{4}/gi
console.log(users.replace(reg,'*'.repeat(4)));
```