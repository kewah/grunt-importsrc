/*
 * grunt-importsrc
 * https://github.com/kewah/grunt-importsrc
 *
 * Copyright (c) 2013 Antoine Lehurt
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var util = require('../lib/util');

module.exports = function(grunt) {
  // Lodash
  var _ = grunt.util._;

  // relative path to the html file
  var htmlRootPath;

  /**
   * Add the HTML root path to a file path.
   * @param  {String} filepath  File path that you want to add the root path.
   * @return {String}           htmlRootPath + filepath
   */

  function addRootPathTo(filepath) {
    return path.join(htmlRootPath, filepath);
  }

  // `importsrc` task
  grunt.registerMultiTask('importsrc', 'Import file paths of scripts and stylesheets from HTML files', function() {
    this.files.forEach(function(file) {
      if (!file.src.length) {
        // The source file does not exist.
        return;
      }

      var html = file.src.map(extractDataFromHTML);
      grunt.file.write(file.dest, html);
    });
  });

  /**
   * Open the HTML file and detect if there are `importsrc` sections.
   * @param  {String} htmlFilepath Path of the file that will be read.
   * @return {String}              HTML content after the task execution.
   */

  function extractDataFromHTML(htmlFilepath) {
    var content = grunt.file.read(htmlFilepath);

    // define the relative path to the html file, to import files declared in the HTML.
    htmlRootPath = htmlFilepath.substr(0, htmlFilepath.lastIndexOf('/') + 1);

    // detect if there are an `importsrc` sections.
    var sections = util.extractSectionsData(content);

    if (!sections) {
      // stop the task.
      return;
    }

    // execute the task using the parameters defined in the HTML.
    sections.forEach(function(section) {
      var concatParam = util.extractConcatParam(section);
      var updateParam = util.extractUpdateParam(section);
      var outputFilepath;

      if (concatParam) {
        outputFilepath = concatSourceFiles(section, concatParam);
      }

      if (updateParam) {
        // TODO: update task
        return;
      }

      // replace content
      var extension = util.getFileExtension(outputFilepath);
      var replacement;

      if (extension === '.js') {
        replacement = '<script src="' + outputFilepath + '"></script>';
      } else if (extension === '.css') {
        replacement = '<link rel="stylesheet" href="' + outputFilepath + '">';
      }

      content = content.replace(new RegExp(util.escapeRegExp(section), 'gi'), replacement);
    });

    return content;
  }

  function concatSourceFiles(section, concatParam) {
    var concatDest = concatParam[0].split(':')[1];

    var sources = util.extractSources(section, util.getFileExtension(concatDest)).map(addRootPathTo).filter(function(filepath) {
      if (!grunt.file.exists(filepath)) {
        grunt.log.warn('Source file "' + filepath + '" not found.');
        return false;
      } else {
        return true;
      }
    });

    var concatFile = sources.map(grunt.file.read).join(grunt.util.normalizelf(grunt.util.linefeed));
    grunt.file.write(concatDest, concatFile);

    // display a message
    grunt.log.ok('Files have been concatenated to "' + concatDest + '"');
    grunt.log.writeln('\nConcatenated files :');
    grunt.log.writeln('    - ' + grunt.log.wordlist(sources, {
      separator: '\n    - '
    }));
    grunt.log.writeln('\n');

    return concatDest;
  }

};