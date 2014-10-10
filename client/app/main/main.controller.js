'use strict';

angular.module('appceptionApp')
  .controller('MainCtrl', function ($scope, $location, $window) {
    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
