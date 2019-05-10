var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const bodyParser = require('body-parser')

var indexRouter = require('./routes/index')
const dataRouter = require('./routes/data')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'dist')))

app.use('/', indexRouter)
app.use('/data', dataRouter)

module.exports = app
