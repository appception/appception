'use strict';

angular.module('appceptionApp')
  .controller('AllProjectsCtrl', function ($q, $scope, $state, github, Auth, indexedDB ) {

    $scope.projects;
    $scope.loading = false;

    // Check to see if currentUser exists. If it does exist, get all of its repos. If it doesn't exist, print an error on the screen
    Auth.isLoggedInAsync(function(boolean) {
      $scope.loading = true;
      if(boolean === true){
        var user = Auth.getCurrentUser()
        // right now, it is making call to server to make a call to Github.
        // TODO: to make faster, switch this to client side call to Github using Coors.
        github.getRepos(user.github.login).then(function(res){
          $scope.projects = res.data;
          $scope.loading = false;
        })
      }else {
        $scope.projects = 'Sorry, no projects have been found';
        $scope.loading = false;
      }
    });

    $scope.emptyLocalDB = function(){
      indexedDB.emptyLocalDB();
    }


    // Makes a call to Github API to get the files for a particular repo.
    // Filer inserts the files into the client's browser local database.
    $scope.getRepoFiles = function(repo) {
      Auth.isLoggedInAsync(function(boolean) {
        if(boolean === true){
          var user = Auth.getCurrentUser();

          // Fetches the files for a particular repo
          github.getRepoFiles(user.github.login, repo)
          .then(function(res) {

            console.log('downloading zip file');
            // insert the files into the user's browser local database 
            indexedDB.insertRepoIntoLocalDB(repo, res.data);

            $state.go('files', {repoName: repo})

          });

        }else {
          $scope.files = 'Sorry, no files have been found';
        }
      })
    }

  });
