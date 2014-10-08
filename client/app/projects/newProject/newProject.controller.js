'use strict';

angular.module('appceptionApp')
  .controller('NewProjectCtrl', function ($scope, $state, github, Auth, indexedDB) {

  	$scope.repoName = '';
    $scope.creating = false;

    $scope.generator = 'beginner';

    $scope.createRepo = function(repoName, generator) {
      console.log('generator', generator)
      $scope.creating = true;
  		Auth.isLoggedInAsync(function(boolean) {
        if(boolean === true){
          var user = Auth.getCurrentUser()
          github.createRepo(user.github.login, repoName, generator).then(function(res) {

            // empties the user's browser's local database
            indexedDB.emptyLocalDB();
            // inserts file templates in browser's local database
            indexedDB.insertRepoIntoLocalDB(repoName, res.data);

            $state.go('files', {repoName: repoName})
          })
        }else {
          $scope.files = 'Sorry, there has been an error while creating your repo.';
        }
      })
  	}
  });
