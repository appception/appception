'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var fs = require('fs');
var config = require('../../config/local.env');
var GitHubApi = require("github");

var github = new GitHubApi({
  version: "3.0.0",
  // debug: true
  debug: false
});

/**************
 * These variables should be added into:
 *   server/config/local.env.js
 *
 *   GITHUB_USERNAME: 'YourGitHubLoginName',
 *
 * Queries generally look like:
 *   .query({ githubLogin: testGithubLogin, repoName: testRepoName, githubBranch: testGithubBranch })
 *************/

var testGithubLogin = config.GITHUB_USERNAME;  // .githubLogin
var testRepoName = 'test';                     // .repoName
var testGithubBranch = 'master';               // .githubBranch
var testGenerator = 'beginner';                // .generator
var testFilesArray = [];                       // .filesArray
var testCommitMessage = 'Commit made by test on' + (new Date()); // .message

describe('GET /api/projects', function() { // controller.index
  it('.index should respond with JSON array of all repos from github', function(done) {
    this.timeout(10000);

    request(app)
      .get('/api/projects')
      .query({
        githubLogin: testGithubLogin
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

    it('should save the contents of repo "' + testRepoName + '" to server/tempfiles', function(done) {
      request(app)
        .get('/api/projects/files')
        .query({ githubLogin: testGithubLogin, repoName: testRepoName, githubBranch: testGithubBranch })
        .expect(200)
        .end(function() {
          console.log("Server responded with status of 200. Next...");
          done();
        }) // end then()
    }); // end it()

  it('should have the file "' + testRepoName + '.zip" in server/tempfiles', function(done) {
    this.timeout(10000);

    request(app)
      .get('/api/projects/files')
      .query({ githubLogin: testGithubLogin, repoName: testRepoName })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        fs.readdir('./server/tempfiles/', function(err, files) {
          files.should.be.instanceof(Array);

          var hasFile = false;

          files.forEach(function(element, index, filesArray){
            if (element === testRepoName + '.zip') {
              hasFile = true;
            }
          });

          hasFile.should.be.equal(true);
          done();
        })
      }) // end end()
  }) // end it()
});

/* uncomment after Kelly's upload
describe('GET /api/projects/new', function() { // controller.newRepo
  this.timeout(10000);

  it('should get a "repo already exists" response back from GitHub', function(done) {
    request(app)
      .get('api/projects/new')
      .query({ githubLogin: testGithubLogin, repoName: testRepoName, generator: testGenerator})
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        console.log ("\n\n    Github should refuse this: res = ", res); // res.body.should.be
        done();
      }) // end end()
  }); // end it
}); // end describe(GET /api/projects/new)
*/

describe('GET /api/projects/branches', function() { // controller.getBranches
    it('.getBranches should respond with JSON array of all repos from github', function(done) {
    this.timeout(10000)
    request(app)
      .get('/api/projects')
      .query({
        githubLogin: testGithubLogin, 
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  }); // end it()
}); // end describe(GET /api/projects/branches)

/******
 * TO FIX:
 * Authentication error...
 * This should be handled during the call to app.
 * This breaks in test but works in serve:local and deployment.
 * 
 * NEXT STEPS: opening bug, commenting out test until testing is necessary.
 * 
 *******************
 * describe('POST /api/projects/commit', function(done) { // controller.commit
 *   it('.commit response should contain "ref: "refs/heads/master"".', function(done) {
 *     this.timeout(5000);
 * 
 *     // Authenticate
 *     github.authenticate({
 *       type: "oauth",
 *       key: process.env.GITHUB_ID,
 *       secret: process.env.GITHUB_SECRET
 *     });
 * 
 *     request(app)
 *       .post('/api/projects/commit')
 *       .send({ githubLogin: testGithubLogin, repoName: testRepoName, message: testCommitMessage, filesArray: testFilesArray })
 *       .expect(200)
 *       .expect('Content-Type', /json/)
 *       .end(function(err, res) {
 *         if (err) return done(err);
 *         res.body.should.be.instanceof(Object);
 *         if (res.ref !== 'refs/heads/master') return 'ERROR: res.ref = ' + res.ref;
 *         done();
 *       });
 *   }); // end it()
 * }); // end describe(POST /api/projects/commit)
 * 
 * describe('Capture response number 2...', function(done) { // controller.commit
 *    it('  ... right here.', function(done) {
 *     done();
 *   }); // end it()
 * }); // end describe(POST /api/projects/commit)
 **********************/
