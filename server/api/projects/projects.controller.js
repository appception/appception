'use strict';

var _ = require('lodash');
var Projects = require('./projects.model');

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

  var githubLogin = req.query.githubLogin;

  github.repos.getFromUser({ user: githubLogin }, function(err, data) {
    if(err){  console.log("projects.controller.js: get all repos error", err); }
    console.log("projects.controller.js: get all repos success")
    return res.json(data)
  });

};

// Get a single projects
exports.show = function(req, res) {
  Projects.findById(req.params.id, function (err, projects) {
    if(err) { return handleError(res, err); }
    if(!projects) { return res.send(404); }
    return res.json(projects);
  });
};

// Creates a new projects in the DB.
exports.create = function(req, res) {
  Projects.create(req.body, function(err, projects) {
    if(err) { return handleError(res, err); }
    return res.json(201, projects);
  });
};

// Updates an existing projects in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Projects.findById(req.params.id, function (err, projects) {
    if (err) { return handleError(res, err); }
    if(!projects) { return res.send(404); }
    var updated = _.merge(projects, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, projects);
    });
  });
};

// Deletes a projects from the DB.
exports.destroy = function(req, res) {
  Projects.findById(req.params.id, function (err, projects) {
    if(err) { return handleError(res, err); }
    if(!projects) { return res.send(404); }
    projects.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}