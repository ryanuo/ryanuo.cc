---
title: Python GUI之tkinter窗口视窗
tags: [Python,tkinter]
date: 2021-04-10 10:42:32
desciption: Tkinter 是使用 python 进行窗口视窗设计的模块。Tkinter模块("Tk 接口")是Python的标准Tk GUI工具包的接口。作为 python 特定的GUI界面，是一个图像的窗口，tkinter是python 自带的，可以编辑的GUI界面，我们可以用GUI 实现很多直观的功能，比如想开发一个计算器，如果只是一个程序输入，输出窗口的话，是没用用户体验的。所有开发一个图像化的小窗口，就是必要的。
---

[[toc]]

## tkinter是什么

1. Tkinter 是使用 python 进行窗口视窗设计的模块。Tkinter模块("Tk 接口")是Python的标准Tk GUI工具包的接口。作为 python 特定的GUI界面，是一个图像的窗口，tkinter是python 自带的，可以编辑的GUI界面，我们可以用GUI 实现很多直观的功能，比如想开发一个计算器，如果只是一个程序输入，输出窗口的话，是没用用户体验的。所有开发一个图像化的小窗口，就是必要的。

## Label标签

1. 创建好主窗口才能在上面放置各种控件元素
2. `tk.Lable(window,text="文本内容"，bg='背景颜色',font=('字体family',字体大小)),width=标签宽度,height=标签高度 以字符的大小为单位`
3. `window.title('窗口名称')`
4. window.geometry('窗口的大小')
5. 放置标签x.pack()或者x.place()

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import tkinter as tk  # 使用Tkinter前需要先导入

# 第1步，实例化object，建立窗口window
window = tk.Tk()

# 第2步，给窗口的可视化起名字
window.title('My Window')

# 第3步，设定窗口的大小(长 * 宽)
window.geometry('500x300')  # 这里的乘是小x

# 第4步，在图形界面上设定标签
l = tk.Label(window, text='你好！this is Tkinter', bg='green', font=('Arial', 12), width=30, height=2)
# 说明： bg为背景，font为字体，width为长，height为高，这里的长和高是字符的长和高，比如height=2,就是标签有2个字符这么高

# 第5步，放置标签
l.pack()    # Label内容content区域放置位置，自动调节尺寸
# 放置lable的方法有：1）l.pack(); 2)l.place();

# 第6步，主窗口循环显示
window.mainloop()
# 注意，loop因为是循环的意思，window.mainloop就会让window不断的刷新，如果没有mainloop,就是一个静态的window,传入进去的值就不会有循环，mainloop就相当于一个很大的while循环，有个while，每点击一次就会更新一次，所以我们必须要有循环
# 所有的窗口文件都必须有类似的mainloop函数，mainloop是窗口文件的关键的关键。
```

## Button窗口部件

1. 定义一个函数功能（内容自己自由编写），供点击Button按键时调用，调用命令参数command=函数名

```python

import tkinter as tk  # 使用Tkinter前需要先导入

# 第1步，实例化object，建立窗口window
window = tk.Tk()

# 第2步，给窗口的可视化起名字
window.title('My Window')

# 第3步，设定窗口的大小(长 * 宽)
window.geometry('500x300')  # 这里的乘是小x
# 第4步，在图形界面上设定标签
# 说明： bg为背景，font为字体，width为长，height为高，这里的长和高是字符的长和高，比如height=2,就是标签有2个字符这么高
var = tk.StringVar()  # 将label标签的内容设置为字符类型，用var来接收hit_me函数的传出内容用以显示在标签上
l = tk.Label(window, textvariable=var, bg='green', fg='white', font=('Arial', 12), width=30, height=2)
# 说明： bg为背景，fg为字体颜色，font为字体，width为长，height为高，这里的长和高是字符的长和高，比如height=2,就是标签有2个字符这么高
l.pack()
# 定义一个函数功能（内容自己自由编写），供点击Button按键时调用，调用命令参数command=函数名
on_hit = False
def hit_me():
    global on_hit
    if on_hit == False:
        on_hit = True
        var.set('you hit me')
    else:
        on_hit = False
        var.set('')
# 第5步，在窗口界面设置放置Button按键
b = tk.Button(window, text='hit me', font=('Arial', 12), width=10, height=1, command=hit_me)
# 第5步，放置标签
# x.pack()  # Label内容content区域放置位置，自动调节尺寸
b.pack()
# 放置lable的方法有：1）l.pack(); 2)l.place();

