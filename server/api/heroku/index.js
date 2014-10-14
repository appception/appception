'use strict';

var express = require('express');
var controller = require('./heroku.controller');

var router = express.Router();

// get list of apps
router.get('/', controller.index);

// create new app
router.post('/createApp', controller.create);

// update existing app
router.post('/updateApp', controller.update);

// get info about user's account
router.get('/accountInfo', controller.account);

module.exports = router;