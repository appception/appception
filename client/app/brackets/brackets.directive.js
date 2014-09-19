'use strict';

angular.module('appceptionApp')
  .directive('brackets', function () {
    return {
      templateUrl: 'app/brackets/brackets.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });