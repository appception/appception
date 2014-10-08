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

  // for cleaning function:
var tempfilesPath = "./server/tempfiles/";
var fs = require('fs');

// files for Nimble code editor
var env = require( "./lib/environment" ),
    middleware = require( "./lib/middleware");

module.exports = function(app) {
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());


  app.use(passport.initialize());
  if ('production' === env) {
    // app.use(favicon(path.join(config.root, 'client/components', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', config.root + '/client');
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', 'client');
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }

  var cleanTempfiles = function() {
    var currentTempfiles = fs.readdirSync(tempfilesPath); // reads files in 'server/tempfiles', returns array of files

    if (currentTempfiles) {
      currentTempfiles.forEach(function(element, index, thisArray){
        var filePath = tempfilesPath + element;
        fs.unlink(filePath, function (err) {
          if (err) console.log("Error : " + err);
          console.log('successfully deleted : '+ filePath);
        }); // end fs.unlink
      }) // end forEach()
    }
  }; // end cleanTempfiles

  setInterval(cleanTempfiles, 43200000); // calls cleanTempfiles every 12 hours
  // setInterval(cleanTempfiles, 5000); // calls cleanTempfiles every 5 seconds
};