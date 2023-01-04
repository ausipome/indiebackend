'use strict';

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var graphql = require('graphql');
var core = require('./core-3a9d46a1.cjs.dev.js');
var nextFields = require('./next-fields-112c1555.cjs.dev.js');
var graphqlTsSchema = require('./graphql-ts-schema-db7cad71.cjs.dev.js');
var values = require('graphql/execution/values');
var graphqlErrors = require('./graphql-errors-0bcd0ecf.cjs.dev.js');
var pluralize = require('pluralize');
var utils = require('./utils-c845278f.cjs.dev.js');
var DataLoader = require('dataloader');
var _objectWithoutProperties = require('@babel/runtime/helpers/objectWithoutProperties');
var apiWithoutContext = require('@graphql-ts/schema/api-without-context');
var apiWithContext = require('@graphql-ts/schema/api-with-context');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var pluralize__default = /*#__PURE__*/_interopDefault(pluralize);
var DataLoader__default = /*#__PURE__*/_interopDefault(DataLoader);

// Run prisma operations as part of a resolver
async function runWithPrisma(context, _ref, fn) {
  let {
    listKey
  } = _ref;
  const model = context.prisma[listKey[0].toLowerCase() + listKey.slice(1)];
  try {
    return await fn(model);
  } catch (err) {
    throw graphqlErrors.prismaError(err);
  }
}

// this is wrong
// all the things should be generic over the id type
// i don't want to deal with that right now though

// these aren't here out of thinking this is better syntax(i do not think it is),
// it's just because TS won't infer the arg is X bit
const isFulfilled = arg => arg.status === 'fulfilled';
const isRejected = arg => arg.status === 'rejected';
async function promiseAllRejectWithAllErrors(promises) {
  const results = await Promise.allSettled(promises);
  if (!results.every(isFulfilled)) {
    const errors = results.filter(isRejected).map(x => x.reason);
    // AggregateError would be ideal here but it's not in Node 12 or 14
    // (also all of our error stuff is just meh. this whole thing is just to align with previous behaviour)
    const error = new Error(errors[0].message || errors[0].toString());
    error.errors = errors;
    throw error;
  }
  return results.map(x => x.value);
}
function getNamesFromList(listKey, _ref2) {
  let {
    graphql,
    ui,
    isSingleton
  } = _ref2;
  if ((ui === null || ui === void 0 ? void 0 : ui.path) !== undefined && !/^[a-z-_][a-z0-9-_]*$/.test(ui.path)) {
    throw new Error(`ui.path for ${listKey} is ${ui.path} but it must only contain lowercase letters, numbers, dashes, and underscores and not start with a number`);
  }
  const computedSingular = utils.humanize(listKey);
  const computedPlural = pluralize__default["default"].plural(computedSingular);
  const computedLabel = isSingleton ? computedSingular : computedPlural;
  const path = (ui === null || ui === void 0 ? void 0 : ui.path) || labelToPath(computedLabel);
  const pluralGraphQLName = (graphql === null || graphql === void 0 ? void 0 : graphql.plural) || labelToClass(computedPlural);
  if (pluralGraphQLName === listKey) {
    throw new Error(`The list key and the plural name used in GraphQL must be different but the list key ${listKey} is the same as the plural GraphQL name, please specify graphql.plural`);
  }
  return {
    pluralGraphQLName,
    adminUILabels: {
      label: (ui === null || ui === void 0 ? void 0 : ui.label) || computedLabel,
      singular: (ui === null || ui === void 0 ? void 0 : ui.singular) || computedSingular,
      plural: (ui === null || ui === void 0 ? void 0 : ui.plural) || computedPlural,
      path
    }
  };
}
const labelToPath = str => str.split(' ').join('-').toLowerCase();
const labelToClass = str => str.replace(/\s+/g, '');
function getDBFieldKeyForFieldOnMultiField(fieldKey, subField) {
  return `${fieldKey}_${subField}`;
}

// this whole thing exists because Prisma doesn't handle doing multiple writes on SQLite well
// https://github.com/prisma/prisma/issues/2955
// note this is keyed by the prisma client instance, not the context
// because even across requests, we want to apply the limit on SQLite
const writeLimits = new WeakMap();
function setWriteLimit(prismaClient, limit) {
  writeLimits.set(prismaClient, limit);
}

// this accepts the context instead of the prisma client because the prisma client on context is `any`
// so by accepting the context, it'll be less likely the wrong thing will be passed.
function getWriteLimit(context) {
  const limit = writeLimits.get(context.prisma);
  if (limit === undefined) {
    throw new Error('unexpected write limit not set for prisma client');
  }
  return limit;
}
const prismaNamespaces = new WeakMap();
function setPrismaNamespace(prismaClient, prismaNamespace) {
  prismaNamespaces.set(prismaClient, prismaNamespace);
}

