'use strict';

angular.module('appceptionApp')
  .controller('FilesCtrl', function ($scope, $stateParams, github, Auth) {

  	$scope.repoName = $stateParams.repoName;

  	$scope.createCommit = function(message) {
  		var message = prompt('Enter a commit message:')
  		Auth.isLoggedInAsync(function(boolean) {
	    	if(boolean === true){
	    		var user = Auth.getCurrentUser()
	        console.log('user: ', user)
	    		github.createCommit(user.github.login, $scope.repoName, message).then(function(res){
	          console.log('success!', res);
		    	})
	    	}else {
	    		console.log('Sorry, an error has occurred while committing');
	    	}
		  });
  	}
  });
