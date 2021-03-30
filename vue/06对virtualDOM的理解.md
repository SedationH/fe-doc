不错的文章

https://programmer.ink/think/virtual-dom-and-diff-algorithm-in-vue.html

https://efe.baidu.com/blog/the-inner-workings-of-virtual-dom/



## what

对真实dom的抽象，又或是对真实UI层的抽象



## why

> Browsers parse an html in five steps: create DOM tree -> create Style Rules -> build Render tree -> layout Layout -> draw Painting. Every time a real dom is manipulated, the browser executes the process from start to finish by building the DOM tree. Real dom operation is expensive, frequent operation will cause page carton to affect user experience, virtual dom is created to solve this browser performance problem.
>
> Virtual DOM does not directly manipulate the real DOM after executing the update operation of dom, but saves the updated diff content to the local js object, then attach es it to the DOM tree at one time, informing the browser to draw the DOM to avoid a large number of meaningless calculations.

在面对大量dom更新的时候，利用virtualDOM & diff 算法 进行操作能够尽量减少对DOM的修改



对UI的抽象，把视图抽象为可存储的数据，而数据是可以跨平台的～因此可以实现跨平台的UI复用

（移动原生，SSR)



## how 

### 利用类似JSX && Babel的工具，可以封装对hypercript的调用

![babel-convert-jsx-to-js](http://picbed.sedationh.cn/convert-jsx-to-js.png)



### 利用hyperscript生成vnode

vnode是对DOM Node的抽象

简化来看

```js
const vnode = {
  nodeName: 'div',
  attributes: {
    class: 'active red'
  },
  children: []
}
```



hyperscript || React.createElement

```js
function h(nodeName, attributes,...children){
  ...
  // flat children，一些配置 ...
  return vnode
}
```

![img](http://picbed.sedationh.cn/ea1ee3d7c59d191978fa478a34671a36.jpg)



拿到了vnode && vnode形成的tree，还要可以转化为真实DOM

```js
function createELe(vnode) {
  vnode.elm = document.createElement(vnode.nodeName, vnode.attributes)
  if (Array.isArray(vnode.children)) {
    for (const ch of vnode.children) {
      vnode.elm.appenChild(createELe(ch))
    }
  }
  return vnode.elm
}
```



在数据发生变化后，当前的vnode发生改变，需要对比前后vnode找出差异部分，执行最小更新，尽可能的复用节点和减少操作

Hypothesis of diff algorithm

- In Web UI, DOM nodes have very few cross-level mobile operations, which can be neglected.
- Two components with the same class will generate similar tree structure, and two components with different classes will generate different tree structure.
- For a group of sub-nodes at the same level, they can be distinguished by a unique id.

不理解O(n^3)的算法复杂度从何而来，只理解很少有cross-level的移动操作，所以实现基于同层比较

Vue的Virtual DOM中的diff处理参考snabbdom。

都有chidren的情况

通过四个指针和key来优化判断

1. 头头
2. 尾尾
3. 新头旧尾
4. 新尾旧头

善后操作

新数组俩指针没重合 接着加

旧数组俩指针没重合 接着删



可以优化吗？ LIS ？

问题抽象为

两个数组 

- newChildren
- oldChildren

如何从old -> newChildren 移动最少的节点

https://github.com/NervJS/nerv/issues/3

