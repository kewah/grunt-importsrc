'use strict';

var grunt = require('grunt');

exports.importsrc = {
  replace: function(test) {
    test.expect(1);

    var actual = grunt.file.read('temp/index.html');
    var expected = grunt.file.read('test/expected/index.html');

    test.equal(actual, expected, 'should replace importsrc section');

    test.done();
  },

  concat: function(test) {
    test.expect(2);

    var actual = grunt.file.read('temp/scripts/importsrcs-concat_output.js');
    var expected = grunt.file.read('test/expected/scripts/importsrcs-concat_output.js');

    test.equal(actual, expected, 'should concat js files');

    actual = grunt.file.read('temp/styles/importsrcs-concat_output.css');
    expected = grunt.file.read('test/expected/styles/importsrcs-concat_output.css');

    test.equal(actual, expected, 'should concat css files');

    test.done();
  },

  update: function(test) {
    test.expect(3);

    var actual = grunt.file.read('temp/scripts/uglify_output.js');
    var expected = grunt.file.read('test/expected/scripts/uglify_output.js');

    test.equal(actual, expected, 'should update uglify config');

    actual = grunt.file.read('temp/styles/mincss_output.css');
    expected = grunt.file.read('test/expected/styles/mincss_output.css');

    test.equal(actual, expected, 'should update mincss config');

    actual = grunt.file.read('temp/styles/mincss_without_dest_output.css');
    expected = grunt.file.read('test/expected/styles/mincss_output.css');

    test.equal(actual, expected, 'should update mincss "without dest" config');

    test.done();
  }
};