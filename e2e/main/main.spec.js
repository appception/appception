'use strict';

describe('Main View', function() {
  var mainPage;

  beforeEach(function() {
  	// Controversial solution in Angular community to timeout issue, may cause other issues (without this line, Protractor gets stuck on the first test with an error that says: Error: Error while waiting for Protractor to sync with the page: {})
		browser.ignoreSynchronization = true;
    browser.get('/');
    mainPage = require('./main.po');
  });

  afterEach(function() {
		browser.ignoreSynchronization = false;
  });

  it('should render main view when user navigates to /', function() {
    expect(mainPage.header.getText())
      .toBe('A Web App to Make Web Apps');
  });

  it('should have a sign in button', function() {
    expect(mainPage.signin.getText()).toBe('Sign in with Github');
  });
});
