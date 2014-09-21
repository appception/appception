'use strict';

describe('Controller: AllProjectsCtrl', function () {

  // load the controller's module
  beforeEach(module('appceptionApp'));

  var AllProjectsCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/projects')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

    scope = $rootScope.$new();
    AllProjectsCtrl = $controller('AllProjectsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of things to the scope', function () {
    $httpBackend.flush();
    expect(scope.projects).toBe(true);
  });
});
