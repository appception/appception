'use strict';

var _ = require('lodash');
// var AdmZip = require('adm-zip');
var zlib = require('zlib');
var fs = require('fs');
var fstream = require('fstream');
var unzip = require('unzip');
var request = require('request');
var Projects = require('./projects.model');
var token = require('../../auth/github/passport');
var forEachAsync = require('forEachAsync').forEachAsync
    ;

var GitHubApi = require("github");

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true
    // protocol: "https",
    // host:  "http",
    // pathP refix: "/api/v3", // for some GHEs
    // timeout: 5000
});


// get
github.authenticate({
    type: "oauth",
    key: process.env.GITHUB_ID,
    secret: process.env.GITHUB_SECRET
});


// Get list of projects
exports.index = function(req, res) {
  // console.log(req)
  var githubLogin = req.query.githubLogin;
  console.log('inside projects.index', githubLogin)

  github.repos.getFromUser({ user: githubLogin }, function(err, data) {
    if(err){  console.log("projects.controller.js: get all repos error", err); }
    console.log("projects.controller.js: get all repos success")
    return res.json(data)
  });

};

// Get a single projects files
exports.files = function(req, res) {
    console.log('inside projects.files')
  var githubLogin = req.query.githubLogin;
  var githubRepo = req.query.githubRepo;

  // Get the url for the requested repo zip archive
  github.repos.getArchiveLink({
    user: githubLogin,
    repo: githubRepo,
    archive_format: 'zipball'
  }, function(err, data) {
    if(err) {
      console.log('projects.controller.js: get files error', err)
    }
    console.log('projects.controller.js: get files success')

    var file = data.meta.location;

    // if we wanted to let users pick a different branch to look at we can change 'master' here
    file = file.replace(/:ref/g, 'master')

    var filePath = 'server/tempfiles/' + githubRepo + '.zip';

    // Download the zip file from the given url and write it to a temporary folder in the server. Then unzip the file and save the outcome to the same temp folder.
    request.get({
      url: file,
      encoding: null
    }, function(err, resp, body) {
      if(err) throw err;
      fs.writeFile(filePath, body, function(err) {
        console.log("file written!");
        fs.createReadStream(filePath).pipe(unzip.Parse())
          .pipe(fstream.Writer('server/tempfiles/'));

        return res.json({
          zipFile: filePath
          })
      });
    });

  })
};


// Create a new repo
exports.newRepo = function(req, res) {
  console.log('inside server new repo')
  var githubLogin = req.query.githubLogin;
  var repoName = req.query.repoName;

  console.log('token.token', token.token)
  github.authenticate({
      type: "oauth",
      token: token.token
  });

  // Creating a new repo using github node module
  github.repos.create({
    name: repoName,
    auto_init: true
  }, function(err, res) {
    if(err) {
      console.log('projects.controller.js: create repo error', err, res)
    }else {
      console.log('projects.controller.js: create repo success')
      console.log('res: ', res)

      // Once new repo has been created, read the directory that contains the template files.
      fs.readdir('server/api/projects/filetemplates/', function(err, files) {

        // Async read each file name in the array returned.
        forEachAsync(files, function(next, fileTitle, index, array) {
          // Get file contents
          var stream = fs.createReadStream('server/api/projects/filetemplates/' + fileTitle, {
            encoding: 'base64'
          })

          var response = '';
          stream.on('data', function(chunk) {
            response = response + chunk
          })

          stream.on('end', function() {
            // Using github module, create a file on github based on data read from file
            github.repos.createFile({
              user: githubLogin,
              repo: repoName,
              path: fileTitle,
              message: 'Initial Commit for ' + fileTitle,
              content: response,
              committer: {
                "name" : "appception",
                "email" : "appception@gmail.com"
              }
            }, function(err, res) {
              if(err) {
                console.log('projects.controller.js: create file error', err, res)
              }else {
                console.log('projects.controller.js: create file success')
                next()
              }
            })

          })
        }).then(function() {
          console.log('All done!')
        })
      })
    }
  })
}


exports.commit = function(req, res) {
  var githubLogin = req.query.githubLogin;
  var repoName = req.query.repoName;
  var message = req.query.message;

  // Get latest commit sha
  github.gitdata.getReference({
    user: githubLogin,
    repo: repoName,
    ref: 'heads/master'
  }, function(err, res) {
    if(err) {
      console.log('get latest commit sha error', err)
    } else {
      console.log('get latest commit sha success')
      var latestCommitSha = res.object.sha;

      github.gitdata.getCommit({
        user: githubLogin,
        repo: repoName,
        sha: latestCommitSha
      }, function(err, res) {
        if(err) {
          console.log('get info for latest commit error', err)
        } else {
          console.log('get info for latest commit success', res)

          var baseTreeSha = res.tree.sha

          github.authenticate({
            type: "oauth",
            token: token.token
          });

          github.gitdata.createTree({
            user: githubLogin,
            repo: repoName,
            tree: [{
              "path" : "index.html",
              "mode" : "100644",
              "type" : "blob",
              "content":
                "hello"
            }],
            base_tree: baseTreeSha
          }, function(err, res) {
            if(err) {
              console.log('create tree error', err)
            } else {
              console.log('create tree success', res)

              var newTreeSha = res.sha
            }

          })
        }
      })
    }
  })
}


exports.addFiletoRepo = function(githubLogin, repoName, path, message, content, cb, committer) {
  console.log('cb: ', cb)
  if(!committer) {
    committer = {
      "name" : "appception",
      "email" : "appception@gmail.com"
    }
  }

  github.repos.createFile({
    user: githubLogin,
    repo: repoName,
    path: path,
    message: message,
    content: content,
    committer: committer
  }, function(err, res) {
    if(err) {
      console.log('projects.controller.js: create file error', err, res)
    }else {
      console.log('projects.controller.js: create file success')
      console.log('res: ', res)
      cb()
    }
  })
}

function handleError(res, err) {
  return res.send(500, err);
}