var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const loginHandle = require('./Authenticate/Login').loginHandle
const cors = require('cors')
const api = require('./Routes/Api')
const auth = require('./Authenticate/Auth')
var app = express()
var bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/static', express.static('uploadResults'))
app.post('/login', loginHandle)
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
});

app.use('/api', auth, api)

module.exports = app