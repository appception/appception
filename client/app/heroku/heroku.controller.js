'use strict';

angular.module('appceptionApp')
  .controller('HerokuCtrl', function ($scope, Auth, $window, $location, github) {
    $scope.message = 'Hello';

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    $scope.deployHeroku = function(){
      console.log('deploy Heroku')

      github.getRepoFilesClient('wykhuh', 'test', 'master').then(function(files){
        console.log(files)
      });

    }




  });