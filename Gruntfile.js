'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    clean: {
      dist: ['temp']
    },
    nodeunit: {
      tests: ['test/*_test.js']
    },
    watch: {
      dev: {
        files: ['Gruntfile.js', 'tasks/*.js', '<%= nodeunit.tests %>'],
        tasks: ['test']
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'tasks/*.js', '<%= nodeunit.tests %>'],
      options: {
        jshintrc: '.jshintrc',
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['test']);
  grunt.registerTask('test', ['jshint']);
};