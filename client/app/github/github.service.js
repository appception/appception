'use strict';

// This factory interacts with the Github API
angular.module('appceptionApp')
  .factory('github', function ($http, Auth) {

    // Get all repos for the logged in user.
    var getRepos = function(githubLogin) {
      return $http({
        method: 'GET',
        url: '/api/projects',
        params: {githubLogin: githubLogin}
      });
    };

    //Get list and content of repo files for the logged in user.
    var getRepoFiles = function(githubLogin, githubRepo) {
      return $http({
        method: 'GET',
        url: '/api/projects/files',
        params: {
          githubLogin: githubLogin,
          githubRepo: githubRepo
        }
      });
    };

    var getRepoFilesClient = function(githubLogin, githubRepo) {
      console.log('inside getArchiveLink')
      return $http({
        method: 'GET',
        url: 'https://github.org/' + githubLogin + '/' + githubRepo + '/zipball/master',
      });
    };

    var createRepo = function(githubLogin, repoName) {
      console.log('inside service createRepo');
      return $http({
        method: 'GET',
        url: '/api/projects/new',
        params: {
          githubLogin: githubLogin,
          repoName: repoName
        }
      })
    };

    return {
      getRepos: getRepos,
      getRepoFiles: getRepoFiles,
      createRepo: createRepo
    };
  });
