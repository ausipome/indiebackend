'use strict';

var path = require('path');
var module$1 = require('module');
var graphql = require('graphql');
var fs = require('fs-extra');
var internals = require('@prisma/internals');
var prompts = require('./prompts-1b5b4598.cjs.dev.js');
var core = require('./core-3a9d46a1.cjs.dev.js');
require('./next-fields-112c1555.cjs.dev.js');
require('@babel/runtime/helpers/objectSpread2');
require('./graphql-ts-schema-db7cad71.cjs.dev.js');
var utils = require('./utils-3551d738.cjs.dev.js');
var typesForLists = require('./types-for-lists-e86af58f.cjs.dev.js');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var path__default = /*#__PURE__*/_interopDefault(path);
var fs__namespace = /*#__PURE__*/_interopNamespace(fs);

const introspectionTypesSet = new Set(graphql.introspectionTypes);
function printEnumTypeDefinition(type) {
  return [`export type ${type.name} =`, type.getValues().map(x => `  | ${JSON.stringify(x.name)}`).join('\n') + ';'].join('\n');
}
function printTypeReference(type, scalars) {
  if (type instanceof graphql.GraphQLNonNull) {
    return printTypeReferenceWithoutNullable(type.ofType, scalars);
  }
  return `${printTypeReferenceWithoutNullable(type, scalars)} | null`;
}
function printTypeReferenceWithoutNullable(type, scalars) {
  if (type instanceof graphql.GraphQLList) {
    return `ReadonlyArray<${printTypeReference(type.ofType, scalars)}> | ${printTypeReference(type.ofType, scalars)}`;
  }
  const name = type.name;
  if (type instanceof graphql.GraphQLScalarType) {
    if (scalars[name] === undefined) return 'any';
    return `Scalars[${JSON.stringify(name)}]`;
  }
  return name;
}
function printInputObjectTypeDefinition(type, scalars) {
  return [`export type ${type.name} = {`, ...Object.values(type.getFields()).map(_ref => {
    let {
      type,
      defaultValue,
      name
    } = _ref;
    const maybe = type instanceof graphql.GraphQLNonNull && defaultValue === undefined ? '' : '?';
    return `  readonly ${name}${maybe}: ${printTypeReference(type, scalars)};`;
  }), '};'].join('\n');
}
function printInputTypesFromSchema(schema, scalars) {
  const output = ['type Scalars = {', ...Object.keys(scalars).map(scalar => `  readonly ${scalar}: ${scalars[scalar]};`), '};'];
  for (const type of Object.values(schema.getTypeMap())) {
    // We don't want to print TS types for the built-in GraphQL introspection types
    // they won't be used for anything we want to print here.
    if (introspectionTypesSet.has(type)) continue;
    if (type instanceof graphql.GraphQLInputObjectType) {
      output.push('', printInputObjectTypeDefinition(type, scalars));
    }
    if (type instanceof graphql.GraphQLEnumType) {
      output.push('', printEnumTypeDefinition(type));
    }
  }
  return output.join('\n');
}
function printInterimFieldType(_ref2) {
  let {
    listKey,
    fieldKey,
    prismaKey,
    operation
  } = _ref2;
  return `  ${fieldKey}?: import('.prisma/client').Prisma.${listKey}${operation}Input["${prismaKey}"];`;
}
function printInterimMultiFieldType(_ref3) {
  let {
    listKey,
    fieldKey,
    operation,
    fields
  } = _ref3;
  return [`  ${fieldKey}: {`, ...Object.keys(fields).map(subFieldKey => {
    const prismaKey = `${fieldKey}_${subFieldKey}`;
    return '  ' + printInterimFieldType({
      listKey,
      fieldKey: subFieldKey,
      prismaKey,
      operation
    });
  }), `  };`].join('\n');
}
function printInterimType(list, listKey, typename, operation) {
  return [`type Resolved${typename} = {`, ...Object.entries(list.fields).map(_ref4 => {
    let [fieldKey, {
      dbField
    }] = _ref4;
    if (dbField.kind === 'none' || fieldKey === 'id') return `  ${fieldKey}?: undefined;`;
    if (dbField.kind === 'multi') {
      return printInterimMultiFieldType({
        listKey,
        fieldKey,
        operation,
        fields: dbField.fields
      });
    }
    return printInterimFieldType({
      listKey,
      fieldKey,
      prismaKey: fieldKey,
      operation
    });
  }), `};`].join('\n');
}
function printListTypeInfo(listKey, list) {
  // prettier-ignore
  const {
    whereInputName,
    whereUniqueInputName,
    createInputName,
    updateInputName,
    listOrderName
  } = core.getGqlNames(list);
  const listTypeInfoName = `Lists.${listKey}.TypeInfo`;

  // prettier-ignore
  return [`export type ${listKey} = import('@keystone-6/core').ListConfig<${listTypeInfoName}, any>;`, `namespace ${listKey} {`, `  export type Item = import('.prisma/client').${listKey};`, `  export type TypeInfo = {`, `    key: "${listKey}";`, `    isSingleton: ${list.isSingleton};`, `    fields: ${Object.keys(list.fields).map(x => `"${x}"`).join(' | ')}`, `    item: Item;`, `    inputs: {`, `      where: ${whereInputName};`, `      uniqueWhere: ${whereUniqueInputName};`, `      create: ${createInputName};`, `      update: ${updateInputName};`, `      orderBy: ${listOrderName};`, `    };`, `    prisma: {`, `      create: Resolved${createInputName}`, `      update: Resolved${updateInputName}`, `    };`, `    all: __TypeInfo;`, `  };`, `}`].map(line => `  ${line}`).join('\n');
}
function printGeneratedTypes(graphQLSchema, lists) {
  const interimCreateUpdateTypes = [];
  const listsTypeInfo = [];
  const listsNamespaces = [];
  for (const [listKey, list] of Object.entries(lists)) {
    const gqlNames = core.getGqlNames(list);
    const listTypeInfoName = `Lists.${listKey}.TypeInfo`;
    interimCreateUpdateTypes.push(printInterimType(list, listKey, gqlNames.createInputName, 'Create'));
    interimCreateUpdateTypes.push(printInterimType(list, listKey, gqlNames.updateInputName, 'Update'));
    listsTypeInfo.push(`    readonly ${listKey}: ${listTypeInfoName};`);
    listsNamespaces.push(printListTypeInfo(listKey, list));
  }
  return [printInputTypesFromSchema(graphQLSchema, {
    ID: 'string',
    Boolean: 'boolean',
    String: 'string',
    Int: 'number',
    Float: 'number',
    JSON: 'import("@keystone-6/core/types").JSONValue',
    Decimal: 'import("@keystone-6/core/types").Decimal | string'
  }), '', interimCreateUpdateTypes.join('\n\n'), '', 'export declare namespace Lists {', ...listsNamespaces, '}', `export type Context = import('@keystone-6/core/types').KeystoneContext<TypeInfo>;`, '', 'export type TypeInfo = {', `  lists: {`, ...listsTypeInfo, `  };`, `  prisma: import('.prisma/client').PrismaClient;`, `};`, ``,
  // we need to reference the `TypeInfo` above in another type that is also called `TypeInfo`
  `type __TypeInfo = TypeInfo;`, ``, `export type Lists = {`, `  [Key in keyof TypeInfo['lists']]?: import('@keystone-6/core').ListConfig<TypeInfo['lists'][Key], any>`, `} & Record<string, import('@keystone-6/core').ListConfig<any, any>>;`, ``, `export {}`, ``].join('\n');
}

