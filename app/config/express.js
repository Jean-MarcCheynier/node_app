/**
 * Express configuration
 */

'use strict';

var express = require('express');
var cors = require('cors');
var favicon = require('serve-favicon');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan = require('morgan');

var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var session = require('express-session');

module.exports = function(app) {
  var env = app.get('env');

  app.set('views', config.root + '/app/views');
  app.set('view engine', 'pug');
  app.set('view options', { layout: false });
  app.set('superSecret', config.secrets.superSecret);
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.use(compression());
  app.use(morgan('dev')); // log every request to the console
  app.use(express.json()) // for parsing application/json
  app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(cors());

  // required for passport
  app.use(passport.initialize()); 

  if ('production' === env) {
    app.use(express.static(path.join(config.root, 'app/public')));
    app.use(express.static(path.join(config.root, 'node_modules')));
    app.set('appPath', path.join(config.root, 'app/public'));
    app.use(errorHandler()); // Error handler - has to be last
  }

  if ('development' === env || 'test' === env) {
    app.use(express.static(path.join(config.root, 'app/public')));
    app.use(express.static(path.join(config.root, 'node_modules')));
    app.set('appPath', path.join(config.root, 'app/public'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};
