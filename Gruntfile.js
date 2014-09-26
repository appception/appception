module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';'
      },

      js: {
        src: ['client/**/*.js', '!client/**/*.cat.js', '!client/**/*.min.js'],
        dest: 'client/app/min/app.cat.js'
      }, // end .js
      css: {
        src: ['client/**/*.css', '!client/**/*.cat.css', '!client/**/*.min.css'],
        dest: 'client/app/min/app.cat.css'
      } // end .css
    }, // end concat

    cssmin: { // minifies css
      options: {
        keepSpecialComments: 0
      },
      css: {
        files: [{
          src: ['client/app/min/app.cat.css', '!client/**/*.min.css'],
          dest: 'client/app/min/app.min.css'
        }] // end files[]
      }
    }, // end cssmin

    uglify: { // minifies js
      options: {
        banner: '/*! Aaron, Kelly, & Wai-Yin. Uglified by Grunt. <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      js: {
        files: [{
          src: ['client/app/min/app.cat.js', '!client/**/*.min.js'],
          dest: 'client/app/min/app.min.js'
        }] // end files[]
      }
    }, // end minify

    nodemon: {
      dev: {
        script: 'server.js'
      }
    }, // end nodemon



    // watch: {
    //   scripts: {
    //     files: [
    //       'public/client/**/*.js', 
    //       'public/lib/**/*.js',
    //     ],
    //     tasks: [
    //       'concat',
    //       'uglify'
    //     ]
    //   },
    //   css: {
    //     files: 'public/*.css',
    //     tasks: ['cssmin']
    //   }
    // },

  }); // end initConfig()

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-contrib-watch');

  // grunt.registerTask('server-dev', function(target) {
  //   // Running nodejs in a different process and displaying output on the main console
  //   var nodemon = grunt.util.spawn({
  //     cmd: 'grunt',
  //     grunt: true,
  //     args: 'nodemon'
  //   });
  //   nodemon.stdout.pipe(process.stdout);
  //   nodemon.stderr.pipe(process.stderr);

  //   grunt.task.run(['watch']);
  // });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('build', [
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('default', [
    'concat',
    'cssmin',
    'uglify'
  ]);

  //   grunt.registerTask('deploy', [
  //     'test',
  //     'build',
  //     'upload'
  //   ]);
  // };

};


/**************************
 * OLD FILE
 *************************/


// // Generated on 2014-09-17 using generator-angular-fullstack 2.0.12
// 'use strict';

// /***********************************
//  ***        GRUNT   TASKS        ***
//  * You can issue the following tasks:
//  *
//  *   grunt  ===================>  DEFAULT TASK. Lints code, then runs server tests, then client tests, then builds.
//  *   grunt wait  ==============>  Wait for server to reload
//  *   grunt express-keepalive ==>  Keep grunt running asynchronously
//  *   grunt serve  =============>  Starts the server & watches, with optional targets:
//  *     grunt serve:dist  ========>  Starts the server & watches AFTER running distribution tasks (minify, etc.)
//  *     grunt serve:debug  =======>  Starts the server & watches AFTER cleaning, injecting scripts / components, etc.
//  *   grunt test  ==============>  Runs server then client tests. This has optional targets:
//  *     grunt test:server  =======>  Runs server tests using MOCHA
//  *     grunt test:client  =======>  Runs client tests using KARMA
//  *     grunt test:e2e  ==========>  Runs end-to-end tests using PROTRACTOR
//  *   grunt build  =============>  Builds app by cleaning folders, injecting, minifying, uglifying, etc.
//  **********************************/

// module.exports = function (grunt) {
//   var localConfig;
//   try {
//     localConfig = require('./server/config/local.env');
//   } catch(e) {
//     localConfig = {};
//   }

//   // Load grunt tasks automatically, when needed
  // require('jit-grunt')(grunt, {
  //   express: 'grunt-express-server',
  //   useminPrepare: 'grunt-usemin',
  //   ngtemplates: 'grunt-angular-templates',
  //   cdnify: 'grunt-google-cdn',
  //   protractor: 'grunt-protractor-runner',
  //   injector: 'grunt-asset-injector',
  //   buildcontrol: 'grunt-build-control'
//   });

//   // Time how long tasks take. Can help when optimizing build times
//   require('time-grunt')(grunt);

