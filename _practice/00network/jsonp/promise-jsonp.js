const jsonp = (initalUrl, cbName, data) =>
  new Promise((resolve, reject) => {
    // 初始化请求url和节点
    let url = `${initalUrl}?cb=${cbName}`
    for (const key in data) {
      url += `&${key}=${data[key]}`
    }
    const jsNode = document.createElement('script')
    jsNode.src = url

    // 全局添加cb
    // 可以做防冲突处理 不过服务端也要适配一下
    window[cbName] = result => {
      delete window[cbName]
      jsNode.remove()
      if (result) {
        resolve(result)
      } else {
        reject('没有返回数据')
      }
    }
    // 监听请求异常情况
    jsNode.addEventListener('error', () => {
      delete window[cbName]
      jsNode.remove()
      reject('资源请求失败')
    })

    // 节点添加，开始请求
    document.body.append(jsNode)
  })
