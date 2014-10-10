'use strict';

angular.module('appceptionApp')
  .directive('repotemplate', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
      	repotemplate: '='
      },
      template: "<ul><folder ng-repeat='folder in repotemplate' folder='folder'></folder></ul>",
    };
  });