'use strict';

var esbuild = require('esbuild');
var utils = require('./utils-4cb70885.cjs.prod.js');
var initConfig = require('./initConfig-e90b5265.cjs.prod.js');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var esbuild__default = /*#__PURE__*/_interopDefault(esbuild);

function getEsbuildConfig(cwd) {
  return {
    entryPoints: ['./keystone'],
    absWorkingDir: cwd,
    bundle: true,
    outfile: '.keystone/config.js',
    format: 'cjs',
    platform: 'node',
    plugins: [{
      name: 'external-node_modules',
      setup(build) {
        build.onResolve({
          // this regex is intended to be the opposite of /^\.\.?(?:\/|$)/
          // so it matches anything that isn't a relative import
          // so this means that we're only going to bundle relative imports
          // we can't use a negative lookahead/lookbehind because this regex is executed
          // by Go's regex package which doesn't support them
          // this regex could have less duplication with nested groups but this is probably easier to read
          filter: /(?:^[^.])|(?:^\.[^/.])|(?:^\.\.[^/])/
        }, args => {
          return {
            external: true,
            path: args.path
          };
        });
      }
    }]
  };
}
function loadBuiltConfig(cwd) {
  return initConfig.initConfig(require(utils.getBuiltConfigPath(cwd)).default);
}
async function loadConfigOnce(cwd) {
  await esbuild__default["default"].build(getEsbuildConfig(cwd));
  return loadBuiltConfig(cwd);
}

exports.getEsbuildConfig = getEsbuildConfig;
exports.loadBuiltConfig = loadBuiltConfig;
exports.loadConfigOnce = loadConfigOnce;
