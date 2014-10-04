'use strict';

angular.module('appceptionApp')
  .controller('FilesCtrl', function ($scope, $stateParams, $timeout, github, Auth, $state,$q, indexedDB) {

    $scope.repoName = $stateParams.repoName;
    $scope.isDeployed = false;
    $scope.checkBranches = false;
    $scope.success = false;
    $scope.failure = false;
    $scope.committing = false;
    $scope.nimbleLoader = true;

    Auth.isLoggedInAsync(function(boolean) {
      if(boolean === true){
        var user = Auth.getCurrentUser()
        $scope.username = user.github.login

        // Get all the branches to look and see if they have a gh-pages branch for deployment
        github.getBranches($scope.username, $scope.repoName)
          .then(function(res){
            for(var i = 0; i < res.data.length; i++) {
              if (res.data[i]["name"] === 'gh-pages'){
                $scope.isDeployed = true;
              }
            }
            $scope.checkBranches = true;
          });
      } else {
        console.log('Sorry, an error has occurred while loading the user');
      }
    });

    $scope.hideLoader = function() {
      alert('hello')
      $scope.nimbleLoader = false;
    }

    $scope.addDeployBranch = function() {
      // Create a gh-pages branch
      github.createBranch($scope.username, $scope.repoName, 'master', 'gh-pages')
        .then(function(res) {
          console.log('addDeployBranch success!', res)
          $scope.isDeployed = true;
        })
    }; // end addDeployBranch()


    $scope.addBranch = function() {
      var branchName = prompt("Enter your branch name:");
      branchName = branchName || 'gh-pages'; // default to 'gh-pages'

      github.createBranch($scope.username, $scope.repoName, 'master', branchName)
        .then(function(res) {
          console.log('addBranch', branchName, 'success!\n', res)
          // $scope.currentBranch = branchName; // Can/should we track the user's current branch
        })
    }; // end addBranch()

    /**************************
     * NOTE: Aaron is putting this codeblock
     * back in but commenting out.
     * This was missing during a merge, and
     * it seems like something we *might* want
     * to keep around for a day or 2.
     **************************/

     
    // var filer = new Filer.FileSystem({
    //   name: 'files',
    //   provider: new Filer.FileSystem.providers.Fallback('makedrive')
    // });

    // var shell = filer.Shell();

    // var exportLocalDB = function(callback){

    //   // get list of all files and directories in user's browsers local DB
    //   shell.ls('/', {recursive: true}, function(err, entries){
    //     console.log('entries', entries[0])
    //     var results = [];
    //     if (err) throw err;


    //     var traverseDirectory = function(item, fullpath){
    //       var itemObj = {};

    //       //  add path of directory to results
    //       results.push({path: fullpath})
    //       // console.log('directory:', fullpath);

    //       // loop through every item in a directory
    //       item.contents.forEach(function(result, i){
    //         var entry = item.contents[i];
    //         var itemPath = fullpath + '/' + entry.path

    //         // if item is a file, add  file path and content to results
    //         if(entry.type === 'FILE'){
    //           filer.readFile(itemPath, function(err, data){
    //             // console.log('file2:', itemPath, data);
    //             results.push({path: itemPath, content: data.toString()})
    //           })

    //         // if item is directory, recursively traverse the directory
    //         } else if (entry.type === 'DIRECTORY') {
    //           traverseDirectory(entry, itemPath );
    //         }
    //       })

    //     }

    //     if(entries[0] && entries[0].type==="DIRECTORY"){
    //       traverseDirectory(entries[0], '/' + entries[0].path)
    //     } else {
    //       alert('You need a folder folder at the root of your project.')
    //     }

    //     setTimeout(function(){
    //       callback(results);
    //     }, 1000);


    //   });
    // };


    $scope.createCommit = function(message) {
      var message = prompt('Enter a commit message:')
      $scope.committing = true;
      indexedDB.exportLocalDB().then(function(filesArray) {

        console.log(filesArray)

        filesArray.shift()
        for(var i = filesArray.length-1; i >= 0; i--) {
          if(!filesArray[i]["content"]){
            console.log(filesArray[i])
            filesArray.splice(i, 1);
          }
        }

        for(var i = 0; i < filesArray.length; i++) {
          filesArray[i]["mode"] = '100644';
          filesArray[i]["type"] = 'blob';
          filesArray[i]["path"] = filesArray[i]["path"].replace('/' + $scope.repoName + '/', '')
        }
        // filesArray.shift()
        console.log(filesArray)

        Auth.isLoggedInAsync(function(boolean) {
          if(boolean === true){
            var user = Auth.getCurrentUser()
            console.log('user: ', user)
            github.createCommit(user.github.login, $scope.repoName, message, filesArray)
              .then(function(res){
                console.log('success!', res.data);
                $scope.committing = false;
                $scope.success = true;
              })
          }else {
            console.log('Sorry, an error has occurred while committing');
            $scope.committing = false;
            $scope.failure = true
          }
        });
      })
    }

    $scope.dismissNotification = function() {
      $scope.success = false;
      $scope.failure = false;
    }
  });
