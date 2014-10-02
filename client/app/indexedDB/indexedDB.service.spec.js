'use strict';

describe('Service: indexedDB', function () {

  // load the service's module
  beforeEach(module('appceptionApp'));

  // instantiate service
  var indexedDB;
  beforeEach(inject(function (_indexedDB_) {
    indexedDB = _indexedDB_;
  }));

  it('should do something', function () {
    expect(!!indexedDB).toBe(true);
  });

});
