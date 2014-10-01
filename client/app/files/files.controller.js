'use strict';

angular.module('appceptionApp')
  .controller('FilesCtrl', function ($scope, $stateParams, $timeout, github, Auth, $state) {

  	$scope.repoName = $stateParams.repoName;
    $scope.isDeployed = false;
    $scope.isLoaded = false;

		Auth.isLoggedInAsync(function(boolean) {
    	if(boolean === true){
	  		var user = Auth.getCurrentUser()
	  		$scope.username = user.github.login

        // Get all the branches to look and see if they have a gh-pages branch for deployment
        github.getBranches($scope.username, $scope.repoName)
          .then(function(res){
            for(var i = 0; i < res.data.length; i++) {
              if (res.data[i]["name"] === 'gh-pages'){
                $scope.isDeployed = true;
              }
            }
            $scope.isLoaded = true;
          });
	  	}else {
  			console.log('Sorry, an error has occurred while loading the user');
  		}
	  });

  	$scope.createCommit = function(message) {
  		var message = prompt('Enter a commit message:')
  		github.createCommit($scope.username, $scope.repoName, message)
  			.then(function(res){
        	console.log('success!', res.data);
	    	});
  	};

    $scope.addDeployBranch = function() {
      // Create a gh-pages branch
      github.createBranch($scope.username, $scope.repoName, 'master', 'gh-pages')
        .then(function(res) {
          console.log('addDeployBranch success!', res)
          $scope.isDeployed = true;
        })
    }


  });
