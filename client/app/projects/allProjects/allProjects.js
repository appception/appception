'use strict';

angular.module('appceptionApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('projects', {
        url: '/projects',
        templateUrl: 'app/projects/allProjects/allProjects.html',
        controller: 'AllProjectsCtrl'
        // authenticate: true
      });
  });