const express = require('express')
const app = express()

app.get('/request', (req, res) => {
  res.end('request success')
})

app.listen(8002)
