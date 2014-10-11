'use strict';

angular.module('appceptionApp')
  .controller('FilesCtrl', function ($scope, $stateParams, github, Auth, indexedDB, $window, $location, $cookieStore, heroku) {

    $scope.isDeployed = false;
    $scope.checkBranches = false;
    $scope.success = false;
    $scope.failure = false;
    $scope.committing = false;
    $scope.nimbleLoader = true;
    $scope.requiresHeroku = false;
    $scope.isDeployedOnHeroku = false;
    $scope.showHerokuLogin = !!$cookieStore.get('deployToken') && $scope.isDeployed ;
    $scope.deployBranch;
    $scope.repoName  = '';
    $scope.timeLoaded = '';
    $scope.currentRepoInformation = github.currentRepoInformation
    $scope.username ='';

    // getCurrentRepo() reads the files in IndexedDb and returns name of the current repo
    indexedDB.getCurrentRepo()
      .then(function(repo){
        Auth.isLoggedInAsync(function(boolean) {
          if(boolean === true){
            var user = Auth.getCurrentUser();
            $scope.username = user.github.login;
            $scope.repoName  = repo;
            fetchDeploymentBranch();
          }
        })
      });

    $scope.showHerokuLink = function() {
      $scope.requiresHeroku = true;
    };

    // logs user into Heroku
    $scope.loginOauth = function() {
      $window.location.href = '/auth/heroku';
    };

    // if project does not have a deploy branch, add a deploy branch
    $scope.pickDeploy = function(){
      console.log('deployBranch', $scope.deployBranch);
      $scope.deployBranch = $scope.deployBranch;
      $scope.isDeployed = true;

      if($scope.deployBranch) {
        formDeployLink($scope.deployBranch);
      }

      // if repo is deployed on heroku and user isn't logged in at heroku,
      // show them login window.
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
          console.log('addBranch', branchName, 'success!\n', res)
          // $scope.currentBranch = branchName; // Can/should we track the user's current branch
        })
    }; // end addBranch()


    $scope.createCommit = function(message) {
      var message = prompt('Enter a commit message:');
      console.log('branch', $scope.deployBranch)
      commit(message, ['master', $scope.deployBranch]);
    };


    var commit = function(message, branches){
      console.log('start commit:', message, '- ', branches);
      var toCommit = [];
      $scope.committing = true;
      indexedDB.exportLocalDB().then(function(filesArray) {
        filesArray.shift()
        filesArray.forEach(function(value) {
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
            github.createCommit(user.github.login, $scope.repoName, branches, message, toCommit)
              .then(function(res){
                console.log('commit done')
                $scope.committing = false;
                $scope.success = true;

                // if app is deployed on Heroku, build app
                if($scope.deployBranch ==='heroku' && !!$cookieStore.get('deployToken')) {
                  console.log('update heroku app')
                  heroku.updateApp($scope.username, $scope.repoName);
                }

              })
          }else {
            console.log('Sorry, an error has occurred while committing');
            $scope.committing = false;
            $scope.failure = true
          }
        });
      })
    };


    $scope.dismissNotification = function() {
      $scope.success = false;
      $scope.failure = false;
    };


    var formDeployLink = function(branch){
      if ( branch === 'gh-pages'){
        console.log('gh link')
        $scope.deployBranch = 'gh-pages';
        $scope.deployedHost = 'Github pages';
        $scope.deployedUrl = 'http://' + $scope.username + '.github.io/' + $scope.repoName;

      } else if (branch === 'heroku') {
        console.log('heroku link')
        $scope.deployBranch = 'heroku';
        $scope.deployedHost = 'Heroku';
        $scope.deployedUrl = 'http://' + $scope.username + '-' + $scope.repoName + '.herokuapp.com';
      }
    };

    var fetchDeploymentBranch = function() {
      // Auth.isLoggedInAsync(function(boolean) {
      //   if(boolean === true){
      //     var user = Auth.getCurrentUser();
      //     $scope.username = user.github.login;


     // Get all the branches for the current repo and checks
          // to see if they have a gh-pages or heroku branch for deployment
          github.getBranches($scope.username, $scope.repoName)
            .then(function(res){
              console.log('inside getBranches:', $scope.username, $scope.repoName)
              // create a a link for the deployment branches 
              for(var i = 0; i < res.data.length; i++) {
                $scope.requiresHeroku = true;

                // if project is has  Heroku branch, 
                if(res.data[i]['name'] === 'heroku'){
                  $scope.isDeployed = true;

                  // if user is  logged in, show preview with Heroku
                  if( !!$cookieStore.get('deployToken') ) {
                    formDeployLink(res.data[i]['name']);
                    heroku.createHerokuApp($scope.username, $scope.repoName);

                  // if user is not logged in, show login with Heroku
                  } else {
                    $scope.showHerokuLogin = true;
                  }
                }

                // if project is has git-hub branch, show preview with Github
                if(res.data[i]['name'] === 'gh-pages' ) {
                  $scope.isDeployed = true;
                  formDeployLink(res.data[i]['name']);
                }

              }
              $scope.checkBranches = true;
            });
      //   } else {
      //     console.log('Sorry, an error has occurred while loading the user');
      //   }
      // });

    };




  });
