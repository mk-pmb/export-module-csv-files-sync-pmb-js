/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';
module.exports = {
  module: null,   // For easy auto-config, pass your module's module object.
  srcPath: null,  // Base path for files. Optional if you passed "module".

  filename2key: 'base',
  globPat: [
    '*.csv',
    'data/*.csv',
  ],
  globOpt: {  // For details, refer to the `glob` package.
    nodir: true,
  },
  csvOpt: {   // For details, refer to the `csv-parse` package.
    auto_parse: true,
    skip_empty_lines: true,
    rtrim: true,
  },
  jsonExportPrefix: 'dist/',
};
