有趣的是  对于下面所提到的

MDN对于他们的描述开始都是

The XXX interfce ....

接口

## Window

https://developer.mozilla.org/en-US/docs/Web/API/Window

window.window ?

循环引用





The **`Window`** interface represents a window containing a [DOM](https://developer.mozilla.org/en-US/docs/Glossary/DOM) document; the `document` property points to the [DOM document](https://developer.mozilla.org/en-US/docs/Web/API/Document) loaded in that window. A window for a given document can be obtained using the [`document.defaultView`](https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView) property.



Note: It's not possible to resize a window or tab that wasn’t created by`**window.open()**`. It's also not possible to resize when the window has multiple tabs.



The point of having the `window` property refer to the object itself, was likely to make it easy to refer to the global object. Otherwise, you'd have to do a manual `var window = this;` assignment at the top of your script.



window是js运行环境的顶层对象，当前js代码运行的窗口对象。

window有自己的实体含义，其实不适合当作最高一层的顶层对象。

> 当初设计的时候是想将语言的内置对象越少越好，用于提升浏览器的性能



iframe可以嵌套其他的网页，形成多个窗口

在满足同源策略的情况下，父亲可以去获取子窗口的dom



## Document

用于描述网页内容

节点类型

- Document
- DocumentType: doctype 标签 `<!DOCTYPE html`
- Element
- Attr
- Text
- Comment
- DocumentFragment

EventTarget <- Node <- Document



所有的DOM节点类型都继承了 Node接口



节点都是单个对象，有时需要一种数据结构，能够容纳多个节点。

DOM提供两种节点结合，用于容纳多个节点。

- NodeList
  - Node.childNodes -> 动态集合
  - document.querySelectorAll -> 静态集合

- HTMLCollection
  - 只能有Element类型的节点
  - 主要是一些Document对象的集合属性
    - document.links
    - document.forms
    - document.images



HTML元素 -> Element 节点对象

​      使用不同的构造函数生成



## EventTarget

**`EventTarget`** is a DOM interface implemented by objects that can receive events and may have listeners for them.

- Node
- Window
- XMLHttpRequest
- AudioNode...



```js
var EventTarget = function() {
  this.listeners = {};
};

EventTarget.prototype.listeners = null;
EventTarget.prototype.addEventListener = function(type, callback) {
  if (!(type in this.listeners)) {
    this.listeners[type] = [];
  }
  this.listeners[type].push(callback);
};

EventTarget.prototype.removeEventListener = function(type, callback) {
  if (!(type in this.listeners)) {
    return;
  }
  var stack = this.listeners[type];
  for (var i = 0, l = stack.length; i < l; i++) {
    if (stack[i] === callback){
      stack.splice(i, 1);
      return;
    }
  }
};

EventTarget.prototype.dispatchEvent = function(event) {
  if (!(event.type in this.listeners)) {
    return true;
  }
  var stack = this.listeners[event.type].slice();

  for (var i = 0, l = stack.length; i < l; i++) {
    stack[i].call(this, event);
  }
  return !event.defaultPrevented;
};
```

有event Bus 那味道了



on => addEventListener

emit => dispatchEvent



addEventListener的第三个参数也值得注意

1. Bolean 默认为false 表示是否在capture阶段触发
2. Object 
   1. capture
   2. once
   3. passive
      1. 忽略 preventDefault方法 
      2. imporve performance



## 事件模型

### 绑定方法

```html
1
<body onload="doSomething()">
  
<script>
  2
	$body.onload = function()   {...}
  3
	$body.addEventListener('load', cb)
</script>
```

上面两种缺乏配置、产生覆盖，默认为冒泡



### 阶段

1. capture: 从顶层window -> ... ->  点击对象
2. target: 到达点击对象
3. bubble: 从点击对象回到顶层

```js
var phases = {
  1: 'capture',
  2: 'target',
  3: 'bubble'
};

var div = document.querySelector('div');
var p = document.querySelector('p');

div.addEventListener('click', callback, true);
p.addEventListener('click', callback, true);
div.addEventListener('click', callback, false);
p.addEventListener('click', callback, false);

function callback(event) {
  var tag = event.currentTarget.tagName;
  var phase = phases[event.eventPhase];
  console.log("Tag: '" + tag + "'. EventPhase: '" + phase + "'");
}

// 点击以后的结果
// Tag: 'DIV'. EventPhase: 'capture'
// Tag: 'P'. EventPhase: 'target'
// Tag: 'P'. EventPhase: 'target'
// Tag: 'DIV'. EventPhase: 'bubble'
```



### 代理

代理就是不自己处理，让别人处理

如何实现

利用 capture && bubble的事件模型

兼容性考虑，大多是在bubble上，事实上都可以

currentTarget && target两者都可以正常拿到



两个关键处理函数

stopPropagation， 仅仅是stop当前function

stopImmediatePropagation, 取消后面所有的传播和当前type的所有函数



## Mutation Observer API

通过这个observer 可以拿到在节点上的变动 -> 收到通知



收到通知的过程类似于事件 👆所提的 EventTarget过程

但那个过程是同步的

Mutation Obserber的设计是异步的

同步结束完的微任务搜索阶段进行任务执行

比如说同步中插入了1000 p 是在1000个p搞完了之后，再触发observer

通过EventLoop机制进行理解

相关的变动📝会被封装成一个数组进行处理

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Document</title>

    <script>
      const $html = document.documentElement
      const config = {
        childList: true,
        attributes: true,
        subtree: true,
      }

      const observer = new MutationObserver(handleHTMLElementMutation)

      function handleHTMLElementMutation(mutationList) {
        console.log(mutationList)
      }
      observer.observe($html, config)
    </script>
  </head>
  <body>
    <h1></h1>
  </body>
</html>
```