//   // Define the configuration for all the tasks
//   grunt.initConfig({

//     // Project settings
//     pkg: grunt.file.readJSON('package.json'),
//     yeoman: {
//       // configurable paths
//       client: require('./bower.json').appPath || 'client',
//       dist: 'dist'
//     },
//     express: {
//       options: {
//         port: process.env.PORT || 9000
//       },
//       dev: {
//         options: {
//           script: 'server/app.js',
//           debug: true
//         }
//       },
//       prod: {
//         options: {
//           script: 'dist/server/app.js'
//         }
//       }
//     },
//     open: {
//       server: {
//         url: 'http://localhost:<%= express.options.port %>'
//       }//,
// //      edit: { // to open the project for SublimeText editing
// //        path: 'AppceptionSublimeProject.sublime-project',
// //        tasks: ['edit']
// //      }
//     },
//     watch: {
//       injectJS: {
//         files: [
//           '<%= yeoman.client %>/{app,components}/**/*.js',
//           '!<%= yeoman.client %>/{app,components}/**/*.spec.js',
//           '!<%= yeoman.client %>/{app,components}/**/*.mock.js',
//           '!<%= yeoman.client %>/app/app.js'],
//         tasks: ['injector:scripts']
//       },
//       injectCss: {
//         files: [
//           '<%= yeoman.client %>/{app,components}/**/*.css'
//         ],
//         tasks: ['injector:css']
//       },
//       mochaTest: {
//         files: ['server/**/*.spec.js'],
//         tasks: ['env:test', 'mochaTest']
//       },
//       jsTest: {
//         files: [
//           '<%= yeoman.client %>/{app,components}/**/*.spec.js',
//           '<%= yeoman.client %>/{app,components}/**/*.mock.js'
//         ],
//         tasks: ['newer:jshint:all', 'karma']
//       },
//       injectStylus: {
//         files: [
//           '<%= yeoman.client %>/{app,components}/**/*.styl'],
//         tasks: ['injector:stylus']
//       },
//       stylus: {
//         files: [
//           '<%= yeoman.client %>/{app,components}/**/*.styl'],
//         tasks: ['stylus', 'autoprefixer']
//       },
//       gruntfile: {
//         files: ['Gruntfile.js']
//       },
//       livereload: {
//         files: [
//           '{.tmp,<%= yeoman.client %>}/{app,components}/**/*.css',
//           '{.tmp,<%= yeoman.client %>}/{app,components}/**/*.html',
//           '{.tmp,<%= yeoman.client %>}/{app,components}/**/*.js',
//           '!{.tmp,<%= yeoman.client %>}{app,components}/**/*.spec.js',
//           '!{.tmp,<%= yeoman.client %>}/{app,components}/**/*.mock.js',
//           '<%= yeoman.client %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
//         ],
//         options: {
//           livereload: true
//         }
//       },
//       express: {
//         files: [
//           'server/**/*.{js,json}'
//         ],
//         tasks: ['express:dev', 'wait'],
//         options: {
//           livereload: true,
//           nospawn: true //Without this option specified express won't be reloaded
//         }
//       }
//     },

//     // Make sure code styles are up to par and there are no obvious mistakes
//     jshint: {
//       options: {
//         jshintrc: '<%= yeoman.client %>/.jshintrc',
//         reporter: require('jshint-stylish')
//       },
//       server: {
//         options: {
//           jshintrc: 'server/.jshintrc'
//         },
//         src: [
//           'server/**/*.js',
//           '!server/**/*.spec.js'
//         ]
//       },
//       serverTest: {
//         options: {
//           jshintrc: 'server/.jshintrc-spec'
//         },
//         src: ['server/**/*.spec.js']
//       },
//       all: [
//         '<%= yeoman.client %>/{app,components}/**/*.js',
//         '!<%= yeoman.client %>/{app,components}/**/*.spec.js',
//         '!<%= yeoman.client %>/{app,components}/**/*.mock.js'
//       ],
//       test: {
//         src: [
//           '<%= yeoman.client %>/{app,components}/**/*.spec.js',
//           '<%= yeoman.client %>/{app,components}/**/*.mock.js'
//         ]
//       }
//     },

