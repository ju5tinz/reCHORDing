var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config({ path: "variables.env" })

var fretstoreRouter = require('./routes/fretstore');
var userRouter = require('./routes/user');
var chordgroupRouter = require('./routes/chordgroup')

var app = express();

// setup mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.DATABASE;
mongoose.connect(mongoDB, { useNewUrlParser: true,  useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client', 'build')))

app.use('/fretstore', fretstoreRouter)
app.use('/user', userRouter)
app.use('/chordgroup', chordgroupRouter)

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);

  // render the error page
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    },
  });
});

module.exports = app;
