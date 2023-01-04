'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function allowAll() {
  return true;
}
function denyAll() {
  return false;
}
function allOperations(func) {
  return {
    query: func,
    create: func,
    update: func,
    delete: func
  };
}

exports.allOperations = allOperations;
exports.allowAll = allowAll;
exports.denyAll = denyAll;