//     // Empties folders to start fresh
//     clean: {
//       dist: {
//         files: [{
//           dot: true,
//           src: [
//             '.tmp',
//             '<%= yeoman.dist %>/*',
//             '!<%= yeoman.dist %>/.git*',
//             '!<%= yeoman.dist %>/.openshift',
//             '!<%= yeoman.dist %>/Procfile'
//           ]
//         }]
//       },
//       server: '.tmp'
//     },

//     // Add vendor prefixed styles
//     autoprefixer: {
//       options: {
//         browsers: ['last 1 version']
//       },
//       dist: {
//         files: [{
//           expand: true,
//           cwd: '.tmp/',
//           src: '{,*/}*.css',
//           dest: '.tmp/'
//         }]
//       }
//     },

//     // Debugging with node inspector
//     'node-inspector': {
//       custom: {
//         options: {
//           'web-host': 'localhost'
//         }
//       }
//     },

//     // Use nodemon to run server in debug mode with an initial breakpoint
//     nodemon: {
//       debug: {
//         script: 'server/app.js',
//         options: {
//           nodeArgs: ['--debug-brk'],
//           env: {
//             PORT: process.env.PORT || 9000
//           },
//           callback: function (nodemon) {
//             nodemon.on('log', function (event) {
//               console.log(event.colour);
//             });

//             // opens browser on initial server start
//             nodemon.on('config:update', function () {
//               setTimeout(function () {
//                 require('open')('http://localhost:8080/debug?port=5858');
//               }, 500);
//             });
//           }
//         }
//       }
//     },

//     // Automatically inject Bower components into the app
//     wiredep: {
//       target: {
//         src: '<%= yeoman.client %>/index.html',
//         ignorePath: '<%= yeoman.client %>/',
//         exclude: [/bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/', /bootstrap/]
//       }
//     },

//     // Renames files for browser caching purposes
//     rev: {
//       dist: {
//         files: {
//           src: [
//             '<%= yeoman.dist %>/public/{,*/}*.js',
//             '<%= yeoman.dist %>/public/{,*/}*.css',
//             '<%= yeoman.dist %>/public/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
//             '<%= yeoman.dist %>/public/assets/fonts/*'
//           ]
//         }
//       }
//     },

//     // Reads HTML for usemin blocks to enable smart builds that automatically
//     // concat, minify and revision files. Creates configurations in memory so
//     // additional tasks can operate on them
//     useminPrepare: {
//       html: ['<%= yeoman.client %>/index.html'],
//       options: {
//         dest: '<%= yeoman.dist %>/public'
//       }
//     },

//     // Performs rewrites based on rev and the useminPrepare configuration
//     usemin: {
//       html: ['<%= yeoman.dist %>/public/{,*/}*.html'],
//       css: ['<%= yeoman.dist %>/public/{,*/}*.css'],
//       js: ['<%= yeoman.dist %>/public/{,*/}*.js'],
//       options: {
//         assetsDirs: [
//           '<%= yeoman.dist %>/public',
//           '<%= yeoman.dist %>/public/assets/images'
//         ],
//         // This is so we update image references in our ng-templates
//         patterns: {
//           js: [
//             [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
//           ]
//         }
//       }
//     },

//     // The following *-min tasks produce minified files in the dist folder
//     imagemin: {
//       dist: {
//         files: [{
//           expand: true,
//           cwd: '<%= yeoman.client %>/assets/images',
//           src: '{,*/}*.{png,jpg,jpeg,gif}',
//           dest: '<%= yeoman.dist %>/public/assets/images'
//         }]
//       }
//     },

//     svgmin: {
//       dist: {
//         files: [{
//           expand: true,
//           cwd: '<%= yeoman.client %>/assets/images',
//           src: '{,*/}*.svg',
//           dest: '<%= yeoman.dist %>/public/assets/images'
//         }]
//       }
//     },

//     // Allow the use of non-minsafe AngularJS files. Automatically makes it
//     // minsafe compatible so Uglify does not destroy the ng references
//     ngAnnotate: {
//       dist: {
//         files: [{
//           expand: true,
//           cwd: '.tmp/concat',
//           src: '*/**.js',
//           dest: '.tmp/concat'
//         }]
//       }
//     },

