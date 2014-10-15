'use strict';

// This factory interacts with the Github API.
// Right now, making call to server to make a call to Github.
// TODO: To make faster, switch this to client side call to Github using CORS.
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

    //Get the all thee files for one one repo for the logged in user.
    var getRepoFiles = function(githubLogin, repoName, githubBranch) {
      return $http({
        method: 'GET',
        url: '/api/projects/files',
        params: {
          githubLogin: githubLogin,
          repoName: repoName,
          githubBranch: githubBranch
        }
      });
    };

    // Create a Github repo.
    var createRepo = function(githubLogin, repoName, generator, deployment) {
      console.log('inside service createRepo');
      return $http({
        method: 'GET',
        url: '/api/projects/new',
        params: {
          githubLogin: githubLogin,
          repoName: repoName,
          generator: generator,
          deployment: deployment
        }
      })
    };

    // Commit files to Github.
    var createCommit = function(githubLogin, repoName, branches, message, filesArray, updateHerokuApp) {
      console.log('inside createCommit')
      return $http({
        method: 'POST',
        url: '/api/projects/commit',
        data: {
          githubLogin: githubLogin,
          repoName: repoName,
          message: message,
          filesArray: JSON.stringify(filesArray),
          branches: branches,
          updateHerokuApp: updateHerokuApp
        }
      })
    }


    // Get all the branches for a repo.
    var getBranches = function(githubLogin, repoName) {
      return $http({
        method: 'GET',
        url: '/api/projects/branches',
        params: {
          githubLogin: githubLogin,
          repoName: repoName
        }
      })
    };

    // Create a new branch on Github.
    var createBranch = function(githubLogin, repoName, baseBranchName, newBranchName) {
      return $http({
        method: 'GET',
        url: '/api/projects/createbranch',
        params: {
          githubLogin: githubLogin,
          repoName: repoName,
          baseBranchName: baseBranchName,
          newBranchName: newBranchName
        }
      })
    };

    // Stores info about the current repo.
    var currentRepoInformation = {
      repoName: '',
      branch: ''
    }

    // Get the template files.
    var getTemplates = function() {
      return $http({
        method: 'GET',
        url: '/api/projects/templates'
      })
    }

    return {
      getRepos: getRepos,
      getRepoFiles: getRepoFiles,
      createRepo: createRepo,
      createCommit: createCommit,
      createBranch: createBranch,
      getBranches: getBranches,
      getTemplates: getTemplates,
      currentRepoInformation: currentRepoInformation
    };
  });
