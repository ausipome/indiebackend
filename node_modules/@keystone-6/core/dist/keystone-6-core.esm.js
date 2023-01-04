import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
export { g as graphql } from './graphql-ts-schema-9020a95a.esm.js';
import '@graphql-ts/schema';
import 'graphql-upload/GraphQLUpload.js';
import 'graphql';
import 'decimal.js';
import '@graphql-ts/schema/api-without-context';
import '@graphql-ts/extend';
import '@graphql-ts/schema/api-with-context';

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

export { config, group, list };
