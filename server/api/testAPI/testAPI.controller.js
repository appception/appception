'use strict';

var _ = require('lodash');
var Testapi = require('./testAPI.model');

// Get list of testAPIs
exports.index = function(req, res) {
  Testapi.find(function (err, testAPIs) {
    console.log('res = ', res); // print result in test
    if(err) { return handleError(res, err); }
    return res.json(200, testAPIs);
  });
};

// Get a single testAPI
exports.show = function(req, res) {
  Testapi.findById(req.params.id, function (err, testAPI) {
    if(err) { return handleError(res, err); }
    if(!testAPI) { return res.send(404); }
    return res.json(testAPI);
  });
};

// Creates a new testAPI in the DB.
exports.create = function(req, res) {
  Testapi.create(req.body, function(err, testAPI) {
    if(err) { return handleError(res, err); }
    return res.json(201, testAPI);
  });
};

// Updates an existing testAPI in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Testapi.findById(req.params.id, function (err, testAPI) {
    if (err) { return handleError(res, err); }
    if(!testAPI) { return res.send(404); }
    var updated = _.merge(testAPI, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, testAPI);
    });
  });
};

// Deletes a testAPI from the DB.
exports.destroy = function(req, res) {
  Testapi.findById(req.params.id, function (err, testAPI) {
    if(err) { return handleError(res, err); }
    if(!testAPI) { return res.send(404); }
    testAPI.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}