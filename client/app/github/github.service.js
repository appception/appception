'use strict';

// This factory interacts with the Github API
angular.module('appceptionApp')
  .factory('github', function ($http) {

    // Get all repos for the logged in user.
    var getRepos = function(githubLogin){
      return $http({
        method: 'GET',
        url: '/api/projects',
        params: {githubLogin: githubLogin}
      });
    };

    return {
      getRepos: getRepos
    };
  });