//     // Package all the html partials into a single javascript payload
//     ngtemplates: {
//       options: {
//         // This should be the name of your apps angular module
//         module: 'appceptionApp',
//         htmlmin: {
//           collapseBooleanAttributes: true,
//           collapseWhitespace: true,
//           removeAttributeQuotes: true,
//           removeEmptyAttributes: true,
//           removeRedundantAttributes: true,
//           removeScriptTypeAttributes: true,
//           removeStyleLinkTypeAttributes: true
//         },
//         usemin: 'app/app.js'
//       },
//       main: {
//         cwd: '<%= yeoman.client %>',
//         src: ['{app,components}/**/*.html'],
//         dest: '.tmp/templates.js'
//       },
//       tmp: {
//         cwd: '.tmp',
//         src: ['{app,components}/**/*.html'],
//         dest: '.tmp/tmp-templates.js'
//       }
//     },

//     // Replace Google CDN references
//     cdnify: {
//       dist: {
//         html: ['<%= yeoman.dist %>/public/*.html']
//       }
//     },

//     // Copies remaining files to places other tasks can use
//     copy: {
//       dist: {
//         files: [{
//           expand: true,
//           dot: true,
//           cwd: '<%= yeoman.client %>',
//           dest: '<%= yeoman.dist %>/public',
//           src: [
//             '*.{ico,png,txt}',
//             '.htaccess',
//             'bower_components/**/*',
//             'assets/images/{,*/}*.{webp}',
//             'assets/fonts/**/*',
//             'index.html'
//           ]
//         }, {
//           expand: true,
//           cwd: '.tmp/images',
//           dest: '<%= yeoman.dist %>/public/assets/images',
//           src: ['generated/*']
//         }, {
//           expand: true,
//           dest: '<%= yeoman.dist %>',
//           src: [
//             'package.json',
//             'server/**/*'
//           ]
//         }]
//       },
//       styles: {
//         expand: true,
//         cwd: '<%= yeoman.client %>',
//         dest: '.tmp/',
//         src: ['{app,components}/**/*.css']
//       }
//     },

//     buildcontrol: {
//       options: {
//         dir: 'dist',
//         commit: true,
//         push: true,
//         connectCommits: false,
//         message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
//       },
//       heroku: {
//         options: {
//           remote: 'heroku',
//           branch: 'master'
//         }
//       },
//       openshift: {
//         options: {
//           remote: 'openshift',
//           branch: 'master'
//         }
//       }
//     },

//     // Run some tasks in parallel to speed up the build process
//     concurrent: {
//       server: [
//         'stylus',
//       ],
//       test: [
//         'stylus',
//       ],
//       debug: {
//         tasks: [
//           'nodemon',
//           'node-inspector'
//         ],
//         options: {
//           logConcurrentOutput: true
//         }
//       },
//       dist: [
//         'stylus',
//         'imagemin',
//         'svgmin'
//       ]
//     },

//     // Test settings
//     karma: {
//       unit: {
//         configFile: 'karma.conf.js',
//         singleRun: true
//       }
//     },

//     mochaTest: {
//       options: {
//         reporter: 'spec'
//       },
//       src: ['server/**/*.spec.js']
//     },

//     protractor: {
//       options: {
//         configFile: 'protractor.conf.js'
//       },
//       chrome: {
//         options: {
//           args: {
//             browser: 'chrome'
//           }
//         }
//       }
//     },

//     env: {
//       test: {
//         NODE_ENV: 'test'
//       },
//       prod: {
//         NODE_ENV: 'production'
//       },
//       all: localConfig
//     },

//     // Compiles Stylus to CSS
//     stylus: {
//       server: {
//         options: {
//           paths: [
//             '<%= yeoman.client %>/bower_components',
//             '<%= yeoman.client %>/app',
//             '<%= yeoman.client %>/components'
//           ],
//           "include css": true
//         },
//         files: {
//           '.tmp/app/app.css' : '<%= yeoman.client %>/app/app.styl'
//         }
//       }
//     },

//     injector: {
//       options: {

//       },
//       // Inject application script files into index.html (doesn't include bower)
//       scripts: {
//         options: {
//           transform: function(filePath) {
//             filePath = filePath.replace('/client/', '');
//             filePath = filePath.replace('/.tmp/', '');
//             return '<script src="' + filePath + '"></script>';
//           },
//           starttag: '<!-- injector:js -->',
//           endtag: '<!-- endinjector -->'
//         },
//         files: {
//           '<%= yeoman.client %>/index.html': [
//               ['{.tmp,<%= yeoman.client %>}/{app,components}/**/*.js',
//                '!{.tmp,<%= yeoman.client %>}/app/app.js',
//                '!{.tmp,<%= yeoman.client %>}/{app,components}/**/*.spec.js',
//                '!{.tmp,<%= yeoman.client %>}/{app,components}/**/*.mock.js']
//             ]
//         }
//       },

