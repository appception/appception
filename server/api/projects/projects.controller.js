'use strict';

var _ = require('lodash');
// var AdmZip = require('adm-zip');
var zlib = require('zlib');
var fs = require('fs');
var fstream = require('fstream');
var unzip = require('unzip');
var request = require('request');
var Projects = require('./projects.model');
var token = require('../../auth/github/passport');

var GitHubApi = require("github");

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true
    // protocol: "https",
    // host:  "http",
    // pathP refix: "/api/v3", // for some GHEs
    // timeout: 5000
});


// get
github.authenticate({
    type: "oauth",
    key: process.env.GITHUB_ID,
    secret: process.env.GITHUB_SECRET
});


// Get list of projects
exports.index = function(req, res) {
  // console.log(req)
  var githubLogin = req.query.githubLogin;
  console.log('inside projects.index', githubLogin)

  github.repos.getFromUser({ user: githubLogin }, function(err, data) {
    if(err){  console.log("projects.controller.js: get all repos error", err); }
    console.log("projects.controller.js: get all repos success")
    return res.json(data)
  });

};

// Get a single projects files
exports.files = function(req, res) {
    console.log('inside projects.files')
  var githubLogin = req.query.githubLogin;
  var githubRepo = req.query.githubRepo;

  // Get the url for the requested repo zip archive
  github.repos.getArchiveLink({
    user: githubLogin,
    repo: githubRepo,
    archive_format: 'zipball'
  }, function(err, data) {
    if(err) {
      console.log('projects.controller.js: get files error', err)
    }
    console.log('projects.controller.js: get files success')

    var file = data.meta.location;

    // if we wanted to let users pick a different branch to look at we can change 'master' here
    file = file.replace(/:ref/g, 'master')

    var filePath = 'server/tempfiles/' + githubRepo + '.zip';

    // Download the zip file from the given url and write it to a temporary folder in the server. Then unzip the file and save the outcome to the same temp folder.
    request.get({
      url: file,
      encoding: null
    }, function(err, resp, body) {
      if(err) throw err;
      fs.writeFile(filePath, body, function(err) {
        console.log("file written!");
        fs.createReadStream(filePath).pipe(unzip.Parse())
          .pipe(fstream.Writer('server/tempfiles/'));

        return res.json({
          zipFile: filePath
          })
      });
    });

  })
};


// Create a new repo
exports.newRepo = function(req, res) {
  console.log('inside server new repo')
  var githubLogin = req.query.githubLogin;
  var repoName = req.query.repoName;

  console.log('token.token', token.token)
  github.authenticate({
      type: "oauth",
      token: token.token
  });

  // passport.authenticate('github')

  github.repos.create({
    name: repoName,
    auto_init: true
  }, function(err, res) {
    if(err) {
      console.log('projects.controller.js: create repo error', err, res)
    }else {
      console.log('projects.controller.js: create repo success')
      console.log('res: ', res)
    }
  })
}

// // Creates a new projects in the DB.
// exports.create = function(req, res) {
//   Projects.create(req.body, function(err, projects) {
//     if(err) { return handleError(res, err); }
//     return res.json(201, projects);
//   });
// };

// // Updates an existing projects in the DB.
// exports.update = function(req, res) {
//   if(req.body._id) { delete req.body._id; }
//   Projects.findById(req.params.id, function (err, projects) {
//     if (err) { return handleError(res, err); }
//     if(!projects) { return res.send(404); }
//     var updated = _.merge(projects, req.body);
//     updated.save(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.json(200, projects);
//     });
//   });
// };

// // Deletes a projects from the DB.
// exports.destroy = function(req, res) {
//   Projects.findById(req.params.id, function (err, projects) {
//     if(err) { return handleError(res, err); }
//     if(!projects) { return res.send(404); }
//     projects.remove(function(err) {
//       if(err) { return handleError(res, err); }
//       return res.send(204);
//     });
//   });
// };

function handleError(res, err) {
  return res.send(500, err);
}