'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var fs = require('fs');
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
var branchName = 'master';
var testGenerator = 'beginner';

describe('GET /api/projects', function() { // controller.index
  it('.index should respond with JSON array of all repos from github', function(done) {
    this.timeout(10000)
    request(app)
      .get('/api/projects')
      .query({
        githubLogin: githubUsername
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  }); // end it()
}); // end describe()

describe('GET /api/projects/files', function() { // controller.files
    this.timeout(10000);

    it('should save the contents of repo "' + repoName + '" to server/tempfiles', function(done) {
      request(app)
        .get('/api/projects/files')
        .query({ githubLogin: githubUsername, githubRepo: repoName, githubBranch: branchName })
        .expect(200)
        .end(function() {
          console.log("Server responded with status of 200. Next...");
          done();
        }) // end then()
    }); // end it()

  it('should have the file "' + repoName + '.zip" in server/tempfiles', function(done) {
    request(app)
      .get('/api/projects/files')
      .query({ githubLogin: githubUsername, githubRepo: repoName })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        fs.readdir('./server/tempfiles/', function(err, files) {
          files.should.be.instanceof(Array);

          var hasFile = false;

          files.forEach(function(element, index, filesArray){
            if (element === repoName + '.zip') {
              hasFile = true;
            }
          });

          hasFile.should.be.equal(true);
          done();
        })
      }) // end end()
  }) // end it()
});

describe('GET /api/projects/new', function() { // controller.newRepo
  it('should get a "repo already exists" response back from GitHub', function(done) {
    request(app)
      .get('api/projects/new')
      .query({ githubLogin: githubUsername, githubRepo: repoName, generator: testGenerator})
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log ("\n\n    Github should refuse this: res = ", res); // res.body.should.be
        done();
      }) // end end()
  }); // end it
}); // end describe(GET /api/projects/new)

describe('POST /api/projects/commit', function() { // controller.commit
}); // end describe(POST /api/projects/commit)

describe('GET /api/projects/branches', function() { // controller.getBranches
}); // end describe(GET /api/projects/branches)

describe('GET /api/projects/createBranch', function() { // controller.createBranch
}); // end describe(GET /api/projects/createBranch)




/*
  Functions inside projects.controller.js:

.authenticate
.index
.files
.newRepo
.commit
.addFileToRepo
.handleError
.doesUserHaveUserPage
.getBranches
.createBranch
.recursivelyGetFileNames
.createBranchHelper
.createCommitHelper
*/


/**********************
 *    Test object "this":

 {
  title: 'GET /api/projects/files',
  ctx: {},
  suites: [],
  tests: [],
  pending: false,
  _beforeEach: [],
  _beforeAll: [],
  _afterEach: [],
  _afterAll: [],
  root: false,
  _timeout: 10000,
  _slow: 75,
  _bail: undefined,
  parent:
   { title: '',
     ctx: {},
     suites: [ [Object], [Object], [Object], [Object], [Circular] ],
     tests: [],
     pending: false,
     _beforeEach: [],
     _beforeAll: [],
     _afterEach: [],
     _afterAll: [],
     root: true,
     _timeout: 2000,
     _slow: 75,
     _bail: undefined,
     _events: { 'pre-require': [Object] } } }

 *****************/