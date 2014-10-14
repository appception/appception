'use strict';
// This factory interacts with the Heroku API.
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

    $scope.accountInfo = function(){
      heroku.accountInfo().then(function(info){
        console.log('info', info);
      });
    }

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
