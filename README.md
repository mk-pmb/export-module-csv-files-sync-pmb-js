
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
1. There, make a node.js script (this example will assume the filename
    `csv2pojo.js`) with code like this:
    ```javascript
    'use strict';
    module.exports = require('export-module-csv-files-sync-pmb')(module);
    ```
1. Make a `package.json` with the `main` key set to `"csv2pojo.js"`.
1. Put your `*.csv` files in that same directory or a `data/` subdirectory.
1. Preview: Run `nodejs -p "require('.')"` to see what your package will export.
1. Optionally you can add custom configuration, see below.
1. Optionally generate a JSON and AMD version, see below-
1. Use and/or publish your package. :-)



Custom config
-------------

1. Replace the `(module)` part from above with `({ module: module })`.
    That config object is merged with the defaults from
    [cfg.default.js](cfg.default.js), go have a look for inspiration.
1. Add and adjust options in your config object as desired and retry the
    preview step.



Generating JSON and AMD versions
--------------------------------

1. Back up your project, because target files will be overwritten.
1. If your JSON directory (option `overrideJsonDir`, default `dist`)
    doesn't exist yet, create it.
1. Run `nodejs csv2pojo.js --save-json`
1. Optionally set that command as a git hook, npm pre-publish script or
    similar, so your JSON and AMD files are kept in sync automatically.




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
