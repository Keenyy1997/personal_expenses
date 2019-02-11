const express = require('express')

const app = express()
const bodyParser = require('body-parser')
var path = require('path');
var serveStatic = require('serve-static');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/api", require(__dirname + "/src/server"))

app.use("/", serveStatic(path.join(__dirname, '/dist')))
app.get('*', function(req, res) {
    res.sendFile(__dirname + '/dist/')
})

const port = 8080;

app.listen(port, () => {
    console.log('Listening on port:8080');
})