// this accepts the context instead of the prisma client because the prisma client on context is `any`
// so by accepting the context, it'll be less likely the wrong thing will be passed.
function getPrismaNamespace(context) {
  const limit = prismaNamespaces.get(context.prisma);
  if (limit === undefined) {
    throw new Error('unexpected prisma namespace not set for prisma client');
  }
  return limit;
}
function areArraysEqual(a, b) {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

const _excluded = ["AND", "OR", "NOT"];
async function resolveUniqueWhereInput(input, list, context) {
  const inputKeys = Object.keys(input);
  if (inputKeys.length !== 1) {
    throw graphqlErrors.userInputError(`Exactly one key must be passed in a unique where input but ${inputKeys.length} keys were passed`);
  }
  const key = inputKeys[0];
  const val = input[key];
  if (list.isSingleton && (key !== 'id' || val !== '1')) {
    throw graphqlErrors.userInputError(`The id field of a unique where input should be '1' for a singleton list`);
  }
  if (val === null) {
    throw graphqlErrors.userInputError(`The unique value provided in a unique where input must not be null`);
  }
  const resolver = list.fields[key].input.uniqueWhere.resolve;
  return {
    [key]: resolver ? await resolver(val, context) : val
  };
}
async function resolveWhereInput(inputFilter, list, context) {
  var _inputFilter$id;
  let isAtRootWhere = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  if (isAtRootWhere && list.isSingleton && (inputFilter === null || inputFilter === void 0 ? void 0 : (_inputFilter$id = inputFilter.id) === null || _inputFilter$id === void 0 ? void 0 : _inputFilter$id.equals) !== '1') {
    throw graphqlErrors.userInputError(`The id field of a where input should be '1' for a singleton list`);
  }
  return {
    AND: await Promise.all(Object.entries(inputFilter).map(async _ref => {
      let [fieldKey, value] = _ref;
      if (fieldKey === 'OR' || fieldKey === 'AND' || fieldKey === 'NOT') {
        return {
          [fieldKey]: await Promise.all(value.map(value => resolveWhereInput(value, list, context, false)))
        };
      }
      const field = list.fields[fieldKey];
      // we know if there are filters in the input object with the key of a field, the field must have defined a where input so this non null assertion is okay
      const where = field.input.where;
      const dbField = field.dbField;
      const ret = where.resolve ? await where.resolve(value, context, (() => {
        if (field.dbField.kind !== 'relation') {
          return undefined;
        }
        const foreignList = field.dbField.list;
        const whereResolver = val => resolveWhereInput(val, list.lists[foreignList], context);
        if (field.dbField.mode === 'many') {
          return async () => {
            if (value === null) {
              throw graphqlErrors.userInputError('A many relation filter cannot be set to null');
            }
            return Object.fromEntries(await Promise.all(Object.entries(value).map(async _ref2 => {
              let [key, val] = _ref2;
              if (val === null) {
                throw graphqlErrors.userInputError(`The key "${key}" in a many relation filter cannot be set to null`);
              }
              return [key, await whereResolver(val)];
            })));
          };
        }
        return val => {
          if (val === null) {
            return null;
          }
          return whereResolver(val);
        };
      })()) : value;
      if (ret === null) {
        if (field.dbField.kind === 'multi') {
          // Note: no built-in field types support multi valued database fields *and* filtering.
          // This code path is only relevent to custom fields which fit that criteria.
          throw new Error('multi db fields cannot return null from where input resolvers');
        }
        return {
          [fieldKey]: null
        };
      }
      return handleOperators(fieldKey, dbField, ret);
    }))
  };
}
function handleOperators(fieldKey, dbField, _ref3) {
  let {
      AND,
      OR,
      NOT
    } = _ref3,
    rest = _objectWithoutProperties(_ref3, _excluded);
  return _objectSpread({
    AND: AND === null || AND === void 0 ? void 0 : AND.map(value => handleOperators(fieldKey, dbField, value)),
    OR: OR === null || OR === void 0 ? void 0 : OR.map(value => handleOperators(fieldKey, dbField, value)),
    NOT: NOT === null || NOT === void 0 ? void 0 : NOT.map(value => handleOperators(fieldKey, dbField, value))
  }, nestWithAppropiateField(fieldKey, dbField, rest));
}
function nestWithAppropiateField(fieldKey, dbField, value) {
  if (dbField.kind === 'multi') {
    return Object.fromEntries(Object.entries(value).map(_ref4 => {
      let [key, val] = _ref4;
      return [getDBFieldKeyForFieldOnMultiField(fieldKey, key), val];
    }));
  }
  return {
    [fieldKey]: value
  };
}

function getNamedOrListTypeNodeForType(type) {
  if (type instanceof graphql.GraphQLList) {
    return {
      kind: graphql.Kind.LIST_TYPE,
      type: getTypeNodeForType(type.ofType)
    };
  }
  return {
    kind: graphql.Kind.NAMED_TYPE,
    name: {
      kind: graphql.Kind.NAME,
      value: type.name
    }
  };
}
function getTypeNodeForType(type) {
  if (type instanceof graphql.GraphQLNonNull) {
    return {
      kind: graphql.Kind.NON_NULL_TYPE,
      type: getNamedOrListTypeNodeForType(type.ofType)
    };
  }
  return getNamedOrListTypeNodeForType(type);
}
function getVariablesForGraphQLField(field) {
  const variableDefinitions = field.args.map(arg => {
    var _ref;
    return {
      kind: graphql.Kind.VARIABLE_DEFINITION,
      type: getTypeNodeForType(arg.type),
      variable: {
        kind: graphql.Kind.VARIABLE,
        name: {
          kind: graphql.Kind.NAME,
          value: arg.name
        }
      },
      defaultValue: arg.defaultValue === undefined ? undefined : (_ref = graphql.astFromValue(arg.defaultValue, arg.type)) !== null && _ref !== void 0 ? _ref : undefined
    };
  });
  const argumentNodes = field.args.map(arg => ({
    kind: graphql.Kind.ARGUMENT,
    name: {
      kind: graphql.Kind.NAME,
      value: arg.name
    },
    value: {
      kind: graphql.Kind.VARIABLE,
      name: {
        kind: graphql.Kind.NAME,
        value: arg.name
      }
    }
  }));
  return {
    variableDefinitions,
    argumentNodes
  };
}
const rawField = 'raw';
const RawScalar = new graphql.GraphQLScalarType({
  name: 'RawThingPlsDontRelyOnThisAnywhere'
});
const ReturnRawValueObjectType = new graphql.GraphQLObjectType({
  name: 'ReturnRawValue',
  fields: {
    [rawField]: {
      type: RawScalar,
      resolve(rootVal) {
        return rootVal;
      }
    }
  }
});
function argsToArgsConfig(args) {
  return Object.fromEntries(args.map(arg => {
    const argConfig = {
      astNode: arg.astNode,
      defaultValue: arg.defaultValue,
      deprecationReason: arg.deprecationReason,
      description: arg.description,
      extensions: arg.extensions,
      type: arg.type
    };
    return [arg.name, argConfig];
  }));
}
// note the GraphQLNonNull and GraphQLList constructors are incorrectly
// not generic over their inner type which is why we have to use as
// (the classes are generic but not the constructors)
function getTypeForField(originalType) {
  if (originalType instanceof graphql.GraphQLNonNull) {
    return new graphql.GraphQLNonNull(getTypeForField(originalType.ofType));
  }
  if (originalType instanceof graphql.GraphQLList) {
    return new graphql.GraphQLList(getTypeForField(originalType.ofType));
  }
  return ReturnRawValueObjectType;
}
function getRootValGivenOutputType(originalType, value) {
  if (originalType instanceof graphql.GraphQLNonNull) {
    return getRootValGivenOutputType(originalType.ofType, value);
  }
  if (value === null) return null;
  if (originalType instanceof graphql.GraphQLList) {
    return value.map(x => getRootValGivenOutputType(originalType.ofType, x));
  }
  return value[rawField];
}
function executeGraphQLFieldToRootVal(field) {
  const {
    argumentNodes,
    variableDefinitions
  } = getVariablesForGraphQLField(field);
  const document = {
    kind: graphql.Kind.DOCUMENT,
    definitions: [{
      kind: graphql.Kind.OPERATION_DEFINITION,
      operation: graphql.OperationTypeNode.QUERY,
      selectionSet: {
        kind: graphql.Kind.SELECTION_SET,
        selections: [{
          kind: graphql.Kind.FIELD,
          name: {
            kind: graphql.Kind.NAME,
            value: field.name
          },
          arguments: argumentNodes,
          selectionSet: {
            kind: graphql.Kind.SELECTION_SET,
            selections: [{
              kind: graphql.Kind.FIELD,
              name: {
                kind: graphql.Kind.NAME,
                value: rawField
              }
            }]
          }
        }]
      },
      variableDefinitions
    }]
  };
  const type = getTypeForField(field.type);
  const fieldConfig = {
    args: argsToArgsConfig(field.args),
    astNode: undefined,
    deprecationReason: field.deprecationReason,
    description: field.description,
    extensions: field.extensions,
    resolve: field.resolve,
    subscribe: field.subscribe,
    type
  };
  const schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
      name: 'Query',
      fields: {
        [field.name]: fieldConfig
      }
    }),
    assumeValid: true
  });
  return async function (args, context) {
    var _result$errors;
    let rootValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const result = await graphql.execute({
      schema,
      document,
      contextValue: context,
      variableValues: args,
      rootValue
    });
    if ((_result$errors = result.errors) !== null && _result$errors !== void 0 && _result$errors.length) {
      throw result.errors[0];
    }
    return getRootValGivenOutputType(type, result.data[field.name]);
  };
}

const argName = 'where';
function coerceAndValidateForGraphQLInput(schema, type, value) {
  const variableDefintions = [{
    kind: graphql.Kind.VARIABLE_DEFINITION,
    type: getTypeNodeForType(type),
    variable: {
      kind: graphql.Kind.VARIABLE,
      name: {
        kind: graphql.Kind.NAME,
        value: argName
      }
    }
  }];
  const coercedVariableValues = values.getVariableValues(schema, variableDefintions, {
    [argName]: value
  });
  if (coercedVariableValues.errors) {
    return {
      kind: 'error',
      error: coercedVariableValues.errors[0]
    };
  }
  return {
    kind: 'valid',
    value: coercedVariableValues.coerced[argName]
  };
}

function cannotForItem(operation, list) {
  return `You cannot ${operation} that ${list.listKey}` + (operation === 'create' ? '' : ' - it may not exist');
}
function cannotForItemFields(operation, list, fieldsDenied) {
  return `You cannot ${operation} that ${list.listKey} - you cannot ${operation} the fields ${JSON.stringify(fieldsDenied)}`;
}
async function getOperationAccess(list, context, operation) {
  const args = {
    operation,
    session: context.session,
    listKey: list.listKey,
    context
  };
  // Check the mutation access
  const access = list.access.operation[operation];
  let result;
  try {
    // @ts-ignore
    result = await access(args);
  } catch (error) {
    throw graphqlErrors.extensionError('Access control', [{
      error,
      tag: `${list.listKey}.access.operation.${args.operation}`
    }]);
  }
  const resultType = typeof result;

  // It's important that we don't cast objects to truthy values, as there's a strong chance that the user
  // has accidentally tried to return a filter.
  if (resultType !== 'boolean') {
    throw graphqlErrors.accessReturnError([{
      tag: `${args.listKey}.access.operation.${args.operation}`,
      returned: resultType
    }]);
  }
  return result;
}
async function getAccessFilters(list, context, operation) {
  try {
    let filters;
    if (operation === 'query') {
      filters = await list.access.filter.query({
        operation,
        session: context.session,
        listKey: list.listKey,
        context
      });
    } else if (operation === 'update') {
      filters = await list.access.filter.update({
        operation,
        session: context.session,
        listKey: list.listKey,
        context
      });
    } else if (operation === 'delete') {
      filters = await list.access.filter.delete({
        operation,
        session: context.session,
        listKey: list.listKey,
        context
      });
    }
    if (typeof filters === 'boolean') return filters;
    if (!filters) return false; // shouldn't happen, but, Typescript

    const schema = context.sudo().graphql.schema;
    const whereInput = graphql.assertInputObjectType(schema.getType(core.getGqlNames(list).whereInputName));
    const result = coerceAndValidateForGraphQLInput(schema, whereInput, filters);
    if (result.kind === 'valid') return result.value;
    throw result.error;
  } catch (error) {
    throw graphqlErrors.extensionError('Access control', [{
      error,
      tag: `${list.listKey}.access.filter.${operation}`
    }]);
  }
}
function parseFieldAccessControl(access) {
  var _access$read, _access$create, _access$update;
  if (typeof access === 'function') {
    return {
      read: access,
      create: access,
      update: access
    };
  }
  return {
    read: (_access$read = access === null || access === void 0 ? void 0 : access.read) !== null && _access$read !== void 0 ? _access$read : () => true,
    create: (_access$create = access === null || access === void 0 ? void 0 : access.create) !== null && _access$create !== void 0 ? _access$create : () => true,
    update: (_access$update = access === null || access === void 0 ? void 0 : access.update) !== null && _access$update !== void 0 ? _access$update : () => true
  };
}
function parseListAccessControl(access) {
  var _operation$query, _operation$create, _operation$update, _operation$delete, _filter$query, _filter$update, _filter$delete, _item$create, _item$update, _item$delete;
  if (typeof access === 'function') {
    return {
      operation: {
        query: access,
        create: access,
        update: access,
        delete: access
      },
      filter: {
        query: () => true,
        update: () => true,
        delete: () => true
      },
      item: {
        create: () => true,
        update: () => true,
        delete: () => true
      }
    };
  }
  let {
    operation,
    filter,
    item
  } = access;
  if (typeof operation === 'function') {
    operation = {
      query: operation,
      create: operation,
      update: operation,
      delete: operation
    };
  }
  return {
    operation: {
      query: (_operation$query = operation.query) !== null && _operation$query !== void 0 ? _operation$query : () => true,
      create: (_operation$create = operation.create) !== null && _operation$create !== void 0 ? _operation$create : () => true,
      update: (_operation$update = operation.update) !== null && _operation$update !== void 0 ? _operation$update : () => true,
      delete: (_operation$delete = operation.delete) !== null && _operation$delete !== void 0 ? _operation$delete : () => true
    },
    filter: {
      query: (_filter$query = filter === null || filter === void 0 ? void 0 : filter.query) !== null && _filter$query !== void 0 ? _filter$query : () => true,
      // create: not supported
      update: (_filter$update = filter === null || filter === void 0 ? void 0 : filter.update) !== null && _filter$update !== void 0 ? _filter$update : () => true,
      delete: (_filter$delete = filter === null || filter === void 0 ? void 0 : filter.delete) !== null && _filter$delete !== void 0 ? _filter$delete : () => true
    },
    item: {
      // query: not supported
      create: (_item$create = item === null || item === void 0 ? void 0 : item.create) !== null && _item$create !== void 0 ? _item$create : () => true,
      update: (_item$update = item === null || item === void 0 ? void 0 : item.update) !== null && _item$update !== void 0 ? _item$update : () => true,
      delete: (_item$delete = item === null || item === void 0 ? void 0 : item.delete) !== null && _item$delete !== void 0 ? _item$delete : () => true
    }
  };
}

