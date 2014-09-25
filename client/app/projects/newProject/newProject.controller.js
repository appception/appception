'use strict';

angular.module('appceptionApp')
  .controller('NewProjectCtrl', function ($scope, github, Auth) {

  	$scope.repoName = '';

  	$scope.createRepo = function(repoName) {
  		console.log('inside create repo client')
  		Auth.isLoggedInAsync(function(boolean) {
        if(boolean === true){
        	console.log('user logged in')
          var user = Auth.getCurrentUser()
          github.createRepo(user.github.login, repoName).then(function(res) {
          	console.log('repo Created')
            console.log(res)
            // $scope.files = res.data
          })
        }else {
          $scope.files = 'Sorry, there has been an error while creating your repo.';
        }
      })
  	}

  	// instantiate a new repo on github
  		// add template files to it
  		// route them to brackets

  });