# 第6步，主窗口循环显示
window.mainloop()
# 注意，loop因为是循环的意思，window.mainloop就会让window不断的刷新，如果没有mainloop,就是一个静态的window,传入进去的值就不会有循环，mainloop就相当于一个很大的while循环，有个while，每点击一次就会更新一次，所以我们必须要有循环
# 所有的窗口文件都必须有类似的mainloop函数，mainloop是窗口文件的关键的关键。
```

## Entry窗口部件

1. Entry是tkinter类中提供的的一个单行文本输入域，用来输入显示一行文本，收集键盘输入(类似 HTML 中的 text)

```python
e1 = tk.Entry(window, show='*', font=('Arial', 14))   # 显示成密文形式
e2 = tk.Entry(window, show=None, font=('Arial', 14))  # 显示成明文形式
e2.pack()
```

## Text窗口部件

1. Text是tkinter类中提供的的一个多行文本区域，显示多行文本，可用来收集(或显示)用户输入的文字(类似 HTML 中的 textarea)，格式化文本显示，允许你用不同的样式和属性来显示和编辑文本，同时支持内嵌图象和窗口。
2. insert 在焦点处插入 ，end 在文本末尾插入数据

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import tkinter as tk  # 使用Tkinter前需要先导入

# 第1步，实例化object，建立窗口window
window = tk.Tk()

# 第2步，给窗口的可视化起名字
window.title('My Window')

# 第3步，设定窗口的大小(长 * 宽)
window.geometry('500x300')  # 这里的乘是小x

# 第4步，在图形界面上设定输入框控件entry框并放置
e = tk.Entry(window, show=None)  # 显示成明文形式
e.pack()

# 第5步，定义两个触发事件时的函数insert_point和insert_end（注意：因为Python的执行顺序是从上往下，所以函数一定要放在按钮的上面）
def insert_point():  # 在鼠标焦点处插入输入内容
    var = e.get()
    t.insert('insert', var)

def insert_end():  # 在文本框内容最后接着插入输入内容
    var = e.get()
    t.insert('end', var)

# 第6步，创建并放置两个按钮分别触发两种情况
b1 = tk.Button(window, text='insert point', width=10,
               height=2, command=insert_point)
b1.pack()
b2 = tk.Button(window, text='insert end', width=10,
               height=2, command=insert_end)
b2.pack()

# 第7步，创建并放置一个多行文本框text用以显示，指定height=3为文本框是三个字符高度
t = tk.Text(window, height=3)
t.pack()

# 第8步，主窗口循环显示
window.mainloop()
```

## Listbox窗口部件

1. Text是tkinter类中提供的的列表框部件，显示供选方案的一个列表。listbox能够被配置来得到radiobutton或checklist的行为。
2. lb.get(lb.curselection()) 获取列表选中文本的值
3. 可以使用insert将值遍历到listbox中

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import tkinter as tk  # 使用Tkinter前需要先导入

# 第1步，实例化object，建立窗口window
window = tk.Tk()

# 第2步，给窗口的可视化起名字
window.title('My Window')

# 第3步，设定窗口的大小(长 * 宽)
window.geometry('500x300')  # 这里的乘是小x

# 第4步，在图形界面上创建一个标签label用以显示并放置
var1 = tk.StringVar()  # 创建变量，用var1用来接收鼠标点击具体选项的内容
l = tk.Label(window, bg='green', fg='yellow', font=('Arial', 12), width=10, textvariable=var1)
l.pack()

# 第6步，创建一个方法用于按钮的点击事件
def print_selection():
    value = lb.get(lb.curselection())  # 获取当前选中的文本
    var1.set(value)  # 为label设置值

# 第5步，创建一个按钮并放置，点击按钮调用print_selection函数
b1 = tk.Button(window, text='print selection', width=15, height=2, command=print_selection)
b1.pack()

# 第7步，创建Listbox并为其添加内容
var2 = tk.StringVar()
var2.set((1, 2, 3, 4))  # 为变量var2设置值
# 创建Listbox
lb = tk.Listbox(window, listvariable=var2)  # 将var2的值赋给Listbox
# 创建一个list并将值循环添加到Listbox控件中
list_items = [11, 22, 33, 44]
for item in list_items:
    lb.insert('end', item)  # 从最后一个位置开始加入值
lb.insert(1, 'first')  # 在第一个位置加入'first'字符
lb.insert(2, 'second')  # 在第二个位置加入'second'字符
lb.delete(2)  # 删除第二个位置的字符
lb.pack()