const modifiers = {
  required: '',
  optional: '?',
  many: '[]'
};
function printIndex(fieldPath, index) {
  return {
    none: '',
    unique: '@unique',
    index: `\n@@index([${fieldPath}])`
  }[index || 'none'];
}
function printNativeType(nativeType, datasourceName) {
  return nativeType === undefined ? '' : ` @${datasourceName}.${nativeType}`;
}
function printScalarDefaultValue(defaultValue) {
  if (defaultValue.kind === 'literal') {
    if (typeof defaultValue.value === 'string') {
      return JSON.stringify(defaultValue.value);
    }
    return defaultValue.value.toString();
  }
  if (defaultValue.kind === 'now' || defaultValue.kind === 'autoincrement' || defaultValue.kind === 'cuid' || defaultValue.kind === 'uuid') {
    return `${defaultValue.kind}()`;
  }
  if (defaultValue.kind === 'dbgenerated') {
    return `dbgenerated(${JSON.stringify(defaultValue.value)})`;
  }
  assertNever(defaultValue);
}
function assertNever(arg) {
  throw new Error(`expected to never be called but was called with ${arg}`);
}
function printField(fieldPath, field, datasourceName, lists) {
  if (field.kind === 'scalar') {
    const nativeType = printNativeType(field.nativeType, datasourceName);
    const index = printIndex(fieldPath, field.index);
    const defaultValue = field.default ? ` @default(${printScalarDefaultValue(field.default)})` : '';
    const map = field.map ? ` @map(${JSON.stringify(field.map)})` : '';
    const updatedAt = field.updatedAt ? ' @updatedAt' : '';
    return `${fieldPath} ${field.scalar}${modifiers[field.mode]}${updatedAt}${nativeType}${defaultValue}${map}${index}`;
  }
  if (field.kind === 'enum') {
    const index = printIndex(fieldPath, field.index);
    const defaultValue = field.default ? ` @default(${field.default.value})` : '';
    const map = field.map ? ` @map(${JSON.stringify(field.map)})` : '';
    return `${fieldPath} ${field.name}${modifiers[field.mode]}${defaultValue}${map}${index}`;
  }
  if (field.kind === 'multi') {
    return Object.entries(field.fields).map(_ref => {
      let [subField, field] = _ref;
      return printField(typesForLists.getDBFieldKeyForFieldOnMultiField(fieldPath, subField), field, datasourceName, lists);
    }).join('\n');
  }
  if (field.kind === 'relation') {
    if (field.mode === 'many') {
      return `${fieldPath} ${field.list}[] @relation("${field.relationName}")`;
    }
    if (field.foreignIdField.kind === 'none') {
      return `${fieldPath} ${field.list}? @relation("${field.relationName}")`;
    }
    const relationIdFieldPath = `${fieldPath}Id`;
    const relationField = `${fieldPath} ${field.list}? @relation("${field.relationName}", fields: [${relationIdFieldPath}], references: [id])`;
    const foreignIdField = lists[field.list].resolvedDbFields.id;
    assertDbFieldIsValidForIdField(field.list, foreignIdField);
    const nativeType = printNativeType(foreignIdField.nativeType, datasourceName);
    const index = printIndex(relationIdFieldPath, field.foreignIdField.kind === 'owned' ? 'index' : 'unique');
    const relationIdField = `${relationIdFieldPath} ${foreignIdField.scalar}? @map(${JSON.stringify(field.foreignIdField.map)}) ${nativeType}${index}`;
    return `${relationField}\n${relationIdField}`;
  }
  // TypeScript's control flow analysis doesn't understand that this will never happen without the assertNever
  // (this will still correctly validate if any case is unhandled though)
  return assertNever(field);
}
function collectEnums(lists) {
  const enums = {};
  for (const [listKey, {
    resolvedDbFields
  }] of Object.entries(lists)) {
    for (const [fieldPath, field] of Object.entries(resolvedDbFields)) {
      const fields = field.kind === 'multi' ? Object.entries(field.fields).map(_ref2 => {
        let [key, field] = _ref2;
        return [field, `${listKey}.${fieldPath} (sub field ${key})`];
      }) : [[field, `${listKey}.${fieldPath}`]];
      for (const [field, ref] of fields) {
        if (field.kind !== 'enum') continue;
        const alreadyExistingEnum = enums[field.name];
        if (alreadyExistingEnum === undefined) {
          enums[field.name] = {
            values: field.values,
            firstDefinedByRef: ref
          };
          continue;
        }
        if (!typesForLists.areArraysEqual(alreadyExistingEnum.values, field.values)) {
          throw new Error(`The fields ${alreadyExistingEnum.firstDefinedByRef} and ${ref} both specify Prisma schema enums` + `with the name ${field.name} but they have different values:\n` + `enum from ${alreadyExistingEnum.firstDefinedByRef}:\n${JSON.stringify(alreadyExistingEnum.values, null, 2)}\n` + `enum from ${ref}:\n${JSON.stringify(field.values, null, 2)}`);
        }
      }
    }
  }
  return Object.entries(enums).map(_ref3 => {
    let [enumName, {
      values
    }] = _ref3;
    return `enum ${enumName} {\n${values.join('\n')}\n}`;
  }).join('\n');
}
function assertDbFieldIsValidForIdField(listKey, field) {
  if (field.kind !== 'scalar') {
    throw new Error(`id fields must be either a String or Int Prisma scalar but the id field for the ${listKey} list is not a scalar`);
  }
  // this may be loosened in the future
  if (field.scalar !== 'String' && field.scalar !== 'Int' && field.scalar !== 'BigInt') {
    throw new Error(`id fields must be String, Int or BigInt Prisma scalars but the id field for the ${listKey} list is a ${field.scalar} scalar`);
  }
  if (field.mode !== 'required') {
    throw new Error(`id fields must be a singular required field but the id field for the ${listKey} list is ${field.mode === 'many' ? 'a many' : 'an optional'} field`);
  }
  if (field.index !== undefined) {
    throw new Error(`id fields must not specify indexes themselves but the id field for the ${listKey} list specifies an index`);
  }
  // this will likely be loosened in the future
  if (field.default === undefined) {
    throw new Error(`id fields must specify a Prisma/database level default value but the id field for the ${listKey} list does not`);
  }
}
function printPrismaSchema(lists, provider, prismaPreviewFeatures, additionalPrismaDatasourceProperties) {
  const additionalDataSourceString = Object.entries(additionalPrismaDatasourceProperties || {}).map(_ref4 => {
    let [key, value] = _ref4;
    return `\n    ${key} = "${value}"`;
  }).join('');
  let prismaFlags = '';
  if (prismaPreviewFeatures && prismaPreviewFeatures.length) {
    prismaFlags = `\n    previewFeatures = ["${prismaPreviewFeatures.join('","')}"]`;
  }
  let prismaSchema = `// This file is automatically generated by Keystone, do not modify it manually.
// Modify your Keystone config when you want to change this.

datasource ${provider} {
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
  provider          = "${provider}"${additionalDataSourceString}
}

generator client {
  provider = "prisma-client-js"
  output   = "node_modules/.prisma/client"${prismaFlags}
}
\n`;
  for (const [listKey, {
    resolvedDbFields,
    dbMap,
    isSingleton
  }] of Object.entries(lists)) {
    prismaSchema += `model ${listKey} {`;
    for (const [fieldPath, field] of Object.entries(resolvedDbFields)) {
      if (field.kind !== 'none' && !(isSingleton && fieldPath === 'id')) {
        prismaSchema += '\n' + printField(fieldPath, field, provider, lists);
      }
      if (fieldPath === 'id') {
        assertDbFieldIsValidForIdField(listKey, field);
        if (isSingleton) {
          prismaSchema += '\nid Int';
        }
        prismaSchema += ' @id';
      }
    }
    if (dbMap !== undefined) {
      prismaSchema += `\n@@map(${JSON.stringify(dbMap)})`;
    }
    prismaSchema += `\n}\n`;
  }
  prismaSchema += `\n${collectEnums(lists)}\n`;
  return prismaSchema;
}

