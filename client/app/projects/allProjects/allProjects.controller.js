'use strict';

angular.module('appceptionApp')
  .controller('AllProjectsCtrl', function ($scope, github) {
    console.log('AllProjectsCtrl')

    github.getRepos().then(function(res){ 
      $scope.projects = res.data;
    })


  });