# 第8步，主窗口循环显示
window.mainloop()
```

## Radiobutton窗口部件

1. 代表一个变量，它可以有多个值中的一个。点击它将为这个变量设置值，并且清除与这同一变量相关的其它radiobutton。类似于单选
2. tk.Radiobutton(window, text='Option A', variable=var, value='A', command=print_selection)

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import tkinter as tk  # 使用Tkinter前需要先导入

# 第1步，实例化object，建立窗口window
window = tk.Tk()

# 第2步，给窗口的可视化起名字
window.title('My Window')

# 第3步，设定窗口的大小(长 * 宽)
window.geometry('500x300')  # 这里的乘是小x

# 第4步，在图形界面上创建一个标签label用以显示并放置
var = tk.StringVar()    # 定义一个var用来将radiobutton的值和Label的值联系在一起.
l = tk.Label(window, bg='yellow', width=20, text='empty')
l.pack()

# 第6步，定义选项触发函数功能
def print_selection():
    l.config(text='you have selected ' + var.get())

# 第5步，创建三个radiobutton选项，其中variable=var, value='A'的意思就是，当我们鼠标选中了其中一个选项，把value的值A放到变量var中，然后赋值给variable
r1 = tk.Radiobutton(window, text='Option A', variable=var, value='A', command=print_selection)
r1.pack()
r2 = tk.Radiobutton(window, text='Option B', variable=var, value='B', command=print_selection)
r2.pack()
r3 = tk.Radiobutton(window, text='Option C', variable=var, value='C', command=print_selection)
r3.pack()

# 第7步，主窗口循环显示
window.mainloop()
```

## Checkbutton窗口部件

1. 代表一个变量，它有两个不同的值。点击这个按钮将会在这两个值间切换，选择和取消选择。
2. `l.config` 将值显示在标签上

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import tkinter as tk  # 使用Tkinter前需要先导入

# 第1步，实例化object，建立窗口window
window = tk.Tk()

# 第2步，给窗口的可视化起名字
window.title('My Window')

# 第3步，设定窗口的大小(长 * 宽)
window.geometry('500x300')  # 这里的乘是小x

# 第4步，在图形界面上创建一个标签label用以显示并放置
l = tk.Label(window, bg='yellow', width=20, text='empty')
l.pack()

# 第6步，定义触发函数功能
def print_selection():
    if (var1.get() == 1) & (var2.get() == 0):  # 如果选中第一个选项，未选中第二个选项
        l.config(text='I love only Python ')
    elif (var1.get() == 0) & (var2.get() == 1):  # 如果选中第二个选项，未选中第一个选项
        l.config(text='I love only C++')
    elif (var1.get() == 0) & (var2.get() == 0):  # 如果两个选项都未选中
        l.config(text='I do not love either')
    else:
        l.config(text='I love both')  # 如果两个选项都选中

# 第5步，定义两个Checkbutton选项并放置
var1 = tk.IntVar()  # 定义var1和var2整型变量用来存放选择行为返回值
var2 = tk.IntVar()
c1 = tk.Checkbutton(window, text='Python', variable=var1, onvalue=1, offvalue=0,
                    command=print_selection)  # 传值原理类似于radiobutton部件
c1.pack()
c2 = tk.Checkbutton(window, text='C++', variable=var2, onvalue=1, offvalue=0, command=print_selection)
c2.pack()

# 第7步，主窗口循环显示
window.mainloop()
```

## Scale窗口部件

1.  尺度（拉动条），允许你通过滑块来设置一数字值。

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import tkinter as tk  # 使用Tkinter前需要先导入

# 第1步，实例化object，建立窗口window
window = tk.Tk()

# 第2步，给窗口的可视化起名字
window.title('My Window')

# 第3步，设定窗口的大小(长 * 宽)
window.geometry('500x300')  # 这里的乘是小x

# 第4步，在图形界面上创建一个标签label用以显示并放置
l = tk.Label(window, bg='green', fg='white', width=20, text='empty')
l.pack()

# 第6步，定义一个触发函数功能
def print_selection(v):
    l.config(text='you have selected ' + v)

# 第5步，创建一个尺度滑条，长度200字符，从0开始10结束，以2为刻度，精度为0.01，触发调用print_selection函数
s = tk.Scale(window, label='try me', from_=0, to=10, orient=tk.HORIZONTAL, length=200, showvalue=0,tickinterval=2, resolution=0.01, command=print_selection)
s.pack()

# 第7步，主窗口循环显示
window.mainloop()
```

## Canvas窗口部件

1. 画布，提供绘图功能(直线、椭圆、多边形、矩形) 可以包含图形或位图，用来绘制图表和图，创建图形编辑器，实现定制窗口部件。

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import tkinter as tk  # 使用Tkinter前需要先导入

