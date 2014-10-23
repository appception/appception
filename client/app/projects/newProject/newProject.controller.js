'use strict';

angular.module('appceptionApp')
  .controller('NewProjectCtrl', function ($scope, $state, github, Auth, indexedDB, $window, $location, repoTemplates) {
    $scope.repoName = '';
    $scope.creating = false;

    $scope.generator = 'beginner';
    $scope.allTemplates;
    $scope.renderedTemplate;
    $scope.templateNames = [];

    $scope.deploymentProvider='';

    // List of generators and their deployment branch.
    var generatorDeployment = {
      'AngularJS': 'heroku',
      'AngularJS-Full-Stack':'heroku',
      'Backbone': 'heroku',
      'beginner': 'gh-pages',
      'beginner-test': 'gh-pages',
      'ChromeExtension': 'heroku',
      'Ember': 'heroku',
      'foundation': 'gh-pages',
      'google-web-starter-kit': 'gh-pages',
      'GulpWebapp': 'heroku',
      'Heroku': 'heroku',
      'Ionic': 'heroku',
      'Mobile': 'heroku',
      'Polymer': 'heroku',
      'WebBasic': 'gh-pages' 
    };

    // Login with heroku.
    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

    // Create a new repo.
    $scope.createRepo = function(repoName, generator) {
      // console.log('generator', generator);
      // console.log('deployment', deployment);

      var deployment = generatorDeployment[generator];

      // Empties the user's browser's local database
      indexedDB.emptyLocalDB();

      $scope.creating = true;
      Auth.isLoggedInAsync(function(boolean) {
        if(boolean === true){
          var user = Auth.getCurrentUser()
          // Create a new repo in Github.
          github.createRepo(user.github.login, repoName, generator, deployment).then(function(res) {
            // Inserts file template in browser's local database.
            indexedDB.insertRepoIntoLocalDB(repoName, res.data);
            // Redirect to files page
            $state.go('files');
          })
        }else {
          $scope.files = 'Sorry, there has been an error while creating your repo.';
        }
      })
    };

    // Render the prebuilt file templates.
    $scope.renderTemplate = function(repo) {
      $scope.allTemplates.forEach(function(value) {
        if(repo === value.name) {
          // console.log(value)
          $scope.renderedTemplate = [value]
        }
      })
    }

    // When the page loads, load all the prebuilt file templates.
    repoTemplates.getTemplates()
      .then(function(res) {
        // console.log(res.data)
        $scope.allTemplates = res.data;
        $scope.allTemplates.forEach(function(value) {
          $scope.templateNames.push(value.name)
        })
        $scope.renderTemplate('beginner')
      });
  });
