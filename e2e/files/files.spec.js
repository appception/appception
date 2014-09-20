'use strict';

describe('Files View', function() {
  var page;

  beforeEach(function() {
    browser.get('/files');
    page = require('./files.po');
  });

  // it('should have a sign in button', function() {
  //   expect(page.signin.getText()).toBe('Sign in with Github');
  // });
});