async function checkFilterOrderAccess(things, context, operation) {
  const func = operation === 'filter' ? 'isFilterable' : 'isOrderable';
  const failures = [];
  const returnTypeErrors = [];
  const accessErrors = [];
  for (const {
    fieldKey,
    list
  } of things) {
    const field = list.fields[fieldKey];
    const rule = field.graphql.isEnabled[operation];
    // Check isOrderable
    if (!rule) {
      // If the field is explicitly false, it will excluded from the GraphQL API.
      throw new Error('Assert failed');
    } else if (typeof rule === 'function') {
      // Apply dynamic rules
      let result;
      try {
        result = await rule({
          context,
          session: context.session,
          listKey: list.listKey,
          fieldKey
        });
      } catch (error) {
        accessErrors.push({
          error,
          tag: `${list.listKey}.${fieldKey}.${func}`
        });
        continue;
      }
      const resultType = typeof result;

      // It's important that we don't cast objects to truthy values, as there's a strong chance that the user
      // has made a mistake.
      if (resultType !== 'boolean') {
        returnTypeErrors.push({
          tag: `${list.listKey}.${fieldKey}.${func}`,
          returned: resultType
        });
      } else if (!result) {
        failures.push(`${list.listKey}.${fieldKey}`);
      }
    }
  }
  if (accessErrors.length) {
    throw graphqlErrors.extensionError(func, accessErrors);
  }
  if (returnTypeErrors.length) {
    throw graphqlErrors.accessReturnError(returnTypeErrors);
  }
  if (failures.length) {
    throw graphqlErrors.filterAccessError({
      operation,
      fieldKeys: failures
    });
  }
}

// we want to put the value we get back from the field's unique where resolver into an equals
// rather than directly passing the value as the filter (even though Prisma supports that), we use equals
// because we want to disallow fields from providing an arbitrary filter
function mapUniqueWhereToWhere(uniqueWhere) {
  // inputResolvers.uniqueWhere validates that there is only one key
  const key = Object.keys(uniqueWhere)[0];
  const val = uniqueWhere[key];
  return {
    [key]: {
      equals: val
    }
  };
}
function traverseQuery(list, context, inputFilter, filterFields) {
  // Recursively traverse a where filter to find all the fields which are being
  // filtered on.
  Object.entries(inputFilter).forEach(_ref => {
    let [fieldKey, value] = _ref;
    if (fieldKey === 'OR' || fieldKey === 'AND' || fieldKey === 'NOT') {
      value.forEach(value => {
        traverseQuery(list, context, value, filterFields);
      });
    } else if (fieldKey === 'some' || fieldKey === 'none' || fieldKey === 'every') {
      traverseQuery(list, context, value, filterFields);
    } else {
      filterFields[`${list.listKey}.${fieldKey}`] = {
        fieldKey,
        list
      };
      // If it's a relationship, check the nested filters.
      const field = list.fields[fieldKey];
      if (field.dbField.kind === 'relation' && value !== null) {
        const foreignList = field.dbField.list;
        traverseQuery(list.lists[foreignList], context, value, filterFields);
      }
    }
  });
}
async function checkFilterAccess(list, context, inputFilter) {
  if (!inputFilter) return;
  const filterFields = {};
  traverseQuery(list, context, inputFilter, filterFields);
  await checkFilterOrderAccess(Object.values(filterFields), context, 'filter');
}
async function accessControlledFilter(list, context, resolvedWhere, accessFilters) {
  // Merge the filter access control
  if (typeof accessFilters === 'object') {
    resolvedWhere = {
      AND: [resolvedWhere, await resolveWhereInput(accessFilters, list, context)]
    };
  }
  return resolvedWhere;
}
async function findOne(args, list, context) {
  // Check operation permission to pass into single operation
  const operationAccess = await getOperationAccess(list, context, 'query');
  if (!operationAccess) {
    return null;
  }
  const accessFilters = await getAccessFilters(list, context, 'query');
  if (accessFilters === false) {
    return null;
  }

  // Validate and resolve the input filter
  const uniqueWhere = await resolveUniqueWhereInput(args.where, list, context);
  const resolvedWhere = mapUniqueWhereToWhere(uniqueWhere);

  // Check filter access
  const fieldKey = Object.keys(args.where)[0];
  await checkFilterOrderAccess([{
    fieldKey,
    list
  }], context, 'filter');

  // Apply access control
  const filter = await accessControlledFilter(list, context, resolvedWhere, accessFilters);
  return runWithPrisma(context, list, model => model.findFirst({
    where: filter
  }));
}
async function findMany(_ref2, list, context, info, extraFilter) {
  var _list$types$findManyA;
  let {
    where,
    take,
    skip,
    orderBy: rawOrderBy
  } = _ref2;
  const maxTake = (_list$types$findManyA = list.types.findManyArgs.take.defaultValue) !== null && _list$types$findManyA !== void 0 ? _list$types$findManyA : Infinity;
  if ((take !== null && take !== void 0 ? take : Infinity) > maxTake) {
    throw graphqlErrors.limitsExceededError({
      list: list.listKey,
      type: 'maxTake',
      limit: maxTake
    });
  }
  const orderBy = await resolveOrderBy(rawOrderBy, list, context);

  // Check operation permission, throw access denied if not allowed
  const operationAccess = await getOperationAccess(list, context, 'query');
  if (!operationAccess) {
    return [];
  }
  const accessFilters = await getAccessFilters(list, context, 'query');
  if (accessFilters === false) {
    return [];
  }
  let resolvedWhere = await resolveWhereInput(where, list, context);

  // Check filter access
  await checkFilterAccess(list, context, where);
  resolvedWhere = await accessControlledFilter(list, context, resolvedWhere, accessFilters);
  const results = await runWithPrisma(context, list, model => model.findMany({
    where: extraFilter === undefined ? resolvedWhere : {
      AND: [resolvedWhere, extraFilter]
    },
    orderBy,
    take: take !== null && take !== void 0 ? take : undefined,
    skip
  }));
  if (info.cacheControl && list.cacheHint) {
    var _info$operation$name;
    info.cacheControl.setCacheHint(list.cacheHint({
      results,
      operationName: (_info$operation$name = info.operation.name) === null || _info$operation$name === void 0 ? void 0 : _info$operation$name.value,
      meta: false
    }));
  }
  return results;
}
async function resolveOrderBy(orderBy, list, context) {
  // Check input format. FIXME: Group all errors
  orderBy.forEach(orderBySelection => {
    const keys = Object.keys(orderBySelection);
    if (keys.length !== 1) {
      throw graphqlErrors.userInputError(`Only a single key must be passed to ${list.types.orderBy.graphQLType.name}`);
    }
    const fieldKey = keys[0];
    const value = orderBySelection[fieldKey];
    if (value === null) {
      throw graphqlErrors.userInputError('null cannot be passed as an order direction');
    }
  });

  // Check orderBy access
  const orderByKeys = orderBy.map(orderBySelection => ({
    fieldKey: Object.keys(orderBySelection)[0],
    list
  }));
  await checkFilterOrderAccess(orderByKeys, context, 'orderBy');
  return await Promise.all(orderBy.map(async orderBySelection => {
    const keys = Object.keys(orderBySelection);
    const fieldKey = keys[0];
    const value = orderBySelection[fieldKey];
    const field = list.fields[fieldKey];
    const resolve = field.input.orderBy.resolve;
    const resolvedValue = resolve ? await resolve(value, context) : value;
    if (field.dbField.kind === 'multi') {
      // Note: no built-in field types support multi valued database fields *and* orderBy.
      // This code path is only relevent to custom fields which fit that criteria.
      const keys = Object.keys(resolvedValue);
      if (keys.length !== 1) {
        throw new Error(`Only a single key must be returned from an orderBy input resolver for a multi db field`);
      }
      const innerKey = keys[0];
      return {
        [getDBFieldKeyForFieldOnMultiField(fieldKey, innerKey)]: resolvedValue[innerKey]
      };
    } else {
      return {
        [fieldKey]: resolvedValue
      };
    }
  }));
}
async function count(_ref3, list, context, info, extraFilter) {
  let {
    where
  } = _ref3;
  // Check operation permission, return zero if not allowed
  const operationAccess = await getOperationAccess(list, context, 'query');
  if (!operationAccess) {
    return 0;
  }
  const accessFilters = await getAccessFilters(list, context, 'query');
  if (accessFilters === false) {
    return 0;
  }
  let resolvedWhere = await resolveWhereInput(where, list, context);

  // Check filter access
  await checkFilterAccess(list, context, where);
  resolvedWhere = await accessControlledFilter(list, context, resolvedWhere, accessFilters);
  const count = await runWithPrisma(context, list, model => model.count({
    where: extraFilter === undefined ? resolvedWhere : {
      AND: [resolvedWhere, extraFilter]
    }
  }));
  if (info.cacheControl && list.cacheHint) {
    var _info$operation$name2;
    info.cacheControl.setCacheHint(list.cacheHint({
      results: count,
      operationName: (_info$operation$name2 = info.operation.name) === null || _info$operation$name2 === void 0 ? void 0 : _info$operation$name2.value,
      meta: true
    }));
  }
  return count;
}

