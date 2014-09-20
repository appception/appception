'use strict';

angular.module('appceptionApp')
  .controller('MainCtrl', function ($scope, $location, $window, Auth) {
    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

  });
