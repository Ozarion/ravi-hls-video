const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressHbs = require('express-handlebars');

const indexRouter = require('./routes/index');
const uploadRouter = require('./routes/uploads');
const accountRouter = require('./routes/accounts');

const accService = require('./services/accountService');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.engine('hbs', expressHbs({
  extname:'.hbs'
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// set static files path
app.use(express.static(path.join(__dirname, 'public')));

// Authorization middleware
app.use((req,res, next)=> {
  // get authToken from cookies
  const authToken = req.cookies['AuthToken'];

  // Inject the user to the request
  req.user = accService.authTokens[authToken];
  next();
});

// mount routes
app.use('/', indexRouter);
app.use('/uploads', uploadRouter);
app.use('/accounts', accountRouter);

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
