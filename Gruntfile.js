module.exports = function(grunt) {
  var localConfig;

  try {
    localConfig = require('./server/config/local.env');
  } catch (e) {
    localConfig = {};
  } // end try/catch

  // add localConfig vars to process.env:
  for (var key in localConfig) { // TODO: refactor this into ENV or projects.controller.js
    process.env[key] = localConfig[key];
  }

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn',
    protractor: 'grunt-protractor-runner',
    injector: 'grunt-asset-injector',
    buildcontrol: 'grunt-build-control'
  });

  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-exec'); // for executing command lines ==> https://github.com/jharding/grunt-exec

  require('time-grunt')(grunt); // Time how long tasks take (for optimizing)


  /*******************************
   *   Main configuration tasks  *
   ******************************/
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'server/app.js'
        }
      },
      debug: {
        options: {
          script: 'server/app.js',
          debug: true
        }
      }
    }, // end express

    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    }, // end open

    // Use nodemon to run server in debug mode with an initial breakpoint
    nodemon: {
      debug: {
        script: 'server/app.js',
        options: {
          nodeArgs: ['--debug-brk'],
          env: {
            PORT: process.env.PORT || 9000
          },
          callback: function(nodemon) {
            nodemon.on('log', function(event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function() {
              setTimeout(function() {
                require('open')('http://localhost:8080/debug?port=5858');
              }, 500);
            });
          }
        }
      }
    },

    env: {
      test: {
        NODE_ENV: 'test'
      },
      prod: {
        NODE_ENV: 'production'
      },
      all: localConfig
    }, // end env


    /***********************************
     ***   Main task configs here:   ***
     * clean, stylus, wiredep (bower), concat, minify css, uglify js, start server, load browser
     **********************************/
    clean: {
      default: { // name that appears on this task. You can add more argument names at this heirarchy
        files: {
          src: 'client/app/min/*.*'
        }
      },
      serverFiles: 'server/tempfiles/*.*' // Cleaning this removes old user zips
    }, // end clean

    stylus: { // Compiles Stylus to CSS
      compile: {
        options: {
          paths: [
            'client/bower_components',
            'client/app/**/*.styl',
            'client/components'
          ],
          "include css": true
        },
        files: {
          'client/app/app.css': 'client/app/app.styl'
        }
      } // end compile
    }, // end stylus

    wiredep: { // Automatically inject Bower components into the app
      target: {
        src: 'client/index.html',
        ignorePath: 'client/',
        exclude: [/bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/', /bootstrap/]
      }
    }, // wiredep

    autoprefixer: {
      options: {
        browsers: ['> 1%']
      },
      dist: {
        files: {
          'client/app/app.build.css': 'client/app/app.css'
        }
      }
    },

    concat: { // concatenate js and css files
      options: {
        separator: ';'
      },
      js: {
        src: ['client/**/*.js', '!client/**/*.cat.js', '!client/**/*.min.js', '!client/bower_components/**/*.*'],
        dest: 'client/app/min/app.cat.js'
      }, // end .js
    }, // end concat

    cssmin: { // minifies css
      options: {
        keepSpecialComments: 0
      },
      css: {
        files: [{
            src: ['client/app/app.build.css', '!client/**/*.min.css'],
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
            src: ['client/app/min/app.cat.js',
              '!client/**/*.min.js',
              '!client/bower_components'
            ],
            dest: 'client/app/min/app.min.js'
          }] // end files[]
      }
    }, // end uglify

    watch: {
      stylus: {
        files: ['client/app/**/*.styl', 'client/components/**/*.styl'],
        tasks: ['stylus', 'autoprefixer', 'cssmin'] // , 'autoprefixer']
      }, // end stylus
      gruntfile: {
        files: ['Gruntfile.js']
      }, // end gruntfile
      livereload: {
        files: [
          'client/app/**/*.css', 'client/components/**/*.css',
          'client/app/**/*.html', 'client/components/**/*.html',
          'client/app/**/*.js', 'client/components/**/*.js',
          '!client/app/**/*.spec.js', '!client/components/**/*.spec.js',
          '!client/app/**/*.mock.js', '!client/components/**/*.mock.js',
        ],
        options: {
          livereload: true
        }
      }, // end livereload
      express: {
        files: [
          'server/**/*.js'
        ],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          nospawn: true // Without this option specified express won't be reloaded
        }
      }, // end express
    }, // end watch

    exec: { // executes on the command line
      startExec: {
        cmd: 'echo " = = = = Installing NPM and Bower components = = = ="'
      },
      appception: {
        command: 'bower install --recursive' // install bower but NOT npm, or we'll be in a loop!!!
      },
      nimble: { // package
        cwd: './nimble',
        command: 'npm install --recursive && grunt build',
        exitCode: [0, 1, 2, 3, 4, 5, 6, 7, 8] // adding to compensate for deploy errors. As of 10-8-14 this is not necessary, but a precaution.
      },
      mustache: { // package
        cwd: './nimble/src/thirdparty/mustache',
        command: 'npm install --recursive'
      },
      acorn: { // package
        cwd: './nimble/src/extensions/default/JavaScriptCodeHints/thirdparty/acorn',
        command: 'npm install --recursive'
      },
      tern: { // package
        cwd: './nimble/src/extensions/default/JavaScriptCodeHints/thirdparty/tern',
        command: 'npm install --recursive'
      },
      makedriveSyncIcon: { // package  &&  bower
        cwd: './nimble/src/extensions/default/makedrive-sync-icon',
        command: 'npm install --recursive --force'
      },
      codemirror: { // package  &&  bower
        cwd: './nimble/src/thirdparty/CodeMirror2',
        command: 'npm install --recursive && bower install --recursive'
      },
      makedrive: { // package  &&  bower
        cwd: './nimble/src/thirdparty/makedrive',
        command: 'npm install --recursive && bower install --recursive'
      },
      requirejs: { // package
        cwd: './nimble/src/thirdparty/requirejs',
        command: 'npm install --recursive'
      },
    }, // end exec


    /************************************************
     *           Testing:           *
     ************************************************
     * Mocha (Server):
     *   Runs MOCHA tests at /server/api/ ** / *.spec.js
     *   You can add as many tests as you want, in any folder.
     *   Folders should each have at least 1 coverage test.
     *
     * TODO: Karma (Client):
     *   Runs KARMA tests and launches PhantomJS web browser.
     *   Add files / patterns to lad in browser by modifying
     *   karma.conf.js : config.set({
     *   files: [ ADD FILES HERE ]})
     *
     * TODO: Protractor (E2E):
     *   Runs PROTRACTOR tests with Jasmine framework in Chrome browser.
     *   Protractor config file at: protractor.conf.js
     *   Tests are in: /e2e/ ** / *.spec.js
     ***********************************************/

    mochaTest: {
      options: {
        reporter: 'spec'
      },
      src: ['server/api/**/*.spec.js']
    } // end mochaTest

    /*
    karma: {
      unit: {
      configFile: 'karma.conf.js',
      singleRun: true
      }
    }, // end karma
    */

    /*
    protractor: {
      options: {
      configFile: 'protractor.conf.js'
      },
      chrome: {
      options: {
        args: {
        browser: 'chrome'
        }
      }
      }
    }, // end protractor
    */

  }); // end initConfig()


  /**********************************************
   *         Grunt tasks         *
   ***********************************************
   * There are 4 MAIN tasks below:
   *   build - for all build tasks
   *   deploy - for Azure deployment
   *   serve - for the server, either 'local' or 'production'.
   *   test - for testing 'server', 'client', or 'e2e'
   *********************************************/
  grunt.registerTask('wait', function() { // delay livereload until after server restarts
    grunt.log.ok('Waiting for server reload...');
    var done = this.async();
    setTimeout(function() {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });


  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });


  grunt.registerTask('build', [
    'stylus',
    'autoprefixer',
    'clean',
    'concat',
    'cssmin',
    'uglify'
  ]);


  grunt.registerTask('deploy', [
    'build',
    'exec'
  ]);


  grunt.registerTask('serve', function(target) {
    if (target === 'production') {
      return grunt.task.run([
        'express:dev',
        'wait',
        'open'
      ])
    } else if (target === 'local') {
      return grunt.task.run([
        'express:dev',
        'wait',
        'open',
        'watch'
      ])
    }
  }); // end 'grunt serve'


  grunt.registerTask('test', function(target) {
    if (target === 'server') {
      return grunt.task.run([
        'env:all',
        'env:test',
        'mochaTest'
      ]);
    } // end 'server'
    else if (target === 'client') {
      return grunt.task.run([
        'env:all',
        'karma'
      ]);
    } // end 'client'
    else if (target === 'e2e') {
      return grunt.task.run([
        'env:all',
        'env:test',
        'express:dev',
        'protractor'
      ]);
    } // end 'e2e'
    else grunt.task.run([
      'build',
      'test:server',
      'test:client'
    ]);
  }); // end 'grunt test'


  grunt.registerTask('default', [
    'build',
    'serve'
  ]);
}; // end Gruntfile
