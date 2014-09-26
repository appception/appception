/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var ProjectsPage = function() {
	this.header = element(by.css('h1'));
  // this.signin = element(by.cssContainingText('button', 'Sign in with Github'));
};

module.exports = new ProjectsPage();

