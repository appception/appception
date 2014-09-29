/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var connect = require('connect'); // include connect middleware: https://www.npmjs.org/package/connect
var brackets = require('brackets'); // include brackets web module: https://www.npmjs.org/package/brackets
var express = require('express');
var path = require('path');
var config = require('./config/environment');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/projects', require('./api/projects'));
  app.use('/api/projects/files', require('./api/projects'))
  app.use('/api/testAPI', require('./api/testAPI'));
  app.use('/api/users', require('./api/user'));
  app.use('/auth', require('./auth'));

  app.use(connect()); // BEST GUESS...
  app.use('/brackets', brackets()); // BEST GUESS...

  // app.get('/nimble', function(req, res){
  //   res.send('Hello World');
  // });

  // External libraries that we want to expose for Nimble/Brackets e.g. Extensions.
  app.use( "/thirdparty", express.static(path.join(config.root, './bower_components')) );
  // Setup static route to serve Nimble/Brackets on "/nimble"
  app.use( "/nimble", express.static(path.join(config.root, './nimble/src')) );
  // This route is exposed for extension loading (see makedrive-sync-icon in ExtensionLoader.js)
  app.use( "/extensions/default/", express.static(path.join(config.root, './bower_components')) );

  console.log(path.join(config.root, './nimble/src'))


  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  app.route('/nimble')
    .get(function(req, res) {
      console.log()
      res.sendfile(app.get('appPath') + '/nimble/src');
    });

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
