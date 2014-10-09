'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var config = require('../../config/local.env');

/**************
 * These variables should be added into:
 *   server/config/local.env.js
 *
 *   GITHUB_USERNAME: 'YourGitHubUserName',
 *   GITHUB_PASSWORD: 'POSSIBLY YourGitHubPassword',
 *************/
var githubUsername = config.GITHUB_USERNAME;
var repoName = 'test';

describe('GET /api/heroku', function() {
  this.timeout(4000); // increase timeout, though this should clock in around 750ms...

  it('MUST be replaced with a real test!', function(done) {
    request(app)
      .get('/api/heroku')
      // .query({ githubLogin: githubUsername, githubRepo: repoName, githubBranch: branchName })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        // console.log('GET api/heroku res = ', res);
        //res.body.should.be.instanceof(Object);
        done();
      });
  });
}); // end describe GET /api/heroku

describe('Create a new app: POST /api/heroku.createApp', function() {

  it('MUST be replaced with a real test!', function(done) {
    request(app)
      .post('/api/heroku/createApp')
      .query({ githubLogin: githubUsername, githubRepo: repoName })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        console.log('  /api/heroku.createApp res = ', res);
        if (err) return done(err);
        // expect(res).to.be.equal('undefined')
        res.body.should.be.instanceof(String);
        done();
      }); // end end()
  });
}); // end describe GET /api/heroku.createApp

describe('GET /api/heroku.update', function() {

// update existing app
  it('MUST be replaced with a real test!', function(done) {
    request(app)
      .post('/api/heroku/updateApp')
      .query({ githubLogin: githubUsername, githubRepo: repoName })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        console.log('  /api/heroku.update res = ', res);
        if (err) return done(err);
        expect(res).to.be.equal('undefined')
        // res.body.should.be.instanceof(Object);
        done();
      }); // end end()
  });
}); // end describe GET /api/heroku.update
