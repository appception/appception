'use strict';

var _ = require('lodash');
var zlib = require('zlib');
var fs = require('fs');
var path = require('path')
var config = require('../../config/environment');
// var fstream = require('fstream');
var unzip = require('unzip');
var request = require('request');
var Projects = require('./projects.model');
var token = require('../../auth/github/passport');
var forEachAsync = require('forEachAsync').forEachAsync;

var GitHubApi = require("github");

var github = new GitHubApi({
  version: "3.0.0",
  debug: true
});

// get
github.authenticate({
  type: "oauth",
  key: process.env.GITHUB_ID,
  secret: process.env.GITHUB_SECRET
});

// Get list of projects
exports.index = function(req, response) {
  var githubLogin = req.query.githubLogin;
  var userPageName = '' + githubLogin + '.github.io';

  // get list of repos
  github.repos.getFromUser({
    user: githubLogin,
    per_page: 100
  }, function(err, data) {
    if (err) {
      console.log("ERROR: projects.controller.js: get all repos", err);
    } // end if (error)
    console.log("SUCCESS: projects.controller.js: get all repos")

    // 'data' is all the data back from GH. Iterate and check for userPageNamme.
    for (var key in data) {
      if (data[key].name === userPageName) { // user has User Page
        return response.json(data);
      } // end if (user has user page)
    } // end for (key in data)

    // We must pass an authentication token before creating the page.
    github.authenticate({
      type: "oauth",
      token: token.token
    });

    // Create the user page if it doesn't exist
    // Creating a new repo using github node module
    github.repos.create({
      name: userPageName,
      auto_init: true
    }, function(err, res) {
      if (err) {
        console.log('ERROR during create User Page', err, res);
      } else {
        console.log('SUCCESS during create User Page, proceeding with Projects page load...');
        return response.json(data);
      } // end else
    }) // end github.repos.create()
  }); // end github.repos.getFromUser()
}; // end index


/**********************
 * Get a single project's files
 *
 * Given a repo name and username [and optional branch name], files() will
 *   1) download a zipped version of the repo from Github.
 *   2) read the zipped file
 *   3) return an object that has the path and content of each file
**********************/
exports.files = function (req, res) {
  var branchToGet = req.query.githubBranch || 'master';
  var githubLogin = req.query.githubLogin;
  var githubRepo = req.query.githubRepo;

  // Get the url for the requested repo zip archive
  github.repos.getArchiveLink({
    user: githubLogin,
    repo: githubRepo,
    archive_format: 'zipball'
    // archive_format: 'tarball'
  }, function (err, data) {
    if (err) {
      console.log('projects.controller.js: get files error', err)
    }
    console.log('projects.controller.js: get files success')

    var file = data.meta.location;
    file = file.replace(/:ref/g, branchToGet) // files to load based on selected branch

    // var filePath = './server/tempfiles/' + githubRepo + '.zip'; // OLD removed code from commit 089ec1686831b023c5609f2d00e569b80d1dadd7
    var filePath = path.normalize(config.serverRoot + 'tempfiles/' + githubRepo + '.zip');

    // Download the zip file from the given url and write it to a temporary folder in the server. Then unzip the file and save the outcome to the same temp folder.
    request.get({
      url: file,
      encoding: null
    }, function (err, resp, body) {
      if (err) throw err;

      var results = [];
      var i = 0;

      fs.writeFile(filePath, body, function (err) {
        if (err) throw err;

        console.log("file written!");
        var r = fs.createReadStream(filePath)
          // unzip file
          .pipe(unzip.Parse())
          //for each item in the zipped file,
          // create an entry object that has path and content properties
          .on("entry", function (e) {
            results.push([]);
            var entry = {};
            entry.path = e.props.path;
            e.on("data", function (c) {
              entry.content = c.toString();
            })
            e.on("end", function () {
              results[i].push(entry);
              i++;
            })
          })
          // when we are done unzipping, return the results
          .on('close', function () {
            return res.send(results)
          })
      });
    });
  })
};


