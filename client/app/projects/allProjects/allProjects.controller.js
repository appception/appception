'use strict';

angular.module('appceptionApp')
  .controller('AllProjectsCtrl', function ($scope, github) {
    var projectList = ['a','b','c'];

    console.log('AllProjectsCtrl')

    console.log(github.someMethod());

    $scope.projects = projectList;

  });