// note: all keystone fields correspond to a field here
// not all fields here correspond to keystone fields(the implicit side of one-sided relation fields)

function sortRelationships(left, right) {
  if (left.field.mode === 'one' && right.field.mode === 'one') {
    if (left.field.foreignKey !== undefined && right.field.foreignKey !== undefined) {
      throw new Error(`You can only set db.foreignKey on one side of a one to one relationship, but foreignKey is set on both ${left.listKey}.${left.fieldPath} and ${right.listKey}.${right.fieldPath}`);
    }
    if (left.field.foreignKey || right.field.foreignKey) {
      // return the field that specifies the foreignKey first
      return left.field.foreignKey ? [left, right] : [right, left];
    }
  } else if (left.field.mode === 'one' || right.field.mode === 'one') {
    // many relationships will never have a foreign key, so return the one relationship first
    const rels = left.field.mode === 'one' ? [left, right] : [right, left];
    // we're only doing this for rels[1] because:
    // - rels[1] is the many side
    // - for the one side, TypeScript will already disallow relationName
    if (rels[1].field.relationName !== undefined) {
      throw new Error(`You can only set db.relationName on one side of a many to many relationship, but db.relationName is set on ${rels[1].listKey}.${rels[1].fieldPath} which is the many side of a many to one relationship with ${rels[0].listKey}.${rels[0].fieldPath}`);
    }
    return rels;
  }
  if (left.field.mode === 'many' && right.field.mode === 'many' && (left.field.relationName !== undefined || right.field.relationName !== undefined)) {
    if (left.field.relationName !== undefined && right.field.relationName !== undefined) {
      throw new Error(`You can only set db.relationName on one side of a many to many relationship, but db.relationName is set on both ${left.listKey}.${left.fieldPath} and ${right.listKey}.${right.fieldPath}`);
    }
    return left.field.relationName !== undefined ? [left, right] : [right, left];
  }
  const order = left.listKey.localeCompare(right.listKey);
  if (order > 0) {
    // left comes after right, so swap them.
    return [right, left];
  } else if (order === 0) {
    // self referential list, so check the paths.
    if (left.fieldPath.localeCompare(right.fieldPath) > 0) {
      return [right, left];
    }
  }
  return [left, right];
}

// what's going on here:
// - validating all the relationships
// - for relationships involving to-one: deciding which side owns the foreign key
// - turning one-sided relationships into two-sided relationships so that elsewhere in Keystone,
//   you only have to reason about two-sided relationships
//   (note that this means that there are "fields" in the returned ListsWithResolvedRelations
//   which are not actually proper Keystone fields, they are just a db field and nothing else)
function resolveRelationships(lists) {
  const alreadyResolvedTwoSidedRelationships = new Set();
  const resolvedLists = Object.fromEntries(Object.keys(lists).map(listKey => [listKey, {}]));
  for (const [listKey, fields] of Object.entries(lists)) {
    const resolvedList = resolvedLists[listKey];
    for (const [fieldPath, {
      dbField: field
    }] of Object.entries(fields.fields)) {
      if (field.kind !== 'relation') {
        resolvedList[fieldPath] = field;
        continue;
      }
      const foreignUnresolvedList = lists[field.list];
      if (!foreignUnresolvedList) {
        throw new Error(`The relationship field at ${listKey}.${fieldPath} points to the list ${listKey} which does not exist`);
      }
      if (foreignUnresolvedList.isSingleton) {
        throw new Error(`The relationship field at ${listKey}.${fieldPath} points to a singleton list, ${listKey}, which is not allowed`);
      }
      if (field.field) {
        var _foreignUnresolvedLis, _leftRel$field$foreig2;
        const localRef = `${listKey}.${fieldPath}`;
        const foreignRef = `${field.list}.${field.field}`;
        if (alreadyResolvedTwoSidedRelationships.has(localRef)) {
          continue;
        }
        alreadyResolvedTwoSidedRelationships.add(foreignRef);
        const foreignField = (_foreignUnresolvedLis = foreignUnresolvedList.fields[field.field]) === null || _foreignUnresolvedLis === void 0 ? void 0 : _foreignUnresolvedLis.dbField;
        if (!foreignField) {
          throw new Error(`The relationship field at ${localRef} points to ${foreignRef} but no field at ${foreignRef} exists`);
        }
        if (foreignField.kind !== 'relation') {
          throw new Error(`The relationship field at ${localRef} points to ${foreignRef} but ${foreignRef} is not a relationship field`);
        }
        if (foreignField.list !== listKey) {
          throw new Error(`The relationship field at ${localRef} points to ${foreignRef} but ${foreignRef} points to the list ${foreignField.list} rather than ${listKey}`);
        }
        if (foreignField.field === undefined) {
          throw new Error(`The relationship field at ${localRef} points to ${foreignRef}, ${localRef} points to ${listKey} correctly but does not point to the ${fieldPath} field when it should`);
        }
        if (foreignField.field !== fieldPath) {
          throw new Error(`The relationship field at ${localRef} points to ${foreignRef}, ${localRef} points to ${listKey} correctly but points to the ${foreignField.field} field instead of ${fieldPath}`);
        }
        let [leftRel, rightRel] = sortRelationships({
          listKey,
          fieldPath,
          field
        }, {
          listKey: field.list,
          fieldPath: field.field,
          field: foreignField
        });
        if (leftRel.field.mode === 'one' && rightRel.field.mode === 'one') {
          var _leftRel$field$foreig;
          const relationName = `${leftRel.listKey}_${leftRel.fieldPath}`;
          resolvedLists[leftRel.listKey][leftRel.fieldPath] = {
            kind: 'relation',
            mode: 'one',
            field: rightRel.fieldPath,
            list: rightRel.listKey,
            foreignIdField: {
              kind: 'owned-unique',
              map: typeof leftRel.field.foreignKey === 'object' ? (_leftRel$field$foreig = leftRel.field.foreignKey) === null || _leftRel$field$foreig === void 0 ? void 0 : _leftRel$field$foreig.map : leftRel.fieldPath
            },
            relationName
          };
          resolvedLists[rightRel.listKey][rightRel.fieldPath] = {
            kind: 'relation',
            mode: 'one',
            field: leftRel.fieldPath,
            list: leftRel.listKey,
            foreignIdField: {
              kind: 'none'
            },
            relationName
          };
          continue;
        }
        if (leftRel.field.mode === 'many' && rightRel.field.mode === 'many') {
          var _leftRel$field$relati;
          const relationName = (_leftRel$field$relati = leftRel.field.relationName) !== null && _leftRel$field$relati !== void 0 ? _leftRel$field$relati : `${leftRel.listKey}_${leftRel.fieldPath}`;
          resolvedLists[leftRel.listKey][leftRel.fieldPath] = {
            kind: 'relation',
            mode: 'many',
            field: rightRel.fieldPath,
            list: rightRel.listKey,
            relationName
          };
          resolvedLists[rightRel.listKey][rightRel.fieldPath] = {
            kind: 'relation',
            mode: 'many',
            field: leftRel.fieldPath,
            list: leftRel.listKey,
            relationName
          };
          continue;
        }
        const relationName = `${leftRel.listKey}_${leftRel.fieldPath}`;
        resolvedLists[leftRel.listKey][leftRel.fieldPath] = {
          kind: 'relation',
          mode: 'one',
          field: rightRel.fieldPath,
          list: rightRel.listKey,
          foreignIdField: {
            kind: 'owned',
            map: typeof leftRel.field.foreignKey === 'object' ? (_leftRel$field$foreig2 = leftRel.field.foreignKey) === null || _leftRel$field$foreig2 === void 0 ? void 0 : _leftRel$field$foreig2.map : leftRel.fieldPath
          },
          relationName
        };
        resolvedLists[rightRel.listKey][rightRel.fieldPath] = {
          kind: 'relation',
          mode: 'many',
          field: leftRel.fieldPath,
          list: leftRel.listKey,
          relationName
        };
        continue;
      }
      const foreignFieldPath = `from_${listKey}_${fieldPath}`;
      if (foreignUnresolvedList.fields[foreignFieldPath]) {
        throw new Error(`The relationship field at ${listKey}.${fieldPath} points to the list ${field.list}, Keystone needs to a create a relationship field at ${field.list}.${foreignFieldPath} to support the relationship at ${listKey}.${fieldPath} but ${field.list} already has a field named ${foreignFieldPath}`);
      }
      if (field.mode === 'many') {
        var _field$relationName;
        const relationName = (_field$relationName = field.relationName) !== null && _field$relationName !== void 0 ? _field$relationName : `${listKey}_${fieldPath}`;
        resolvedLists[field.list][foreignFieldPath] = {
          kind: 'relation',
          mode: 'many',
          list: listKey,
          field: fieldPath,
          relationName
        };
        resolvedList[fieldPath] = {
          kind: 'relation',
          mode: 'many',
          list: field.list,
          field: foreignFieldPath,
          relationName
        };
      } else {
        var _field$foreignKey;
        const relationName = `${listKey}_${fieldPath}`;
        resolvedLists[field.list][foreignFieldPath] = {
          kind: 'relation',
          mode: 'many',
          list: listKey,
          field: fieldPath,
          relationName
        };
        resolvedList[fieldPath] = {
          kind: 'relation',
          list: field.list,
          field: foreignFieldPath,
          foreignIdField: {
            kind: 'owned',
            map: typeof field.foreignKey === 'object' ? (_field$foreignKey = field.foreignKey) === null || _field$foreignKey === void 0 ? void 0 : _field$foreignKey.map : fieldPath
          },
          relationName,
          mode: 'one'
        };
      }
    }
  }
  // the way we resolve the relationships means that the relationships will be in a
  // different order than the order the user specified in their config
  // doesn't really change the behaviour of anything but it means that the order of the fields in the prisma schema will be
  // the same as the user provided
  return Object.fromEntries(Object.entries(resolvedLists).map(_ref => {
    let [listKey, outOfOrderDbFields] = _ref;
    // this adds the fields based on the order that the user passed in
    // (except it will not add the opposites to one-sided relations)
    const resolvedDbFields = Object.fromEntries(Object.keys(lists[listKey].fields).map(fieldKey => [fieldKey, outOfOrderDbFields[fieldKey]]));
    // then we add the opposites to one-sided relations
    Object.assign(resolvedDbFields, outOfOrderDbFields);
    return [listKey, resolvedDbFields];
  }));
}

