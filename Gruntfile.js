'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    clean: ['temp'],
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
    },
    nodeunit: {
      tests: ['test/*_test.js']
    },
    uglify: {
      dist: {
        files: {
          'temp/scripts/uglify_output.js': []
        }
      },
      options: {
        mangle: true
      }
    },
    mincss: {
      compress: {
        src: ['test/fixtures/styles/input.css'],
        dest: 'temp/styles/mincss_output.css'
      }
    },

    importsrc: {
      test: {
        files: {
          'temp/index.html': 'test/fixtures/index.html',
        }
      }
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-mincss');

  grunt.registerTask('test', ['clean', 'importsrc', 'nodeunit']);

  grunt.registerTask('default', ['jshint', 'test']);
};