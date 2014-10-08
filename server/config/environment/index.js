'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,
  // printProcessInfo: (function() {console.log("process: ", process);
  //                         // console.log("\n\nenv: ", env);
  //                         })(),

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  serverRoot: process.env.SERVER_ROOT || 'server/',

  // Server port
  port: process.env.PORT || 9000,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'appception-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  github: {
    clientID:     process.env.GITHUB_ID || 'b000475dfa18e133e84b',
    clientSecret: process.env.GITHUB_SECRET || '623daa76e878008111f88e15446017239fc9219c',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/github/callback'
  },

  heroku: {
    clientID:     process.env.HEROKU_ID || '9ef1cb31-aa27-4515-bfb6-761d28dbfc5a',
    clientSecret: process.env.HEROKU_SECRET || '5c61d9d2-0a25-406b-9cb7-0be2f3d2792c',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/heroku/callback'
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});