function getRelationVal(dbField, id, foreignList, context, info, fk) {
  const oppositeDbField = foreignList.resolvedDbFields[dbField.field];
  if (oppositeDbField.kind !== 'relation') throw new Error('failed assert');
  if (dbField.mode === 'many') {
    const relationFilter = {
      [dbField.field]: oppositeDbField.mode === 'many' ? {
        some: {
          id
        }
      } : {
        id
      }
    };
    return {
      findMany: async args => findMany(args, foreignList, context, info, relationFilter),
      count: async _ref => {
        let {
          where
        } = _ref;
        return count({
          where
        }, foreignList, context, info, relationFilter);
      }
    };
  } else {
    return async () => {
      if (fk === null) {
        // If the foreign key is explicitly null, there's no need to anything else,
        // since we know the related item doesn't exist.
        return null;
      }
      // for one-to-many relationships, the one side always owns the foreign key
      // so that means we have the id for the related item and we're fetching it by _its_ id.
      // for the a one-to-one relationship though, the id might be on the related item
      // so we need to fetch the related item by the id of the current item on the foreign key field
      const currentItemOwnsForeignKey = fk !== undefined;
      return fetchRelatedItem(context)(foreignList)(currentItemOwnsForeignKey ? 'id' : `${dbField.field}Id`)(currentItemOwnsForeignKey ? fk : id);
    };
  }
}
function weakMemoize(cb) {
  const cache = new WeakMap();
  return arg => {
    if (!cache.has(arg)) {
      const result = cb(arg);
      cache.set(arg, result);
    }
    return cache.get(arg);
  };
}
function memoize(cb) {
  const cache = new Map();
  return arg => {
    if (!cache.has(arg)) {
      const result = cb(arg);
      cache.set(arg, result);
    }
    return cache.get(arg);
  };
}
const fetchRelatedItem = weakMemoize(context => weakMemoize(foreignList => memoize(idFieldKey => {
  const relatedItemLoader = new DataLoader__default["default"](keys => fetchRelatedItems(context, foreignList, idFieldKey, keys), {
    cache: false
  });
  return id => relatedItemLoader.load(id);
})));
async function fetchRelatedItems(context, foreignList, idFieldKey, toFetch) {
  const operationAccess = await getOperationAccess(foreignList, context, 'query');
  if (!operationAccess) {
    return [];
  }
  const accessFilters = await getAccessFilters(foreignList, context, 'query');
  if (accessFilters === false) {
    return [];
  }
  const resolvedWhere = await accessControlledFilter(foreignList, context, {
    [idFieldKey]: {
      in: toFetch
    }
  }, accessFilters);
  const results = await runWithPrisma(context, foreignList, model => model.findMany({
    where: resolvedWhere
  }));
  const resultsById = new Map(results.map(x => [x[idFieldKey], x]));
  return toFetch.map(id => resultsById.get(id));
}
function getValueForDBField(rootVal, dbField, id, fieldPath, context, lists, info) {
  if (dbField.kind === 'multi') {
    return Object.fromEntries(Object.keys(dbField.fields).map(innerDBFieldKey => {
      const keyOnDbValue = getDBFieldKeyForFieldOnMultiField(fieldPath, innerDBFieldKey);
      return [innerDBFieldKey, rootVal[keyOnDbValue]];
    }));
  }
  if (dbField.kind === 'relation') {
    // If we're holding a foreign key value, let's take advantage of that.
    let fk;
    if (dbField.mode === 'one' && dbField.foreignIdField.kind !== 'none') {
      fk = rootVal[`${fieldPath}Id`];
    }
    return getRelationVal(dbField, id, lists[dbField.list], context, info, fk);
  } else {
    return rootVal[fieldPath];
  }
}
function outputTypeField(output, dbField, cacheHint, access, listKey, fieldKey, lists) {
  return graphqlTsSchema.field({
    type: output.type,
    deprecationReason: output.deprecationReason,
    description: output.description,
    args: output.args,
    extensions: output.extensions,
    async resolve(rootVal, args, context, info) {
      const id = rootVal.id;

      // Check access
      let canAccess;
      try {
        canAccess = typeof access === 'function' ? await access({
          context,
          fieldKey,
          item: rootVal,
          listKey,
          operation: 'read',
          session: context.session
        }) : access;
      } catch (error) {
        throw graphqlErrors.extensionError('Access control', [{
          error,
          tag: `${listKey}.${fieldKey}.access.read`
        }]);
      }
      if (typeof canAccess !== 'boolean') {
        throw graphqlErrors.accessReturnError([{
          tag: `${listKey}.${fieldKey}.access.read`,
          returned: typeof canAccess
        }]);
      }
      if (!canAccess) {
        return null;
      }

      // Only static cache hints are supported at the field level until a use-case makes it clear what parameters a dynamic hint would take
      if (cacheHint && info && info.cacheControl) {
        info.cacheControl.setCacheHint(cacheHint);
      }
      const value = getValueForDBField(rootVal, dbField, id, fieldKey, context, lists, info);
      if (output.resolve) {
        return output.resolve({
          value,
          item: rootVal
        }, args, context, info);
      } else {
        return value;
      }
    }
  });
}