function getSchemaPaths(cwd) {
  return {
    prisma: path__default["default"].join(cwd, 'schema.prisma'),
    graphql: path__default["default"].join(cwd, 'schema.graphql')
  };
}
function getFormattedGraphQLSchema(schema) {
  return '# This file is automatically generated by Keystone, do not modify it manually.\n' + '# Modify your Keystone config when you want to change this.\n\n' + schema + '\n';
}
async function getCommittedArtifacts(graphQLSchema, config) {
  const lists = typesForLists.initialiseLists(config);
  const prismaSchema = printPrismaSchema(lists, config.db.provider, config.db.prismaPreviewFeatures, config.db.additionalPrismaDatasourceProperties);
  return {
    graphql: getFormattedGraphQLSchema(graphql.printSchema(graphQLSchema)),
    prisma: await formatPrismaSchema(prismaSchema)
  };
}
let hasEnsuredBinariesExist = false;
async function ensurePrismaBinariesExist() {
  // ensureBinariesExist does a bunch of slightly expensive things
  // so if we can avoid running it a bunch in tests, that's ideal
  if (hasEnsuredBinariesExist) return;
  // we're resolving @prisma/engines from @prisma/internals
  // because we don't want to depend on @prisma/engines
  // since its version includes a commit hash from https://github.com/prisma/prisma-engines
  // and we just want to use whatever version @prisma/internals is using
  // also note we use an exact version of @prisma/internals
  // so if @prisma/internals suddenly stops depending on @prisma/engines
  // that won't break a released version of Keystone
  // also, we're not just directly importing @prisma/engines
  // since stricter package managers(e.g. pnpm, Yarn Berry)
  // don't allow importing packages that aren't explicitly depended on
  const requireFromPrismaSdk = module$1.createRequire(require.resolve('@prisma/internals'));
  const prismaEngines = requireFromPrismaSdk('@prisma/engines');
  await prismaEngines.ensureBinariesExist();
  hasEnsuredBinariesExist = true;
}
async function formatPrismaSchema(schema) {
  await ensurePrismaBinariesExist();
  return internals.formatSchema({
    schema
  });
}
async function readFileButReturnNothingIfDoesNotExist(filename) {
  try {
    return await fs__namespace.readFile(filename, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      return;
    }
    throw err;
  }
}
async function validateCommittedArtifacts(graphQLSchema, config, cwd) {
  const artifacts = await getCommittedArtifacts(graphQLSchema, config);
  const schemaPaths = getSchemaPaths(cwd);
  const [writtenGraphQLSchema, writtenPrismaSchema] = await Promise.all([readFileButReturnNothingIfDoesNotExist(schemaPaths.graphql), readFileButReturnNothingIfDoesNotExist(schemaPaths.prisma)]);
  const outOfDateSchemas = (() => {
    if (writtenGraphQLSchema !== artifacts.graphql && writtenPrismaSchema !== artifacts.prisma) {
      return 'both';
    }
    if (writtenGraphQLSchema !== artifacts.graphql) {
      return 'graphql';
    }
    if (writtenPrismaSchema !== artifacts.prisma) {
      return 'prisma';
    }
  })();
  if (outOfDateSchemas) {
    const message = {
      both: 'Your Prisma and GraphQL schemas are not up to date',
      graphql: 'Your GraphQL schema is not up to date',
      prisma: 'Your Prisma schema is not up to date'
    }[outOfDateSchemas];
    console.log(message);
    const term = {
      both: 'Prisma and GraphQL schemas',
      prisma: 'Prisma schema',
      graphql: 'GraphQL schema'
    }[outOfDateSchemas];
    if (prompts.shouldPrompt && (await prompts.confirmPrompt(`Would you like to update your ${term}?`))) {
      await writeCommittedArtifacts(artifacts, cwd);
    } else {
      console.log(`Please run keystone postinstall --fix to update your ${term}`);
      throw new utils.ExitError(1);
    }
  }
}
async function writeCommittedArtifacts(artifacts, cwd) {
  const schemaPaths = getSchemaPaths(cwd);
  await Promise.all([fs__namespace.writeFile(schemaPaths.graphql, artifacts.graphql), fs__namespace.writeFile(schemaPaths.prisma, artifacts.prisma)]);
}
async function generateCommittedArtifacts(graphQLSchema, config, cwd) {
  const artifacts = await getCommittedArtifacts(graphQLSchema, config);
  await writeCommittedArtifacts(artifacts, cwd);
  return artifacts;
}
const makeVercelIncludeTheSQLiteDB = (cwd, directoryOfFileToBeWritten, config) => {
  if (config.db.provider === 'sqlite') {
    const sqliteDbAbsolutePath = path__default["default"].resolve(cwd, config.db.url.replace('file:', ''));
    return `import path from 'path';

    path.join(__dirname, ${JSON.stringify(path__default["default"].relative(directoryOfFileToBeWritten, sqliteDbAbsolutePath))});
    path.join(process.cwd(), ${JSON.stringify(path__default["default"].relative(cwd, sqliteDbAbsolutePath))});
    `;
  }
  return '';
};
const nextGraphQLAPIJS = (cwd, config) => `import keystoneConfig from '../../../keystone';
import { PrismaClient } from '.prisma/client';
import { nextGraphQLAPIRoute } from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/next-graphql';
${makeVercelIncludeTheSQLiteDB(cwd, path__default["default"].join(cwd, 'node_modules/.keystone/next'), config)}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default nextGraphQLAPIRoute(keystoneConfig, PrismaClient);
`;

