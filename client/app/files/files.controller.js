'use strict';

angular.module('appceptionApp')
  .controller('FilesCtrl', function ($scope, $stateParams, $timeout, github, Auth, $state,$q, indexedDB, $window, $location, $cookieStore) {

    $scope.repoName = $stateParams.repoName;
    $scope.isDeployed = false;
    $scope.checkBranches = false;
    $scope.success = false;
    $scope.failure = false;
    $scope.committing = false;
    $scope.nimbleLoader = true;
    $scope.requiresHeroku = false;
    var repoName = $stateParams.repoName;

    Auth.isLoggedInAsync(function(boolean) {
      if(boolean === true){
        var user = Auth.getCurrentUser()
        $scope.username = user.github.login;
        var username = user.github.login;


        // Get all the branches to look and see if they have a gh-pages/heroku branch for deployment
        github.getBranches($scope.username, $scope.repoName)
          .then(function(res){
            for(var i = 0; i < res.data.length; i++) {
              if (res.data[i]["name"] === 'gh-pages'){
                $scope.isDeployed = true;
                $scope.deployedUrl = 'http://' + username + '.github.io/' + repoName;
                $scope.deployedHost = 'Github pages';

              } else if (res.data[i]["name"] === 'heroku') {
                $scope.isDeployed = true;
                $scope.deployedUrl = 'http://' + username + '-' + repoName + '.herokuapp.com';
                $scope.deployedHost = 'Heroku';
                // check if user has logged in with Heroku
                if(!$cookieStore.get('deployToken')) {
                  $scope.requiresHeroku = true;
                }

              }
            }
            $scope.checkBranches = true;
          });
      } else {
        console.log('Sorry, an error has occurred while loading the user');
      }
    });

    // login in with Heroku
    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
      $scope.requiresHeroku = false;
    };

    $scope.addDeployBranch = function() {
      // Create a gh-pages branch
      github.createBranch($scope.username, $scope.repoName, 'master', 'gh-pages')
        .then(function(res) {
          console.log('addDeployBranch success!', res)
          $scope.isDeployed = true;
        })
    }; // end addDeployBranch()


    // Show "Live Preview"
    // when "Live Preview" is clicked, get progress bar of when files are being process
      // if project doesn't have deploy branch, add deploy branch
      // if project is heroku, and cookie isn't set, make them login
      // commit changes to deploy branch
      // if heroku, buildApp()

    // when doen processing, show "Live Preview"



    $scope.addBranch = function() {
      var branchName = prompt("Enter your branch name:");
      branchName = branchName || 'gh-pages'; // default to 'gh-pages'

      github.createBranch($scope.username, $scope.repoName, 'master', branchName)
        .then(function(res) {
          console.log('addBranch', branchName, 'success!\n', res)
          // $scope.currentBranch = branchName; // Can/should we track the user's current branch
        })
    }; // end addBranch()

    $scope.createCommit = function(message) {
      var message = prompt('Enter a commit message:')
      $scope.committing = true;
      indexedDB.exportLocalDB().then(function(filesArray) {

        filesArray.shift()
        for(var i = filesArray.length-1; i >= 0; i--) {
          if(!filesArray[i]["content"]){
            filesArray.splice(i, 1);
          }
        }

        for(var i = 0; i < filesArray.length; i++) {
          filesArray[i]["mode"] = '100644';
          filesArray[i]["type"] = 'blob';
          filesArray[i]["path"] = filesArray[i]["path"].replace('/' + $scope.repoName + '/', '')
        }

        Auth.isLoggedInAsync(function(boolean) {
          if(boolean === true){
            var user = Auth.getCurrentUser()
            console.log('user: ', user)
            github.createCommit(user.github.login, $scope.repoName, message, filesArray)
              .then(function(res){
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
