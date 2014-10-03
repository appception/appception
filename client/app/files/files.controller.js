'use strict';

angular.module('appceptionApp')
  .controller('FilesCtrl', function ($scope, $stateParams, $timeout, github, Auth, $state,$q, indexedDB) {

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
      } else {
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

    $scope.getProjectFiles = function(){

      indexedDB.exportLocalDB().then(function(result){
        console.log('result', result)
      });

    }

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
