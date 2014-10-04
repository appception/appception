'use strict';

var _ = require('lodash');
var Deploy = require('./deploy.model');

// Get list of deploys
exports.index = function(req, res) {
  Deploy.find(function (err, deploys) {
    if(err) { return handleError(res, err); }
    return res.json(200, deploys);
  });
};

// Get a single deploy
exports.show = function(req, res) {
  Deploy.findById(req.params.id, function (err, deploy) {
    if(err) { return handleError(res, err); }
    if(!deploy) { return res.send(404); }
    return res.json(deploy);
  });
};

// Creates a new deploy in the DB.
exports.create = function(req, res) {
  Deploy.create(req.body, function(err, deploy) {
    if(err) { return handleError(res, err); }
    return res.json(201, deploy);
  });
};

// Updates an existing deploy in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Deploy.findById(req.params.id, function (err, deploy) {
    if (err) { return handleError(res, err); }
    if(!deploy) { return res.send(404); }
    var updated = _.merge(deploy, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, deploy);
    });
  });
};

// Deletes a deploy from the DB.
exports.destroy = function(req, res) {
  Deploy.findById(req.params.id, function (err, deploy) {
    if(err) { return handleError(res, err); }
    if(!deploy) { return res.send(404); }
    deploy.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}