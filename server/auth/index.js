'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var User = require('../api/user/user.model');

// Passport Configuration
require('./local/passport').setup(User, config);
require('./github/passport').setup(User, config);

var router = express.Router();

router.use('/local', require('./local'));
router.use('/github', require('./github'));

module.exports = router;