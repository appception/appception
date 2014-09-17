'use strict';

angular.module('appceptionApp')
  .directive('testDirective', function () {
    return {
      templateUrl: 'app/testDirective/testDirective.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });