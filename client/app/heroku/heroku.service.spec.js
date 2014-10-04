'use strict';

describe('Service: heroku', function () {

  // load the service's module
  beforeEach(module('appceptionApp'));

  // instantiate service
  var heroku;
  beforeEach(inject(function (_heroku_) {
    heroku = _heroku_;
  }));

  it('should do something', function () {
    expect(!!heroku).toBe(true);
  });

});
