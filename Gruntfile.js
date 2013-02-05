'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    clean: ['temp'],
    watch: {
      test: {
        files: ['<%= jshint.all %>'],
        tasks: ['test']
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'tasks/*.js', 'lib/*.js', '<%= nodeunit.tests %>'],
      options: {
        jshintrc: '.jshintrc',
      }
    },
    nodeunit: {
      tests: ['test/*_test.js']
    },
    uglify: {
      test: {
        files: {
          'temp/scripts/uglify_output.js': []
        }
      },
      expected: {
        files: {
          'test/expected/scripts/uglify_output.js': [
            'test/fixtures/scripts/vendors/plugin.js',
            'test/fixtures/scripts/file-1.js',
            'test/fixtures/scripts/file-2.js'
          ]
        }
      },
      options: {
        mangle: true
      }
    },
    mincss: {
      test: {
        src: ['test/fixtures/styles/input.css'],
        dest: 'temp/styles/mincss_output.css'
      },
      expected: {
        src: [
          'test/fixtures/styles/input.css',
          'test/fixtures/styles/reset.css',
          'test/fixtures/styles/main.css'
        ],
        dest: 'test/expected/styles/mincss_output.css'
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

  grunt.registerTask('test', ['clean', 'expected', 'importsrc', 'uglify:test', 'mincss:test','nodeunit']);

  // build expected files to check if the `updatesrc:update` is working.
  grunt.registerTask('expected', ['uglify:expected', 'mincss:expected']);

  grunt.registerTask('default', ['jshint', 'test']);
};