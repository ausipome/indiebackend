import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import 'decimal.js';
import './graphql-ts-schema-9020a95a.esm.js';
import { enum as enum$1, enumValues } from '@graphql-ts/schema/api-without-context';

const orderDirectionEnum = enum$1({
  name: 'OrderDirection',
  values: enumValues(['asc', 'desc'])
});
const QueryMode = enum$1({
  name: 'QueryMode',
  values: enumValues(['default', 'insensitive'])
});
// fieldType(dbField)(fieldInfo) => { ...fieldInfo, dbField };
function fieldType(dbField) {
  return function (graphQLInfo) {
    return _objectSpread(_objectSpread({}, graphQLInfo), {}, {
      dbField
    });
  };
}

export { QueryMode as Q, fieldType as f, orderDirectionEnum as o };
