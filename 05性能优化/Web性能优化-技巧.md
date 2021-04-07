理解了页面出现的过程中有哪些逻辑和策略方法，接下来针对的进行操作就好了



下面主要处理的是加载时候的性能，部分涉及到网页整体优化（相关联的其他页面）

注意⚠️ 不仅是在考虑最开始的文档请求，还有文档相关联的其他资源的请求

文章是一份地图，有些具体内容不进行展开



## 缓存查找～

本地数据存储localStorage ... -> CacheAPI && Service Worker -> HTTP强缓存、协商缓存

这个与HTTP相关度很高，后说，这部分如果强缓存get，连请求都不用发了



## DNS

请求第一步，往往是DNS

考虑预解析 DNS prefetching cross origin 才有意义

```html
<link rel="dns-prefetch" href="https://fonts.gstatic.com/" >
```

[最佳实践参看](https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch#examples)



提一嘴域名劫持的解决方案

> 移动解析（HTTPDNS）基于HTTP协议向腾讯云的DNS服务器发送域名解析请求，替代了基于DNS协议向运营商Local DNS发起解析请求的传统方式，可以避免Local DNS造成的域名劫持和跨网访问问题，解决移动互联网服务中域名解析异常带来的困扰。



感觉CDN(Content Delivery Network)应该属于这里 DNS解析的时候找到就是最近的再加一波负载均衡

[参考](https://juejin.cn/post/6844903604596244493)

[参考](https://zhuanlan.zhihu.com/p/29468624)

这里缺乏实践经验 不好理解 日后再补充 TODO

## TCP

在查询DNS的时候提到了preconected

```html
<!-- 注意顺序, precontent和dns-prefetch的兼容性 -->
<link rel="preconnect" href="https://fonts.googleapis.com/" crossorigin>
<link rel="dns-prefetch" href="https://fonts.googleapis.com/">
```



下面都是服务端的优化操作

HTTP/1.0 无法优化...

HTTP/1.x 通过

响应报文～

```
  HTTP/1.1 200 OK
+ Connection: Keep-Alive
  Content-Encoding: gzip
  Content-Type: text/html; charset=utf-8
  Date: Thu, 11 Aug 2016 15:23:13 GMT
+ Keep-Alive: timeout=5, max=1000
  Last-Modified: Mon, 25 Jul 2016 04:32:39 GMT
  Server: Apache

  (body)
```

![Compares the performance of the three HTTP/1.x connection models: short-lived connections, persistent connections, and HTTP pipelining.](http://picbed.sedationh.cn/http1_x_connections-20210405164049718.png)

实现效果就是中间那样，对于同一域名，不用重复建立TCP了，但没法像第三幅图那样并行～

[第三幅的pipeline 因为种种原因并没有实际使用](https://developer.mozilla.org/en-US/docs/Web/HTTP/Connection_management_in_HTTP_1.x#http_pipelining)

想要并发只能建立多个TCP

但浏览器对同一域名的TCP数量有数量限制 6 - 8

HTTP2多路复用

**HTTP/2** is a major revision of the [HTTP network protocol](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP). The primary goals for HTTP/2 are to reduce [latency](https://developer.mozilla.org/en-US/docs/Glossary/Latency) by enabling full request and response multiplexing, minimize protocol overhead via efficient compression of HTTP header fields, and add support for request prioritization and server push.

这就可以实现对在一个tcp下的请求并发了（某些场景性能并不一定好于http1.x）



## HTTP

[一篇有趣的文章](https://mp.weixin.qq.com/s/7Bp8Q9ySIXpnaBfO4jk6Vw)

[参考 HTTP协议的优化](https://juejin.cn/post/6844904064531038216)

这里主要是利用协议来更好的处理传输

### [Compression](https://developer.mozilla.org/en-US/docs/Web/HTTP/Compression) && 编码

HTTP1.1

1. 使用chunked让客户端更快的接收到响应

```http
  HTTP/1.1 200 OK
  Content-Type: text/plain
+ Transfer-Encoding: chunked

  25
  This is the data in the first chunk

  1C
  and this is the second one

  3
  con

  8
  sequence

  0
```

2. [End-to-end compression](https://developer.mozilla.org/en-US/docs/Web/HTTP/Compression#end-to-end_compression)

![img](http://picbed.sedationh.cn/httpcompression1.png)



HTTP2 二进制协议

3. 头部压缩

### 缓存 

强缓存

```http
Expires: Wed, 11 May 2018 07:20:00 GMT
Cache-Control: max-age=315360000
```

协商缓存

```http
Last-Modified / If-Modified-Since
ETag/If-None-Match
```



缓存这里很有讲的内容 也是能够显著提升性能的地方

[大公司里怎样开发和部署前端代码](https://www.zhihu.com/question/20790576/answer/32602154)

[利用webpack进行持久缓存](https://github.com/happylindz/blog/issues/7)

逻辑上就是，对于静态的资源，通过内容摘要算法或一些hash方案，来标记内容的唯一性和稳定性

更新的时候，先资源，再文档，增量式更新



### 减少重定向

https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections

一般用重定向的时候是有相关需求的，这个意义不大

> HTTP redirects aren't the only way to define redirections. There are two others:
>
> 1. HTML redirections with the `<meta>` element
> 2. JavaScript redirections via the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)



## 开发过程 项目文件

这里面要涉及的考虑比较多

分别重编码和构建进行梳理



### 编码方面

[参考](https://github.com/berwin/Blog/issues/23)

- JS运行优化
  - 数据读取
  - DOM
  - 流程控制
  - 减少JS操作DOM而产生的reflow repaint 尽量利用Composite
  - 长计算任务拆解，分散到各个帧中去执行
  - debounce throttle
  - web worker...

- 文件按需引入
  - 组件可以
  - css也可以
    - 媒体查询
    - 谨慎使用@import Chrome对js中link引入的外表内容有并行下载优化
  - 图片也可以按需加载 
  - polifill按需引入

- 注意文档内容组织，js可以操作DOM && CSSOM，所以可能产生相关阻塞

  - > JavaScript 会阻塞 DOM 构建，而 CSSOM 的构建又回阻塞 JavaScript 的执行。所以这就是为什么在优化的最佳实践中，我们基本都推荐把 CSS 样式表放在 `<head>` 之中（即页面的头部），把 JavaScript 脚本放在 `<body>` 的最后（即页面的尾部）。

  - script上 defer or async



### 构建

构建就是尽可能的压缩和去除不需要代码

通过构建工具🔧 各种xxx uglify

Tree Shaking



图片和一些其他文件也是在保证能用的情况下尽量压缩

[图片是流量大头 这里重点提一嘴](https://zhuanlan.zhihu.com/p/98683679)



## 页面展现在你的眼前👀啦 🎉

OKK





## 💡想法

文章开始想着通过URL到页面的这个路径去思考如何优化就好了，但却发现每一步都还要好多东西要去做

上面仅仅说的还是页面加载的这个视角，有些内容限于自身理解没到位，就没往上写，除此之外，还有我们开发，维护，监控测试还有一系列自动化的角度。需要去学习的还有很多。

文末附在探索路径上帮到我的文章，感谢😊

- [嗨，送你一张Web性能优化地图](https://github.com/berwin/Blog/issues/23#) 
- [前端性能优化-加载篇](https://www.cxymsg.com/guide/load.html)
- [前端性能优化之旅](https://alienzhou.github.io/fe-performance-journey/) web-highlighter就和作者相遇，太奇妙了。。。
- [Chrome web developers](https://developers.google.com/web/fundamentals/performance/get-started) 还需要慢慢看～
- ...各种碎碎的知识点





## 其他

### Paint

Paint是一个很有趣的点，这里对CSS3在渲染上是如何优化的，很有帮助～

key word : Layers  Compositing

https://developers.google.com/web/fundamentals/performance/rendering



从paint的角度来理解 will-change是如何起作用的～

https://www.youtube.com/watch?v=8-pkB2vGUKk



### 在单页面的开发模式下

JS是很多时候的加载大头

加个loading感觉会让用户舒服很多～

![2019-06-23-12-20-14](http://picbed.sedationh.cn/d3ca5a9ee75428bc53d8751caabdc19e.png)

