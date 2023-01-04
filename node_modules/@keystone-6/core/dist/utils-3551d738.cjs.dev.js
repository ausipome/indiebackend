'use strict';

var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var path = require('path');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefault(path);

function getAdminPath(cwd) {
  return path__default["default"].join(cwd, '.keystone/admin');
}
function getBuiltConfigPath(cwd) {
  return path__default["default"].join(cwd, '.keystone/config.js');
}
class ExitError extends Error {
  constructor(code) {
    super(`The process should exit with ${code}`);
    _defineProperty(this, "code", void 0);
    this.code = code;
  }
}

exports.ExitError = ExitError;
exports.getAdminPath = getAdminPath;
exports.getBuiltConfigPath = getBuiltConfigPath;
