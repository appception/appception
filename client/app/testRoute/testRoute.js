'use strict';

angular.module('appceptionApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('testRoute', {
        url: '/testRoute',
        templateUrl: 'app/testRoute/testRoute.html',
        controller: 'TestrouteCtrl'
      });
  });