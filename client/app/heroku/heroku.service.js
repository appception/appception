'use strict';

angular.module('appceptionApp')
  .factory('heroku', function ($http, $cookieStore) {
    
    // List the user's Heroku apps.
    var listApps = function(){
      // console.log('inside service listApps');
      return $http({
        method: 'GET',
        url: '/api/heroku'
      });
    };

    // Get information about the Heroku account.
    var accountInfo = function(){
      return $http({
        method: 'GET',
        url: '/api/heroku/accountInfo'
      });
    };

    // Create Heroku app.
    var createApp = function(githubLogin, repoName){
      // console.log('inside service createApp');
      return $http({
        method: 'POST',
        url: '/api/heroku/createApp',
        params: {
          githubLogin: githubLogin,
          repoName: repoName
        }
      });
    };

    // Update the Heroku app.
    var updateApp = function(githubLogin, repoName){
      // console.log('inside service updateApp');
      return $http({
        method: 'POST',
        url: '/api/heroku/updateApp',
        params: {
          githubLogin: githubLogin,
          repoName: repoName
        }
      });
    };

    // Returns the number of Heroku apps user has.
    var countHerokuApps = function(){
      return listApps().then(function(apps){
        return apps.data.length;
      });
    };

    // Create new Heroku app if user logged in and app doesn't exist.
    var createHerokuApp = function(username, repoName){
      // Get a list of Heroku apps for logged in user.
      return listApps().then(function(apps){
        // console.log('list of apps', apps);

        var appExists = false;
        // Check if the current repo already has a heroko app.
        angular.forEach(apps.data, function(app){
          if(app.name === username + '-' + repoName) {
            appExists = true;
          }
        });

        // If current app isn't already a heroku app, create a heroku app.
        if(!appExists) {
          console.log('create new app:', username, repoName);
          // returns a promise when app is created
           var result= createApp(username, repoName);
           return result;
        }

      });
    };


    return {
      listApps: listApps,
      createApp: createApp,
      updateApp: updateApp,
      createHerokuApp: createHerokuApp,
      accountInfo: accountInfo,
      countHerokuApps: countHerokuApps
    };

  });


