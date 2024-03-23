---
title: Sass-CSS预处理器
tags: ['web','sass']
date: 2021-08-17 10:34:06
description: Sass-CSS预处理器：.scss扩展名，npm安装，动态变量、嵌套、mixin混入、extend继承、@import、数据类型判断、数学字符串颜色函数、列表操作、插值、条件循环、自定义函数、警告错误。
---
[[toc]]
## 认识sass

* 它是一个css的预处理器, 文件的后缀为`.scss`

## 安装

```shell
npm i -g sass
# 使用
$ sass <input.scss> [output.css]
```

## 语法规则

### 动态变量

```sass
// 使用变量,可以在变量中使用变量
$primary-color:#1269b5;

p {
  width: 20px;
  color: $primary-color;
}
```

### 嵌套

* 使用嵌入式, 使用`&`符号 连接伪元素
* 属性的嵌套, 如果有多个相同前缀的属性, 使用`前缀名:{后缀属性: 属性值}`

```css
.nav {
  ul {
    li {
      color: $primary-color;
    }

    a {
      text-align: center;

      &:hover {
        font-size: 20px;
      }
    }
  }
}
```

```css
/* // 属性的嵌套 前缀有-可以使用  前缀名：{} */
body {
  font: {
    size: 20px;
    weight: normal;
    family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  }
}
```

### mixin alert函数

* 可以给alert函数加参数也可以不加, 调用时使用include方法调用alert函数
* 也可以给alert函数参数定义默认值

```css
/* // mixin */

@mixin alert($text-color, $background) {
  color: $text-color;
  background-color: $background;

  a {
    color: $primary-color;
    background-color: darken($text-color, 10%);
  }
}

.alert-warning {
  @include alert(#1269b5, #fff);
}
```

### 继承extend

```css
/* // 继承 */

a {
  text-decoration: none;
}

.info {
  @extend a;
}
```

### @import方法

* 导入时不需要加入后缀
* 多行注释在不压缩编译后也能显示

```css
@import 'base';
```

### data-type

* 使用type-of方法来判断数据类型
* 在终端输入`sass -i`

### 数字函数

* `abs()` 绝对值
* `round()` 方法 四舍五入
* `ceil()` 方法 向上取整 取大
* `floor()` 方法 向下取整  取小
* `min() max()` 判断大小

#### 字符串处理方法

* `to-upper-case()`方法 将字符串全部改为大写
* `to-lower-case()`方法 全部改为小写
* `str-length(变量)` 输出字符串的长度
* `str-index(变量, 检测的字符串)`  输出当前检测字符串在变量字符串中第一次出现的索引号
* `str-insert(变量, 输入插入的值, 索引位置)` 在字符串的指定位置插入值

### 颜色函数

* `adjust-hue` 对颜色值进行调整, 对hsl颜色进行调整
* `darken`函数可以改变颜色的深度, 更暗 `lignten`函数更亮, 第一个参数是要转换的值, 第二个参数是改变的程度百分比
* `saturate函`数 颜色的饱和度 `desaturate`函数 减少颜色的饱和度 对hsl颜色进行处理
* opacify函数 设置不透明度
* transparentize函数 设置透明度

### 列表 List

* length方法, index方法 nth方法 append方法
* join方法组合 使用comma 会使用', '分隔
* map-get()方法获取 列表对应的属性值 map-keys 返回所有的key值, map-value 返回列表中的值, 判断是否存在某个属性, 使用map-has-key方法 map-merge()方法将新创建的属性加入到列表中使用map-remove方法来移除列表中的指定属性

### 使用interpolation方法

* `#{}` 格式

```css
// 使用变量,可以在变量中使用变量
$version:"0.0.1";
/* 当前的版本号#{$version} */
$name:'info';
$attr:'border';

.border-#{name} {
  #{$attr}-radius: 10px;
}
```

### 控制指令

* @if

```css
$primary-color:#1269b5;
$state:true;

.info-warp {
  @if $state {
    color: $primary-color;
  }
}
```

* @for, through包括最后一个值; to不包括

```css
$colums:4;

@for $i from 1 through $colums {
  .col-#{$i} {
    width: 100% / $colums*$i;
  }
}
```

* @each 遍历数组

```css
$icons: error success info;

@each $i in $icons {
  .col-#{$i} {
    background: url('image/#{$i}.png');
  }
}
```

* @while 计算字符要空格

```css
$i:6;

@while $i>0 {
  .item-#{$i} {
    width: 5px * $i;
    color: $primary-color;
  }

  $i: $i - 2;
}
```

## 自定义函数

* 格式`@function(传入的参数){@return 属性值}`如果是对象可以使用map方法获取第一个参数是构造的对象属性, 第二个参数是要调用的对象参数

```css
$color:(light:#fff, dark:#000);

@function color($key) {
  @return map-get($color, $key)
}

.oi {
  color: color(dark)
}
```

### 警告和错误

* @warn和@error 打印输入 在终端输出