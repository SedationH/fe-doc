const express = require('express')
const app = express()

let whileList = ['http://127.0.0.1:5500'] // 设置白名单
app.use((req, res, next) => {
  let origin = req.headers.origin
  console.log(whileList.includes(origin))
  if (whileList.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin) // 设置允许哪个域访问
    res.setHeader('Access-Control-Allow-Methods', 'PUT') // 设置允许哪种请求方法访问
  }
  next()
})

app.put('/request', (req, res) => {
  res.end('server ok')
})

app.listen(8002)