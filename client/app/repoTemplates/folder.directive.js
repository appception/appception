'use strict';

angular.module('appceptionApp')
  .directive('folder', function ($compile) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
      	folder: '='
      },
      template: '<li>{{folder.name}}</li>',
      link: function (scope, element, attrs) {
      	// Check if this folder(or file) has children.
        if(angular.isArray(scope.folder.children)) {
        	// Append the repotemplate (maybe rename this to folder?) directive to this element.
        	element.addClass('fa fa-folder-o')
        	element.append("<repotemplate repotemplate='folder.children'></repotemplate")
        	// Tell angular to render the directive.
        	$compile(element.contents())(scope)
        } else {
        	element.addClass('fa fa-file-text-o')
        }
      }
    };
  });