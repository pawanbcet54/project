var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var fs = require('fs');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var cron = require('./config/cronJob.js');
var cors = require('cors');

var app = express();
app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Create application config
var configPath = path.join(__dirname, 'config.json')
var data = fs.readFileSync(configPath);
jsonData = JSON.parse(data);
var requiredKeys = Object.keys(jsonData);
for (var i = 0; i < requiredKeys.length; i++) {
  var key = requiredKeys[i];
  var val = jsonData[requiredKeys[i]];
  process.env[key] = val;
};
mongoose.connect(process.env.dbConnectionString, { useNewUrlParser: true })
  .then(function (connection) {
    console.log('DB Connection established successfully');
  })
  .catch(function (error) {
    console.log('DB Coonection has error: ' + error);
  });

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
/* This is no more required as expiration is setup in db itself
cron.cleanupDB(process.env.ThresholdTime);
*/
module.exports = app;
