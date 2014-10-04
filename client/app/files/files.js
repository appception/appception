'use strict';

angular.module('appceptionApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('files', {
        url: '/files/{repoName}',
        templateUrl: 'app/files/files.html',
        controller: 'FilesCtrl',
        authenticate: true
      });
  });

// var hideLoader = function() {
// 	alert('im loaded')
// }
