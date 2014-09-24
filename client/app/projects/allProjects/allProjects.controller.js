'use strict';

angular.module('appceptionApp')
  .controller('AllProjectsCtrl', function ($q, $scope, github, Auth) {

    $scope.projects;
    $scope.loading = false;

    // Check to see if currentUser exists. If it does exist, get all of its repos. If it doesn't exist, print an error on the screen
  	Auth.isLoggedInAsync(function(boolean) {
      $scope.loading = true;
    	if(boolean === true){
    		var user = Auth.getCurrentUser()
    		github.getRepos(user.github.login).then(function(res){
          $scope.projects = res.data;
          $scope.loading = false;
	    	})
    	}else {
    		$scope.projects = 'Sorry, no projects have been found';
        $scope.loading = false;
    	}
	  });

    $scope.getRepoFiles = function(repo) {
      Auth.isLoggedInAsync(function(boolean) {
        if(boolean === true){
          var user = Auth.getCurrentUser()
          github.getRepoFiles(user.github.login, repo).then(function(res) {
            $scope.files = res.data
          })
        }else {
          $scope.files = 'Sorry, no files have been found';
        }
      })
    }


  });
