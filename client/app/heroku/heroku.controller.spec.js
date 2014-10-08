'use strict';

describe('Controller: HerokuCtrl', function () {

  // load the controller's module
  beforeEach(module('appceptionApp'));

  var HerokuCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HerokuCtrl = $controller('HerokuCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
