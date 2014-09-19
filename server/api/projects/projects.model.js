'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectsSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Projects', ProjectsSchema);