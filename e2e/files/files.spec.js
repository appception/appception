'use strict';

describe('Files View', function() {
  var filesPage;

  beforeEach(function() {
		browser.ignoreSynchronization = true;
    browser.get('/files');
    filesPage = require('./files.po');
  });

  afterEach(function() {
		browser.ignoreSynchronization = false;
  });

  // This test will pass once we figure out how to log people in through testing
  it('should render files view when user navigates to /files', function() {
    expect(filesPage.editor.isPresent()).toBeTruthy();
  });
});
