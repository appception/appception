'use strict';

angular.module('appceptionApp')
  .controller('FilesCtrl', function ($scope, $stateParams, github, Auth, indexedDB, $window, $location, $cookieStore, heroku) {

    $scope.isDeployed = false;
    $scope.checkBranches = false;
    $scope.success = false;
    $scope.failure = false;
    $scope.committing = false;
    $scope.showHerokuLogin = false ;
    $scope.deployBranch;
    $scope.repoName  = '';
    $scope.timeLoaded = '';
    $scope.branch = github.currentRepoInformation.branch || 'master';
    $scope.username ='';
    $scope.showLivePreview = false;
    $scope.creatingHerokuApp = false;
    $scope.updatingHerokuApp = false;

    // getCurrentRepo() reads the files in IndexedDb and returns name of the current repo
    indexedDB.getCurrentRepo()
      .then(function(repo){
        Auth.isLoggedInAsync(function(boolean) {
          if(boolean === true){
            var user = Auth.getCurrentUser();
            $scope.username = user.github.login;
            $scope.repoName  = repo;

            $scope.timeLoaded = new Date().getTime();
            fetchDeploymentBranch();
          }
        })
      });

    // logs user into Heroku
    $scope.loginOauth = function() {
      $window.location.href = '/auth/heroku';
    };

    // if project does not have a deploy branch, add a deploy branch
    $scope.addDeployBranch = function(){
      console.log('deployBranch', $scope.deployBranch);
      $scope.deployBranch = $scope.deployBranch;
      $scope.isDeployed = true;

      if($scope.deployBranch) {
        formDeployLink($scope.deployBranch);
      }

      // if repo is deployed on heroku and user isn't logged in at heroku,
      // redirect to Heroku login.
      if($scope.deployBranch==='heroku' && !$cookieStore.get('deployToken') ){
        $window.location.href = '/auth/heroku';
      }

      // create deploy branch on github
      github.createBranch($scope.username, $scope.repoName, 'master', $scope.deployBranch)
        .then(function(res) {
          console.log('addDeployBranch success!', res);
        });
    }

    $scope.deploy = function(){
      // commit the files to the deploy branch
      var message = 'test deployment ' + new Date();
      console.log('deploy commit:', message, $scope.deployBranch)

      commit(message, [$scope.deployBranch]);
    };

    $scope.addBranch = function() {
      var branchName = prompt("Enter your branch name:");
      branchName = branchName || 'gh-pages'; // default to 'gh-pages'

      github.createBranch($scope.username, $scope.repoName, 'master', branchName)
        .then(function(res) {
          console.log('addBranch', branchName, 'success!\n', res);
          $scope.branch = branchName;
        })
    }; // end addBranch()

    $scope.createCommit = function(message) {
      var message = prompt('Enter a commit message:');
      console.log('main branch', $scope.branch , 'deploy branch', $scope.deployBranch )
      commit(message, [$scope.branch , $scope.deployBranch]);
    };


    $scope.dismissNotification = function() {
      $scope.success = false;
      $scope.failure = false;
    };

    var commit = function(message, branches){
      console.log('start commit:', message, '- ', branches);
      var toCommit = [];
      $scope.committing = true;
      indexedDB.exportLocalDB().then(function(filesArray) {
        console.log('files',filesArray)
        // filesArray.shift()
        filesArray.forEach(function(value) {
          // console.log('time', value, $scope.timeLoaded)
          if (value.modified > $scope.timeLoaded){
            toCommit.push(value)
          }
        })
        console.log(toCommit)
        for(var i = toCommit.length-1; i >= 0; i--) {
          if(!toCommit[i]["content"]){
            toCommit.splice(i, 1);
          }
        }

        for(var i = 0; i < toCommit.length; i++) {
          toCommit[i]["mode"] = '100644';
          toCommit[i]["type"] = 'blob';
          toCommit[i]["path"] = toCommit[i]["path"].replace('/' + $scope.repoName + '/', '')
        }

        Auth.isLoggedInAsync(function(boolean) {
          if(boolean === true){
            var user = Auth.getCurrentUser();
            var updateHerokuApp;

            if($scope.deployBranch ==='heroku' && !!$cookieStore.get('deployToken')) {
              updateHerokuApp = true;
            } else {
              updateHerokuApp = false;
            }


            github.createCommit(user.github.login, $scope.repoName, branches, message, toCommit, updateHerokuApp)
              .then(function(res){
                console.log('commit done', res)
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
    };

    var formDeployLink = function(deployBranch){
      if ( deployBranch === 'gh-pages'){
        console.log('gh link')
        $scope.deployBranch = 'gh-pages';
        $scope.deployedHost = 'Github pages';
        $scope.deployedUrl = 'http://' + $scope.username + '.github.io/' + $scope.repoName;
        $scope.showLivePreview = true;

      } else if (deployBranch === 'heroku') {
        console.log('heroku link')
        $scope.deployBranch = 'heroku';
        $scope.deployedHost = 'Heroku';
        $scope.deployedUrl = 'http://' + $scope.username + '-' + $scope.repoName + '.herokuapp.com';
        $scope.showLivePreview = true;

      }
    };

    var fetchDeploymentBranch = function() {
      github.getBranches($scope.username, $scope.repoName)
        .then(function(res){
          console.log('inside getBranches:', $scope.username, $scope.repoName)
          // create a a link for the deployment branches
          for(var i = 0; i < res.data.length; i++) {

            // if project is has  Heroku branch,
            if(res.data[i]['name'] === 'heroku'){
              $scope.isDeployed = true;
              // $scope.showLivePreview = true;

              // if user is  logged in, show preview with Heroku and create Heroku app
              if( !!$cookieStore.get('deployToken') ) {
                $scope.creatingHerokuApp = true;

                formDeployLink(res.data[i]['name']);
                $scope.createHerokuApp = true;
                 heroku.createHerokuApp($scope.username, $scope.repoName)
                  .then( function(res){
                    console.log('done creating')
                    $scope.showLivePreview = true;
                    $scope.creatingHerokuApp = false;
                  });

              // if user is not logged in, show login with Heroku
              } else {
                $scope.showHerokuLogin = true;

              }
            }

            // if project is has github branch, show preview with Github
            if(res.data[i]['name'] === 'gh-pages' ) {
              $scope.isDeployed = true;
              formDeployLink(res.data[i]['name']);
              $scope.showLivePreview = true;

            }
          }
          $scope.checkBranches = true;
        });


    };




  });
