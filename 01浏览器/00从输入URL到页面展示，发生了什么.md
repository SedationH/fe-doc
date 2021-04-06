

## 图

![image-20210327155407527](http://picbed.sedationh.cn/image-20210327155407527.png)

![image-20210327170148416](http://picbed.sedationh.cn/image-20210327170148416.png)





## 来一波文字版本 

若不是ip的话

### DNS (Domain Name System)

1. 缓存有不？
   1. 浏览器DNS缓存 **chrome://net-internals/#dns** 
   2. 操作系统缓存
   3. 路由器 & IPS Internet service provider
2. 没有缓存，DNS查询请求寻找

DNS的本质是一种映射关系，数量太多，查询，维护和更新问题下，使用分布式设计

主要有两种查询方式

递归和迭代 迭代请求需要发多次，递归相当于借助后面的服务器作为代理去找了

![img](http://picbed.sedationh.cn/2019-02-27-02.png)

从这里拿到具体的IP地址，url中又包含着端口号(default 80/443 ...)

### 建立TCP连接

![v2-acbef35a5faa508408c0b8e7b26bc02a_720w](http://picbed.sedationh.cn/v2-acbef35a5faa508408c0b8e7b26bc02a_720w.jpg)

TCP是传输层的一种协议，除了TCP还有UDP，作为传输层，搭建在网络层的IP之上，目的是建立端到端的通讯

（app/service 在os上对应端口）

参考 https://zhuanlan.zhihu.com/p/157607847

TCP -> Transmission Control Protocol 传输控制协议

主要特点

1. 可靠的有序的传输机制
2. 面向连接的
3. 抽象出了端口的概念

一个端口对应一个TCP链接，因此程序建立了一个TCP链接就占用了系统的一个端口，这是有限的资源，这也解释了为什么浏览器在一个页面上，针对某个域名只允许同时建立6个链接。（http2  TCP复用技术得以解决）

面向连接，就意味着要建立连接和释放连接

对应着三次握手和四次挥手

TODO

### HTTP请求和响应

客户端组织好请求报文，进行发送～

在拿到响应报文后，根据相应中的Content-Type选择处理方式

![image-20210405145116697](http://picbed.sedationh.cn/image-20210405145116697.png)

如果是text/html，准备渲染进程



### 文档阶段

这里的文档就是就是最开始发出的请求返回的html内容啦

理解这里的前提是，渲染进程所需要的html并不是完全都拿到的～

FROM WIKI

> **Chunked transfer encoding** is a [streaming](https://en.wikipedia.org/wiki/Stream_(computing)) data transfer mechanism available in version 1.1 of the [Hypertext Transfer Protocol](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) (HTTP). In chunked transfer encoding, the data stream is divided into a series of non-overlapping "chunks". The chunks are sent out and received independently of one another. No knowledge of the data stream outside the currently-being-processed chunk is necessary for both the sender and the receiver at any given time.

网络进程收到的是[chunk](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding#chunked_encoding)，因此渲染检查和网络进程建立pipe进行传输

这个数据传输完毕，渲染进程就会发送确认文档提交给浏览器进程，从而完成浏览器相关的一些状态改变，比如说前进后退～



### 渲染

DOM

CSSOM

布局树

图层树

图层这里的处理，不仅是为了更好的处理z轴上的展示效果，处理clip的情况

也是为了能够优化布局，减少paint

![image-20210405155058515](http://picbed.sedationh.cn/image-20210405155058515.png)

形成绘制列表 paint list

浏览器根据绘制列表利用[Chrome Compositor](https://chromium.googlesource.com/chromium/src/+/master/docs/how_cc_works.md)进行合成绘制 -> paint

Compositing reason



### loaded

非阻塞资源也加载完成～✅



## 后

浏览器就是前端开发的操作系统

无论是开发还是优化，熟悉所处的OS是基本出发点