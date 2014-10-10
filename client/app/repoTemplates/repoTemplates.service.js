'use strict';

angular.module('appceptionApp')
  .service('repoTemplates', function ($http) {
    var getTemplates = function() {
      return $http({
        method: 'GET',
        url: '/api/projects/templates'
      })
    }

    return {
    	getTemplates: getTemplates
    }
  });
