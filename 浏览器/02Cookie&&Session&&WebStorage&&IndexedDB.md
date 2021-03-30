|     特性     |                   cookie                   |       localStorage       | sessionStorage |         indexDB          |
| :----------: | :----------------------------------------: | :----------------------: | :------------: | :----------------------: |
| 数据生命周期 |     一般由服务器生成，可以设置过期时间     | 除非被清理，否则一直存在 | 页面关闭就清理 | 除非被清理，否则一直存在 |
| 数据存储大小 |                     4K                     |            5M            |       5M       |           无限           |
| 与服务端通信 | 每次都会携带在 header 中，对于请求性能影响 |          不参与          |     不参与     |          不参与          |



## Cookie

https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies

Cookie用于解决无状态的HTTP协议无法记录稳定状态信息的问题

简而言之，服务器无法知道两个请求是否来自同一个服务器

cookie是服务端给客户端通过http响应中的Set-Cookie设置的，随后的客户端再发送请求，会携带上cookie

![image-20200306111453238](http://picbed.sedationh.cn/00831rSTly1gck1cx9lahj30f805e40p.jpg)

```plain
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: yummy_cookie=choco
Set-Cookie: tasty_cookie=strawberry
```



```plain
GET /sample_page.html HTTP/1.1
Host: www.example.org
Cookie: yummy_cookie=choco; tasty_cookie=strawberry
```

Cookie可以定义生命周期

- 会话期Cookie
- 持久性Cookie
  - Expires
  - Max-Age

可以进行访问限制

| 属性      | 作用                                                         |
| --------- | ------------------------------------------------------------ |
| value     | 用于保存用户登录状态，应该将该值加密，不能使用铭文的用户标识 |
| http-only | 不能通过 JavaScript 访问 Cookie，减少 XSS 攻击               |
| secure    | 只能在协议为 HTTPS 的请求中携带                              |
| SameSite  | 规定游览器不能再跨域请求中携带 Cookie，减少 CSRF 攻击        |



Cookie的Domain问题

`Domain` 指定了哪些主机可以接受 Cookie。如果不指定，默认为 [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin)，**不包含子域名**。如果指定了`Domain`，则一般包含子域名。因此，指定 `Domain` 比省略它的限制要少。

例如，如果设置 `Domain=mozilla.org`，则 Cookie 也包含在子域名中（如`developer.mozilla.org`）。

**HTML5中新增了本地存储的解决方案——Web Storage，它分为 sessionStorage 和 localStorage**。有了 WebStorage 后，cookie 只需做它应该做的事情了——作为客户端与服务器交互的通道，保持客户端状态。



`sessionStorage`保存的数据用于浏览器的一次会话，当会话结束（通常是该窗口关闭），数据被清空；`sessionStorage` 特别的一点在于，**即便是相同域名下的两个页面，只要它们不在同一个浏览器窗口中打开，那么它们的 sessionStorage 内容便无法共享**。`localStorage` 在所有同源窗口中都是共享的；`cookie` 也是在所有同源窗口中都是共享的。除了保存期限的长短不同，`sessionStorage`的属性和方法与 `localStorage` 完全一样。

![image-20200306172554605](http://picbed.sedationh.cn/00831rSTly1gckc2y8k3ij30gc09smzx.jpg)



## IndexedDB

使用场景：离线登陆，博客写文章草稿