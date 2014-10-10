'use strict';

describe('Directive: folder', function () {

  // load the directive's module
  beforeEach(module('appceptionApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<folder></folder>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the folder directive');
  }));
});