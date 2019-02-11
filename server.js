const express = require('express')

const app = express()
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/api", require(__dirname + "/src/server"))

app.use(express.static('dist'))

const port = 8080;

app.listen(port, () => {
    console.log('Listening on port:8080');
})