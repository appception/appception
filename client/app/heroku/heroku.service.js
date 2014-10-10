'use strict';

angular.module('appceptionApp')
  .factory('heroku', function ($http) {
    
    var listApps = function(){
      console.log('inside service listApps');
      return $http({
        method: 'GET',
        url: '/api/heroku'
      });
    };

    var createApp = function(githubLogin, repoName){
      console.log('inside service createApp');
      return $http({
        method: 'POST',
        url: '/api/heroku/createApp',
        params: {
          githubLogin: githubLogin,
          repoName: repoName
        }
      });
    };

    var updateApp = function(githubLogin, repoName){
      console.log('inside service updateApp');
      return $http({
        method: 'POST',
        url: '/api/heroku/updateApp',
        params: {
          githubLogin: githubLogin,
          repoName: repoName
        }
      });
    };

    return {
      listApps: listApps,
      createApp: createApp,
      updateApp: updateApp
    };

  });


