'use strict';

angular.module('appceptionApp')
  .controller('FilesCtrl', function ($scope, $stateParams, github, Auth, indexedDB, $window, $location, $cookieStore, heroku) {

    // $scope.repoName = $stateParams.repoName;
    $scope.isDeployed = false;
    $scope.checkBranches = false;
    $scope.success = false;
    $scope.failure = false;
    $scope.committing = false;
    $scope.nimbleLoader = true;
    $scope.requiresHeroku = false;
    var repoName = $stateParams.repoName;
    $scope.deployBranch;
    // $scope.deployBranch;
    var deployBranch = '';
    var username = '';

    indexedDB.getCurrentRepo()
      .then(function(repo){ 
        $scope.repoName  = repo; 
      });

    // console.log(rp).then

    Auth.isLoggedInAsync(function(boolean) {
      if(boolean === true){
        var user = Auth.getCurrentUser();
        $scope.username = user.github.login;
        username = user.github.login;


        // Get all the branches to look and see if they have a gh-pages/heroku branch for deployment
        github.getBranches($scope.username, $scope.repoName)
          .then(function(res){
            for(var i = 0; i < res.data.length; i++) {
              if (res.data[i]['name'] === 'gh-pages'){
                deployBranch = 'gh-pages';
                $scope.deployedHost = 'Github pages';
                $scope.isDeployed = true;
                $scope.deployedUrl = 'http://' + username + '.github.io/' + repoName;

              } else if (res.data[i]['name'] === 'heroku') {
                deployBranch = 'heroku';
                $scope.deployedHost = 'Heroku';
                $scope.isDeployed = true;
                $scope.deployedUrl = 'http://' + username + '-' + repoName + '.herokuapp.com';

                // if project is deployed on Heroku, and user is not logged in with Heroku, 
                // show log in with Heroku link
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


    $scope.showHerokuLink = function() {

      $scope.requiresHeroku = true;
    };




    // Show "Live Preview"
    // when "Live Preview" is clicked, get progress bar of when files are being process
      // if project doesn't have deploy branch, add deploy branch = done
      // if project is heroku, and cookie isn't set, make them login = done
      // commit changes to deploy branch
      // if heroku, buildApp() = done

    // when doen processing, show "Live Preview"

    // if project does not have a deploy branch, add a deploy branch
    $scope.pickDeploy = function(){
      console.log('deployBranch', $scope.deployBranch);
      deployBranch = $scope.deployBranch;
      $scope.isDeployed = true;

      // if repo is deployed on heroku and user isn't logged in at heroku,
      // show them login window.
      if(deployBranch==='heroku' && !$cookieStore.get('deployToken') ){
        $window.location.href = '/auth/heroku';
      }

      // // create deploy branch on github
      // github.createBranch($scope.username, $scope.repoName, 'master', deployBranch)
      //   .then(function(res) {
      //     console.log('addDeployBranch success!', res);
  
      //     // // if project is deployed on heroku, create a new heroku app
      //     // if(deployBranch ==='heroku') {
      //     //   console.log('create heroku app', username, repoName)
      //     //   // heroku.createApp(username, repoName);
      //     // }
      //   });

    }


    $scope.deploy = function(){

      // commit the files to the deploy branch
      var message = 'test deployment ' + new Date();
      console.log('message', message, deployBranch)
      commit(message, [deployBranch], function(){
        // if app is deployed on Heroku, build app
        if(deployBranch ==='heroku') {
          console.log('build heroku app')
          heroku.updateApp(username, repoName);
        }

      });


    };



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
      commit(message, ['master', deployBranch]);
    }


    var commit = function(message, branches, callback){
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
            github.createCommit(user.github.login, $scope.repoName, branches, message, filesArray)
              .then(function(res){
                $scope.committing = false;
                $scope.success = true;
                console.log('fff', res)

                console.log(callback)

                if(callback){
                  console.log('callback build app')
                  callback();
                }

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
