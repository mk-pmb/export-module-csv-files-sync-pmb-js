
<!--#echo json="package.json" key="name" underline="=" -->
export-module-csv-files-sync-pmb
================================
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Turn your collection of CSV files into a node module that exports them.
<!--/#echo -->


Usage
-----

1. Make a new directory for your package.
2. There, make a node.js script (this example will assume the filename
   `csv2pojo.js`) with code like this:
    ```javascript
    'use strict';
    module.exports = require('export-module-csv-files-sync-pmb')({
      module: module,
      pkgName: require('./package.json').name,
    });
    ```
3. Make a `package.json` with the `main` key set to `"csv2pojo.js"`.
4. Put your `*.csv` files in that same directory or a `data/` subdirectory.
5. Run `nodejs -p "require('.')"` to see what your package will export.
6. Optionally adjust the config in your script and retry. Your config is
    merged with the defaults from [cfg.default.js](cfg.default.js),
    go have a look for inspiration.
7. Optionally generate a JSON and AMD version by running
    `nodejs csv2pojo.js --save-json`
8. Use and/or publish your package. :-)




<!--#toc stop="scan" -->



Known issues
------------

* needs more/better tests and docs




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
