'use strict';

angular.module('appceptionApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('newproject', {
        url: '/newproject',
        templateUrl: 'app/projects/newProject/newProject.html',
        controller: 'NewProjectCtrl',
        authenticate: true
      });
  });