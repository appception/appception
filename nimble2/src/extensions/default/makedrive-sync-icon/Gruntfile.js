module.exports = function( grunt ) {
  grunt.loadNpmTasks( "grunt-contrib-jshint" );
  grunt.initConfig({
    pkg: grunt.file.readJSON( "package.json" ),
    jshint: {
      files: [
        "Gruntfile.js",
        "main.js",
        "package.json"
      ]
    }
  });

  // Register custom tasks
  grunt.registerTask( "default", [ "jshint" ]);
  grunt.registerTask( "travis", [ "jshint" ]);
};
