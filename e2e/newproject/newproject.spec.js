'use strict';

describe('New Project View', function() {
  var newprojectPage;

  beforeEach(function() {
		browser.ignoreSynchronization = true;
    browser.get('/newproject');
    newprojectPage = require('./newproject.po');
  });

  afterEach(function() {
		browser.ignoreSynchronization = false;
  });

  //Need to figure out how to log User in to make test pass

  it('should render new project view when user navigates to /newproject', function() {
    expect(newprojectPage.header.getText()).
      toBe('Create a New Project');
  });
});
