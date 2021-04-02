const express = require('express')

const app = express()

// 设置静态资源
app.use(express.static(__dirname))

app.listen(8000, () => {
  console.log(`http://localhost:8000`)
})
