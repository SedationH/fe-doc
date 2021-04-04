## 理解前提和策略

前端作为GUI开发的一种，有其存在的特殊性--“动态”

传统GUI开发，相关应用是预先下载好的，而前端这里常常是动态增量的，实时下载和执行的

所以在前端开发性能优化里

网页的加载速度是一个需要重点考量的问题



用户体验是根本，各种策略都是基于这一基本出发点



## 从用户的角度来看网页加载的过程

用户点击某个网址 或者输入某个地址进行访问

从点击或者输入地址，开始访问  作为加载过程的起点



用户视角可能产生两个问题

- 能访问吗？（1）
- 能用吗？（2）



1的问题来源是 网页是白的，啥都没有，用户不知道自己的操作是否是有效的

白花花的一片，就是我理解的白屏



2的问题是页面开始出现内容了，但内容不够完整，也没法正常的交互



## 较为必要的理解前提

从URL到页面展示，发生了什么？

理解页面渲染的过程



强调一下

下载往往是并行的（parse 和下载进度不要求一致）

注意<script>标签的特殊性，不仅可能要下载，也要进行执行



## 从开发者的视角看加载

参考 https://www.sitepen.com/blog/improving-performance-with-the-paint-timing-api

Performance提供 

![image-20210404200413924](http://picbed.sedationh.cn/image-20210404200413924.png)

代码方面可以通过

```js
performance.getEntriesByType('paint')
// or
const observer = new PerformanceObserver(list => {
    // `list` provides access to performance metrics
});

observer.observe({entryTypes: ['paint']});
```

拿到

![image-20210404205341961](http://picbed.sedationh.cn/image-20210404205341961.png)

访问开始事件 performance.timing.navigationStart

![img](http://picbed.sedationh.cn/5bac41a960798.png)



那么白屏时间 = firstPaint - performance.timing.navigationStart



两个关键词

- First Paint (FP)
- First Contentful Paint (FCP)



白屏的结束FP在页面较为复杂的时候并不是很有意义，因为即使是背景颜色也归于FB之中，而用户更在意的是内容



> FCP：**First contentful paint (FCP)** is the first content that is rendered on the screen when users browse the website. It measures the time from navigation to the time when the browser renders the first piece of content defined in the **Document Object Model (DOM).** This can be text, an image or canvas render.
>
> It represents the first point at which a user can start consuming content. 

FCP表示的提供给用户的内容第一次渲染到页面上的时机，网页是内容的载体，所以这个指标更有代表意义



![First Meaningful paint](https://www.acmethemes.com/blog/wp-content/uploads/2020/01/First-Meaningful-paint-e1588261514486.jpg)

图片来源 https://www.acmethemes.com/blog/first-contentful-paint-and-first-meaningful-paint/

图中还提了一个 Frist Meaningful Paint，这个概念是谷歌提出来的，个人感觉比较玄学，没有相关API直接获取

腾讯团队探讨了一下这个问题 http://www.alloyteam.com/2019/12/14174/#prettyPhoto



## 一些细节

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Paint delay example</title>
    <script>
      const observer = new window.PerformanceObserver(list => {
        list.getEntries().forEach(({ name, startTime }) => {
          console.log({ name, startTime })
        })
      })

      observer.observe({
        entryTypes: ['paint'],
      })

      function sleep(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms))
      }

      // This triggers first-paint
      sleep().then(() => (document.body.style.backgroundColor = 'lightgrey'))

      // This triggers first-contentful-paint
      sleep(2000).then(() => (document.body.innerHTML += '<p>Hi there!</p>'))
    </script>
  </head>
  <body>
    <img
      src="http://picbed.sedationh.cn/First-Meaningful-paint-e1588261514486.jpg"
      alt=""
    />
    <script>
      window.addEventListener('load', event => {
        console.log('page is fully loaded')
      })
      window.addEventListener('DOMContentLoaded', event => {
        console.log('DOM fully loaded and parsed')
      })
    </script>
    <script>
      // for (let i = 0; i < 1e8; i++) {
      //   let a = 0
      // }
      console.log(1)
    </script>
  </body>
</html>

```

从测试来看，FP都会在DOMContentLoaded事件之后，可见完全parse HTML  -> DOM 后才会有Paint 



提三个描述DOM parse情况的api

```js
const log = document.querySelector('.event-log-contents');
const reload = document.querySelector('#reload');

reload.addEventListener('click', () => {
  log.textContent ='';
  window.setTimeout(() => {
      window.location.reload(true);
  }, 200);
});

window.addEventListener('load', (event) => {
    log.textContent = log.textContent + 'load\n';
});

document.addEventListener('readystatechange', (event) => {
    log.textContent = log.textContent + `readystate: ${document.readyState}\n`;
});

document.addEventListener('DOMContentLoaded', (event) => {
    log.textContent = log.textContent + `DOMContentLoaded\n`;
});

```