function assertFieldsValid(list) {
  assertNoConflictingExtraOutputFields(list);
  assertIdFieldGraphQLTypesCorrect(list);
  assertNoFieldKeysThatConflictWithFilterCombinators(list);
  assertUniqueWhereInputsValid(list);
}
function assertUniqueWhereInputsValid(list) {
  for (const [fieldKey, {
    dbField,
    input
  }] of Object.entries(list.fields)) {
    if (input !== null && input !== void 0 && input.uniqueWhere) {
      if (dbField.kind !== 'scalar' && dbField.kind !== 'enum') {
        throw new Error(`Only scalar db fields can provide a uniqueWhere input currently but the field at ${list.listKey}.${fieldKey} specifies a uniqueWhere input`);
      }
      if (dbField.index !== 'unique' && fieldKey !== 'id') {
        throw new Error(`Fields must have a unique index or be the idField to specify a uniqueWhere input but the field at ${list.listKey}.${fieldKey} specifies a uniqueWhere input without a unique index`);
      }
    }
  }
}
function assertNoFieldKeysThatConflictWithFilterCombinators(list) {
  for (const fieldKey of Object.keys(list.fields)) {
    if (fieldKey === 'AND' || fieldKey === 'OR' || fieldKey === 'NOT') {
      throw new Error(`Fields cannot be named ${fieldKey} but there is a field named ${fieldKey} on ${list.listKey}`);
    }
  }
}
function assertNoConflictingExtraOutputFields(list) {
  const fieldKeys = new Set(Object.keys(list.fields));
  const alreadyFoundFields = {};
  for (const [fieldKey, field] of Object.entries(list.fields)) {
    if (field.extraOutputFields) {
      for (const outputTypeFieldName of Object.keys(field.extraOutputFields)) {
        // note that this and the case handled below are fundamentally the same thing but i want different errors for each of them
        if (fieldKeys.has(outputTypeFieldName)) {
          throw new Error(`The field ${fieldKey} on the ${list.listKey} list defines an extra GraphQL output field named ${outputTypeFieldName} which conflicts with the Keystone field type named ${outputTypeFieldName} on the same list`);
        }
        const alreadyFoundField = alreadyFoundFields[outputTypeFieldName];
        if (alreadyFoundField !== undefined) {
          throw new Error(`The field ${fieldKey} on the ${list.listKey} list defines an extra GraphQL output field named ${outputTypeFieldName} which conflicts with the Keystone field type named ${alreadyFoundField} which also defines an extra GraphQL output field named ${outputTypeFieldName}`);
        }
        alreadyFoundFields[outputTypeFieldName] = fieldKey;
      }
    }
  }
}
function assertIdFieldGraphQLTypesCorrect(list) {
  var _idField$input;
  const idField = list.fields.id;
  if (((_idField$input = idField.input) === null || _idField$input === void 0 ? void 0 : _idField$input.uniqueWhere) === undefined) {
    throw new Error(`The idField on a list must define a uniqueWhere GraphQL input with the ID GraphQL scalar type but the idField for ${list.listKey} does not define one`);
  }
  if (idField.input.uniqueWhere.arg.type !== apiWithoutContext.ID) {
    throw new Error(`The idField on a list must define a uniqueWhere GraphQL input with the ID GraphQL scalar type but the idField for ${list.listKey} defines the type ${idField.input.uniqueWhere.arg.type.graphQLType.toString()}`);
  }
  // we may want to loosen these constraints in the future
  if (idField.input.create !== undefined) {
    throw new Error(`The idField on a list must not define a create GraphQL input but the idField for ${list.listKey} does define one`);
  }
  if (idField.input.update !== undefined) {
    throw new Error(`The idField on a list must not define an update GraphQL input but the idField for ${list.listKey} does define one`);
  }
  if (idField.graphql.isEnabled.read === false) {
    throw new Error(`The idField on a list must not have graphql.isEnabled.read be set to false but ${list.listKey} does`);
  }
  if (idField.output.type.kind !== 'non-null' || idField.output.type.of !== apiWithoutContext.ID) {
    throw new Error(`The idField on a list must define a GraphQL output field with a non-nullable ID GraphQL scalar type but the idField for ${list.listKey} defines the type ${idField.output.type.graphQLType.toString()}`);
  }
}

