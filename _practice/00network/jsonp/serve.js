const express = require('express')

const app = express()

function fooFn(args) {
  return {
    raw: args,
    foo: 'happy',
  }
}

app.get('/jsonp', (req, res) => {
  console.log(req.query)
  const { cb } = req.query
  const args = {}
  for (const key in req.query) {
    if (key !== 'cb') {
      args[key] = req.query[key]
    }
  }
  res.setHeader('Content-type', 'application/json')
  if (cb === 'fooFn') {
    res.send(`${cb}(${JSON.stringify(fooFn(args))})`)
  }
})

app.listen(8001, () => {
  console.log(`http://localhost:8001`)
})
