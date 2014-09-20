'use strict';

describe('Projects View', function() {
  var page;

  beforeEach(function() {
    browser.get('/projects');
    page = require('./projects.po');
  });

  // it('should have a sign in button', function() {
  //   expect(page.signin.getText()).toBe('Sign in with Github');
  // });
});
