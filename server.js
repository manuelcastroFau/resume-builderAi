const express = require('express')
const bodyParser = require("body-parser");

const app = express()
app.use(express.static(__dirname + "/public"));

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
  });

app.get('/', function (req, res) {
  res.sendFile("/index.html");
})

app.get('/manuel', function (req, res) {
    res.send('Hello Manuel')
  })

const PORT = 3000 || process.env.PORT
console.log("Server running in port: ",PORT)
app.listen(3000)