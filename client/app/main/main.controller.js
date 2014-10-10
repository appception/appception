'use strict';

angular.module('appceptionApp')
  .controller('MainCtrl', function ($scope, $location, $window, Auth, github) {
    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    $scope.getTemplates = function() {
    	github.getTemplates()
    	.then(function(res) {
    		console.log(res)
    	});
    }

  });
