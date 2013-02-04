/*
 * grunt-importsrc
 * https://github.com/kewah/grunt-importsrc
 *
 * Copyright (c) 2013 Antoine Lehurt
 * Licensed under the MIT license.
 */

'use strict';

exports.escapeRegExp = escapeRegExp;

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
exports.extractSectionsData = extractSectionsData;

function extractSectionsData(content) {
  return content.match(/<!--\s*importsrc\s*([\s\S]*?)\s*-->[\s\S]*?<!--\s*endimportsrc\s*-->/gi);
}

exports.extractConcatParam = extractConcatParam;

function extractConcatParam(content) {
  return content.match(/concat:[\w\/\-.]*/gi);
}

exports.extractUpdateParam = extractUpdateParam;

function extractUpdateParam(content) {
  return content.match(/update:[\w\/\[\]."'\-]*/gi);
}

exports.extractReplaceParam = extractReplaceParam;

function extractReplaceParam(content) {
  return content.match(/replace:[\w\/\[\]."'\-]*/gi);
}

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