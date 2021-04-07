### 介绍一下Promise

红宝书第四版 期约

三个状态

- pending
- fulfilled
- rejected

只能由pending转向其他两者，并且转换后状态不可变

异步解决方案之一

理解JS的异步的的知识背景是

JS对代码的执行是单线程的，但又是非阻塞的，这一点是通过Event loop实现的

Promise就是借助event loop的微任务来进行的较高优先级的异步处理



传统中存在的问题

错误不好捕捉

回调地狱

