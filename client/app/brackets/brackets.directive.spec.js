'use strict';

describe('Directive: brackets', function () {

  // load the directive's module and view
  beforeEach(module('appceptionApp'));
  beforeEach(module('app/brackets/brackets.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<brackets></brackets>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the brackets directive');
  }));
});