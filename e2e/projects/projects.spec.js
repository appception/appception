'use strict';

describe('Projects View', function() {
  var projectsPage;

  beforeEach(function() {
    browser.ignoreSynchronization = true;
    browser.get('/projects');
    projectsPage = require('./projects.po');
  });

  afterEach(function() {
    browser.ignoreSynchronization = false;
  });

  it('should render projects view when user navigates to /projects', function() {
    expect(projectsPage.header.getText()).
      toBe('Your Projects');
  });
});
