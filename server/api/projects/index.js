'use strict';

var express = require('express');
var controller = require('./projects.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/files', controller.files);
router.get('/new', controller.newRepo);
router.post('/commit', controller.commit);
router.get('/branches', controller.getBranches);
router.get('/createbranch', controller.createBranch);
router.get('/templates', controller.getTemplates)

module.exports = router;