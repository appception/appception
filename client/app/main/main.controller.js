'use strict';

angular.module('appceptionApp')
  .controller('MainCtrl', function ($scope, $location, $window, Auth, repoTemplates, $cookieStore) {
    $scope.loginOauth = function(provider) {
      $cookieStore.remove('deployToken');
      $window.location.href = '/auth/' + provider;
    };

    $scope.getTemplates = function() {
    	repoTemplates.getTemplates()
    	.then(function(res) {
    		console.table(res.data)
    		console.log(res.data)
    	});
    }

  });
