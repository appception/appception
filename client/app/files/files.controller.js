'use strict';

angular.module('appceptionApp')
  .controller('FilesCtrl', function ($scope, github, Auth) {

  	$scope.createCommit = function(message) {
  		Auth.isLoggedInAsync(function(boolean) {
	    	if(boolean === true){
	    		var user = Auth.getCurrentUser()
	        console.log('user: ', user)
	    		github.createCommit('commit from api').then(function(res){
	          console.log('success!', res.data);
		    	})
	    	}else {
	    		console.log('Sorry, an error has occurred while committing');
	    	}
		  });
  	}
  });
