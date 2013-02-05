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
      example: {
        files: {
          'example/dist/min.js': []
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
      // To test the replace option.
      // not recommended to use this format.
      test_without_dest: {
        src: []
      },
      expected: {
        src: [
          'test/fixtures/styles/input.css',
          'test/fixtures/styles/reset.css',
          'test/fixtures/styles/main.css'
        ],
        dest: 'test/expected/styles/mincss_output.css'
      },
      example: {
        files: {
          'example/dist/min.css': []
        }
      }
    },

    importsrc: {
      test: {
        files: {
          'temp/index.html': 'test/fixtures/index.html',
        }
      },
      example: {
        files: {
          'example/dist/index.html': 'example/index.html'
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

  grunt.registerTask('test', ['clean', 'expected', 'importsrc:test', 'uglify:test', 'mincss:test', 'mincss:test_without_dest','nodeunit']);

  // build expected files to check if the `updatesrc:update` is working.
  grunt.registerTask('expected', ['uglify:expected', 'mincss:expected']);

  // build example files
  grunt.registerTask('example', ['importsrc:example', 'uglify:example', 'mincss:example']);

  grunt.registerTask('default', ['jshint', 'test']);
};