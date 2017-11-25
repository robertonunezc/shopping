let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let expressHbs = require('express-handlebars');
let session = require('express-session');
let passport = require('passport');
let validator = require('express-validator');
let flash = require('connect-flash');

let index = require('./routes/index');
let users = require('./routes/users');

let app = express();

require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(validator());

app.use(session({
    secret: 'mycodesecret',
    resave: false,
    saveUninitialized: false,
    //guardando la session en la BD
   // store: new (require('connect-pg-simple')(session))(),
    cookie: { maxAge: 180 * 60 * 1000}
}));
app.use(flash());

//config d passport
app.use(passport.initialize());
app.use(passport.session());

//creando un middleware
app.use(function (req, res, next) {
    //para agregar la variable login y session a todas los view(.hbs)
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});


app.use('/', index);
app.use('/user', users);

app.use(express.static(path.join(__dirname, 'public')));



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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
