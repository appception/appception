'use strict';

describe('Controller: TestcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('appceptionApp'));

  var TestcontrollerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TestcontrollerCtrl = $controller('TestcontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