function throwIfNotAFilter(x, listKey, fieldKey) {
  if (['boolean', 'undefined', 'function'].includes(typeof x)) return;
  throw new Error(`Configuration option '${listKey}.${fieldKey}' must be either a boolean value or a function. Received '${x}'.`);
}
function getIsEnabled(listsConfig) {
  const isEnabled = {};
  for (const [listKey, listConfig] of Object.entries(listsConfig)) {
    var _listConfig$graphql;
    const omit = (_listConfig$graphql = listConfig.graphql) === null || _listConfig$graphql === void 0 ? void 0 : _listConfig$graphql.omit;
    const {
      defaultIsFilterable,
      defaultIsOrderable
    } = listConfig;
    if (!omit) {
      // We explicity check for boolean/function values here to ensure the dev hasn't made a mistake
      // when defining these values. We avoid duck-typing here as this is security related
      // and we want to make it hard to write incorrect code.
      throwIfNotAFilter(defaultIsFilterable, listKey, 'defaultIsFilterable');
      throwIfNotAFilter(defaultIsOrderable, listKey, 'defaultIsOrderable');
    }
    if (omit === true) {
      isEnabled[listKey] = {
        type: false,
        query: false,
        create: false,
        update: false,
        delete: false,
        filter: false,
        orderBy: false
      };
    } else if (omit === undefined) {
      isEnabled[listKey] = {
        type: true,
        query: true,
        create: true,
        update: true,
        delete: true,
        filter: defaultIsFilterable !== null && defaultIsFilterable !== void 0 ? defaultIsFilterable : true,
        orderBy: defaultIsOrderable !== null && defaultIsOrderable !== void 0 ? defaultIsOrderable : true
      };
    } else {
      isEnabled[listKey] = {
        type: true,
        query: !omit.includes('query'),
        create: !omit.includes('create'),
        update: !omit.includes('update'),
        delete: !omit.includes('delete'),
        filter: defaultIsFilterable !== null && defaultIsFilterable !== void 0 ? defaultIsFilterable : true,
        orderBy: defaultIsOrderable !== null && defaultIsOrderable !== void 0 ? defaultIsOrderable : true
      };
    }
  }
  return isEnabled;
}
function getListsWithInitialisedFields(_ref, listGraphqlTypes, intermediateLists) {
  let {
    storage: configStorage,
    lists: listsConfig,
    db: {
      provider
    }
  } = _ref;
  const result = {};
  for (const [listKey, list] of Object.entries(listsConfig)) {
    var _list$ui$labelField, _list$ui, _list$ui$searchFields, _list$ui2, _list$db, _list$isSingleton;
    const intermediateList = intermediateLists[listKey];
    const resultFields = {};
    const groups = [];
    const fieldKeys = Object.keys(list.fields);
    for (const [idx, [fieldKey, fieldFunc]] of Object.entries(list.fields).entries()) {
      var _f$graphql, _f$isFilterable, _f$isOrderable, _f$hooks, _f$graphql2;
      if (fieldKey.startsWith('__group')) {
        const group = fieldFunc;
        if (typeof group === 'object' && group !== null && typeof group.label === 'string' && (group.description === null || typeof group.description === 'string') && Array.isArray(group.fields) && areArraysEqual(group.fields, fieldKeys.slice(idx + 1, idx + 1 + group.fields.length))) {
          groups.push(group);
          continue;
        }
        throw new Error(`unexpected value for a group at ${listKey}.${fieldKey}`);
      }
      if (typeof fieldFunc !== 'function') {
        throw new Error(`The field at ${listKey}.${fieldKey} does not provide a function`);
      }
      const f = fieldFunc({
        fieldKey,
        listKey,
        lists: listGraphqlTypes,
        provider,
        getStorage: storage => configStorage === null || configStorage === void 0 ? void 0 : configStorage[storage]
      });

      // We explicity check for boolean values here to ensure the dev hasn't made a mistake
      // when defining these values. We avoid duck-typing here as this is security related
      // and we want to make it hard to write incorrect code.
      throwIfNotAFilter(f.isFilterable, listKey, 'isFilterable');
      throwIfNotAFilter(f.isOrderable, listKey, 'isOrderable');
      const omit = (_f$graphql = f.graphql) === null || _f$graphql === void 0 ? void 0 : _f$graphql.omit;
      const read = omit !== true && !(omit !== null && omit !== void 0 && omit.includes('read'));
      const _isEnabled = {
        read,
        update: omit !== true && !(omit !== null && omit !== void 0 && omit.includes('update')),
        create: omit !== true && !(omit !== null && omit !== void 0 && omit.includes('create')),
        // Filter and orderBy can be defaulted at the list level, otherwise they
        // default to `false` if no value was set at the list level.
        filter: read && ((_f$isFilterable = f.isFilterable) !== null && _f$isFilterable !== void 0 ? _f$isFilterable : intermediateList.graphql.isEnabled.filter),
        orderBy: read && ((_f$isOrderable = f.isOrderable) !== null && _f$isOrderable !== void 0 ? _f$isOrderable : intermediateList.graphql.isEnabled.orderBy)
      };
      resultFields[fieldKey] = _objectSpread(_objectSpread({}, f), {}, {
        dbField: f.dbField,
        access: parseFieldAccessControl(f.access),
        hooks: (_f$hooks = f.hooks) !== null && _f$hooks !== void 0 ? _f$hooks : {},
        graphql: {
          cacheHint: (_f$graphql2 = f.graphql) === null || _f$graphql2 === void 0 ? void 0 : _f$graphql2.cacheHint,
          isEnabled: _isEnabled
        },
        input: _objectSpread({}, f.input)
      });
    }

    // Default the labelField to `name`, `label`, or `title` if they exist; otherwise fall back to `id`
    const labelField = (_list$ui$labelField = (_list$ui = list.ui) === null || _list$ui === void 0 ? void 0 : _list$ui.labelField) !== null && _list$ui$labelField !== void 0 ? _list$ui$labelField : list.fields.label ? 'label' : list.fields.name ? 'name' : list.fields.title ? 'title' : 'id';
    const searchFields = new Set((_list$ui$searchFields = (_list$ui2 = list.ui) === null || _list$ui2 === void 0 ? void 0 : _list$ui2.searchFields) !== null && _list$ui$searchFields !== void 0 ? _list$ui$searchFields : []);
    if (searchFields.has('id')) {
      throw new Error(`${listKey}.ui.searchFields cannot include 'id'`);
    }
    result[listKey] = _objectSpread(_objectSpread(_objectSpread({
      fields: resultFields
    }, intermediateList), getNamesFromList(listKey, list)), {}, {
      access: parseListAccessControl(list.access),
      dbMap: (_list$db = list.db) === null || _list$db === void 0 ? void 0 : _list$db.map,
      types: listGraphqlTypes[listKey].types,
      ui: {
        labelField,
        searchFields,
        searchableFields: new Map()
      },
      groups,
      hooks: list.hooks || {},
      listKey,
      cacheHint: (() => {
        var _list$graphql;
        const cacheHint = (_list$graphql = list.graphql) === null || _list$graphql === void 0 ? void 0 : _list$graphql.cacheHint;
        if (cacheHint === undefined) {
          return undefined;
        }
        return typeof cacheHint === 'function' ? cacheHint : () => cacheHint;
      })(),
      isSingleton: (_list$isSingleton = list.isSingleton) !== null && _list$isSingleton !== void 0 ? _list$isSingleton : false
    });
  }
  return result;
}
function introspectGraphQLTypes(lists) {
  for (const [listKey, list] of Object.entries(lists)) {
    const {
      ui: {
        searchFields,
        searchableFields
      }
    } = list;
    if (searchFields.has('id')) {
      throw new Error(`The ui.searchFields option on the ${listKey} list includes 'id'. Lists can always be searched by an item's id so it must not be specified as a search field`);
    }
    const whereInputFields = list.types.where.graphQLType.getFields();
    for (const fieldKey of Object.keys(list.fields)) {
      var _whereInputFields$fie, _fieldFilterFields$co;
      const filterType = (_whereInputFields$fie = whereInputFields[fieldKey]) === null || _whereInputFields$fie === void 0 ? void 0 : _whereInputFields$fie.type;
      const fieldFilterFields = graphql.isInputObjectType(filterType) ? filterType.getFields() : undefined;
      if ((fieldFilterFields === null || fieldFilterFields === void 0 ? void 0 : (_fieldFilterFields$co = fieldFilterFields.contains) === null || _fieldFilterFields$co === void 0 ? void 0 : _fieldFilterFields$co.type) === graphql.GraphQLString) {
        var _fieldFilterFields$mo;
        searchableFields.set(fieldKey, (fieldFilterFields === null || fieldFilterFields === void 0 ? void 0 : (_fieldFilterFields$mo = fieldFilterFields.mode) === null || _fieldFilterFields$mo === void 0 ? void 0 : _fieldFilterFields$mo.type) === nextFields.QueryMode.graphQLType ? 'insensitive' : 'default');
      }
    }
    if (searchFields.size === 0) {
      if (searchableFields.has(list.ui.labelField)) {
        searchFields.add(list.ui.labelField);
      }
    }
  }
}
function getListGraphqlTypes(listsConfig, lists, intermediateLists) {
  const graphQLTypes = {};
  for (const [listKey, listConfig] of Object.entries(listsConfig)) {
    var _listConfig$graphql2;
    const names = core.getGqlNames({
      listKey,
      pluralGraphQLName: getNamesFromList(listKey, listConfig).pluralGraphQLName
    });
    const output = apiWithContext.object()({
      name: names.outputTypeName,
      fields: () => {
        const {
          fields
        } = lists[listKey];
        return _objectSpread({}, Object.fromEntries(Object.entries(fields).flatMap(_ref2 => {
          let [fieldPath, field] = _ref2;
          if (!field.output || !field.graphql.isEnabled.read || field.dbField.kind === 'relation' && !intermediateLists[field.dbField.list].graphql.isEnabled.query) {
            return [];
          }
          return [[fieldPath, field.output], ...Object.entries(field.extraOutputFields || {})].map(_ref3 => {
            var _field$graphql;
            let [outputTypeFieldName, outputField] = _ref3;
            return [outputTypeFieldName, outputTypeField(outputField, field.dbField, (_field$graphql = field.graphql) === null || _field$graphql === void 0 ? void 0 : _field$graphql.cacheHint, field.access.read, listKey, fieldPath, lists)];
          });
        })));
      }
    });
    const uniqueWhere = apiWithoutContext.inputObject({
      name: names.whereUniqueInputName,
      fields: () => {
        const {
          fields
        } = lists[listKey];
        return _objectSpread(_objectSpread({}, Object.fromEntries(Object.entries(fields).flatMap(_ref4 => {
          var _field$input, _field$input$uniqueWh;
          let [key, field] = _ref4;
          if (!((_field$input = field.input) !== null && _field$input !== void 0 && (_field$input$uniqueWh = _field$input.uniqueWhere) !== null && _field$input$uniqueWh !== void 0 && _field$input$uniqueWh.arg) || !field.graphql.isEnabled.read || !field.graphql.isEnabled.filter) {
            return [];
          }
          return [[key, field.input.uniqueWhere.arg]];
        }))), {}, {
          // this is exactly what the id field will add
          // but this does it more explicitly so that typescript understands
          id: apiWithoutContext.arg({
            type: apiWithoutContext.ID
          })
        });
      }
    });
    const where = apiWithoutContext.inputObject({
      name: names.whereInputName,
      fields: () => {
        const {
          fields
        } = lists[listKey];
        return Object.assign({
          AND: apiWithoutContext.arg({
            type: apiWithoutContext.list(apiWithoutContext.nonNull(where))
          }),
          OR: apiWithoutContext.arg({
            type: apiWithoutContext.list(apiWithoutContext.nonNull(where))
          }),
          NOT: apiWithoutContext.arg({
            type: apiWithoutContext.list(apiWithoutContext.nonNull(where))
          })
        }, ...Object.entries(fields).map(_ref5 => {
          var _field$input2, _field$input2$where, _field$input3, _field$input3$where;
          let [fieldKey, field] = _ref5;
          return ((_field$input2 = field.input) === null || _field$input2 === void 0 ? void 0 : (_field$input2$where = _field$input2.where) === null || _field$input2$where === void 0 ? void 0 : _field$input2$where.arg) && field.graphql.isEnabled.read && field.graphql.isEnabled.filter && {
            [fieldKey]: (_field$input3 = field.input) === null || _field$input3 === void 0 ? void 0 : (_field$input3$where = _field$input3.where) === null || _field$input3$where === void 0 ? void 0 : _field$input3$where.arg
          };
        }));
      }
    });
    const create = apiWithoutContext.inputObject({
      name: names.createInputName,
      fields: () => {
        const {
          fields
        } = lists[listKey];
        return Object.fromEntries(Object.entries(fields).flatMap(_ref6 => {
          var _field$input4, _field$input4$create;
          let [key, field] = _ref6;
          if (!((_field$input4 = field.input) !== null && _field$input4 !== void 0 && (_field$input4$create = _field$input4.create) !== null && _field$input4$create !== void 0 && _field$input4$create.arg) || !field.graphql.isEnabled.create) return [];
          return [[key, field.input.create.arg]];
        }));
      }
    });
    const update = apiWithoutContext.inputObject({
      name: names.updateInputName,
      fields: () => {
        const {
          fields
        } = lists[listKey];
        return Object.fromEntries(Object.entries(fields).flatMap(_ref7 => {
          var _field$input5, _field$input5$update;
          let [key, field] = _ref7;
          if (!((_field$input5 = field.input) !== null && _field$input5 !== void 0 && (_field$input5$update = _field$input5.update) !== null && _field$input5$update !== void 0 && _field$input5$update.arg) || !field.graphql.isEnabled.update) return [];
          return [[key, field.input.update.arg]];
        }));
      }
    });
    const orderBy = apiWithoutContext.inputObject({
      name: names.listOrderName,
      fields: () => {
        const {
          fields
        } = lists[listKey];
        return Object.fromEntries(Object.entries(fields).flatMap(_ref8 => {
          var _field$input6, _field$input6$orderBy;
          let [key, field] = _ref8;
          if (!((_field$input6 = field.input) !== null && _field$input6 !== void 0 && (_field$input6$orderBy = _field$input6.orderBy) !== null && _field$input6$orderBy !== void 0 && _field$input6$orderBy.arg) || !field.graphql.isEnabled.read || !field.graphql.isEnabled.orderBy) {
            return [];
          }
          return [[key, field.input.orderBy.arg]];
        }));
      }
    });
    let take = apiWithoutContext.arg({
      type: apiWithoutContext.Int
    });
    if (((_listConfig$graphql2 = listConfig.graphql) === null || _listConfig$graphql2 === void 0 ? void 0 : _listConfig$graphql2.maxTake) !== undefined) {
      take = apiWithoutContext.arg({
        type: apiWithoutContext.nonNull(apiWithoutContext.Int),
        // warning: this is used by queries/resolvers.ts to enforce the limit
        defaultValue: listConfig.graphql.maxTake
      });
    }
    const findManyArgs = {
      where: apiWithoutContext.arg({
        type: apiWithoutContext.nonNull(where),
        defaultValue: listConfig.isSingleton ? {
          id: {
            equals: '1'
          }
        } : {}
      }),
      orderBy: apiWithoutContext.arg({
        type: apiWithoutContext.nonNull(apiWithoutContext.list(apiWithoutContext.nonNull(orderBy))),
        defaultValue: []
      }),
      take,
      skip: apiWithoutContext.arg({
        type: apiWithoutContext.nonNull(apiWithoutContext.Int),
        defaultValue: 0
      })
    };
    const isEnabled = intermediateLists[listKey].graphql.isEnabled;
    let relateToManyForCreate, relateToManyForUpdate, relateToOneForCreate, relateToOneForUpdate;
    if (isEnabled.type) {
      relateToManyForCreate = apiWithoutContext.inputObject({
        name: names.relateToManyForCreateInputName,
        fields: () => {
          return _objectSpread(_objectSpread({}, isEnabled.create && {
            create: apiWithoutContext.arg({
              type: apiWithoutContext.list(apiWithoutContext.nonNull(create))
            })
          }), {}, {
            connect: apiWithoutContext.arg({
              type: apiWithoutContext.list(apiWithoutContext.nonNull(uniqueWhere))
            })
          });
        }
      });
      relateToManyForUpdate = apiWithoutContext.inputObject({
        name: names.relateToManyForUpdateInputName,
        fields: () => {
          return _objectSpread(_objectSpread({
            // The order of these fields reflects the order in which they are applied
            // in the mutation.
            disconnect: apiWithoutContext.arg({
              type: apiWithoutContext.list(apiWithoutContext.nonNull(uniqueWhere))
            }),
            set: apiWithoutContext.arg({
              type: apiWithoutContext.list(apiWithoutContext.nonNull(uniqueWhere))
            })
          }, isEnabled.create && {
            create: apiWithoutContext.arg({
              type: apiWithoutContext.list(apiWithoutContext.nonNull(create))
            })
          }), {}, {
            connect: apiWithoutContext.arg({
              type: apiWithoutContext.list(apiWithoutContext.nonNull(uniqueWhere))
            })
          });
        }
      });
      relateToOneForCreate = apiWithoutContext.inputObject({
        name: names.relateToOneForCreateInputName,
        fields: () => {
          return _objectSpread(_objectSpread({}, isEnabled.create && {
            create: apiWithoutContext.arg({
              type: create
            })
          }), {}, {
            connect: apiWithoutContext.arg({
              type: uniqueWhere
            })
          });
        }
      });
      relateToOneForUpdate = apiWithoutContext.inputObject({
        name: names.relateToOneForUpdateInputName,
        fields: () => {
          return _objectSpread(_objectSpread({}, isEnabled.create && {
            create: apiWithoutContext.arg({
              type: create
            })
          }), {}, {
            connect: apiWithoutContext.arg({
              type: uniqueWhere
            }),
            disconnect: apiWithoutContext.arg({
              type: apiWithoutContext.Boolean
            })
          });
        }
      });
    }
    graphQLTypes[listKey] = {
      types: {
        output,
        uniqueWhere,
        where,
        create,
        orderBy,
        update,
        findManyArgs,
        relateTo: {
          many: {
            where: apiWithoutContext.inputObject({
              name: `${listKey}ManyRelationFilter`,
              fields: {
                every: apiWithoutContext.arg({
                  type: where
                }),
                some: apiWithoutContext.arg({
                  type: where
                }),
                none: apiWithoutContext.arg({
                  type: where
                })
              }
            }),
            create: relateToManyForCreate,
            update: relateToManyForUpdate
          },
          one: {
            create: relateToOneForCreate,
            update: relateToOneForUpdate
          }
        }
      }
    };
  }
  return graphQLTypes;
}

