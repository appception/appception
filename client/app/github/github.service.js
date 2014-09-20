'use strict';

angular.module('appceptionApp')
  .factory('github', function ($http) {
    // Service logic
    // ...

    var meaningOfLife = 42;

    var someMethod = function () {
        return meaningOfLife;
    };

    var getRepos = function(){
      return $http({
        method: 'GET',
        url: '/api/projects'
      });
    };

    // Public API here
    return {
      someMethod: someMethod,
      getRepos: getRepos
    };
  });
