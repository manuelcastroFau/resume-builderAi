const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/manuel', function (req, res) {
    res.send('Hello Manuel')
  })

const PORT = 3000 || process.env.PORT
console.log("Server running in port: ",PORT)
app.listen(3000)