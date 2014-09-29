/***********************************
***        GRUNT   TASKS        ***
* You can issue the following tasks:
*
* grunt  ===================>  DEFAULT TASK.
*   cleans old files, concats, minifies css, uglifies js,



* starts server,
* opens browser
**********************************/

module.exports = function (grunt) {
  var localConfig;

  try {
    localConfig = require('./server/config/local.env');
  } catch (e) {
    localConfig = {};
  } // end try/catch

  // add localConfig vars to process.env:
  // var pEnv = process.env;
  for (var key in localConfig) { // SUPER HACKY FIX!!!!!!!!!!!!!!!
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

  //? Optional??? grunt.loadNpmTasks('grunt-express-server'); // this was originally in require(jit-...)
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  // require('grunt-express-server')(express); // Aaron made this an include instead of part of the jit...

  // grunt.loadNpmTasks('grunt-usemin');
  // grunt.loadNpmTasks('grunt-angular-templates');
  // grunt.loadNpmTasks('grunt-google-cdn');
  // grunt.loadNpmTasks('grunt-protractor-runner');
  // grunt.loadNpmTasks('grunt-asset-injector');
  // grunt.loadNpmTasks('grunt-build-control');
  // require('grunt-angular-templates')(ngTemplates);
  // require('grunt-express-server')(express); // Aaron made this an include instead of part of the jit...
  // useminPrepare: 'grunt-usemin',
  // ngtemplates: 'grunt-angular-templates',
  // cdnify: 'grunt-google-cdn',
  // protractor: 'grunt-protractor-runner',
  // injector: 'grunt-asset-injector',
  // buildcontrol: 'grunt-build-control'
  // require('express')(express);
  // require('useminPrepare')(useminPrepare);
  // require('ngtemplates')(ngtemplates);
  // require('cdnify')(cdnify);
  // require('protractor')(protractor);
  // require('injector')(injector);
  // require('buildcontrol')(buildcontrol);

  // grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-build-control');


  require('time-grunt')(grunt); // Time how long tasks take (for optimizing)

  ////////////////////////////////////////////////////
  // Main configuration tasks
  ////////////////////////////////////////////////////

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
     * clean
     * stylus
     * wiredep (bower)
     * concat
     * minify css
     * uglify js
     * start server
     * load browser
     **********************************/
    clean: {
      default: { // name that appears on this task. You can add more argument names at this heirarchy
        files: {
          src: 'client/app/min/*.*'
        }
      }//,
      // serverFiles: 'server/tempfiles'
    }, // end clean


    /*************************************************************
 _        _______  _        _                         _______  _        _______  _  _  _
| \    /\(  ____ \( \      ( \   |\     /|  |\     /|(  ____ \( \      (  ____ )( )( )( )
|  \  / /| (    \/| (      | (   ( \   / )  | )   ( || (    \/| (      | (    )|| || || |
|  (_/ / | (__    | |      | |    \ (_) /   | (___) || (__    | |      | (____)|| || || |
|   _ (  |  __)   | |      | |     \   /    |  ___  ||  __)   | |      |  _____)| || || |
|  ( \ \ | (      | |      | |      ) (     | (   ) || (      | |      | (      (_)(_)(_)
|  /  \ \| (____/\| (____/\| (____/\| |     | )   ( || (____/\| (____/\| )       _  _  _
|_/    \/(_______/(_______/(_______/\_/     |/     \|(_______/(_______/|/       (_)(_)(_)

*************************************************************/

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


    // injector: {
    //   options: {

    //   },
    //   // Inject component styl into app.styl
    //   stylus: {
    //     options: {
    //       transform: function(filePath) {
    //         filePath = filePath.replace('/client/app/', '');
    //         filePath = filePath.replace('/client/components/', '');
    //         return '@import \'' + filePath + '\';';
    //       },
    //       starttag: '// injector',
    //       endtag: '// endinjector'
    //     },
    //     files: {
    //       'client/app/app.styl': [
    //         'client/{app,components}/**/*.styl',
    //         '!client/app/app.styl'
    //       ]
    //     }
    //   }, // end stylus

    //   // Inject component css into index.html
    //   css: {
    //     options: {
    //       transform: function(filePath) {
    //         filePath = filePath.replace('/client/', '');
    //         filePath = filePath.replace('/.tmp/', '');
    //         return '<link rel="stylesheet" href="' + filePath + '">';
    //       }, // transform
    //       starttag: '<!-- injector:css -->',
    //       endtag: '<!-- endinjector -->'
    //     },
    //     files: {
    //       'client/index.html': [
    //         'client/{app,components}/**/*.css'
    //       ]
    //     }
    //   } // end css
    // }, // end injector


    // Automatically inject Bower components into the app
    wiredep: {
      target: {
        src: 'client/index.html',
        ignorePath: 'client/',
        exclude: [/bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/', /bootstrap/]
      }
    }, // wiredep



    /*************************************************************
,---------. .---.  .---.    ____    ,---.   .--..--.   .--.             ____     __   ,-----.      ___    _  .---.
\          \|   |  |_ _|  .'  __ `. |    \  |  ||  | _/  /              \   \   /  /.'  .-,  '.  .'   |  | | \   /
 `--.  ,---'|   |  ( ' ) /   '  \  \|  ,  \ |  || (`' ) /                \  _. /  '/ ,-.|  \ _ \ |   .'  | | |   |
    |   \   |   '-(_{;}_)|___|  /  ||  |\_ \|  ||(_ ()_)                  _( )_ .';  \  '_ /  | :.'  '_  | |  \ /
    :_ _:   |      (_,_)    _.-`   ||  _( )_\  || (_,_)   __          ___(_ o _)' |  _`,/ \ _/  |'   ( \.-.|   v
    (_I_)   | _ _--.   | .'   _    || (_ o _)  ||  |\ \  |  |        |   |(_,_)'  : (  '\_/ \   ;' (`. _` /|  _ _
   (_(=)_)  |( ' ) |   | |  _( )_  ||  (_,_)\  ||  | \ `'   /        |   `-'  /    \ `"/  \  ) / | (_ (_) _) (_I_)
    (_I_)   (_{;}_)|   | \ (_ o _) /|  |    |  ||  |  \    /          \      /      '. \_/``".'   \ /  . \ /(_(=)_)
    '---'   '(_,_) '---'  '.(_,_).' '--'    '--'`--'   `'-'            `-..-'         '-----'      ``-'`-''  (_I_)
*************************************************************/


    concat: { // concatenate js and css files
      options: {
        separator: ';'
      },
      js: {
        src: ['client/**/*.js', '!client/**/*.cat.js', '!client/**/*.min.js', '!client/bower_components/**/*.*'],
        dest: 'client/app/min/app.cat.js'
      }, // end .js
      css: {
        src: ['client/**/*.css', '!client/**/*.cat.css', '!client/**/*.min.css', '!client/bower_components/**/*.*'],
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
          src: ['client/app/min/app.cat.js',
          '!client/**/*.min.js',
          '!client/bower_components'],
          dest: 'client/app/min/app.min.js'
        }] // end files[]
      }
    }, // end uglify

    watch: {
      stylus: {
        files: ['client/app/**/*.styl', 'client/components/**/*.styl'],
        tasks: ['stylus'] // , 'autoprefixer']
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
    } // end watch


    /**********************************************
     *     END init config
     *********************************************/
  }); // end initConfig()


  /**********************************************
   *     Grunt tasks
   *********************************************/

  // CHOICE SYNTAX:
  //
  //   if (target === 'debug') {
  //     return grunt.task.run([
  //       'clean:server'
  //     ]);
  //   }

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function() {
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

/***********************************
 * There are 3 tasks below:
 *   test - for testing the current task we're working on
 *   clean - to clean temp files
 *   build - for all build tasks that CURRENTLY WORK
 *   serve - for the server.
 *
 * As tests pass, they should be added to 'build' or 'server'.
 * the default 'grunt' task will build, then serve.
 **********************************/

  grunt.registerTask('test', [

    'injector',
    'wiredep',
    'useminPrepare',
    'autoprefixer',
    'ngtemplates',
    'ngAnnotate',
    'cdnify',
    'usemin'
  ]);


  // grunt.registerTask('clean', [
  //   'clean'
  // ]);


  grunt.registerTask('build', [
    'stylus',
    'clean',
    'concat',
    'cssmin',
    'uglify'
  ]);

  grunt.registerTask('serve', [
    'express:dev',
    'wait',
    'open',
    'watch'
  ]);

  grunt.registerTask('default', [
    'build',
    'serve'
  ]);
}; // end Gruntfile

/******************************
 * We might need grunt to issue the following commands during build:
 *
 *   cd nimble // to enter the nimble directory
 *   npm install --recursive // to recursively install npm packages
 *   git submodule update --init // to initialize NIMBLE's submodules!
 *
 * This is to enable the nimble submodule to function over Azure.
******************************/