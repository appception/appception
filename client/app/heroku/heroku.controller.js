'use strict';

angular.module('appceptionApp')
  .controller('HerokuCtrl', function ($scope, Auth, $window, $location) {
    $scope.message = 'Hello';

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };


  });