'use strict';

var _ = require('lodash');
var Deploy = require('./deploy.model');
var Heroku = require('heroku-client'),
    // heroku = new Heroku({ token: HEROKU_API_TOKEN });

 
// Get list of all heroku apps
exports.index = function(req, res) {
  heroku.apps().list(function (err, apps) {
     return res.json(apps)
  });
};

// Creates a new heroku app
exports.create = function(req, res) {
  console.log('create app api');
  var attributes = {"source_blob":{"url":"https://github.com/wykhuh/heroku/archive/master.tar.gz"}};
  var callback = function(message){console.log('new app created', message)}
  heroku.appSetups().create(attributes, callback);
};

// Updates an existing heroku app
exports.update = function(req, res) {
  console.log('update app api');
  var app="vast-fortress-4388";
  var attributes = {"source_blob":{"url":"https://github.com/wykhuh/heroku/archive/master.tar.gz", "version": "3"}};
  var callback = function(message){console.log(' app updated', message)}
  heroku.apps(app).builds().create(attributes, callback);
};


function handleError(res, err) {
  return res.send(500, err);
}