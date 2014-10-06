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

          $scope.projects.forEach(function(element, index, arrayBeingTraversed) {
            // arrayBeingTraversed[index].currentbranch = 'master'; // for the default master branch selection
            $scope.getBranchesForRepo(arrayBeingTraversed[index]);
          }); // end $scope.projects.forEach()

          $scope.loading = false;
        }); // end getRepos().then()
      }else {
        $scope.projects = 'Sorry, no projects have been found';
        $scope.loading = false;
      }
    });

    $scope.emptyLocalDB = function(){
      indexedDB.emptyLocalDB();
    }

    $scope.getBranchesForRepo = function(project) { // store $scope.project.branch.name{name, sha, url}

      Auth.isLoggedInAsync(function(boolean) {
        if(boolean === true){
          var user = Auth.getCurrentUser();

          github.getBranches(user.github.login, project.name).then(function(res) {
            project.branches = res.data; // array of objects with {commit: {sha: "shaCode", url: "commitURL"}, name: "bug/packageJSON"}

            // allBranches.forEach(function(element, index, array) { // POSSIBLY OBSOLETE. Creating array instead
            //   project.branches[element.name] = {
            //     'name': element.name,
            //     'sha': element.commit.sha,
            //     'url': element.commit.url
            //   }; // end branch.name object
            // }); // end allBranches.forEach()

          }); // end github.getBranches().then()
        } // end if
      }) // end Auth.isLoggedInAsync
    }; // end getBranchesForRepo


    // Makes a call to Github API to get the files for a particular repo.
    // Filer inserts the files into the client's browser local database.
    $scope.getRepoFiles = function(repo) {
      Auth.isLoggedInAsync(function(boolean) {
        if(boolean === true){
          var user = Auth.getCurrentUser();

          // empties the user's browser's local database so there is only
          // one project in the local database at a time.
          indexedDB.emptyLocalDB();

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