// Create a new repo
exports.newRepo = function (req, response) {
  var githubLogin = req.query.githubLogin;
  var repoName = req.query.repoName;
  var generator = req.query.generator
  var deployment = req.query.deployment;

  github.authenticate({
    type: "oauth",
    token: token.token
  });

  github.repos.create({
    name: repoName,
    auto_init: true
  }, function (err, res) {
    if (err) {
      console.log('projects.controller.js: create repo error', err)
    } else {
      console.log('projects.controller.js: create repo success')

      // Generate an array of all the file names for the generator, including the directories they are within
      var allFiles =  recursivelyGetFileNames('', '', generator)
      var results = [];

      forEachAsync(allFiles, function (next, fileTitle, index, array) {
        console.log('fileTitle', fileTitle)
        var fileOrDirPath = path.normalize(config.serverRoot + 'filetemplates/' + generator + '/' + fileTitle);


        // Check to see if path is a file
        if(!fs.lstatSync(fileOrDirPath).isDirectory()){
          // If path is a file, get the contents of the file
          var stream = fs.createReadStream(fileOrDirPath, {
            encoding: 'base64'
          })

          var response = '';
          stream.on('data', function (chunk) {
            response = response + chunk
          })

          stream.on('end', function () {
              github.authenticate({
                type: "oauth",
                token: token.token
              });
            // Using github module, create a file on github based on data read from file
            setTimeout(function(){
              github.repos.createFile({
                user: githubLogin,
                repo: repoName,
                path: fileTitle,
                message: 'Initial Commit for ' + fileTitle,
                content: response,
                committer: {
                  "name": "appception",
                  "email": "appception@gmail.com"
                }
              }, function (err, res) {
                if (err) {
                  console.log('projects.controller.js: create file error', err, res)
                } else {
                  console.log('projects.controller.js: create file success')

                  var decodeResponse = new Buffer(response, 'base64').toString('ascii');

                  results.push([{path: path.normalize(repoName + '/' + fileTitle), content: decodeResponse }])
                  next()
                }
              })
            }, 600)
          })
        } else {
          // If path is a directory, add the folder name to the results array
          results.push([{path: path.normalize(repoName + '/' + fileTitle)}])
          next();
        }
      }).then(function(){
        // Create a deploy branch for github pages/deployment
        createBranchHelper(githubLogin, repoName, 'master', deployment)
        console.log('all done!')
        return response.json(results)
      }); // end forEachAsync
    }; // end else

  }); // end github.repos.create()
} // end newRepo()


exports.commit = function (req, response) {
  var githubLogin = req.body.githubLogin;
  var repoName = req.body.repoName;
  var message = req.body.message;
  var branches = req.body.branches;
  var filesArray = req.body.filesArray;
  //console.log('filesArray before',filesArray)
  // for(var i = 0; i < filesArray.length; i++) {
  //   filesArray[i] = JSON.parse(filesArray[i])
  // }
  //console.log('filesArray after',filesArray)

  for(var i = 0; i < branches.length; i++){
    createCommitHelper(githubLogin, repoName, 'heads/' + branches[i], filesArray, message)
  }
  return response.json('success!')
}


exports.addFiletoRepo = function (githubLogin, repoName, path, message, content, cb, committer) {
  if (!committer) {
    committer = {
      "name": "appception",
      "email": "appception@gmail.com"
    }
  }

  github.repos.createFile({
    user: githubLogin,
    repo: repoName,
    path: path,
    message: message,
    content: content,
    committer: committer
  }, function (err, res) {
    if (err) {
      console.log('projects.controller.js: create file error', err, res)
    } else {
      console.log('projects.controller.js: create file success')
      cb()
    }
  })
}

function handleError(res, err) {
  return res.send(500, err);
}

exports.doesUserHaveUserPage = function (username) {
  var userPageName = '' + username + '.github.io';

  github.repos.getFromUser({user: username}, function (err, data) {
    if (err) {
      console.log("get all repos error", err);
    } // end if (error)

    // 'data' is all the data back from GH. Iterate and check for repo names.
    for (var key in data) {
      if (data[key].name === userPageName) { // user has User Page
        console.log("\nFOUND PAGE: ", data[key].name);
        return true;
      } // end if (user has user page)
    } // end for (key in data)
    return false;
  }); // end github.repos.getFromUser
}; // end doesUserHaveUserPage


exports.getBranches = function(req, response) {
  var githubLogin = req.query.githubLogin;
  var repoName = req.query.repoName;

  github.repos.getBranches({
    user: githubLogin,
    repo: repoName
  }, function(err, res) {
    if(err) {
      console.log('get branches error:', err)
    } else {
      // console.log('get branches success:')
      return response.json(res)
    }
  }); // end github.repos.getBranches
}; // end exports.getBranches


exports.createBranch = function(req, res) {
  var githubLogin = req.query.githubLogin;
  var repoName = req.query.repoName;
  var baseBranchName = req.query.baseBranchName;
  var newBranchName = req.query.newBranchName;

  return res.json(createBranchHelper(githubLogin, repoName, baseBranchName, newBranchName))
}

