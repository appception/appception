'use strict';

describe('Directive: repoTemplates', function () {

  // load the directive's module
  beforeEach(module('appceptionApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<repo-templates></repo-templates>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the repoTemplates directive');
  }));
});