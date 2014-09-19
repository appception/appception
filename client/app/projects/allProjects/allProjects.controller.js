'use strict';

angular.module('appceptionApp')
  .controller('AllProjectsCtrl', function ($scope) {
    var projectList = ['a','b','c']

    $scope.projects = projectList;

  });
