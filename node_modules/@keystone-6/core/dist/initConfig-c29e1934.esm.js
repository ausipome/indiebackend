import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import { validate } from 'uuid';
import { isCuid } from 'cuid';
import { f as fieldType, o as orderDirectionEnum } from './next-fields-d3605624.esm.js';
import { f as field } from './graphql-ts-schema-9020a95a.esm.js';
import { u as userInputError } from './graphql-errors-e6d55894.esm.js';
import { arg, ID, list, nonNull, inputObject } from '@graphql-ts/schema/api-without-context';

const idParsers = {
  autoincrement(val) {
    if (val === null) {
      throw userInputError('Only an integer can be passed to id filters');
    }
    const parsed = parseInt(val);
    if (Number.isInteger(parsed)) {
      return parsed;
    }
    throw userInputError('Only an integer can be passed to id filters');
  },
  autoincrementBigInt(val) {
    if (val === null) {
      throw userInputError('Only a bigint can be passed to id filters');
    }
    try {
      return BigInt(val);
    } catch (err) {
      throw userInputError('Only a bigint can be passed to id filters');
    }
  },
  singleton(val) {
    if (val === null) {
      throw userInputError('Only an integer can be passed to id filters');
    }
    const parsed = parseInt(val);
    if (Number.isInteger(parsed)) {
      return parsed;
    }
    throw userInputError('Only an integer can be passed to id filters');
  },
  cuid(val) {
    // isCuid is just "it's a string and it starts with c"
    // https://github.com/ericelliott/cuid/blob/215b27bdb78d3400d4225a4eeecb3b71891a5f6f/index.js#L69-L73
    if (typeof val === 'string' && isCuid(val)) {
      return val;
    }
    throw userInputError('Only a cuid can be passed to id filters');
  },
  uuid(val) {
    if (typeof val === 'string' && validate(val)) {
      return val.toLowerCase();
    }
    throw userInputError('Only a uuid can be passed to id filters');
  }
};
const nonCircularFields = {
  equals: arg({
    type: ID
  }),
  in: arg({
    type: list(nonNull(ID))
  }),
  notIn: arg({
    type: list(nonNull(ID))
  }),
  lt: arg({
    type: ID
  }),
  lte: arg({
    type: ID
  }),
  gt: arg({
    type: ID
  }),
  gte: arg({
    type: ID
  })
};
const IDFilter = inputObject({
  name: 'IDFilter',
  fields: () => _objectSpread(_objectSpread({}, nonCircularFields), {}, {
    not: arg({
      type: IDFilter
    })
  })
});
const filterArg = arg({
  type: IDFilter
});
function resolveVal(input, parseId) {
  if (input === null) {
    throw userInputError('id filter cannot be null');
  }
  const obj = {};
  for (const key of ['equals', 'gt', 'gte', 'lt', 'lte']) {
    const val = input[key];
    if (val !== undefined) {
      const parsed = parseId(val);
      obj[key] = parsed;
    }
  }
  for (const key of ['in', 'notIn']) {
    const val = input[key];
    if (val !== undefined) {
      if (val === null) {
        throw userInputError(`${key} id filter cannot be null`);
      }
      obj[key] = val.map(x => parseId(x));
    }
  }
  if (input.not !== undefined) {
    obj.not = resolveVal(input.not, parseId);
  }
  return obj;
}
const idFieldType = (config, isSingleton) => meta => {
  const parseVal = config.kind === 'autoincrement' && config.type === 'BigInt' ? idParsers.autoincrementBigInt : idParsers[isSingleton ? 'singleton' : config.kind];
  return fieldType({
    kind: 'scalar',
    mode: 'required',
    scalar: config.kind === 'autoincrement' ? config.type === 'BigInt' ? 'BigInt' : 'Int' : 'String',
    nativeType: meta.provider === 'postgresql' && config.kind === 'uuid' ? 'Uuid' : undefined,
    default: {
      kind: config.kind
    }
  })(_objectSpread(_objectSpread({}, config), {}, {
    // The ID field is always filterable and orderable.
    isFilterable: true,
    isOrderable: true,
    input: {
      where: {
        arg: filterArg,
        resolve(val) {
          return resolveVal(val, parseVal);
        }
      },
      uniqueWhere: {
        arg: arg({
          type: ID
        }),
        resolve: parseVal
      },
      orderBy: {
        arg: arg({
          type: orderDirectionEnum
        })
      }
    },
    output: field({
      type: nonNull(ID),
      resolve(_ref) {
        let {
          value
        } = _ref;
        return value.toString();
      }
    }),
    views: '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/id-field-view',
    getAdminMeta: () => ({
      kind: config.kind
    }),
    ui: {
      createView: {
        fieldMode: 'hidden'
      },
      itemView: {
        fieldMode: 'hidden'
      }
    }
  }));
};

/* Validate lists config and default the id field */
function applyIdFieldDefaults(config) {
  var _config$db$idField;
  const lists = {};
  const defaultIdField = (_config$db$idField = config.db.idField) !== null && _config$db$idField !== void 0 ? _config$db$idField : {
    kind: 'cuid'
  };
  if (defaultIdField.kind === 'autoincrement' && defaultIdField.type === 'BigInt' && config.db.provider === 'sqlite') {
    throw new Error('BigInt autoincrements are not supported on SQLite but they are configured as the global id field type at db.idField');
  }
  Object.keys(config.lists).forEach(key => {
    var _listConfig$db, _listConfig$db$idFiel, _listConfig$db2, _listConfig$db$idFiel2, _listConfig$db3;
    const listConfig = config.lists[key];
    if (listConfig.fields.id) {
      throw new Error(`A field with the \`id\` path is defined in the fields object on the ${JSON.stringify(key)} list. This is not allowed, use the idField option instead.`);
    }
    if (((_listConfig$db = listConfig.db) === null || _listConfig$db === void 0 ? void 0 : (_listConfig$db$idFiel = _listConfig$db.idField) === null || _listConfig$db$idFiel === void 0 ? void 0 : _listConfig$db$idFiel.kind) === 'autoincrement' && listConfig.db.idField.type === 'BigInt' && config.db.provider === 'sqlite') {
      throw new Error(`BigInt autoincrements are not supported on SQLite but they are configured at db.idField on the ${key} list`);
    }
    if (listConfig.isSingleton && (_listConfig$db2 = listConfig.db) !== null && _listConfig$db2 !== void 0 && _listConfig$db2.idField) {
      throw new Error(`A singleton list cannot specify an idField, but it is configured at db.idField on the ${key} list`);
    }
    const idFieldConfig = (_listConfig$db$idFiel2 = (_listConfig$db3 = listConfig.db) === null || _listConfig$db3 === void 0 ? void 0 : _listConfig$db3.idField) !== null && _listConfig$db$idFiel2 !== void 0 ? _listConfig$db$idFiel2 : defaultIdField;
    const idField = idFieldType(idFieldConfig, !!listConfig.isSingleton);
    const fields = _objectSpread({
      id: idField
    }, listConfig.fields);
    lists[key] = _objectSpread(_objectSpread({}, listConfig), {}, {
      fields
    });
  });
  return lists;
}

/*
  This function executes the validation and other initialisation logic that
  needs to be run on Keystone Config before it can be used.
*/

function initConfig(config) {
  if (!['postgresql', 'sqlite', 'mysql'].includes(config.db.provider)) {
    throw new Error('Invalid db configuration. Please specify db.provider as either "sqlite", "postgresql" or "mysql"');
  }
  return _objectSpread(_objectSpread({}, config), {}, {
    lists: applyIdFieldDefaults(config)
  });
}

export { initConfig as i };
