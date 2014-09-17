'use strict';

describe('Directive: testDirective', function () {

  // load the directive's module and view
  beforeEach(module('appceptionApp'));
  beforeEach(module('app/testDirective/testDirective.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<test-directive></test-directive>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the testDirective directive');
  }));
});