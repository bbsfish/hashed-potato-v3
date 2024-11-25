// Modules
const express = require('express');
const expressSession = require('express-session');
const createError = require('http-errors');
const logger = require('morgan');
const path = require('path');

// Routers
const indexRouter = require('./routes/index');

/**
 * Application setup
 */
const app = express();

// Use EJS as View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * Logger Argment Passing
 * コマンドライン引数に --log-level のオプションをつけて指定する.
 * ログレベル指定子について: https://expressjs.com/en/resources/middleware/morgan.html
 * 例: "node ./bin/www --log-level tiny"
 */
let logLevel = 'common';
if (process.argv.length > 2) {
  for (let i = 2; i < process.argv.length; i+=2) {
    const arg = process.argv[i];
    if (arg === '--log-level') {
      logLevel = process.argv[i+1];
      break;
    }
  }
}
app.use(logger(logLevel));

// Use Express Session
const session = expressSession({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie:{
    httpOnly: true,
    secure: false,
    maxage: 1000 * 60 * 10  // 10 min
  }
});
app.use(session); 

// Use JSON Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// './public' is path to static files
const dataPath = path.join(__dirname, 'public');
app.use(express.static(dataPath));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
