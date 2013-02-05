/*
 * grunt-importsrc
 * https://github.com/kewah/grunt-importsrc
 *
 * Copyright (c) 2013 Antoine Lehurt
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Escape String to be used as Regex.
 * @param  {String} str String that will be escaped.
 * @return {String}     Escaped String.
 */
exports.escapeRegExp = escapeRegExp;

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

/**
 * Extract `importsrc` sections.
 * @param  {String} content Content that may contains `importsrc` sections.
 * @return {Array}          `importsrc` sections.
 */
exports.extractSectionsData = extractSectionsData;

function extractSectionsData(content) {
  return content.match(/<!--\s*importsrc\s*([\s\S]*?)\s*-->[\s\S]*?<!--\s*endimportsrc\s*-->/gi);
}

/**
 * Extract the value of a param like -> key:value
 * @param  {String} param
 * @return {String}
 */

function extractParamValue(content, regex) {
  var param = content.match(regex);
  if (!param) {
    return;
  }

  var values = param[0].split(':');
  if (!values) {
    return;
  }

  return values[1];
}

/**
 * Extract the value of an section option
 * @param  {String} section
 * @param  {String} option  concat|update|dest|replace
 * @return {String}
 */
exports.extractSectionOption = extractSectionOption;

function extractSectionOption(section, option) {
  return extractParamValue(section, new RegExp(option + ':[\\w\\/\\[\\].\"\'\\-]*', 'gi'));
}

/**
 * Get the file extion.
 * @param  {String} filename File that you want to have the extension value.
 * @return {String}          If it's a `.js` or `.css` file extension.
 */
exports.getFileExtension = getFileExtension;

function getFileExtension(filename) {
  var fileExtension = filename.match(/[^.]+$/);
  var extension;

  if (/js/i.test(fileExtension)) {
    extension = '.js';
  } else if (/css/i.test(fileExtension)) {
    extension = '.css';
  }

  return extension;
}

/**
 * Extract file paths with a defined file extension from a section.
 * @param  {String} section   Section in which you will extract file paths.
 * @param  {String} extension File extension type.
 * @return {Array}            File paths.
 */
exports.extractFilePaths = extractFilePaths;

function extractFilePaths(section, extension) {
  var attr, regexp;

  if (extension === '.js') {
    attr = 'src=';
    regexp = /src=['"]([^"']+)['"]/gi;
  } else if (extension === '.css') {
    attr = 'href=';
    regexp = /href=['"]([^"']+)["']/gi;
  }

  if (!attr || !regexp) {
    return [];
  }

  var filepaths = section.match(regexp);

  if (!filepaths) {
    return [];
  }

  return filepaths.map(function(src) {
    return src.split(attr)[1].replace(/(['"])/g, '');
  });
}

/**
 * Detect if the content contains "[]"
 * @param  {String} content
 * @return {Boolean}
 */
exports.containsBrackets = containsBrackets;

function containsBrackets(content) {
  return (/['"]([^"']+)['"]/).test(content);
}

/**
 * @param  {String} content
 * @return {Array}
 */
exports.extractValueInsideBrackets = extractValueInsideBrackets;

function extractValueInsideBrackets(content) {
  var values = content.match(/['"]([^"']+)['"]/gi);

  if (!values) {
    return [];
  }

  return values.map(function(s) {
    return s.replace(/['"]/gi, '');
  });
}

/**
 * Remove "[]" of a String
 * @param  {String} content
 * @return {String}
 */
exports.removeBrackets = removeBrackets;

function removeBrackets(content) {
  return content.replace(/\[(.+?)\]/gi, '');
}