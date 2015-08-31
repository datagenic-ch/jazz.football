var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var flash    = require('connect-flash');
var debug = require('debug')('jazz.football:server');
var controllers = {};
var app = express();

// =====================================
// CONFIGURATION BY ENVIRONMENT
// =====================================
if (app.get('env') === 'development') {
  debug('Running in development mode');
  var configDB = require('./config/database-dev.js');
  var configAuth = require('./config/auth.js');
} else {
  debug('Running in production mode');
  configDB = require('./config/database.js');
  configAuth = require('./config/auth-dev.js');
}

// =====================================
// CONFIGURATION
// =====================================
debug('Connecting to '+configDB.url);
mongoose.connect(configDB.url); // connect to our database
require('./config/passport')(passport, configAuth); // pass passport for configuration

// =====================================
// CONTROLLERS
// =====================================
require('./controllers/user')(controllers);
require('./controllers/game')(controllers);
require('./controllers/competition')(controllers);
require('./controllers/gamecard-lms')(controllers);
require('./controllers/fixture')(controllers);
require('./controllers/admin')(controllers);

// =====================================
// VIEW ENGINE
// =====================================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// =====================================
// PASSPORT
// =====================================
app.use(session({ secret: 'ynwajazzfootballisthebest' ,
  saveUninitialized: true,
  resave: true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// =====================================
// ROUTING
// =====================================
require('./routes/routes.js')(express, app, passport);
require('./routes/controllers.js')(app, controllers);
require('./routes/admin.js')(app, controllers);
require('./routes/error.js')(express, app);  // Catch all error handling


module.exports = app;
