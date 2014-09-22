'use strict';

angular.module('appceptionApp')
  .controller('AllProjectsCtrl', function ($q, $scope, github, Auth) {

    $scope.projects;

    // Check to see if currentUser exists. If it does exist, get all of its repos. If it doesn't exist, print an error on the screen
  	Auth.isLoggedInAsync(function(boolean) {
    	if(boolean === true){
    		var user = Auth.getCurrentUser()
    		console.log('user', user.github.login)
    		github.getRepos(user.github.login).then(function(res){
	      	$scope.projects = res.data;
	      	console.log('res.data', res)
	      	console.log('$scope.projects', $scope.projects)
	    	})
    	}else {
    		$scope.projects = 'Sorry, no projects have been found'
    	}
	  });



  });
