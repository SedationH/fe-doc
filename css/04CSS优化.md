## 模块化

https://juejin.cn/post/6844904034281734151#heading-9



## 优化

一篇不错的文章，涉及Chrome样式变动的相关原理

https://juejin.cn/post/6942186697727836174#heading-12



chrome维护失效集合，表示某些样式变动后会影响哪些元素，从而在产生对于某个样式的修改后，针对性的修改相应的元素



优化CSS的核心在于如何减少没必要的检测和操作（`Recalculate Style`），既然chrome以失效集来优化操作，那么我们尽量减少失效集中所涉及的元素，就完成了优化的目的



失效集有两种类型

1. 后代元素失效集
2. 同级元素失效集



失效集的实现还 和**特征**有关

```css
/* 这条css规则的特征是#b */
.a #b.b {}
/* 这条css规则的特征是.b */
.a .b {}
```



简单📝几条Tip

1. **尽量避免一个复合选择器中的高优先级选择器匹配到页面中较多的元素**，比如这种选择器写法`#a > span{}`，会导致匹配到`#a`下面所的`span`，而不是仅仅是儿子`span`。
2. **尽量避免`:not`选择器**。
3. **避免使用兄弟元素选择器**。



## GPU

https://zhuanlan.zhihu.com/p/88288584

https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome

传统的浏览器架构完全依赖CPU去渲染页面内容，而现代浏览器采用GPU合成的方式去呈现网页内容。



`transform`是如何让动画不会导致重绘的呢？最直接的答案就是`transform`会直接使用硬件加速，在`GPU`中运行，绕开了软件渲染。



- 频繁重绘的区域可以利用硬件加速；
- 但也要避免滥用硬件加速创建过多合成层，占用过多内存，影响性能；
- 避免隐式创建的合成层造成层爆炸；
- 避免使用gif（可以使用video代替；



一些需要高出来层的情景

- z-index 层叠场景
- transform
- opcity filert
- 动画效果 animation

