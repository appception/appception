'use strict';

angular.module('appceptionApp')
  .controller('NewProjectCtrl', function ($scope, $state, github, Auth) {

  	$scope.repoName = '';
    $scope.creating = false;

  	$scope.createRepo = function(repoName) {
  		console.log('inside create repo client')
      $scope.creating = true;
  		Auth.isLoggedInAsync(function(boolean) {
        if(boolean === true){
        	console.log('user logged in')
          var user = Auth.getCurrentUser()
          github.createRepo(user.github.login, repoName).then(function(res) {
            console.log('success')
            $state.go('files', {repoName: repoName})
          })
        }else {
          $scope.files = 'Sorry, there has been an error while creating your repo.';
        }
      })
  	}
  });
