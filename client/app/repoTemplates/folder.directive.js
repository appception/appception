'use strict';

angular.module('appceptionApp')
  .directive('folder', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
      	folder: '='
      },
      template: '<li></li>',
      link: function (scope, element, attrs) {
        element.text('this is the folder directive');
      }
    };
  });