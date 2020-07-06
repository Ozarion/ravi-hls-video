const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressHbs = require('express-handlebars');

const indexRouter = require('./routes/index');
const videoRouter = require('./routes/videos');
const accountRouter = require('./routes/accounts');
const settingRouter = require('./routes/settings');

const accService = require('./services/accountService');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

// setup handlebar template engine
var hbs = expressHbs.create({
  defaultLayout: "main",
  extname: ".hbs",
  helpers: {
    section: function(name, options) {
      if (!this._sections) { this._sections = {}; }
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});
app.engine('hbs', hbs.engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// set static files path
app.use(express.static(path.join(__dirname, 'public')));

// Rpites Authorization and mounting
app.use((req,res, next)=> {
  // get authToken from cookies
  const authToken = req.cookies['AuthToken'];

  // Inject the user to the request
  req.user = accService.authTokens[authToken];
  next();
});
app.use('/accounts', accountRouter);
app.use((req, res, next) => {
  if (!req.user) {
    res.redirect('/accounts/login');
  }
  next();
});
app.use('/', indexRouter);
app.use('/videos', videoRouter);
app.use('/settings', settingRouter);

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
