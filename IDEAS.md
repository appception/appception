## Random group of Ideas ##
	- Allow automatic cloning of repo to desktop
	- Auto push and pull on desktop
	- CSS templates (bootstrap, material design)
	- Ability to have personal templates (I like to have my SASS files set up a certain way, would be cool to be able to store that somewhere and pull it up later)

## Aaron's edits 9.16.14 ##
  - Using Monk's angular-fullstack generator: https://github.com/DaftMonk/generator-angular-fullstack
  ```
  yo angular-fullstack Appception
  ```
  - for difference between 2 MEAN generators, see: http://stackoverflow.com/questions/24601323/what-is-the-relationship-between-generator-angular-and-generator-angular-fullsta
  - Testing with:
  ```
  karma        (runs unit tests in browser)
  Mocha? (NOTE: might change to Jasmine later)
  protractor   (angular-focused) 
  ```
  Later versions might use:
  ```
  jasmine      (Complete client-side testing framework -- use with karma)   NOTE: Might not work out-the-box...
  jasmine-node (Complete server-side unit testing)                           NOTE: Might not work out-the-box...
  ```
  
## Building the app ##
  - Run the following commands:
  ```
  grunt              || to build
  grunt edit         || to open project in Sublime
  grunt serve        || preview
  grunt serve:dist   || preview of built app
  ```
  
## Adding helpful components ##
  - You can also add the following, with details here: https://github.com/DaftMonk/generator-angular-fullstack
  ```
  ROUTE:
    yo angular-fullstack:route myroute
    [?] Where would you like to create this route? client/app/
    [?] What will the url of your route be? /myroute

  CONTROLLER:
    yo angular-fullstack:controller user
    [?] Where would you like to create this controller? client/app/

  DIRECTIVE:
    yo angular-fullstack:directive myDirective
    [?] Where would you like to create this directive? client/app/
    [?] Does this directive need an external html file? Yes
    ```
    
## NOTES ##
Might need:
```
npm run update-webdriver
```

Also, for testing:
```
grunt test           || run the client and server unit tests with karma and mocha.
grunt test:server    || only run server tests.
grunt test:client    || only run client tests.   
grunt test:e2e       || protractor tests located in the e2e folder.
```
    
    