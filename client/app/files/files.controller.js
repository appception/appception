'use strict';

angular.module('appceptionApp')
  .controller('FilesCtrl', function ($scope, $stateParams, github, Auth, indexedDB, $window, $location, $cookieStore, heroku) {

    $scope.missingDeployBranch = false;
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
    $scope.herokuMaxLimit = false;

    // When the page loads, we fetch the name of the current repo, the username,
    // and whether the app is hosted on Github or Heroku.
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

    // Logs user into Heroku.
    $scope.loginOauth = function() {
      $window.location.href = '/auth/heroku';
    };

    // If project does not have a deploy branch, add a deploy branch.
    $scope.addDeployBranch = function(){
      console.log('deployBranch', $scope.deployBranch);

      $scope.missingDeployBranch = false;

      if($scope.deployBranch) {
        formDeployLink($scope.deployBranch);
      }

      // If repo is deployed on heroku and user isn't logged in at Heroku,
      // redirect to Heroku login.
      if($scope.deployBranch==='heroku' && !$cookieStore.get('deployToken') ){
        $window.location.href = '/auth/heroku';
      }

      // Create deploy branch on Github
      github.createBranch($scope.username, $scope.repoName, 'master', $scope.deployBranch)
        .then(function(res) {
          console.log('addDeployBranch success!', res);
        });
    }

    // Commit the files to the deploy branch so users can preview the changes.
    $scope.deploy = function(){
      var message = 'test deployment ' + new Date();
      console.log('deploy commit:', message, $scope.deployBranch)
      commit(message, [$scope.deployBranch]);
    };

    // Creates a new branch.
    $scope.addBranch = function() {
      var branchName = prompt("Enter your branch name:");
      branchName = branchName || 'gh-pages'; // default to 'gh-pages'

      github.createBranch($scope.username, $scope.repoName, 'master', branchName)
        .then(function(res) {
          console.log('addBranch', branchName, 'success!\n', res);
          $scope.branch = branchName;
        })
    }; // end addBranch()

    // Commits the files to the current branch and the deploy branch.
    $scope.createCommit = function(message) {
      var message = prompt('Enter a commit message:');
      console.log('main branch', $scope.branch , 'deploy branch', $scope.deployBranch )
      commit(message, [$scope.branch , $scope.deployBranch]);
    };


    $scope.dismissNotification = function() {
      $scope.success = false;
      $scope.failure = false;
      $scope.herokuMaxLimit = false;
    };

    // Exports the files from indexedDB and commits the changed files
    // to Github.
    var commit = function(message, branches){
      console.log('start commit:', message, '- ', branches);
      var toCommit = [];
      $scope.committing = true;
      // export the files from indexedDB
      indexedDB.exportLocalDB().then(function(filesArray) {
        console.log('files',filesArray);

        filesArray.forEach(function(value) {
          // console.log('time', value, $scope.timeLoaded)

          // Only commit the files that have been changed recently.
          if (value.modified > $scope.timeLoaded){
            toCommit.push(value);
          }
        })

        // Don't commit directories.
        for(var i = toCommit.length-1; i >= 0; i--) {
          if(!toCommit[i]["content"]){
            toCommit.splice(i, 1);
          }
        }

        // Setup up info Github requires and remove repo name from file path.
        for(var i = 0; i < toCommit.length; i++) {
          toCommit[i]["mode"] = '100644';
          toCommit[i]["type"] = 'blob';
          toCommit[i]["path"] = toCommit[i]["path"].replace('/' + $scope.repoName + '/', '')
        }

        Auth.isLoggedInAsync(function(boolean) {
          if(boolean === true){
            var user = Auth.getCurrentUser();
            var updateHerokuApp;

            // If repo is deployed on Heroku and user is logged, updated the Heroku app
            // after the files are commited to Github.
            if($scope.deployBranch ==='heroku' && !!$cookieStore.get('deployToken')) {
              updateHerokuApp = true;
            } else {
              updateHerokuApp = false;
            }

            // Commits the files to Github.
            github.createCommit(user.github.login, $scope.repoName, branches, message, toCommit, updateHerokuApp)
              .then(function(res){
                console.log('commit done', res);
                $scope.committing = false;
                $scope.success = true;
              });

          } else {
            console.log('Sorry, an error has occurred while committing');
            $scope.committing = false;
            $scope.failure = true;
          }
        });
      })
    };

    // Sets the deployment information based on which branch the repo has.
    var formDeployLink = function(deployBranch){
      if ( deployBranch === 'gh-pages'){
        console.log('gh link')
        $scope.deployedUrl = 'http://' + $scope.username + '.github.io/' + $scope.repoName;
        $scope.showLivePreview = true;

      } else if (deployBranch === 'heroku') {
        console.log('heroku link')
        $scope.deployedUrl = 'http://' + $scope.username + '-' + $scope.repoName + '.herokuapp.com';
        $scope.showLivePreview = true;

      }
    };

    // Check if repo is deployed on Github or Heroku, and adjust the UI buttons
    // and links accordingly.
    var fetchDeploymentBranch = function() {
      github.getBranches($scope.username, $scope.repoName)
        .then(function(res){
          console.log('inside getBranches:', $scope.username, $scope.repoName);

          // create a a link for the deployment branches
          $scope.missingDeployBranch = true;

          for(var i = 0; i < res.data.length; i++) {

            // if project has  Heroku branch,
            if(res.data[i]['name'] === 'heroku'){
              console.log('deployment heroku')
              $scope.missingDeployBranch = false;
              $scope.deployBranch = 'heroku';
              $scope.deployedHost = 'Heroku';
  

              // if user already has 5 Heroku apps, show them a warning.
              heroku.countHerokuApps()
                .then(function(res){
                  if(res === 5){
                    console.log('max limit')
                    $scope.herokuMaxLimit = true;
                  }
                });

              // if user is logged in, show preview with Heroku and create a new 
              // Heroku app if the app doesn't exist.
              if( !!$cookieStore.get('deployToken') ) {
                $scope.creatingHerokuApp = true;
                formDeployLink(res.data[i]['name']);
                $scope.createHerokuApp = true;
                heroku.createHerokuApp($scope.username, $scope.repoName)
                  .then( function(res){
                    $scope.showLivePreview = true;
                    $scope.creatingHerokuApp = false;
                  });

              // if user is not logged in, show login with Heroku
              } else {
                $scope.showHerokuLogin = true;
              }

            // if project is has github branch, show preview with Github
            } else if(res.data[i]['name'] === 'gh-pages' ) {
              console.log('deployment github')
              $scope.deployBranch = 'gh-pages';
              $scope.deployedHost = 'Github pages';
              formDeployLink(res.data[i]['name']);
              $scope.showLivePreview = true;
              $scope.missingDeployBranch = false;
            }
          }
          $scope.checkBranches = true;
        });
    };




  });
