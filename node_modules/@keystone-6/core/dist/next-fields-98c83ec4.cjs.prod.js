'use strict';

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
require('decimal.js');
require('./graphql-ts-schema-e1666bd5.cjs.prod.js');
var apiWithoutContext = require('@graphql-ts/schema/api-without-context');

const orderDirectionEnum = apiWithoutContext["enum"]({
  name: 'OrderDirection',
  values: apiWithoutContext.enumValues(['asc', 'desc'])
});
const QueryMode = apiWithoutContext["enum"]({
  name: 'QueryMode',
  values: apiWithoutContext.enumValues(['default', 'insensitive'])
});
// fieldType(dbField)(fieldInfo) => { ...fieldInfo, dbField };
function fieldType(dbField) {
  return function (graphQLInfo) {
    return _objectSpread(_objectSpread({}, graphQLInfo), {}, {
      dbField
    });
  };
}

exports.QueryMode = QueryMode;
exports.fieldType = fieldType;
exports.orderDirectionEnum = orderDirectionEnum;
