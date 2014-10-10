'use strict';

describe('Service: repoTemplates', function () {

  // load the service's module
  beforeEach(module('appceptionApp'));

  // instantiate service
  var repoTemplates;
  beforeEach(inject(function (_repoTemplates_) {
    repoTemplates = _repoTemplates_;
  }));

  it('should do something', function () {
    expect(!!repoTemplates).toBe(true);
  });

});
