'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var graphqlTsSchema = require('./graphql-ts-schema-e1666bd5.cjs.prod.js');
require('@graphql-ts/schema');
require('graphql-upload/GraphQLUpload.js');
require('graphql');
require('decimal.js');
require('@graphql-ts/schema/api-without-context');
require('@graphql-ts/extend');
require('@graphql-ts/schema/api-with-context');

function config(config) {
  return config;
}
let i = 0;
function group(config) {
  var _config$description;
  const keys = Object.keys(config.fields);
  if (keys.some(key => key.startsWith('__group'))) {
    throw new Error('groups cannot be nested');
  }
  const groupConfig = {
    fields: keys,
    label: config.label,
    description: (_config$description = config.description) !== null && _config$description !== void 0 ? _config$description : null
  };
  return _objectSpread({
    [`__group${i++}`]: groupConfig
  }, config.fields);
}
function list(config) {
  return _objectSpread({}, config);
}

exports.graphql = graphqlTsSchema.graphqlBoundToKeystoneContext;
exports.config = config;
exports.group = group;
exports.list = list;
