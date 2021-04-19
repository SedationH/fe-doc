https://tech.meituan.com/2018/10/11/fe-security-csrf.html

## CSRF Corss-site request forgery

**XSS** 利用的是用户对指定网站的信任，CSRF 利用的是网站对用户网页浏览器的信任。

CSRF 就是 利用用户登录态发起的恶意请求

一个典型的CSRF攻击有着如下的流程：

- 受害者登录 `a.com`，并保留了登录凭证（Cookie）
- 攻击者引诱受害者访问了`b.com`
- `b.com` 向 `a.com` 发送了一个请求：`a.com/act=xx`浏览器会默认携带a.com的Cookie
- a.com接收到请求后，对请求进行验证，并确认是受害者的凭证，误以为是受害者自己发送的请求
- a.com以受害者的名义执行了act=xx
- 攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让a.com执行了自己定义的操作



例子

例如，SanShao可能正在浏览其他用户XiaoMing发布消息的聊天论坛。假设XiaoMing制作了一个引用ShanShao银行网站的HTML图像元素，例如，

```html
<img  src = "http://www.bank.com/withdraw?user=SanShao&amount=999999&for=XiaoMing" >
```

如果SanShao的银行将其认证信息保存在cookie中，并且cookie尚未过期，(当然是没有其他验证身份的东西)，那么SanShao的浏览器尝试加载该图片将使用他的cookie提交提款表单，从而在未经SanShao批准的情况下授权交易。

## 如何预防

CSRF的两个特点：

- CSRF（通常）发生在第三方域名。
- CSRF攻击者不能获取到Cookie等信息，只是使用。

How

- CSRF自动防御策略：同源检测（Origin 和 Referer 验证）。

- CSRF主动防御措施：Token验证 或者 双重Cookie验证 以及配合Samesite Cookie。

  

## Samesite Cookie属性

Google起草了一份草案来改进HTTP协议，那就是为Set-Cookie响应头新增Samesite属性，它用来标明这个 Cookie是个“同站 Cookie”，同站Cookie只能作为第一方Cookie，不能作为第三方Cookie，Samesite 有两个属性值:

- Samesite=Strict: 这种称为严格模式，表明这个 Cookie 在任何情况下都不可能作为第三方 Cookie
- Samesite=Lax: 这种称为宽松模式，比 Strict 放宽了点限制,假如这个请求是这种请求且同时是个GET请求，则这个Cookie可以作为第三方Cookie

还不支持子域