var recursivelyGetFileNames = function(rootDir, fileOrDirTitle, generator){
  var allFiles = [];

  var innerRecurse = function(rootDir, fileOrDirTitle) {
    var fileOrDirPath = path.normalize(config.serverRoot + 'filetemplates/' + generator + rootDir + '/' + fileOrDirTitle);
    // Check if path leads to a file
    if(!fs.lstatSync(fileOrDirPath).isDirectory()){
      console.log('file: ', fileOrDirTitle)
      // Clean the directory name if necessary
      if(rootDir.charAt(0) === '/'){
        rootDir = rootDir.substr(1)
      }
      // If file is not yet in the allFiles array, push it in
      if(allFiles.indexOf(rootDir + fileOrDirTitle) === -1) {
        allFiles.push(rootDir + fileOrDirTitle)
      }
    } else {
      rootDir = path.normalize(rootDir + fileOrDirTitle + '/');
      // Push the cleaned directory name to the allFiles array
      if(rootDir.charAt(0) === '/'){
        var cleanRootDir = rootDir.substr(1)
        allFiles.push(cleanRootDir)
      } else {
        allFiles.push(rootDir)
      }
      // If path leads to a directory, read the directory
      var files = fs.readdirSync(fileOrDirPath)
      // Look at each file in the directory and perform the entire function again on each
      files.forEach(function (nextFileOrDirTitle, index, array) {
        console.log('rootDir', rootDir)
        return innerRecurse(rootDir, nextFileOrDirTitle)
      })
    }
  }
  innerRecurse(rootDir, fileOrDirTitle)
  return allFiles
}

exports.getTemplates = function(req, res) {
  var fileTemplatesRoot = path.normalize(config.serverRoot + 'filetemplates/');

  var filesObject = {};

  var innerRecurse = function(currentObj, rootDir, dirTitle) {
    var dirPath = path.normalize(config.serverRoot + 'filetemplates/' + rootDir);
    if(dirTitle) {
      currentObj[dirTitle] = {};
      currentObj = currentObj[dirTitle];
    }
    // Read the directory
    var files = fs.readdirSync(dirPath)

    // Look at each file in the directory
    files.forEach(function (fileOrDirTitle) {
      var fileOrDirPath = path.normalize(config.serverRoot + 'filetemplates/' + rootDir + '/' + fileOrDirTitle);
      // Check if path leads to a file
      if(!fs.lstatSync(fileOrDirPath).isDirectory()){
        currentObj[fileOrDirTitle] = 'file';
        return;
      } else {
        currentObj[fileOrDirTitle] = {};
        return innerRecurse(currentObj, path.normalize(rootDir + '/' + fileOrDirTitle), fileOrDirTitle)
      }
    })
  }
  fs.readdir(fileTemplatesRoot, function(err, files) {
    files.forEach(function(generator) {
      filesObject[generator] = {}
      return innerRecurse(filesObject[generator], generator)
    })
    return res.json(filesObject)
  })
}

var createBranchHelper = function(username, repoName, baseBranchName, newBranchName) {
  github.gitdata.getReference({
    user: username,
    repo: repoName,
    ref: 'heads/' + baseBranchName
  }, function(err, res) {
    if(err) {
      console.log('create branch get reference error:', err)
    } else {
      console.log('create branch get reference success:')
      var referenceSha = res.object.sha

      github.authenticate({
        type: "oauth",
        token: token.token
      });

      github.gitdata.createReference({
        user: username,
        repo: repoName,
        ref: 'refs/heads/' + newBranchName,
        sha: referenceSha
      }, function(err, res) {
        if(err) {
          console.log('create branch create reference error:', err)
        } else {
          console.log('create branch create reference success:')
          return res;
        }
      })
    }
  })
}

var createCommitHelper = function(githubLogin, repoName, branchName, filesArray, message) {
  // Get reference to head of branch
  // NOTE: if we want to commit to a different branch we can change that in ref
  github.gitdata.getReference({
    user: githubLogin,
    repo: repoName,
    ref: branchName
  }, function (err, res) {
    if (err) {
      console.log('get latest commit sha error', err)
    } else {
      console.log('get latest commit sha success')
      var latestCommitSha = res.object.sha;

      // Get last commit info
      github.gitdata.getCommit({
        user: githubLogin,
        repo: repoName,
        sha: latestCommitSha
      }, function (err, res) {
        if (err) {
          console.log('get info for latest commit error', err)
        } else {
          console.log('get info for latest commit success')

          var baseTreeSha = res.tree.sha

          github.authenticate({
            type: "oauth",
            token: token.token
          });

          // Create a new tree with changed content, based on the last commit
          github.gitdata.createTree({
            user: githubLogin,
            repo: repoName,
            tree: filesArray,
            base_tree: baseTreeSha
          }, function (err, res) {
            if (err) {
              console.log('create tree error', err)
            } else {
              console.log('create tree success')

              var newTreeSha = res.sha

              // Create actual commit info
              github.gitdata.createCommit({
                user: githubLogin,
                repo: repoName,
                message: message,
                tree: newTreeSha,
                parents: [latestCommitSha]
              }, function (err, res) {
                if (err) {
                  console.log('create commit error', err)
                } else {
                  console.log('create commit success')
                  var newCommitSha = res.sha

                  // Update head of branch to be current commit
                  github.gitdata.updateReference({
                    user: githubLogin,
                    repo: repoName,
                    ref: branchName,
                    sha: newCommitSha,
                    force: true
                  }, function (err, res) {
                    if (err) {
                      console.log('create reference error', err)
                    } else {
                      console.log('create reference success')
                      return;
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}
