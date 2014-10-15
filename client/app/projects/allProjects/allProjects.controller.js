'use strict';

angular.module('appceptionApp')
  .controller('AllProjectsCtrl', function ($q, $scope, $state, github, Auth, indexedDB ) {

    $scope.projects;
    $scope.loading = false;

    // Check to see if currentUser exists. If user does exist, get all of their repos.
    // If user doesn't exist, print an error on the screen
    Auth.isLoggedInAsync(function(boolean) {
      $scope.loading = true;
      if(boolean === true){
        var user = Auth.getCurrentUser()
        // Get the repos for the current user.
        github.getRepos(user.github.login).then(function(res){
          $scope.projects = res.data;
          // Sets 'master' as the default selection in the dropdown menue.
          $scope.selectedbranch = 'master'; 

          // Get the branches for each repo.
          $scope.projects.forEach(function(element, index, arrayBeingTraversed) {
            getBranchesForRepo(element);
          }); // end $scope.projects.forEach()

          $scope.loading = false;
        }); // end getRepos().then()
      }else {
        $scope.projects = 'Sorry, no projects have been found';
        $scope.loading = false;
      }
    });

    // Fetches all the branches for a repo.
    var getBranchesForRepo = function(project) { // store $scope.project.branch.name{name, sha, url}

      Auth.isLoggedInAsync(function(boolean) {
        if(boolean === true){
          var user = Auth.getCurrentUser();

          github.getBranches(user.github.login, project.name).then(function(res) {
            project.branches = res.data; // array of objects with {commit: {sha: "shaCode", url: "commitURL"}, name: "bug/packageJSON"}
          }); // end github.getBranches().then()
        } // end if
      }) // end Auth.isLoggedInAsync
    }; // end getBranchesForRepo

    // Makes a call to Github API to get the files for a particular repo.
    // Filer inserts the files into the client's browser local database.
    $scope.getRepoFiles = function(repo, selectedbranch) {
      github.currentRepoInformation = {
        repoName: repo,
        branch: selectedbranch
      }
      Auth.isLoggedInAsync(function(boolean) {
        if(boolean === true){
          var user = Auth.getCurrentUser();

          // Empties the user's browser's local database so there is only
          // one project in the local database at a time.
          indexedDB.emptyLocalDB();

          // Fetches the files for a particular repo.
          github.getRepoFiles(user.github.login, repo, selectedbranch)
          .then(function(res) {
            console.log('downloading zip file');

            // Insert the files into the user's browser local database.
            indexedDB.insertRepoIntoLocalDB(repo, res.data);

            // Redirects to files page.
            $state.go('files', {repoName: repo})
          });

        }else {
          $scope.files = 'Sorry, no files have been found';
        }
      })
    }

  });
