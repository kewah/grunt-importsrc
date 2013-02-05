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
  // relative path to the generated html file.
  var htmlDestRootPath;

  /**
   * Add the HTML root path to a file path.
   * @param  {String} filepath  File path that you want to add the root path.
   * @return {String}           htmlRootPath + filepath
   */

  function addRootPath(filepath) {
    return path.join(htmlRootPath, filepath);
  }

  /**
   * Convert a string ('path.to.smth') to an object (path: {to: {smth: {}}})
   * @param  {String} str
   * @return {Object}
   */

  function stringToGruntConfigObject(str) {
    var cfg = grunt.config.data;
    var props = str.split('.');
    var obj, lastProp;

    props.forEach(function(prop, i) {
      if (i === props.length - 1) {
        lastProp = prop;
        return;
      }
      obj = (!obj) ? cfg[prop] : obj[prop];
    });

    return {
      obj: obj,
      lastProp: lastProp
    };
  }

  // `importsrc` task
  grunt.registerMultiTask('importsrc', 'Import file paths of scripts and stylesheets from HTML files', function() {
    this.files.forEach(function(file) {
      if (!file.src.length) {
        // The source file does not exist.
        return;
      }

      htmlDestRootPath = file.dest.replace(/[^\/]*$/, '');

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

    sections.forEach(function(section) {
      var concatOpt = util.extractSectionOption(section, 'concat');
      var updateOpt = util.extractSectionOption(section, 'update');
      var replaceOpt = util.extractSectionOption(section, 'replace');
      var destOpt = util.extractSectionOption(section, 'dest');
      var outputFilepath;

      if (concatOpt) {
        outputFilepath = concatSourceFiles(section, concatOpt);
      }

      if (updateOpt) {
        outputFilepath = updateGruntTask(section, updateOpt, destOpt);
      }

      // we get the relative path between the generated html file and the generated js|css file.
      // ex: src/index.html and src/script/file.js -> script/file.js
      outputFilepath = replaceOpt || path.relative(htmlDestRootPath, outputFilepath);

      // replace section with the output file path.
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

  /**
   * Concatenates files present in a section.
   * @param  {String} section
   * @param  {String} concatDest
   * @return {String}             The output file path.
   */

  function concatSourceFiles(section, concatDest) {
    // extract file paths that will be read and concatenated.
    var sources = util.extractFilePaths(section, util.getFileExtension(concatDest)).map(addRootPath).filter(function(filepath) {
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

  /**
   * Update an existing Grunt task (like uglify, mincss, etc.)
   * @param  {String} section
   * @param  {String} taskToUpdate
   * @param  {String} destOpt
   * @return {String}              The output file path.
   */

  function updateGruntTask(section, taskToUpdate, destOpt) {
    var destFilepath;

    // Grunt has different syntax format for config of tasks (see https://github.com/gruntjs/grunt/wiki/grunt)
    //
    // - compact & list: 'dist/built.js': ['src/file1.js', 'src/file2.js']
    //    ex: uglify.dist.files['dist/built.js'] (<= brackets) return ['src/file1.js', 'src/file2.js']
    //
    // - full: env: {src: ['src/file1.css', 'src/file2.css'], dest: ... }
    //    ex: mincss.compress.src (<= no brackets) return ['src/file1.css', 'src/file2.css']
    //
    // To detect those different formats, I just check if there are brackets in the `taskToUpdate` value.
    if (util.containsBrackets(taskToUpdate)) {
      destFilepath = updateGruntTaskWithCompactFormat(section, taskToUpdate, destOpt);
    } else {
      destFilepath = updateGruntTaskWithFullFormat(section, taskToUpdate, destOpt);
    }

    return destFilepath;
  }

  /**
   * Update a task with the "compact" format syntax.
   * @param  {String} section
   * @param  {String} taskToUpdate
   * @param  {String} destFilepath
   * @return {String}                 output file path
   */

  function updateGruntTaskWithCompactFormat(section, taskToUpdate, destFilepath) {
    var insideBrackets = util.extractValueInsideBrackets(taskToUpdate);
    var cfg = stringToGruntConfigObject(util.removeBrackets(taskToUpdate));
    var taskData = cfg.obj[cfg.lastProp];
    var taskDestFile, destFileExtension;

    // get the last prop of the object to be able to update it after.
    insideBrackets.forEach(function(prop, i) {
      if (i === insideBrackets.length - 1) {
        taskDestFile = prop;
        return;
      }

      taskData = taskData[prop];
    });

    // If the 'dest' option is specified
    taskDestFile = taskDestFile || destFilepath;
    destFileExtension = util.getFileExtension(taskDestFile);

    // In case the dest file of the task that you want to update is not defined in the Grunt config.
    // Should not happen...
    if (!taskData[taskDestFile]) {
      taskData[taskDestFile] = [];
    }

    // extract file paths from the html to add it to the task that we are updating.
    var sources = util.extractFilePaths(section, destFileExtension).map(addRootPath);
    var updatedTask = _.union(taskData[taskDestFile], sources);

    updateGruntTaskMessage(taskToUpdate, taskData[taskDestFile], updatedTask);

    // update the task
    cfg.obj[cfg.lastProp][taskDestFile] = updatedTask;

    return taskDestFile;
  }

  /**
   * Update a task with the "full" format syntax.
   * @param  {String} section
   * @param  {String} taskToUpdate
   * @param  {String} destFilepath
   * @return {String}                 output file path
   */

  function updateGruntTaskWithFullFormat(section, taskToUpdate, destFilepath) {
    var cfg = stringToGruntConfigObject(taskToUpdate);
    var taskData = cfg.obj[cfg.lastProp];

    if (destFilepath) {
      cfg.obj['dest'] = destFilepath;
    } else {
      destFilepath = cfg.obj['dest'];
    }

    if (!taskData) {
      taskData = cfg.obj[cfg.lastProp] = [];
    }

    if (!destFilepath) {
      grunt.fail.fatal('Can\'t find the "dest" value of the task option update:' + taskToUpdate + ' \n You have to specify the "dest" option.');
    }

    var destFileExtension = util.getFileExtension(destFilepath);

    // extract file paths from the html to add it to the task that we are updating.
    var sources = util.extractFilePaths(section, destFileExtension).map(addRootPath);
    var updatedTask = _.union(taskData, sources);

    updateGruntTaskMessage(taskToUpdate, taskData, updatedTask);

    // update the task
    cfg.obj[cfg.lastProp] = updatedTask;

    return destFilepath;
  }

  /**
   * Display a message in the terminal.
   */

  function updateGruntTaskMessage(taskName, beforeUpdate, afterUpdate) {
    grunt.log.ok('Task ' + taskName + ' has been updated');
    grunt.log.subhead('  from:');
    grunt.log.writeln('    - ' + grunt.log.wordlist((_.isArray(beforeUpdate)) ? beforeUpdate : [beforeUpdate], {
      separator: '\n    - '
    }));
    grunt.log.subhead('  to:');
    grunt.log.writeln('    - ' + grunt.log.wordlist(afterUpdate, {
      separator: '\n    - '
    }));

    grunt.log.writeln('\n');
  }

};