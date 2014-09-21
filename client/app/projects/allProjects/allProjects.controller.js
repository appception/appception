'use strict';

angular.module('appceptionApp')
  .controller('AllProjectsCtrl', function ($q, $scope, github, Auth) {

    // Bug: can't figure out how to get the github info
    // console.log(user())

    var user = Auth.getCurrentUser();
    console.log(user);

    var user = 'wykhuh';

    github.getRepos(user).then(function(res){
      $scope.projects = res.data;
    });


  });
