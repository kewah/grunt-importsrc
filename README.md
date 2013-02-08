# grunt-importsrc [![Build Status](https://travis-ci.org/kewah/grunt-importsrc.png?branch=master)](https://travis-ci.org/kewah/grunt-importsrc)

> Import scripts and stylesheets paths from HTML files into your Gruntfile.  
> You can update an existing Grunt task like Uglify, mincss, etc. or just concatenate those imported files.

If you are bored of having to copy and paste scripts (or stylesheets) files paths from your HTML to your Gruntfile, this plugin can help you.

## Getting Started

If you haven't used [grunt][] before, be sure to check out the [Getting Started][] guide, as it explains how to create a [gruntfile][Getting Started] as well as install and use grunt plugins. Once you're familiar with that process, install this plugin with this command:

```shell
$ npm install grunt-importsrc --save-dev
```

## Importsrc task

_This plugin is only compatible with Grunt >= 0.4.0._

Add _importsrc_ to your Grunt file.

```javascript
importsrc: {
  dist: {
    files: {
      'dist/index.html': 'src/index.html' // dest: source
    }
  }
}
```

In your HTML file (here `src/index.html`), add _importsrc_ sections with HTML comments. 
You define _importsrc_ options in those comments (see below for more informations).

### Importsrc pattern

```html
<!-- importsrc <option>:<path> -->  
[List of script or link tags]  
<!-- endimportsrc -->  
```  

### Options

#### update
> Update paths of source files of an existing Grunt task.

Example with the _uglify_ task ("list" format):

```javascript
[Gruntfile.js]

importsrc: {
  dist: {
    files: {
      'dist/index.html': 'src/index.html'
    }
  }
},
uglify: {
  dist: {
    files: {
      'dist/app.js': [/* Source files will be updated by the importsrc task */]
    }
  },
  options: {
    mangle: true
  }
}
```

```html
[src/index.html]

<!-- importsrc update:uglify.dist.files['dist/app.js'] -->
<script src="scripts/vendors/plugin.js"></script>
<script src="scripts/file-1.js"></script>
<script src="scripts/file-2.js"></script>
<!-- endimportsrc -->
```

Will render:  

```html
[dist/index.html]

<script src="app.js"></script>
```

Example with the _mincss_ task ("full" format):

```javascript
[Gruntfile.js]

importsrc: {
  dist: {
    files: {
      'dist/index.html': 'src/index.html'
    }
  }
},
mincss: {
  dist: {
    src: [/* Source files will be updated by the importsrc task */],
    dest: 'dist/app.css'
  }
}
```

```html
[src/index.html]

<!-- importsrc update:mincss.dist.src -->
<link rel="stylesheet" href="styles/reset.css">
<link rel="stylesheet" href="styles/main.css">
<!-- endimportsrc -->
```

Will render:  

```html
[dist/index.html]

<script src="app.css"></script>
```

------------------------------------------------  

#### concat
> Concatenates script or stylesheet files list.


Example: 
 
```html
<!-- importsrc concat:path/to/dest/file.(css|js) -->
[...]
<!-- endimportsrc -->
```

```html
[src/index.html]

<!-- importsrc concat:dist/app.js -->
<script src="scripts/file-1.js"></script>
<script src="scripts/file-2.js"></script>
<!-- endimportsrc -->
```

Will render:

```html
[dist/index.html]

<script src="app.js"></script>
```

------------------------------------------------

#### dest

> Change the dest file path of an existing Grunt task.

In case you need to change it.

Example:

```html
[src/index.html]

<!-- 
  importsrc
  update:exotic.task.sources
  dest:dist/file.css -->
<link rel="stylesheet" href="styles/reset.css">
<link rel="stylesheet" href="styles/main.css">
<!-- endimportsrc -->
```

Will render:

```html
[dist/index.html]

<script src="file.css"></script>
```

------------------------------------------------

#### replace
> Replace the generated file path.

By default, file paths are relative to the generated HTML file.  
But you can change those paths with this option.

Example **without** the replace option:

```html
[src/index.html]

<!-- importsrc
  update:update:mincss.dist.src -->
<link rel="stylesheet" href="styles/reset.css">
<link rel="stylesheet" href="styles/main.css">
<!-- endimportsrc -->
```

Will render:

```html
[dist/index.html]

<script src="file.css"></script>
```

Example **with** the replace option:

```html
[src/index.html]

<!-- importsrc
  update:update:mincss.dist.src
  replace:a/new/path/to/file.css -->
<link rel="stylesheet" href="styles/reset.css">
<link rel="stylesheet" href="styles/main.css">
<!-- endimportsrc -->
```

will render:

```html
[dist/src]

<script src="a/new/path/to/file.css"></script>
```

## Example

```javascript
[Gruntfile.js]

grunt.initConfig({
  uglify: {
    example: {
      files: {
        'example/dist/min.js': []
      }
    }
  },
  mincss: {
    example: {
      files: {
        'example/dist/min.css': []
      }
    }
  },
  importsrc: {
    example: {
      files: {
        'example/dist/index.html': 'example/index.html'
      }
    }
  }
});

grunt.registerTask('example', ['importsrc:example', 'uglify:example', 'mincss:example']);
```

Execute the command `grunt example` and see `example/` folder.

## Release History

- 02/2013 - 0.1.0 - Initial release

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][].

## License

Copyright (c) 2013 Antoine Lehurt  
Licensed under the MIT license.

[grunt]: http://gruntjs.com/
[Getting Started]: https://github.com/gruntjs/grunt/wiki/Getting-started
[wiki]: https://github.com/gruntjs/grunt/wiki/grunt