/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var EX, obAss = Object.assign, objHas = Object.prototype.hasOwnProperty,
  glob = require('glob').sync,
  fs = require('fs'), pathLib = require('path'),
  parseCsv = require('csv-parse/lib/sync'),
  dfltOpt = require('./cfg.default.js');

function ifFun(x, d) { return ((typeof x) === 'function' ? x : d); }
function isStr(x, no) { return (((typeof x) === 'string') || no); }
function fail(why) { throw new Error(why); }
function throwIf(err) { if (err) { throw err; } }
function str_isin(needle, hay) { return (hay.indexOf(needle) >= 0); }
function firstLine(text) { return text.split(/[\r\n]+/)[0]; }
function concArgs(d, a) { return (a ? d.concat.apply(d, a) : d); }
function bindIfHas(o, m) { return (o[m] && o[m].bind(m)); }
function blockingRead(type) { return bindIfHas(fs, 'read' + type + 'Sync'); }


EX = function (opt) {
  if (!opt) { fail('need at least a srcPath'); }
  opt = EX.mergeOpt(opt);
  var oMod = (opt.module || false), srcFiles, allData;
  if (oMod) {
    delete opt.module;
  } else {
    if (ifFun(opt.require) && isStr(opt.filename)) {
      oMod = opt;
      opt = false;
    }
  }
  if (!opt.srcPath) {
    if (oMod.filename) { opt.srcPath = pathLib.dirname(oMod.filename); }
    if (!opt.srcPath) { fail('missing srcPath'); }
  }
  if (!opt.pkgName) { opt.pkgName = oMod.require('./package.json').name; }
  if (!opt.pkgName) { opt.pkgName = pathLib.basename(opt.srcPath); }
  if (!opt.pkgName) { fail('Unable to guess missing option pkgName'); }

  srcFiles = EX.findSrcFiles(opt);
  allData = EX.readParseSrcFiles(srcFiles, opt);
  if (oMod && (require.main === oMod)) { return EX.cliMain(opt, allData); }
  return allData;
};


EX.runFromCLI = function () {
  fail("Don't run " + module.filename + ' directly; instead, ' +
    'make a csv2pojo.js in your package (example in the readme) ' +
    'and run that one.');
};


EX.mergeOpt = function (o) {
  var m = obAss({}, dfltOpt, o);
  function subDf(k) { if (o[k]) { m[k] = obAss({}, dfltOpt[k], o[k]); } }
  [ 'csvOpt', 'globOpt' ].forEach(subDf);
  return m;
};


EX.findSrcFiles = function (opt) {
  var sf = [], glOpt = opt.globOpt,
    baseDir = opt.srcPath + '/', baseLen = baseDir.length;
  function add() { sf = concArgs(sf, arguments); }
  sf = concArgs(sf, opt.extraSrcFiles);
  opt.globPat.forEach(function (p) { add(glob(baseDir + p, glOpt)); });
  sf = sf.map(function (fn) {
    return (fn.substr(0, baseLen) === baseDir ? fn.slice(baseLen) : fn);
  });
  return sf;
};


EX.readParseSrcFiles = function (srcFiles, opt) {
  var csvDelim = opt.csvOpt.delimiter, dest = (opt.destObj || {}),
    baseDir = opt.srcPath + '/', fn2key = EX.findOptFunc(opt, 'filename2key');
  srcFiles.sort().forEach(function (subFn) {
    var key = subFn, csv;
    if (fn2key) {
      key = fn2key(subFn, opt, srcFiles);
      if ((key === null) || (key === undefined)) { return; }
      key = String(key);
    }
    if (objHas.call(dest, key)) { fail('Duplicate key: ' + key); }
    csv = blockingRead('File')(baseDir + subFn, 'UTF-8');
    if (csvDelim && (!str_isin(csvDelim, firstLine(csv)))) { return; }
    dest[key] = parseCsv(csv, opt.csvOpt);
  });
  return dest;
};


EX.findOptFunc = function (opt, optName) {
  var spec = opt[optName], f;
  if (!spec) { return false; }
  if (ifFun(spec)) { return spec; }
  f = EX[optName + '_' + spec] || ((EX[optName] || false)[spec]);
  if (f) { return f; }
  fail('Invalid value for option ' + optName + ': ' + String(spec));
};


EX.noFnExt = function (fn) {
  fn = fn.split(/(\.|\/|\\|:)/);
  return (fn.length < 2 ? fn : fn.slice(0, -2)).join('');
};


EX.filename2key = (function () {
  var bn = pathLib.basename;
  return {
    base: function (fn) { return EX.noFnExt(bn(fn)); },
  };
}());


EX.cliMain = function (opt, allData) {
  var args = process.argv.slice(2), mode = args.shift();
  if ((!mode) || (mode === '--dump-json')) {
    return console.log(EX.jsonize(allData, opt));
  }
  if (mode === '--save-json') {
    if (args[0]) { opt.overrideJsonDir = args[0]; }
    return EX.saveJSON(opt, allData);
  }
  fail('Unsupported runmode: ' + mode);
};


EX.jsonize = function (data, opt) {
  return JSON.stringify(data, ((opt || false).jsonMutate || null), 2
    ).replace(/(:)\s*\n\s*(\[)/g, '$1 $2'
    ).replace(/(\{)\s*\n\s*(")/g, '$1 $2'
    ).replace(/(\[|[!-Z_-~],)\s*\n\s*(?="|\d)/g, '$1 '
    ).replace(/((?:\[|\],)\n)\s*(\[)/g, '$1    $2'
    ).replace(/\s+\]/g, ' ]');
};


EX.saveJSON = function (opt, allData) {
  var asJson = EX.jsonize(allData, opt), bfn;
  bfn = pathLib.join((opt.overrideJsonDir
    || pathLib.join(opt.srcPath, opt.jsonExportPrefix)),
    opt.pkgName);
  fs.writeFile(bfn + '.json', asJson + '\n', throwIf);
  fs.writeFile(bfn + '.amd.js', 'define(' + asJson + ');\n', throwIf);
};




















module.exports = EX;
if (require.main === module) { EX.runFromCLI(); }
