const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()

// 设置静态资源
app.use(express.static(__dirname))

// 使用代理
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:8002',
    pathRewrite: {
      '^/api': '', // 重写路径
    },
    changeOrigin: true,
  })
)

app.listen(8001)
