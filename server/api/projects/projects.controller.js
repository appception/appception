'use strict';

var _ = require('lodash');
var AdmZip = require('adm-zip');
var zlib = require('zlib');
var fs = require('fs');
var https = require('https');
var request = require('request');
var Projects = require('./projects.model');

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

  var githubLogin = req.query.githubLogin;

  github.repos.getFromUser({ user: githubLogin }, function(err, data) {
    if(err){  console.log("projects.controller.js: get all repos error", err); }
    console.log("projects.controller.js: get all repos success")
    return res.json(data)
  });

};

// Get a single projects files
exports.files = function(req, res) {
  var githubLogin = req.query.githubLogin;
  var githubRepo = req.query.githubRepo;

  github.repos.getArchiveLink({
    user: githubLogin,
    repo: githubRepo,
    archive_format: 'tarball'
  }, function(err, data) {
    if(err) {
      console.log('projects.controller.js: get files error', err)
    }
    console.log('projects.controller.js: get files success')




    var file = data.meta.location;
    file = file.replace(/:ref/g, 'master')

    var fileName = '/tmp/' + new Date().getTime() + Math.random();

    request.get({
      url: file,
      encoding: null
    }, function(err, resp, body) {
      if(err) throw err;
      fs.writeFile('server/tempfiles/' + githubRepo + '.zip', body, function(err) {
        console.log("file written!");
      });
    });



    // https.get(file, function(res) {
    //   var data = [];
    //   var dataLength = 0;
    //   res.on('data', function(chunk) {
    //     data.push(chunk);;
    //     dataLength += chunk.length;
    //   }).on('end', function() {
    //     var buf = new Buffer(dataLength);
    //     var pos = 0;
    //     for(var i = 0; i < data.length; i++) {
    //       data[i].copy(buf, pos);
    //       pos += data[i].length;
    //     }

    //     var zip = new AdmZip(buf);
    //     var zipEntries = zip.getEntries();
    //     console.log(zipEntries.length)
    //   })
    // })

    // var output = fs.createWriteStream('output.txt')
    // var input = fs.createReadStream(file)
    // input.pipe(zlib.createGunzip()).pipe(output)
    // unzipAndStoreFiles(file)
  })
};

var unzipAndStoreFiles = function(zipball) {
  // in the future we can let users pick a branch and update the :ref
  // var branch = 'master';
  // var zipballURL = zipball.replace(/:ref/g, branch);
  // console.log(zipballURL)

  // var zip = new AdmZip(zipballURL);
  // var zipEntries = zip.getEntries();
  // console.log(zipEntries)

  // zipEntries.forEach(function(zipEntry) {
  //   console.log(zipEntry.toString())
  // })


}

// // Creates a new projects in the DB.
// exports.create = function(req, res) {
//   Projects.create(req.body, function(err, projects) {
//     if(err) { return handleError(res, err); }
//     return res.json(201, projects);
//   });
// };

// // Updates an existing projects in the DB.
// exports.update = function(req, res) {
//   if(req.body._id) { delete req.body._id; }
//   Projects.findById(req.params.id, function (err, projects) {
//     if (err) { return handleError(res, err); }
//     if(!projects) { return res.send(404); }
//     var updated = _.merge(projects, req.body);
//     updated.save(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.json(200, projects);
//     });
//   });
// };

// // Deletes a projects from the DB.
// exports.destroy = function(req, res) {
//   Projects.findById(req.params.id, function (err, projects) {
//     if(err) { return handleError(res, err); }
//     if(!projects) { return res.send(404); }
//     projects.remove(function(err) {
//       if(err) { return handleError(res, err); }
//       return res.send(204);
//     });
//   });
// };

function handleError(res, err) {
  return res.send(500, err);
}