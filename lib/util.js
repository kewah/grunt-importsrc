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
 * Extract `concat` param value.
 * @param  {String} content  `importsrc` section
 * @return {Array}
 */
exports.extractConcatParam = extractConcatParam;

function extractConcatParam(content) {
  return content.match(/concat:[\w\/\-.]*/gi);
}

/**
 * Extract `update` param value.
 * @param  {String} content  `importsrc` section
 * @return {Array}
 */
exports.extractUpdateParam = extractUpdateParam;

function extractUpdateParam(content) {
  return content.match(/update:[\w\/\[\]."'\-]*/gi);
}

/**
 * Extract `replace` param value.
 * @param  {String} content  `importsrc` section
 * @return {Array}
 */
exports.extractReplaceParam = extractReplaceParam;

function extractReplaceParam(content) {
  return content.match(/replace:[\w\/\[\]."'\-]*/gi);
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

  return section.match(regexp).map(function(src) {
    return src.split(attr)[1].replace(/(['"])/g, '');
  });
}