//       // Inject component styl into app.styl
//       stylus: {
//         options: {
//           transform: function(filePath) {
//             filePath = filePath.replace('/client/app/', '');
//             filePath = filePath.replace('/client/components/', '');
//             return '@import \'' + filePath + '\';';
//           },
//           starttag: '// injector',
//           endtag: '// endinjector'
//         },
//         files: {
//           '<%= yeoman.client %>/app/app.styl': [
//             '<%= yeoman.client %>/{app,components}/**/*.styl',
//             '!<%= yeoman.client %>/app/app.styl'
//           ]
//         }
//       },

//       // Inject component css into index.html
//       css: {
//         options: {
//           transform: function(filePath) {
//             filePath = filePath.replace('/client/', '');
//             filePath = filePath.replace('/.tmp/', '');
//             return '<link rel="stylesheet" href="' + filePath + '">';
//           },
//           starttag: '<!-- injector:css -->',
//           endtag: '<!-- endinjector -->'
//         },
//         files: {
//           '<%= yeoman.client %>/index.html': [
//             '<%= yeoman.client %>/{app,components}/**/*.css'
//           ]
//         }
//       }
//     },
//   });

//   // Used for delaying livereload until after server has restarted
//   grunt.registerTask('wait', function () {
//     grunt.log.ok('Waiting for server reload...');

//     var done = this.async();

//     setTimeout(function () {
//       grunt.log.writeln('Done waiting!');
//       done();
//     }, 1500);
//   });

//   grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
//     this.async();
//   });

//   grunt.registerTask('serve', function (target) {
//     if (target === 'dist') {
//       return grunt.task.run(['build', 'env:all', 'env:prod', 'express:prod', 'wait', 'open', 'express-keepalive']);
//     }

//     if (target === 'debug') {
//       return grunt.task.run([
//         'clean:server',
//         'env:all',
//         'injector:stylus',
//         'concurrent:server',
//         'injector',
//         'wiredep',
//         'autoprefixer',
//         'concurrent:debug'
//       ]);
//     }

//     grunt.task.run([
//       'clean:server',
//       'env:all',
//       'injector:stylus',
//       'concurrent:server',
//       'injector',
//       'wiredep',
//       'autoprefixer',
//       'express:dev',
//       'wait',
//       'open',
//       'watch'
//     ]);
//   });

//   grunt.registerTask('server', function () {
//     grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
//     grunt.task.run(['serve']);
//   });

//   grunt.registerTask('test', function(target) {
//     if (target === 'server') {
//       return grunt.task.run([
//         'env:all',
//         'env:test',
//         'mochaTest'
//       ]);
//     }

//     else if (target === 'client') {
//       return grunt.task.run([
//         'clean:server',
//         'env:all',
//         'injector:stylus',
//         'concurrent:test',
//         'injector',
//         'autoprefixer',
//         'karma'
//       ]);
//     }

//     else if (target === 'e2e') {
//       return grunt.task.run([
//         'clean:server',
//         'env:all',
//         'env:test',
//         'injector:stylus',
//         'concurrent:test',
//         'injector',
//         'wiredep',
//         'autoprefixer',
//         'express:dev',
//         'protractor'
//       ]);
//     }

//     else grunt.task.run([
//       'test:server',
//       'test:client'
//     ]);
//   });

//   grunt.registerTask('build', [
//     'clean:dist',
//     'injector:stylus',
//     'concurrent:dist',
//     'injector',
//     'wiredep',
//     'useminPrepare',
//     'autoprefixer',
//     'ngtemplates',
//     'concat',
//     'ngAnnotate',
//     'copy:dist',
//     'cdnify',
//     'cssmin',
//     'uglify',
//     'rev',
//     'usemin'
//   ]);

//   grunt.registerTask('default', [
//     'newer:jshint',
//     'test',
//     'build'
//   ]);

//   //grunt.registerTask('edit', [
//   //]);
// };
