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

    var createApp = function(){
      console.log('inside service createApp');
      return $http({
        method: 'POST',
        url: '/api/heroku/createApp'
      });
    };

    var updateApp = function(){
      console.log('inside service updateApp');
      return $http({
        method: 'POST',
        url: '/api/heroku/updateApp'
      });
    };

    return {
      listApps: listApps,
      createApp: createApp,
      updateApp: updateApp
    };

  });
