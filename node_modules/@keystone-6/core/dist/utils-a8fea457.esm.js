import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import path__default from 'path';

function getAdminPath(cwd) {
  return path__default.join(cwd, '.keystone/admin');
}
function getBuiltConfigPath(cwd) {
  return path__default.join(cwd, '.keystone/config.js');
}
class ExitError extends Error {
  constructor(code) {
    super(`The process should exit with ${code}`);
    _defineProperty(this, "code", void 0);
    this.code = code;
  }
}

export { ExitError as E, getBuiltConfigPath as a, getAdminPath as g };