/**
 * 1. Get the `isEnabled` config object from the listConfig - the returned object will be modified later
 * 2. Instantiate `lists` object - it is done here as the object will be added to the listGraphqlTypes
 * 3. Get graphqlTypes
 * 4. Initialise fields - field functions are called
 * 5. Handle relationships - ensure correct linking between two sides of all relationships (including one-sided relationships)
 * 6.
 */
function initialiseLists(config) {
  const listsConfig = config.lists;
  let intermediateLists;
  intermediateLists = Object.fromEntries(Object.entries(getIsEnabled(listsConfig)).map(_ref9 => {
    let [key, isEnabled] = _ref9;
    return [key, {
      graphql: {
        isEnabled
      }
    }];
  }));

  /**
   * Lists is instantiated here so that it can be passed into the `getListGraphqlTypes` function
   * This function binds the listsRef object to the various graphql functions
   *
   * The object will be populated at the end of this function, and the reference will be maintained
   */
  const listsRef = {};
  {
    const listGraphqlTypes = getListGraphqlTypes(listsConfig, listsRef, intermediateLists);
    intermediateLists = getListsWithInitialisedFields(config, listGraphqlTypes, intermediateLists);
  }
  {
    const resolvedDBFieldsForLists = resolveRelationships(intermediateLists);
    intermediateLists = Object.fromEntries(Object.entries(intermediateLists).map(_ref10 => {
      let [listKey, list] = _ref10;
      return [listKey, _objectSpread(_objectSpread({}, list), {}, {
        resolvedDbFields: resolvedDBFieldsForLists[listKey]
      })];
    }));
  }
  intermediateLists = Object.fromEntries(Object.entries(intermediateLists).map(_ref11 => {
    let [listKey, list] = _ref11;
    const fields = {};
    for (const [fieldKey, field] of Object.entries(list.fields)) {
      fields[fieldKey] = _objectSpread(_objectSpread({}, field), {}, {
        dbField: list.resolvedDbFields[fieldKey]
      });
    }
    return [listKey, _objectSpread(_objectSpread({}, list), {}, {
      fields
    })];
  }));
  for (const list of Object.values(intermediateLists)) {
    let hasAnEnabledCreateField = false;
    let hasAnEnabledUpdateField = false;
    for (const field of Object.values(list.fields)) {
      var _field$input7, _field$input7$create, _field$input8;
      if ((_field$input7 = field.input) !== null && _field$input7 !== void 0 && (_field$input7$create = _field$input7.create) !== null && _field$input7$create !== void 0 && _field$input7$create.arg && field.graphql.isEnabled.create) {
        hasAnEnabledCreateField = true;
      }
      if ((_field$input8 = field.input) !== null && _field$input8 !== void 0 && _field$input8.update && field.graphql.isEnabled.update) {
        hasAnEnabledUpdateField = true;
      }
    }
    // You can't have a graphQL type with no fields, so
    // if they're all disabled, we have to disable the whole operation.
    if (!hasAnEnabledCreateField) {
      list.graphql.isEnabled.create = false;
    }
    if (!hasAnEnabledUpdateField) {
      list.graphql.isEnabled.update = false;
    }
  }

  // Error checking
  for (const [listKey, {
    fields
  }] of Object.entries(intermediateLists)) {
    assertFieldsValid({
      listKey,
      fields
    });
  }

  // Fixup the GraphQL refs
  for (const [listKey, intermediateList] of Object.entries(intermediateLists)) {
    listsRef[listKey] = _objectSpread(_objectSpread({}, intermediateList), {}, {
      lists: listsRef
    });
  }

  // Do some introspection
  introspectGraphQLTypes(listsRef);
  return listsRef;
}

exports.areArraysEqual = areArraysEqual;
exports.cannotForItem = cannotForItem;
exports.cannotForItemFields = cannotForItemFields;
exports.checkFilterOrderAccess = checkFilterOrderAccess;
exports.count = count;
exports.executeGraphQLFieldToRootVal = executeGraphQLFieldToRootVal;
exports.findMany = findMany;
exports.findOne = findOne;
exports.getAccessFilters = getAccessFilters;
exports.getDBFieldKeyForFieldOnMultiField = getDBFieldKeyForFieldOnMultiField;
exports.getOperationAccess = getOperationAccess;
exports.getPrismaNamespace = getPrismaNamespace;
exports.getVariablesForGraphQLField = getVariablesForGraphQLField;
exports.getWriteLimit = getWriteLimit;
exports.initialiseLists = initialiseLists;
exports.isFulfilled = isFulfilled;
exports.isRejected = isRejected;
exports.mapUniqueWhereToWhere = mapUniqueWhereToWhere;
exports.promiseAllRejectWithAllErrors = promiseAllRejectWithAllErrors;
exports.resolveUniqueWhereInput = resolveUniqueWhereInput;
exports.resolveWhereInput = resolveWhereInput;
exports.runWithPrisma = runWithPrisma;
exports.setPrismaNamespace = setPrismaNamespace;
exports.setWriteLimit = setWriteLimit;
