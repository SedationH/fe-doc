webpack  模块 打包工具

gulp 任务和流

## webpack 的构建流程

1. 初始化参数，通过配置文件和shell来初始化参数形成Compiler对象
2. 加载所使用的插件，调用Complier对象的run方法进行开始执行编译
3. 编译的入口是enrty中配置好的入口，从入口出发，使用配置好的loader来转换所有依赖文件，递归执行至所有依赖文件直至转换完毕
4. 根据入口和模块的依赖关系，形成chunk到文件列表，这一步是修改文件列表的最后机会(MiniCssExtractPlugin)
5. 根据出口和文件列表，写入文件系统



## 分别介绍bundle chunk module是什么

我们自己写的文件分成一个又一个的module，webpack通过Compiler实例（主要是enrty起作用）和具体文件之间的依赖关系，形成不同的chunk

bundle是最后webpack输出的文件，这个和chunk并不一定是一一对应的，因为类似MiniCssExtractPlugin的插件可以从chunk中抽离出css文件，再加入文件列表

[不错的参考](https://blog.csdn.net/trust_future99/article/details/111817316)



## Loader && Plugin的不同

```
While loaders are used to transform certain types of modules, plugins can be leveraged to perform a wider range of tasks like bundle optimization, asset management and injection of environment variables.
```

loader专注于文件transform

transform意味着啥？

- 搞定不属于原生js模块的，css，图片等，变为js代码
- 压缩，降级与翻译

从webpack的流程来看，loader只在一部分时间起作用

plugins利用webpack生命周期中的事件，完成更多的任务，在整个流程中起作用～

如

- 分析打包情况
- 减少重复性html创建与文件删除拷贝



## 按需加载

https://webpack.wuhaolin.cn/4%E4%BC%98%E5%8C%96/4-12%E6%8C%89%E9%9C%80%E5%8A%A0%E8%BD%BD.html



首次看到的，不需要按需

在某些交互产生了，进行加载，如

- router切换
- 按钮

```js
window.document.getElementById('btn').addEventListener('click', function () {
  // 当按钮被点击后才去加载 show.js 文件，文件加载成功后执行文件导出的函数
  import(/* webpackChunkName: "show" */ './show').then((show) => {
    show('Webpack');
  })
});
```

```js
module.exports = {
  // JS 执行入口文件
  entry: {
    main: './main.js',
  },
  output: {
    // 为从 entry 中配置生成的 Chunk 配置输出文件的名称
    filename: '[name].js',
    // 为动态加载的 Chunk 配置输出文件的名称
    chunkFilename: '[name].js',
  }
};
```

https://zhuanlan.zhihu.com/p/159216534

底层实现的逻辑是通过Promise包装的**JSONP**, or **JSON-P** (JSON with Padding)

