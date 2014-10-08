'use strict';

angular.module('appceptionApp')
  .controller('HerokuCtrl', function ($scope, Auth, $window, $location, heroku, $cookieStore) {
    $scope.message = 'Hello';
    $scope.getCurrentUser = Auth.getCurrentUser;
    console.log('Auth.getCurrentUser', Auth.getCurrentUser())

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    $scope.listApps = function(){
      console.log('list app cont')

      heroku.listApps().then(function(files){
        console.log('files', files)
      });

    }


    $scope.createApp = function(){
      console.log('create app cont')

      heroku.createApp().then(function(files){
        console.log('files', files)
      });

    }

    $scope.updateApp = function(){
      console.log('update app cont')

      heroku.updateApp().then(function(files){
        console.log('files', files)
      });

    }

    // console.log($cookieStore.get('deploy_token'))



  });

  /*
14e74e0a-af1c-4ba5-baa8-a485453dd7dc
  */