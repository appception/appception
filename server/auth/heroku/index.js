'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router
  .get('/', passport.authenticate('heroku', {
    scope: ['global'],
    failureRedirect: '/signup',
    session: false
  }))

  .get('/callback', passport.authenticate('heroku', {
    failureRedirect: '/signup',
    session: false
  }), auth.setDeployTokenCookie);

module.exports = router;