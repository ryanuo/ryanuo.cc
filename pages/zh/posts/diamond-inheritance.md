---
title: C++菱形继承的二义性与虚继承原理
date: "2025-12-23 15:55"
description: 从单继承到多继承，理清菱形继承为什么会出问题，以及虚继承到底是怎么解决的。
cate: 笔记
---

[[toc]]

## 继承的基本形态

### 单继承

一个派生类只有一个直接基类，这就是单继承，最简单的继承关系：

```cpp
class Person {
public:
    string _name = "张三";
    int _age = 18;
};

class Teacher : public Person {
protected:
    string _subject;  // 科目
    int _id;           // 职工编号
};

class Student : public Teacher {
protected:
    int _num;  // 学号
};
```

`Student` 继承 `Teacher`，`Teacher` 又继承 `Person`，一条链下来，`Student` 里面能看到 `_name`、`_age`、`_subject`、`_num` 全部成员。没什么问题。

### 多继承

一个派生类同时有两个或以上的直接基类。内存布局上，先继承的基类排前面，后继承的排后面，派生类自己的成员放最后。

当两个基类又共同继承自同一个顶层基类时，继承图就变成了菱形：

```
      Person
       /  \
  Student  Teacher
       \  /
     Assistant
```

这就是菱形继承。问题也就跟着来了。

## 菱形继承的两个坑

直接看代码：

```cpp
class Person {
public:
    string _name;
};

class Student : public Person {
protected:
    int _num;
};

class Teacher : public Person {
protected:
    int _id;
};

class Assistant : public Student, public Teacher {
protected:
    string _majorCourse;
};

int main() {
    Assistant a;
    a._name = "peter";  // 编译报错：对 _name 的访问不明确
    return 0;
}
```

`Assistant` 同时继承了 `Student` 和 `Teacher`，而它俩各自带着一份 `Person`。所以 `a._name` 到底指的是 `Student` 那条链的 `_name` 还是 `Teacher` 那条链的？编译器分不清，直接报错。

**第一个坑：二义性。** 编译器不知道该走哪条路。

可以靠指定类域绕过去：

```cpp
a.Student::_name = "xxx";
a.Teacher::_name = "yyy";
```

但这只是让编译器不报错了，**第二个坑还在：数据冗余。** `Assistant` 对象里存了两份 `Person`，本来一份就够，现在多了一份白占内存。

## 虚继承怎么解的

C++ 给的方案是虚继承——在中间类的继承声明上加 `virtual` 关键字：

```cpp
class Person {
public:
    string _name;
};

class Student : virtual public Person {
protected:
    int _num;
};

class Teacher : virtual public Person {
protected:
    int _id;
};

class Assistant : public Student, public Teacher {
protected:
    string _majorCourse;
};

int main() {
    Assistant a;
    a._name = "peter";  // 不报错了
    return 0;
}
```

加了 `virtual` 之后，`Student` 和 `Teacher` 不再各自内嵌一份 `Person` 成员，而是改成放一个**虚基类指针（vptr）**，指向最终的共享 `Person` 实例。不管走哪条继承路径，最后都定位到同一块内存。

这样就一把解决了两个问题：

- 二义性没了——只有一份 `_name`，不存在"走哪条路"的问题
- 数据冗余没了——`Person` 只存一份

![虚基类和非虚基类](https://fastly.jsdelivr.net/gh/ryanuo/image@master/2026/07/28/1785237950774-ea9ce232-dbe6-4fce-b4c9-f10bbe35810a.png)

### 内存布局

虚继承下 `Assistant` 对象的内存大致长这样：

```
+-------------------+
| Teacher 成员       |
+-------------------+
| Student 成员       |
+-------------------+
| Assistant 新增成员  |
+-------------------+
| Person 共享数据     |  ← 所有 vptr 指向这里
+-------------------+
```

中间类（`Student`、`Teacher`）内部不直接放 `Person` 的成员，而是放一个指针，通过虚基类表（vbtable）里记录的偏移量，算出 `Person` 共享数据的位置。所有路径最后都指到同一处。

### 构造顺序

虚继承的构造有个反直觉的地方：**虚基类由最派生类直接初始化，而不是由直接子类初始化。**

```cpp
class Person {
public:
    Person(const char* name) : _name(name) {}
    string _name;
};

class Student : virtual public Person {
public:
    Student(const char* name, int num)
        : Person(name), _num(num) {}
protected:
    int _num;
};

class Teacher : virtual public Person {
public:
    Teacher(const char* name, int id)
        : Person(name), _id(id) {}
protected:
    int _id;
};

class Assistant : public Student, public Teacher {
public:
    Assistant(const char* name1, const char* name2, const char* name3)
        : Person(name3)
        , Student(name1, 1)
        , Teacher(name2, 2) {}
};

int main() {
    Assistant a("张三", "李四", "王五");
    // a._name 最终是 "王五"
    return 0;
}
```

顺序是这样的：

1. **虚基类最先构造**——`Assistant` 构造函数里显式调用的 `Person(name3)` 先执行，`_name` 被初始化为 "王五"
2. **然后是非虚基类**——`Student` 和 `Teacher` 的构造函数里虽然也写了 `Person(name)`，但因为 `Person` 是虚基类且已经构造过，这些调用会被忽略

所以最终 `_name` 的值由最派生类 `Assistant` 里显式指定的那个参数决定，而不是中间类传上去的。这是虚继承跟普通继承最大的区别——初始化责任从中间类上交给了最派生类。

## 小结

虚继承用"共享 + 间接寻址"换掉了"各自内嵌"，代价是多出来的 vptr 和偏移量计算带来的内存和时间开销。所以实际项目里，菱形继承本身就尽量避免，能重新设计继承关系就别搞菱形。真躲不开的时候，虚继承是兜底手段，不是首选方案。
