/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var passport = require('passport');
var compression = require('compression');
var swig  = require('swig');

var connect = require('connect'); // include connect middleware: https://www.npmjs.org/package/connect
var brackets = require('brackets'); // include brackets web module: https://www.npmjs.org/package/brackets

// files for Nimble code editor
var env = require( "./lib/environment" ),
    middleware = require( "./lib/middleware");


module.exports = function(app) {
  var env = app.get('env');

  // Nimble
  app.set('views', config.root + '/brackets-overrides');
  // app.set('views', config.root + '/server/views');
  app.engine('html', swig.renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());


  app.use(connect()); // BEST GUESS...
  app.use('/brackets', brackets()); // BEST GUESS...

  //Nimble
  app.use( middleware.errorHandler );
  // app.use( middleware.fourOhFourHandler );

  // Setup static route to serve Nimble/Brackets on "/" (root of the server).
  app.use( "/nimble", express.static(path.join(config.root, './nimble/src')) );
  // External libraries that we want to expose for Nimble/Brackets e.g. Extensions.
  app.use( "/thirdparty", express.static(path.join(config.root, './bower_components')) );
  // This route is exposed for extension loading (see makedrive-sync-icon in ExtensionLoader.js)
  app.use( "/extensions/default/", express.static(path.join(config.root, './bower_components')) );


  app.use(passport.initialize());
  if ('production' === env) {
    // app.use(favicon(path.join(config.root, 'client/components', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', config.root + '/client');
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', 'client');
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};