// note the export default config is just a lazy way of going "this is also any"
const nextGraphQLAPIDTS = `export const config: any;
export default config;
`;
async function generateNodeModulesArtifactsWithoutPrismaClient(graphQLSchema, config, cwd) {
  var _config$experimental;
  const lists = typesForLists.initialiseLists(config);
  const dotKeystoneDir = path__default["default"].join(cwd, 'node_modules/.keystone');
  await Promise.all([fs__namespace.outputFile(path__default["default"].join(dotKeystoneDir, 'types.d.ts'), printGeneratedTypes(graphQLSchema, lists)), fs__namespace.outputFile(path__default["default"].join(dotKeystoneDir, 'types.js'), ''), ...((_config$experimental = config.experimental) !== null && _config$experimental !== void 0 && _config$experimental.generateNextGraphqlAPI ? [fs__namespace.outputFile(path__default["default"].join(dotKeystoneDir, 'next/graphql-api.js'), nextGraphQLAPIJS(cwd, config)), fs__namespace.outputFile(path__default["default"].join(dotKeystoneDir, 'next/graphql-api.d.ts'), nextGraphQLAPIDTS)] : [])]);
}
async function generateNodeModulesArtifacts(graphQLSchema, config, cwd) {
  await Promise.all([generatePrismaClient(cwd), generateNodeModulesArtifactsWithoutPrismaClient(graphQLSchema, config, cwd)]);
}
async function generatePrismaClient(cwd) {
  const generator = await internals.getGenerator({
    schemaPath: getSchemaPaths(cwd).prisma,
    dataProxy: false
  });
  try {
    await generator.generate();
  } finally {
    let closePromise = new Promise(resolve => {
      const child = generator.generatorProcess.child;
      child.once('exit', () => {
        resolve();
      });
    });
    generator.stop();
    await closePromise;
  }
}
function requirePrismaClient(cwd) {
  return require(path__default["default"].join(cwd, 'node_modules/.prisma/client'));
}

exports.generateCommittedArtifacts = generateCommittedArtifacts;
exports.generateNodeModulesArtifacts = generateNodeModulesArtifacts;
exports.generateNodeModulesArtifactsWithoutPrismaClient = generateNodeModulesArtifactsWithoutPrismaClient;
exports.getCommittedArtifacts = getCommittedArtifacts;
exports.getFormattedGraphQLSchema = getFormattedGraphQLSchema;
exports.getSchemaPaths = getSchemaPaths;
exports.printPrismaSchema = printPrismaSchema;
exports.requirePrismaClient = requirePrismaClient;
exports.validateCommittedArtifacts = validateCommittedArtifacts;
