'use strict';

angular.module('appceptionApp')
  .controller('NavbarCtrl', function ($scope, $location, $window, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    },
    {
      'title': 'Projects',
      'link': '/projects'
    },
    {
      'title': 'Files',
      'link': '/files'
    }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to files
          $location.path('/files');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

     $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };

  });