'use strict';

var express = require('express');
var controller = require('./projects.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/files', controller.files);
router.get('/new', controller.newRepo);
router.get('/commit', controller.commit);

module.exports = router;