# 第1步，实例化object，建立窗口window
window = tk.Tk()

# 第2步，给窗口的可视化起名字
window.title('My Window')

# 第3步，设定窗口的大小(长 * 宽)
window.geometry('500x300')  # 这里的乘是小x

# 第4步，在图形界面上创建 500 * 200 大小的画布并放置各种元素
canvas = tk.Canvas(window, bg='green', height=200, width=500)
# 说明图片位置，并导入图片到画布上
image_file = tk.PhotoImage(file='pic.gif')  # 图片位置（相对路径，与.py文件同一文件夹下，也可以用绝对路径，需要给定图片具体绝对路径）
image = canvas.create_image(250, 0, anchor='n',image=image_file)        # 图片锚定点（n图片顶端的中间点位置）放在画布（250,0）坐标处
# 定义多边形参数，然后在画布上画出指定图形
x0, y0, x1, y1 = 100, 100, 150, 150
line = canvas.create_line(x0-50, y0-50, x1-50, y1-50)                   # 画直线
oval = canvas.create_oval(x0+120, y0+50, x1+120, y1+50, fill='yellow')  # 画圆 用黄色填充
arc = canvas.create_arc(x0, y0+50, x1, y1+50, start=0, extent=180)      # 画扇形 从0度打开收到180度结束
rect = canvas.create_rectangle(330, 30, 330+20, 30+20)                  # 画矩形正方形
canvas.pack()

# 第6步，触发函数，用来一定指定图形
def moveit():
    canvas.move(rect, 2, 2) # 移动正方形rect（也可以改成其他图形名字用以移动一起图形、元素），按每次（x=2, y=2）步长进行移动

# 第5步，定义一个按钮用来移动指定图形的在画布上的位置
b = tk.Button(window, text='move item',command=moveit).pack()

# 第7步，主窗口循环显示
window.mainloop()
```

## Menu窗口部件

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import tkinter as tk  # 使用Tkinter前需要先导入

# 第1步，实例化object，建立窗口window
window = tk.Tk()

# 第2步，给窗口的可视化起名字
window.title('My Window')

# 第3步，设定窗口的大小(长 * 宽)
window.geometry('500x300')  # 这里的乘是小x

# 第4步，在图形界面上创建一个标签用以显示内容并放置
l = tk.Label(window, text='      ', bg='green')
l.pack()

# 第10步，定义一个函数功能，用来代表菜单选项的功能，这里为了操作简单，定义的功能比较简单
counter = 0

def do_job():
    global counter
    l.config(text='do ' + str(counter))
    counter += 1

# 第5步，创建一个菜单栏，这里我们可以把他理解成一个容器，在窗口的上方
menubar = tk.Menu(window)

# 第6步，创建一个File菜单项（默认不下拉，下拉内容包括New，Open，Save，Exit功能项）
filemenu = tk.Menu(menubar, tearoff=0)
# 将上面定义的空菜单命名为File，放在菜单栏中，就是装入那个容器中
menubar.add_cascade(label='File', menu=filemenu)

# 在File中加入New、Open、Save等小菜单，即我们平时看到的下拉菜单，每一个小菜单对应命令操作。
filemenu.add_command(label='New', command=do_job)
filemenu.add_command(label='Open', command=do_job)
filemenu.add_command(label='Save', command=do_job)
filemenu.add_separator()  # 添加一条分隔线
filemenu.add_command(label='Exit', command=window.quit)  # 用tkinter里面自带的quit()函数

# 第7步，创建一个Edit菜单项（默认不下拉，下拉内容包括Cut，Copy，Paste功能项）
editmenu = tk.Menu(menubar, tearoff=0)
# 将上面定义的空菜单命名为 Edit，放在菜单栏中，就是装入那个容器中
menubar.add_cascade(label='Edit', menu=editmenu)

# 同样的在 Edit 中加入Cut、Copy、Paste等小命令功能单元，如果点击这些单元, 就会触发do_job的功能
editmenu.add_command(label='Cut', command=do_job)
editmenu.add_command(label='Copy', command=do_job)
editmenu.add_command(label='Paste', command=do_job)

# 第8步，创建第二级菜单，即菜单项里面的菜单
submenu = tk.Menu(filemenu)  # 和上面定义菜单一样，不过此处实在File上创建一个空的菜单
filemenu.add_cascade(label='Import', menu=submenu, underline=0)  # 给放入的菜单submenu命名为Import

# 第9步，创建第三级菜单命令，即菜单项里面的菜单项里面的菜单命令（有点拗口，笑~~~）
submenu.add_command(label='Submenu_1', command=do_job)  # 这里和上面创建原理也一样，在Import菜单项中加入一个小菜单命令Submenu_1

# 第11步，创建菜单栏完成后，配置让菜单栏menubar显示出来
window.config(menu=menubar)

# 第12步，主窗口循环显示
window.mainloop()
```

