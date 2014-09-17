'use strict';

describe('Controller: TestrouteCtrl', function () {

  // load the controller's module
  beforeEach(module('appceptionApp'));

  var TestrouteCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TestrouteCtrl = $controller('TestrouteCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
