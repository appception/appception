'use strict';

var _ = require('lodash');
var herokuToken = require('../../auth/heroku/passport');
var Heroku = require('heroku-client');

// Get list of all heroku apps
exports.index = function(req, res) {
  console.log('list all app api', herokuToken.herokuToken );

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
  var githubRepo = req.query.repoName;
  var appName = githubLogin + '-' + githubRepo;
  var attributes = {"source_blob":{"url":"https://github.com/" + githubLogin + "/" + githubRepo + "/archive/heroku.tar.gz"},
                    "app": {"name": appName } };

  var callback = function(){
    res.send('new app created')
    return console.log('new app created'); // making this a return so the server can capture it and we can test it.
  }

  // console.log('create new attributes', attributes);

  heroku.appSetups().create(attributes, callback);
};

// Updates an existing heroku app
exports.update = function(req, res) {
  console.log('update app api');

  var heroku = new Heroku({ token: herokuToken.herokuToken  });
  var githubLogin = req.query.githubLogin;
  var githubRepo = req.query.repoName;
  var appName = githubLogin + '-' + githubRepo;
  var attributes = {"source_blob":{"url":"https://github.com/" + githubLogin + "/" + githubRepo + "/archive/heroku.tar.gz"},
                    "app": {"name": appName } };
 
  var callback = function(){
    res.send('app updated');
    return console.log('app updated'); // making this a return so the server can capture it and we can test it.
  };
   console.log('update app attributes', attributes);

  heroku.apps(appName).builds().create(attributes, callback);
};


exports.account = function(req, res) {

  var heroku = new Heroku({ token: herokuToken.herokuToken  });

  heroku.account().info(function (err, info) {
     return res.json(info)
  });
};

// Updates an existing heroku app. 
// This method is used by server-side controllers. 
exports.updateServerSide = function(githubLogin, githubRepo) {
  console.log('update app api');

  var heroku = new Heroku({ token: herokuToken.herokuToken  });
  var appName = githubLogin + '-' + githubRepo;
  var attributes = {"source_blob":{"url":"https://github.com/" + githubLogin + "/" + githubRepo + "/archive/heroku.tar.gz"},
                    "app": {"name": appName } };
 
  var callback = function(){
    return console.log('app updated server side'); // making this a return so the server can capture it and we can test it.
  };
   console.log('update app attributes server side', attributes);

  heroku.apps(appName).builds().create(attributes, callback);
};


function handleError(res, err) {
  return res.send(500, err);
}