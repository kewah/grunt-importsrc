'use strict';

var util = require('../lib/util');

exports.util = {
  escapeRegExp: function(test) {
    test.expect(2);

    var expected = '\\["path\\/to\\/smth"\\]';
    var actual = util.escapeRegExp('["path/to/smth"]');

    test.equal(actual, expected, 'should escape to be used as Regex');

    var regex = new RegExp(util.escapeRegExp('["smth"]'));
    test.ok(regex.test('path.to["smth"]'), 'should find the escaped string');

    test.done();
  },

  extractSectionsData: function(test) {
    test.expect(1);

    var sections = '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      '<!-- importsrc concat:path/to/smth.css -->' +
      '<link rel="stylesheet" href="styles/one.css">' +
      '<link rel="stylesheet" href="styles/two.css">' +
      '<!-- endimportsrc -->' +
      '<!-- importsrc update:uglify.dist.files["smth"] replace:path/to/smth.js -->' +
      '<script src="scripts/file-1.js"></script>' +
      '<script src="scripts/file-2.js"></script>' +
      '<!-- endimportsrc -->' +
      '</head><body></body></html>';

    var expected = [
      '<!-- importsrc concat:path/to/smth.css --><link rel="stylesheet" href="styles/one.css"><link rel="stylesheet" href="styles/two.css"><!-- endimportsrc -->',
      '<!-- importsrc update:uglify.dist.files["smth"] replace:path/to/smth.js --><script src="scripts/file-1.js"></script><script src="scripts/file-2.js"></script><!-- endimportsrc -->'
    ];
    var actual = util.extractSectionsData(sections);

    test.deepEqual(actual, expected, 'should extract `importsrc` sections');

    test.done();
  },

  extractConcatParam: function(test) {
    test.expect(1);

    var section = '<!-- importsrc concat:path/to/smth.css -->' +
      '<link rel="stylesheet" href="styles/one.css">' +
      '<link rel="stylesheet" href="styles/two.css">' +
      '<!-- endimportsrc -->';

    var expected = 'path/to/smth.css';
    var actual = util.extractConcatParam(section);

    test.equal(actual, expected, 'should extract `concat` param value');

    test.done();
  },

  extractUpdateParamAndReplace: function(test) {
    test.expect(2);

    var section = '<!-- importsrc update:uglify.dist.files["smth"] replace:path/to/smth.js -->' +
      '<script src="scripts/file-1.js"></script>' +
      '<script src="scripts/file-2.js"></script>' +
      '<!-- endimportsrc -->';

    var expected = 'uglify.dist.files["smth"]';
    var actual = util.extractUpdateParam(section);

    test.equal(actual, expected, 'should extract `update` param value');

    expected = 'path/to/smth.js';
    actual = util.extractReplaceParam(section);

    test.equal(actual, expected, 'should extract `replace` param value');

    test.done();
  },

  getFileExtension: function(test) {
    test.expect(3);

    var expected = '.js';
    var actual = util.getFileExtension('path/to/script.js');

    test.equal(actual, expected, 'should return .js extension');

    expected = '.css';
    actual = util.getFileExtension('path/to/style.css');

    test.equal(actual, expected, 'should return .css extension');

    expected = undefined;
    actual = util.getFileExtension('path/to/style.php');

    test.equal(actual, expected, 'should return undefined');

    test.done();
  },

  extractFilePaths: function(test) {
    test.expect(3);

    var section = '<script src="scripts/file-1.js"></script>' +
      '<script src="scripts/file-2.js"></script>';

    var expected = ['scripts/file-1.js', 'scripts/file-2.js'];
    var actual = util.extractFilePaths(section, '.js');

    test.deepEqual(actual, expected, 'should return js file paths');

    section = '<link rel="stylesheet" href="styles/one.css">' +
      '<link rel="stylesheet" href="styles/two.css">';

    expected = ['styles/one.css', 'styles/two.css'];
    actual = util.extractFilePaths(section, '.css');

    test.deepEqual(actual, expected, 'should return css file paths');

    expected = [];
    actual = util.extractFilePaths(section, '.js');

    test.deepEqual(actual, expected, 'should return an empty array');

    test.done();
  },

  containsBrackets: function(test) {
    test.expect(2);

    test.ok(util.containsBrackets('path.to["smth"]'), 'should detect brackets');
    test.equal(util.containsBrackets('path.to.smth'), false, 'should not detect brackets');

    test.done();
  },

  extractValueInsideBrackets: function(test) {
    test.expect(3);

    test.deepEqual(util.extractValueInsideBrackets('path.to["smth"]'), ['smth'], 'should return the value inside brackets');
    test.deepEqual(util.extractValueInsideBrackets('path.to["smth"]["else"]'), ['smth', 'else'], 'should return values inside brackets');
    test.deepEqual(util.extractValueInsideBrackets('path.to.smth'), [], 'should return an empty array');

    test.done();
  },

  removeBrackets: function(test) {
    test.expect(2);

    test.equal(util.removeBrackets('path.to["smth"]'), 'path.to', 'should remove brackets');
    test.equal(util.removeBrackets('path.to["smth"]["else"]'), 'path.to', 'should remove brackets');

    test.done();
  }
};