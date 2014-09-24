'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var fs = require('fs');

describe('GET /api/projects', function() {

  it('should respond with JSON array from github', function(done) {
    this.timeout(10000)
    request(app)
      .get('/api/projects')
      .query({githubLogin: 'kwalker3690'})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

});

describe('GET /api/projects/files', function() {

  it('should save the contents of a repo to a folder in server/tempfiles', function(done) {
    this.timeout(20000)
    request(app)
      .get('/api/projects/files')
      .query({githubLogin: 'kwalker3690', githubRepo: 'kwalker3690.github.io'})
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        fs.readdir('./server/tempfiles/kwalker3690-kwalker3690.github.io-9702cc0/', function(err, files) {
          files.should.be.instanceof(Array);
          files[0].should.equal('README.md')
          done();
        })
      })
  })

});

/*

make call to github

get json back from github


*/