## Frame 窗口部件

1. 框架，用来承载放置其他GUI元素，就是一个容器，是一个在 Windows 上分离小区域的部件, 它能将 Windows 分成不同的区,然后存放不同的其他部件. 同时一个 Frame 上也能再分成两个 Frame, Frame 可以认为是一种容器.

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import tkinter as tk  # 使用Tkinter前需要先导入

# 第1步，实例化object，建立窗口window
window = tk.Tk()

# 第2步，给窗口的可视化起名字
window.title('My Window')

# 第3步，设定窗口的大小(长 * 宽)
window.geometry('500x300')  # 这里的乘是小x

# 第4步，在图形界面上创建一个标签用以显示内容并放置
tk.Label(window, text='on the window', bg='red', font=('Arial', 16)).pack()   # 和前面部件分开创建和放置不同，其实可以创建和放置一步完成

# 第5步，创建一个主frame，长在主window窗口上
frame = tk.Frame(window)
frame.pack()

# 第6步，创建第二层框架frame，长在主框架frame上面
frame_l = tk.Frame(frame)# 第二层frame，左frame，长在主frame上
frame_r = tk.Frame(frame)# 第二层frame，右frame，长在主frame上
frame_l.pack(side='left')
frame_r.pack(side='right')

# 第7步，创建三组标签，为第二层frame上面的内容，分为左区域和右区域，用不同颜色标识
tk.Label(frame_l, text='on the frame_l1', bg='green').pack()
tk.Label(frame_l, text='on the frame_l2', bg='green').pack()
tk.Label(frame_l, text='on the frame_l3', bg='green').pack()
tk.Label(frame_r, text='on the frame_r1', bg='yellow').pack()
tk.Label(frame_r, text='on the frame_r2', bg='yellow').pack()
tk.Label(frame_r, text='on the frame_r3', bg='yellow').pack()

# 第8步，主窗口循环显示
window.mainloop()
```

## messageBox窗口部件

1. 类似于弹窗的操作

```python
 tkinter.messagebox.showinfo(title='Hi', message='你好！')  # 提示信息对话窗
    tkinter.messagebox.showwarning(title='Hi', message='有警告！')       # 提出警告对话窗
    tkinter.messagebox.showerror(title='Hi', message='出错了！')         # 提出错误对话窗
    print(tkinter.messagebox.askquestion(title='Hi', message='你好！'))  # 询问选择对话窗return 'yes', 'no'
    print(tkinter.messagebox.askyesno(title='Hi', message='你好！'))     # return 'True', 'False'
    print(tkinter.messagebox.askokcancel(title='Hi', message='你好！'))  # return 'True', 'False'
```

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import tkinter as tk  # 使用Tkinter前需要先导入
import tkinter.messagebox  # 要使用messagebox先要导入模块

# 第1步，实例化object，建立窗口window
window = tk.Tk()

# 第2步，给窗口的可视化起名字
window.title('My Window')

# 第3步，设定窗口的大小(长 * 宽)
window.geometry('500x300')  # 这里的乘是小x

# 第5步，定义触发函数功能
def hit_me():
    tkinter.messagebox.showinfo(title='Hi', message='你好！')  # 提示信息对话窗
    tkinter.messagebox.showwarning(title='Hi', message='有警告！')       # 提出警告对话窗
    tkinter.messagebox.showerror(title='Hi', message='出错了！')         # 提出错误对话窗
    print(tkinter.messagebox.askquestion(title='Hi', message='你好！'))  # 询问选择对话窗return 'yes', 'no'
    print(tkinter.messagebox.askyesno(title='Hi', message='你好！'))     # return 'True', 'False'
    print(tkinter.messagebox.askokcancel(title='Hi', message='你好！'))  # return 'True', 'False'

# 第4步，在图形界面上创建一个标签用以显示内容并放置
tk.Button(window, text='hit me', bg='green', font=('Arial', 14), command=hit_me).pack()

# 第6步，主窗口循环显示
window.mainloop()
```

- [参考文章](https://blog.csdn.net/low5252/article/details/106366257?utm_medium=distribute.pc_relevant.none-task-blog-baidujs_title-8&spm=1001.2101.3001.4242)
