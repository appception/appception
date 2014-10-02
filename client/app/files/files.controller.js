'use strict';

angular.module('appceptionApp')
  .controller('FilesCtrl', function ($scope, $stateParams, $timeout, github, Auth, $state, $q) {

    $scope.repoName = $stateParams.repoName;
    $scope.isDeployed = false;
    $scope.checkBranches = false;
    $scope.success = false;
    $scope.failure = false;
    $scope.committing = false;

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
      }else {
        console.log('Sorry, an error has occurred while loading the user');
      }
    });

    $scope.addDeployBranch = function() {
      // Create a gh-pages branch
      github.createBranch($scope.username, $scope.repoName, 'master', 'gh-pages')
        .then(function(res) {
          console.log('addDeployBranch success!', res)
          $scope.isDeployed = true;
        })
    }


    var filer = new Filer.FileSystem({
      name: 'files',
      provider: new Filer.FileSystem.providers.Fallback('makedrive')
    });

    var shell = filer.Shell();

    var exportLocalDB = function(callback){
      var promises = [];
      var results = [];

      // turn shell.ls callback into a promise
      var defer = $q.defer();

      // shell.ls get list of all files and directories in user's browsers local DB
      shell.ls('/', {recursive: true}, function(err, entries){
        // console.log('entries', entries[0])
        if (err) throw err;
        // counter keeps track of the number of promises
        var counter = 0;

        var traverseDirectory = function(item, fullpath){

          // loop through every item in a directory
          angular.forEach(item.contents, function(entry, i){
            var entry = item.contents[i];
            var itemPath = fullpath + '/' + entry.path;

            // if item is a file, read the file,  
            // and add  file path and content to promises
            if(entry.type === 'FILE'){

              (function(i) {
                // turns filer.readFile callback into a promise
                promises[i] = $q.defer();
                filer.readFile(itemPath, function(err, data){
                  if (err) {
                    return promises[i].reject(err);
                  } 
                  // console.log('file2:', itemPath, data);
                  promises[i].resolve({path: itemPath, content: data.toString()});
                }) 
              })(counter++)

            // if item is directory, add directory path to promises, and 
            //  recursively traverse the directory
            } else if (entry.type === 'DIRECTORY') {
             // console.log('directory:', itemPath);
              promises[counter]  = $q.defer();
              promises[counter].resolve({path: itemPath});
              counter++;
              traverseDirectory(entry, itemPath );
            }

            // console.log(promises)

          })
        }

        // get all the files and directories for the root directory
        if(entries[0] && entries[0].type==="DIRECTORY"){
          traverseDirectory(entries[0], '/' + entries[0].path)
        } else {
          alert('You need a folder folder at the root of your project.')
        }

        // since there are two nested level of promises,
        // push every  promise in 2nd level of promise (promises[])
        // into the promise of the 1st level (REALpromises[]) 
        var REALpromises = [];
        angular.forEach(promises, function(promise) {
          REALpromises.push(promise.promise);
        })
        defer.resolve($q.all(REALpromises));
  
      });

      return defer.promise;

    };


    $scope.getProjectFiles = function(){

      exportLocalDB().then(function(result){
        console.log('result', result)
      });

    }

    $scope.createCommit = function(message) {
      var message = prompt('Enter a commit message:')
      $scope.committing = true;
      exportLocalDB().then(function(filesArray) {

        for(var i = 0; i < filesArray.length; i++) {
          filesArray[i]["mode"] = '100644';
          filesArray[i]["type"] = 'blob';
          filesArray[i]["path"] = filesArray[i]["path"].replace('/' + $scope.repoName + '/', '')
        }
        //filesArray.shift()

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
