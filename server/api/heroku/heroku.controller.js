'use strict';

var _ = require('lodash');
var herokuToken = require('../../auth/heroku/passport');
var Heroku = require('heroku-client');

// Get list of all heroku apps
exports.index = function(req, res) {
  var heroku = new Heroku({ token: herokuToken.herokuToken  });

  heroku.apps().list(function (err, apps) {
     return res.json(apps)
  });
};

// Creates a new heroku app
exports.create = function(req, res) {
  console.log('create app api');

  var heroku = new Heroku({ token: herokuToken.herokuToken  });
  var githubLogin = req.query.githubLogin;
  var githubRepo = req.query.githubRepo;
  var appName = githubLogin + '-' + githubRepo;
  var attributes = {"source_blob":{"url":"https://github.com/" + githubLogin + "/" + githubRepo + "/archive/master.tar.gz"},
                    "app": {"name": appName } };
  var callback = function(){
    return console.log('new app created'); // making this a return so the server can capture it and we can test it.
  }

  heroku.appSetups().create(attributes, callback);
};

// Updates an existing heroku app
exports.update = function(req, res) {
  console.log('update app api');

  var heroku = new Heroku({ token: herokuToken.herokuToken  });
  var githubLogin = req.query.githubLogin;
  var githubRepo = req.query.githubRepo;
  var appName = githubLogin + '-' + githubRepo;
  var attributes = {"source_blob":{"url":"https://github.com/" + githubLogin + "/" + githubRepo + "/archive/master.tar.gz"}};
  var callback = function(){
    return console.log(' app updated'); // making this a return so the server can capture it and we can test it.
  };

  heroku.apps(appName).builds().create(attributes, callback);
};


function handleError(res, err) {
  return res.send(500, err);
}