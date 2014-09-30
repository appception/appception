'use strict';

angular.module('appceptionApp')
  .controller('FilesCtrl', function ($scope, $stateParams, $timeout, github, Auth) {

  	$scope.repoName = $stateParams.repoName;

		Auth.isLoggedInAsync(function(boolean) {
    	if(boolean === true){
	  		var user = Auth.getCurrentUser()
	  		console.log(user)
	  		$scope.username = user.github.login
	  	}else {
  			console.log('Sorry, an error has occurred while loading the user');
  		}
	  })

  	$scope.createCommit = function(message) {
  		var message = prompt('Enter a commit message:')
  		Auth.isLoggedInAsync(function(boolean) {
	    	if(boolean === true){
	    		var user = Auth.getCurrentUser()
	    		github.createCommit(user.github.login, $scope.repoName, message).then(function(res){
	          console.log('success!', res.data);
		    	})
	    	}else {
	    		console.log('Sorry, an error has occurred while committing');
	    	}
		  });
  	}
  });
