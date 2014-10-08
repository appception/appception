'use strict';

angular.module('appceptionApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('heroku', {
        url: '/heroku',
        templateUrl: 'app/heroku/heroku.html',
        controller: 'HerokuCtrl'
      });
  });