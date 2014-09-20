'use strict';

describe('Main View', function() {
  var page;

  beforeEach(function() {
    browser.get('/');
    page = require('./main.po');
  });

  it('should have a sign in button', function() {
    expect(page.signin.getText()).toBe('Sign in with Github');
  });
});
