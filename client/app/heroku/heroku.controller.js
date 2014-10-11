'use strict';

angular.module('appceptionApp')
  .controller('HerokuCtrl', function ($scope, Auth, $window, $location, heroku, $cookieStore) {
    $scope.message = 'Hello';
    $scope.getCurrentUser = Auth.getCurrentUser;
    console.log('Auth.getCurrentUser', Auth.getCurrentUser())

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    // var user = Auth.getCurrentUser();
    var username = 'wykhuh'
    var repo = 'heroku';

    $scope.listApps = function(){
      console.log('list app cont');

      heroku.listApps().then(function(files){
        console.log('files', files);
      });
    };

    $scope.createApp = function(){
      console.log('create app cont');

      heroku.createApp(username, 'testher').then(function(files){
        console.log('files', files);
      });
    };

    $scope.updateApp = function(){
      console.log('update app cont');

      heroku.updateApp(username, repo).then(function(files){
        console.log('files', files);
      });
    };

  });
