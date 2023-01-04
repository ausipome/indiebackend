'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var meow = require('meow');
var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _objectWithoutProperties = require('@babel/runtime/helpers/objectWithoutProperties');
var path = require('path');
var url = require('url');
var http = require('http');
var express = require('express');
var graphql = require('graphql');
var fs = require('fs-extra');
var chalk = require('chalk');
var esbuild = require('esbuild');
var util = require('util');
var resolve = require('resolve');
var fs_walk = require('@nodelib/fs.walk');
var hashString = require('@emotion/hash');
var adminMetaGraphql = require('../../../dist/admin-meta-graphql-d825f8e4.cjs.dev.js');
var createSystem = require('../../../dist/createSystem-e6a7a86b.cjs.dev.js');
var migrations = require('../../../dist/migrations-e3b5740b.cjs.dev.js');
var loadConfig = require('../../../dist/loadConfig-132d4c96.cjs.dev.js');
var createAdminUIMiddleware = require('../../../dist/createAdminUIMiddleware-c41a0fb3.cjs.dev.js');
var os = require('os');
var ci = require('ci-info');
var Conf = require('conf');
var fetch = require('node-fetch');
var artifacts = require('../../../dist/artifacts-5eda5369.cjs.dev.js');
var utils = require('../../../dist/utils-3551d738.cjs.dev.js');
var typesForLists = require('../../../dist/types-for-lists-e86af58f.cjs.dev.js');
var execa = require('execa');
require('@apollo/client');
require('p-limit');
require('../../../dist/core-3a9d46a1.cjs.dev.js');
require('../../../dist/next-fields-112c1555.cjs.dev.js');
require('decimal.js');
require('../../../dist/graphql-ts-schema-db7cad71.cjs.dev.js');
require('@graphql-ts/schema');
require('graphql-upload/GraphQLUpload.js');
require('@graphql-ts/schema/api-without-context');
require('@graphql-ts/extend');
require('@graphql-ts/schema/api-with-context');
require('../../../dist/createAdminMeta-1cd6fe5b.cjs.dev.js');
require('../../../dist/utils-c845278f.cjs.dev.js');
require('@babel/runtime/helpers/classPrivateFieldInitSpec');
require('@babel/runtime/helpers/classPrivateFieldGet');
require('@babel/runtime/helpers/classPrivateFieldSet');
require('../../../dist/graphql-errors-0bcd0ecf.cjs.dev.js');
require('apollo-server-errors');
require('@babel/runtime/helpers/defineProperty');
require('uuid');
require('image-type');
require('image-size');
require('stream');
require('@aws-sdk/s3-request-presigner');
require('@aws-sdk/client-s3');
require('@aws-sdk/lib-storage');
require('crypto');
require('filenamify');
require('@sindresorhus/slugify');
require('@prisma/internals');
require('@prisma/migrate');
require('../../../dist/prompts-1b5b4598.cjs.dev.js');
require('prompts');
require('../../../dist/initConfig-d6be2710.cjs.dev.js');
require('cuid');
require('cors');
require('graphql-upload/graphqlUploadExpress.js');
require('../../../dist/createApolloServer-dcab13c4.cjs.dev.js');
require('apollo-server-micro');
require('apollo-server-express');
require('apollo-server-core');
require('module');
require('graphql/execution/values');
require('pluralize');
require('dataloader');

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

var meow__default = /*#__PURE__*/_interopDefault(meow);
var path__namespace = /*#__PURE__*/_interopNamespace(path);
var url__default = /*#__PURE__*/_interopDefault(url);
var express__default = /*#__PURE__*/_interopDefault(express);
var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var chalk__default = /*#__PURE__*/_interopDefault(chalk);
var esbuild__default = /*#__PURE__*/_interopDefault(esbuild);
var resolve__default = /*#__PURE__*/_interopDefault(resolve);
var hashString__default = /*#__PURE__*/_interopDefault(hashString);
var os__default = /*#__PURE__*/_interopDefault(os);
var ci__default = /*#__PURE__*/_interopDefault(ci);
var Conf__default = /*#__PURE__*/_interopDefault(Conf);
var fetch__default = /*#__PURE__*/_interopDefault(fetch);
var execa__default = /*#__PURE__*/_interopDefault(execa);

const appTemplate = (adminMetaRootVal, graphQLSchema, _ref, apiPath) => {
  let {
    configFileExists
  } = _ref;
  const result = graphql.executeSync({
    document: adminMetaGraphql.staticAdminMetaQuery,
    schema: graphQLSchema,
    contextValue: {
      isAdminUIBuildProcess: true
    }
  });
  if (result.errors) {
    throw result.errors[0];
  }
  const {
    adminMeta
  } = result.data.keystone;
  const adminMetaQueryResultHash = hashString__default["default"](JSON.stringify(adminMeta));
  const allViews = adminMetaRootVal.views.map(viewRelativeToProject => {
    const isRelativeToFile = viewRelativeToProject.startsWith('./') || viewRelativeToProject.startsWith('../');
    const viewRelativeToAppFile = isRelativeToFile ? '../../../' + viewRelativeToProject : viewRelativeToProject;

    // we're not using serializePathForImport here because we want the thing you write for a view
    // to be exactly what you would put in an import in the project directory.
    // we're still using JSON.stringify to escape anything that might need to be though
    return JSON.stringify(viewRelativeToAppFile);
  });
  // -- TEMPLATE START
  return `import { getApp } from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/pages/App';

${allViews.map((views, i) => `import * as view${i} from ${views};`).join('\n')}

${configFileExists ? `import * as adminConfig from "../../../admin/config";` : 'var adminConfig = {};'}

export default getApp({
  lazyMetadataQuery: ${JSON.stringify(getLazyMetadataQuery(graphQLSchema, adminMeta))},
  fieldViews: [${allViews.map((_, i) => `view${i}`)}],
  adminMetaHash: "${adminMetaQueryResultHash}",
  adminConfig: adminConfig,
  apiPath: "${apiPath}",
});
`;
  // -- TEMPLATE END
};

function getLazyMetadataQuery(graphqlSchema, adminMeta) {
  const selections = graphql.parse(`fragment x on y {
    keystone {
      adminMeta {
        lists {
          key
          isHidden
          fields {
            path
            createView {
              fieldMode
            }
          }
        }
      }
    }
  }`).definitions[0].selectionSet.selections;
  const queryType = graphqlSchema.getQueryType();
  if (queryType) {
    const getListByKey = name => adminMeta.lists.find(_ref2 => {
      let {
        key
      } = _ref2;
      return key === name;
    });
    const fields = queryType.getFields();
    if (fields['authenticatedItem'] !== undefined) {
      const authenticatedItemType = fields['authenticatedItem'].type;
      if (!(authenticatedItemType instanceof graphql.GraphQLUnionType) || authenticatedItemType.name !== 'AuthenticatedItem') {
        throw new Error(`The type of Query.authenticatedItem must be a type named AuthenticatedItem and be a union of types that refer to Keystone lists but it is "${authenticatedItemType.toString()}"`);
      }
      for (const type of authenticatedItemType.getTypes()) {
        const fields = type.getFields();
        const list = getListByKey(type.name);
        if (list === undefined) {
          throw new Error(`All members of the AuthenticatedItem union must refer to Keystone lists but "${type.name}" is in the AuthenticatedItem union but is not a Keystone list`);
        }
        let labelGraphQLField = fields[list.labelField];
        if (labelGraphQLField === undefined) {
          throw new Error(`The labelField for the list "${list.key}" is "${list.labelField}" but the GraphQL type does not have a field named "${list.labelField}"`);
        }
        let labelGraphQLFieldType = labelGraphQLField.type;
        if (labelGraphQLFieldType instanceof graphql.GraphQLNonNull) {
          labelGraphQLFieldType = labelGraphQLFieldType.ofType;
        }
        if (!(labelGraphQLFieldType instanceof graphql.GraphQLScalarType)) {
          throw new Error(`Label fields must be scalar GraphQL types but the labelField "${list.labelField}" on the list "${list.key}" is not a scalar type`);
        }
        const requiredArgs = labelGraphQLField.args.filter(arg => arg.defaultValue === undefined && arg.type instanceof graphql.GraphQLNonNull);
        if (requiredArgs.length) {
          throw new Error(`Label fields must have no required arguments but the labelField "${list.labelField}" on the list "${list.key}" has a required argument "${requiredArgs[0].name}"`);
        }
      }
      selections.push({
        kind: graphql.Kind.FIELD,
        name: {
          kind: graphql.Kind.NAME,
          value: 'authenticatedItem'
        },
        selectionSet: {
          kind: graphql.Kind.SELECTION_SET,
          selections: authenticatedItemType.getTypes().map(_ref3 => {
            let {
              name
            } = _ref3;
            return {
              kind: graphql.Kind.INLINE_FRAGMENT,
              typeCondition: {
                kind: graphql.Kind.NAMED_TYPE,
                name: {
                  kind: graphql.Kind.NAME,
                  value: name
                }
              },
              selectionSet: {
                kind: graphql.Kind.SELECTION_SET,
                selections: [{
                  kind: graphql.Kind.FIELD,
                  name: {
                    kind: graphql.Kind.NAME,
                    value: 'id'
                  }
                }, {
                  kind: graphql.Kind.FIELD,
                  name: {
                    kind: graphql.Kind.NAME,
                    value: getListByKey(name).labelField
                  }
                }]
              }
            };
          })
        }
      });
    }
  }

  // We're returning the complete query AST here for explicit-ness
  return {
    kind: 'Document',
    definitions: [{
      kind: 'OperationDefinition',
      operation: 'query',
      selectionSet: {
        kind: 'SelectionSet',
        selections
      }
    }]
  };
}

const homeTemplate = `export { HomePage as default } from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/pages/HomePage';
`;

const listTemplate = listKey => `import { getListPage } from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/pages/ListPage';

export default getListPage(${JSON.stringify({
  listKey
})});
`;

const itemTemplate = listKey => `import { getItemPage } from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/pages/ItemPage';

export default getItemPage(${JSON.stringify({
  listKey
})})
`;

const noAccessTemplate = session => `import { getNoAccessPage } from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/pages/NoAccessPage';

export default getNoAccessPage(${JSON.stringify({
  sessionsEnabled: !!session
})})
`;

const createItemTemplate = listKey => `import { getCreateItemPage } from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/pages/CreateItemPage';

export default getCreateItemPage(${JSON.stringify({
  listKey
})})
`;

const pkgDir = path__namespace.dirname(require.resolve('@keystone-6/core/package.json'));
const writeAdminFiles = (config, graphQLSchema, adminMeta, configFileExists) => {
  var _config$graphql;
  return [...['next.config.js', 'tsconfig.json'].map(outputPath => ({
    mode: 'copy',
    inputPath: path__namespace.join(pkgDir, 'static', outputPath),
    outputPath
  })), {
    mode: 'copy',
    inputPath: path__namespace.join(pkgDir, 'static', 'favicon.ico'),
    outputPath: 'public/favicon.ico'
  }, {
    mode: 'write',
    src: noAccessTemplate(config.session),
    outputPath: 'pages/no-access.js'
  }, {
    mode: 'write',
    src: appTemplate(adminMeta, graphQLSchema, {
      configFileExists
    }, ((_config$graphql = config.graphql) === null || _config$graphql === void 0 ? void 0 : _config$graphql.path) || '/api/graphql'),
    outputPath: 'pages/_app.js'
  }, {
    mode: 'write',
    src: homeTemplate,
    outputPath: 'pages/index.js'
  }, ...adminMeta.lists.flatMap(_ref => {
    let {
      path,
      key
    } = _ref;
    return [{
      mode: 'write',
      src: listTemplate(key),
      outputPath: `pages/${path}/index.js`
    }, {
      mode: 'write',
      src: itemTemplate(key),
      outputPath: `pages/${path}/[id].js`
    }, {
      mode: 'write',
      src: createItemTemplate(key),
      outputPath: `pages/${path}/create.js`
    }];
  })];
};

function serializePathForImport(path) {
  // JSON.stringify is important here because it will escape windows style paths(and any thing else that might potentially be in there)
  return JSON.stringify(path
  // Next is unhappy about imports that include .ts/tsx in them because TypeScript is unhappy with them because when doing a TypeScript compilation with tsc, the imports won't be written so they would be wrong there
  .replace(/\.tsx?$/, '').replace(new RegExp(`\\${path__namespace["default"].sep}`, 'g'), '/'));
}

const walk = util.promisify(fs_walk.walk);
function getDoesAdminConfigExist() {
  try {
    const configPath = path__namespace["default"].join(process.cwd(), 'admin', 'config');
    resolve__default["default"].sync(configPath, {
      extensions: ['.ts', '.tsx', '.js'],
      preserveSymlinks: false
    });
    return true;
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return false;
    }
    throw err;
  }
}
async function writeAdminFile(file, projectAdminPath) {
  const outputFilename = path__namespace["default"].join(projectAdminPath, file.outputPath);
  if (file.mode === 'copy') {
    if (!path__namespace["default"].isAbsolute(file.inputPath)) {
      throw new Error(`An inputPath of "${file.inputPath}" was provided to copy but inputPaths must be absolute`);
    }
    await fs__namespace["default"].ensureDir(path__namespace["default"].dirname(outputFilename));
    // TODO: should we use copyFile or copy?
    await fs__namespace["default"].copyFile(file.inputPath, outputFilename);
  }
  let content;
  try {
    content = await fs__namespace["default"].readFile(outputFilename, 'utf8');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
  if (file.mode === 'write' && content !== file.src) {
    await fs__namespace["default"].outputFile(outputFilename, file.src);
  }
  return path__namespace["default"].normalize(outputFilename);
}
const pageExtensions = new Set(['.js', '.jsx', '.ts', '.tsx']);
const generateAdminUI = async (config, graphQLSchema, adminMeta, projectAdminPath, isLiveReload) => {
  var _config$ui$getAdditio, _config$ui, _config$ui$getAdditio2;
  // when we're not doing a live reload, we want to clear everything out except the .next directory (not the .next directory because it has caches)
  // so that at least every so often, we'll clear out anything that the deleting we do during live reloads doesn't (should just be directories)
  if (!isLiveReload) {
    const dir = await fs__namespace["default"].readdir(projectAdminPath).catch(err => {
      if (err.code === 'ENOENT') {
        return [];
      }
      throw err;
    });
    await Promise.all(dir.map(x => {
      if (x === '.next') return;
      return fs__namespace["default"].remove(path__namespace["default"].join(projectAdminPath, x));
    }));
  }

  // Write out the files configured by the user
  const userFiles = (_config$ui$getAdditio = (_config$ui = config.ui) === null || _config$ui === void 0 ? void 0 : (_config$ui$getAdditio2 = _config$ui.getAdditionalFiles) === null || _config$ui$getAdditio2 === void 0 ? void 0 : _config$ui$getAdditio2.map(x => x(config))) !== null && _config$ui$getAdditio !== void 0 ? _config$ui$getAdditio : [];
  const userFilesToWrite = (await Promise.all(userFiles)).flat();
  const savedFiles = await Promise.all(userFilesToWrite.map(file => writeAdminFile(file, projectAdminPath)));
  const uniqueFiles = new Set(savedFiles);

  // Write out the built-in admin UI files. Don't overwrite any user-defined pages.
  const configFileExists = getDoesAdminConfigExist();
  let adminFiles = writeAdminFiles(config, graphQLSchema, adminMeta, configFileExists);

  // Add files to pages/ which point to any files which exist in admin/pages
  const adminConfigDir = path__namespace["default"].join(process.cwd(), 'admin');
  const userPagesDir = path__namespace["default"].join(adminConfigDir, 'pages');
  let userPagesEntries = [];
  try {
    userPagesEntries = await walk(userPagesDir, {
      entryFilter: entry => entry.dirent.isFile() && pageExtensions.has(path__namespace["default"].extname(entry.name))
    });
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
  for (const {
    path
  } of userPagesEntries) {
    const outputFilename = path__namespace["default"].relative(adminConfigDir, path);
    const importPath = path__namespace["default"].relative(path__namespace["default"].dirname(path__namespace["default"].join(projectAdminPath, outputFilename)), path);
    const serializedImportPath = serializePathForImport(importPath);
    adminFiles.push({
      mode: 'write',
      outputPath: outputFilename,
      src: `export { default } from ${serializedImportPath}`
    });
  }
  adminFiles = adminFiles.filter(x => !uniqueFiles.has(path__namespace["default"].normalize(path__namespace["default"].join(projectAdminPath, x.outputPath))));
  await Promise.all(adminFiles.map(file => writeAdminFile(file, projectAdminPath)));

  // Because Next will re-compile things (or at least check things and log a bunch of stuff)
  // if we delete pages and then re-create them, we want to avoid that when live reloading
  // so we only delete things that shouldn't exist anymore
  // this won't clear out empty directories, this is fine since:
  // - they won't create pages in Admin UI which is really what this deleting is about avoiding
  // - we'll remove them when the user restarts the process
  if (isLiveReload) {
    const ignoredDir = path__namespace["default"].resolve(projectAdminPath, '.next');
    const ignoredFiles = new Set([...adminFiles.map(x => x.outputPath), ...uniqueFiles, 'next-env.d.ts', 'pages/api/__keystone_api_build.js'].map(x => path__namespace["default"].resolve(projectAdminPath, x)));
    const entries = await walk(projectAdminPath, {
      deepFilter: entry => entry.path !== ignoredDir,
      entryFilter: entry => entry.dirent.isFile() && !ignoredFiles.has(entry.path)
    });
    await Promise.all(entries.map(entry => fs__namespace["default"].remove(entry.path)));
  }
};

// destructured to prevent inlining to `"production" = "production"`
const {
  env
} = process;
async function buildAdminUI(projectAdminPath) {
  let prevNodeEnv = env.NODE_ENV;
  // Next does a broken build unless we set NODE_ENV to production
  // @ts-ignore
  env.NODE_ENV = 'production';
  try {
    // importing next/dist/build is quite expensive so we're requiring it lazily
    /** We do this to stop webpack from bundling next inside of next */
    const next = 'next/dist/build';
    const build = require(next).default;
    await build(projectAdminPath);
  } finally {
    if (prevNodeEnv === undefined) {
      // @ts-ignore
      delete env.NODE_ENV;
    } else {
      // @ts-ignore
      env.NODE_ENV = prevNodeEnv;
    }
  }
}

const packageNames = ['@keystone-6/core', '@keystone-6/auth', '@keystone-6/fields-document', '@keystone-6/cloudinary', '@keystone-6/session-store-redis', '@opensaas/keystone-nextjs-auth'];
function getTelemetryConfig() {
  const userConfig = new Conf__default["default"]({
    projectName: 'keystonejs',
    projectSuffix: ''
  });
  let telemetry;
  try {
    // Load global telemetry config settings (if set)
    telemetry = userConfig.get('telemetry');
  } catch (err) {
    // Fail silently unless KEYSTONE_TELEMETRY_DEBUG is set to '1'
    if (process.env.KEYSTONE_TELEMETRY_DEBUG === '1') {
      console.log(err);
    }
  }
  return {
    telemetry,
    userConfig
  };
}
const todaysDate = new Date().toISOString().slice(0, 10);
const notifyText = `
${chalk__default["default"].bold('Keystone Telemetry')}

Keystone collects anonymous data about how you use it. 
For more information including how to opt-out see: https://keystonejs.com/telemetry

Or run: ${chalk__default["default"].green('keystone telemetry --help')} to change your preference at any time.

No telemetry data has been sent yet, but will be sent the next time you run ${chalk__default["default"].green('keystone dev')} unless you first opt-out.

`;
function runTelemetry(cwd, lists, dbProviderName) {
  try {
    const {
      userConfig,
      telemetry
    } = getTelemetryConfig();
    if (ci__default["default"].isCI ||
    // Don't run in CI
    process.env.NODE_ENV === 'production' ||
    // Don't run in production
    telemetry === false // Don't run if the user has opted out
    ) {
      return;
    }
    if (telemetry === undefined) {
      const newTelemetry = {
        device: {
          informedAt: new Date().toISOString()
        },
        projects: {
          default: {
            informedAt: new Date().toISOString()
          },
          [cwd]: {
            informedAt: new Date().toISOString()
          }
        }
      };
      userConfig.set('telemetry', newTelemetry);
      console.log(notifyText);
      // Don't run telemetry on first run, give the user a chance to opt out
      return;
    }
    if (!telemetry) {
      return;
    }
    if (telemetry.projects[cwd] === undefined) {
      userConfig.set(`telemetry.projects${cwd}`, telemetry.projects.default);
      telemetry.projects[cwd] = telemetry.projects.default;
    }
    if (!!telemetry.projects[cwd]) {
      sendProjectTelemetryEvent(cwd, lists, dbProviderName, telemetry.projects[cwd]);
    }
    if (!!telemetry.device) {
      sendDeviceTelemetryEvent(telemetry.device);
    }
  } catch (err) {
    // Fail silently unless KEYSTONE_TELEMETRY_DEBUG is set to '1'
    if (process.env.KEYSTONE_TELEMETRY_DEBUG === '1') {
      console.log(err);
    }
  }
}
const fieldCount = lists => {
  const fields = {
    unknown: 0
  };
  for (const list of Object.values(lists)) {
    for (const [fieldPath, field] of Object.entries(list.fields)) {
      const fieldType = field.__ksTelemetryFieldTypeName;
      if (!fieldType) {
        // skip id fields
        if (fieldPath.endsWith('id')) continue;
        fields.unknown++;
        continue;
      }
      if (!fields[fieldType]) {
        fields[fieldType] = 0;
      }
      fields[fieldType] += 1;
    }
  }
  return fields;
};
function sendEvent(eventType, eventData) {
  try {
    const telemetryEndpoint = process.env.KEYSTONE_TELEMETRY_ENDPOINT || createAdminUIMiddleware.defaults.telemetryEndpoint;
    const telemetryUrl = `${telemetryEndpoint}/v1/event/${eventType}`;
    // Do not `await` to keep non-blocking
    fetch__default["default"](telemetryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    }).then(() => {}, () => {});
  } catch (err) {
    // Fail silently unless KEYSTONE_TELEMETRY_DEBUG is set to '1'
    if (process.env.KEYSTONE_TELEMETRY_DEBUG === '1') {
      console.log(err);
    }
  }
}
function sendProjectTelemetryEvent(cwd, lists, dbProviderName, projectConfig) {
  try {
    const userConfig = getTelemetryConfig().userConfig;
    if (projectConfig === false) {
      return;
    }
    if (!!projectConfig.lastSentDate && projectConfig.lastSentDate >= todaysDate) {
      if (process.env.KEYSTONE_TELEMETRY_DEBUG === '1') {
        console.log('Project telemetry already sent but debugging is enabled');
      } else {
        return;
      }
    }
    // get installed keystone package versions
    const versions = {
      '@keystone-6/core': '0.0.0'
    };
    packageNames.forEach(packageName => {
      try {
        const packageJson = require(`${packageName}/package.json`);
        versions[packageName] = packageJson.version;
      } catch {
        // Fail silently most likely because the package is not installed
      }
    });
    const projectInfo = {
      previous: projectConfig.lastSentDate || null,
      fields: fieldCount(lists),
      lists: Object.keys(lists).length,
      versions,
      database: dbProviderName
    };
    sendEvent('project', projectInfo);
    userConfig.set(`telemetry.projects.${cwd}.lastSentDate`, todaysDate);
  } catch (err) {
    // Fail silently unless KEYSTONE_TELEMETRY_DEBUG is set to '1'
    if (process.env.KEYSTONE_TELEMETRY_DEBUG === '1') {
      console.log(err);
    }
  }
}
function sendDeviceTelemetryEvent(deviceConsent) {
  try {
    const userConfig = getTelemetryConfig().userConfig;
    if (deviceConsent === false) return;
    if (!!deviceConsent.lastSentDate && deviceConsent.lastSentDate >= todaysDate) {
      if (process.env.KEYSTONE_TELEMETRY_DEBUG === '1') {
        console.log('Device telemetry already sent but debugging is enabled');
      } else {
        return;
      }
    }
    const deviceInfo = {
      previous: deviceConsent.lastSentDate || null,
      os: os__default["default"].platform(),
      node: process.versions.node.split('.')[0]
    };
    sendEvent('device', deviceInfo);
    userConfig.set(`telemetry.device.lastSentDate`, todaysDate);
  } catch (err) {
    // Fail silently unless KEYSTONE_TELEMETRY_DEBUG is set to '1' to 1
    if (process.env.KEYSTONE_TELEMETRY_DEBUG === '1') {
      console.log(err);
    }
  }
}

const _excluded = ["server"],
  _excluded2 = ["extendHttpServer"],
  _excluded3 = ["adminMeta", "graphQLSchema", "context", "prismaSchema", "apolloServer", "prismaClientModule"];
const devLoadingHTMLFilepath = path__namespace["default"].join(path__namespace["default"].dirname(require.resolve('@keystone-6/core/package.json')), 'static', 'dev-loading.html');
const cleanConfig = config => {
  const {
      server
    } = config,
    rest = _objectWithoutProperties(config, _excluded);
  if (server) {
    const restServer = _objectWithoutProperties(server, _excluded2);
    return _objectSpread(_objectSpread({}, rest), {}, {
      server: restServer
    });
  }
  return rest;
};
function resolvablePromise() {
  let _resolve;
  const promise = new Promise(resolve => {
    _resolve = resolve;
  });
  promise.resolve = _resolve;
  return promise;
}
function isBuildFailure(err) {
  return err instanceof Error && Array.isArray(err.errors);
}
const dev = async (cwd, shouldDropDatabase) => {
  var _config$server;
  console.log('✨ Starting Keystone');
  const app = express__default["default"]();
  let expressServer = null;
  const httpServer = http.createServer(app);
  let hasAddedAdminUIMiddleware = false;
  let disconnect = null;

  // note that because we don't catch this throwing, if this fails it'll crash the process
  // so that means if
  // - you have an error in your config on startup -> will fail to start and you have to start the process manually after fixing the problem
  // - you have an error in your config after startup -> will keep the last working version until importing the config succeeds
  // also, if you're thinking "why not always use the Next api route to get the config"?
  // this will get the GraphQL API up earlier

  let lastPromise = resolvablePromise();
  const builds = {
    [Symbol.asyncIterator]: () => ({
      next: () => lastPromise
    })
  };
  const initialBuildResult = await esbuild__default["default"].build(_objectSpread(_objectSpread({}, loadConfig.getEsbuildConfig(cwd)), {}, {
    watch: {
      onRebuild(error, result) {
        let prev = lastPromise;
        lastPromise = resolvablePromise();
        prev.resolve({
          value: {
            error,
            result
          },
          done: false
        });
      }
    } 
  })).catch(async err => {
    if (isBuildFailure(err)) {
      // when a build failure happens, esbuild will have printed the error already
      throw new utils.ExitError(1);
    }
    throw err;
  });
  const configWithHTTP = loadConfig.loadBuiltConfig(cwd);
  const config = cleanConfig(configWithHTTP);
  const isReady = () => expressServer !== null && hasAddedAdminUIMiddleware;
  const initKeystone = async () => {
    var _configWithHTTP$serve;
    await fs__namespace["default"].remove(utils.getAdminPath(cwd));
    const _await$setupInitialKe = await setupInitialKeystone(config, cwd, shouldDropDatabase),
      {
        adminMeta,
        graphQLSchema,
        context,
        prismaSchema,
        apolloServer,
        prismaClientModule
      } = _await$setupInitialKe,
      rest = _objectWithoutProperties(_await$setupInitialKe, _excluded3);
    if (configWithHTTP !== null && configWithHTTP !== void 0 && (_configWithHTTP$serve = configWithHTTP.server) !== null && _configWithHTTP$serve !== void 0 && _configWithHTTP$serve.extendHttpServer) {
      configWithHTTP.server.extendHttpServer(httpServer, context, graphQLSchema);
    }
    const prismaClient = context.prisma;
    ({
      disconnect,
      expressServer
    } = rest);
    const nextApp = await initAdminUI(config, graphQLSchema, adminMeta, cwd);
    if (nextApp) {
      expressServer.use(createAdminUIMiddleware.createAdminUIMiddlewareWithNextApp(config, context, nextApp));
    }
    hasAddedAdminUIMiddleware = true;
    initKeystonePromiseResolve();
    const initialisedLists = typesForLists.initialiseLists(config);
    const originalPrismaSchema = artifacts.printPrismaSchema(initialisedLists, config.db.provider, config.db.prismaPreviewFeatures, config.db.additionalPrismaDatasourceProperties);
    let lastPrintedGraphQLSchema = graphql.printSchema(graphQLSchema);
    let lastApolloServer = apolloServer;
    if (config.telemetry !== false) {
      runTelemetry(cwd, initialisedLists, config.db.provider);
    }
    for await (const buildResult of builds) {
      if (buildResult.error) {
        // esbuild will have printed the error already
        continue;
      }
      console.log('compiled successfully');
      try {
        const resolved = require.resolve(utils.getBuiltConfigPath(cwd));
        delete require.cache[resolved];
        const newConfigWithHttp = loadConfig.loadBuiltConfig(cwd);
        const newConfig = cleanConfig(newConfigWithHttp);
        const newPrismaSchema = artifacts.printPrismaSchema(typesForLists.initialiseLists(newConfig), newConfig.db.provider, newConfig.db.prismaPreviewFeatures, newConfig.db.additionalPrismaDatasourceProperties);
        if (originalPrismaSchema !== newPrismaSchema) {
          console.log('🔄 Your prisma schema has changed, please restart Keystone');
          process.exit(1);
        }
        // we only need to test for the things which influence the prisma client creation
        // and aren't written into the prisma schema since we check whether the prisma schema has changed above
        if (newConfig.db.enableLogging !== config.db.enableLogging || newConfig.db.url !== config.db.url || newConfig.db.useMigrations !== config.db.useMigrations) {
          console.log('Your db config has changed, please restart Keystone');
          process.exit(1);
        }
        const {
          graphQLSchema,
          getKeystone,
          adminMeta
        } = createSystem.createSystem(newConfig);
        // we're not using generateCommittedArtifacts or any of the similar functions
        // because we will never need to write a new prisma schema here
        // and formatting the prisma schema leaves some listeners on the process
        // which means you get a "there's probably a memory leak" warning from node
        const newPrintedGraphQLSchema = graphql.printSchema(graphQLSchema);
        if (newPrintedGraphQLSchema !== lastPrintedGraphQLSchema) {
          await fs__namespace["default"].writeFile(artifacts.getSchemaPaths(cwd).graphql, artifacts.getFormattedGraphQLSchema(newPrintedGraphQLSchema));
          lastPrintedGraphQLSchema = newPrintedGraphQLSchema;
        }
        await artifacts.generateNodeModulesArtifactsWithoutPrismaClient(graphQLSchema, newConfig, cwd);
        await generateAdminUI(newConfig, graphQLSchema, adminMeta, utils.getAdminPath(cwd), true);
        const keystone = getKeystone({
          PrismaClient: function fakePrismaClientClass() {
            return prismaClient;
          },
          Prisma: prismaClientModule.Prisma
        });
        const servers = await createAdminUIMiddleware.createExpressServer(newConfig, graphQLSchema, keystone.context);
        if (nextApp) {
          servers.expressServer.use(createAdminUIMiddleware.createAdminUIMiddlewareWithNextApp(newConfig, keystone.context, nextApp));
        }
        expressServer = servers.expressServer;
        let prevApolloServer = lastApolloServer;
        lastApolloServer = servers.apolloServer;
        await prevApolloServer.stop();
      } catch (err) {
        console.log('🚨', chalk__default["default"].red('There was an error loading your Keystone config'));
        console.log(err);
      }
    }
  };

  // You shouldn't really be doing a healthcheck on the dev server, but we
  // respond on the endpoint with the correct error code just in case. This
  // doesn't send the configured data shape, because config doesn't allow
  // for the "not ready" case but that's probably OK.
  if ((_config$server = config.server) !== null && _config$server !== void 0 && _config$server.healthCheck) {
    const healthCheckPath = config.server.healthCheck === true ? createAdminUIMiddleware.defaults.healthCheckPath : config.server.healthCheck.path || createAdminUIMiddleware.defaults.healthCheckPath;
    app.use(healthCheckPath, (req, res, next) => {
      if (expressServer) return next();
      res.status(503).json({
        status: 'fail',
        timestamp: Date.now()
      });
    });
  }

  // Serve the dev status page for the Admin UI
  app.use('/__keystone_dev_status', (req, res) => {
    res.json({
      ready: isReady() ? true : false
    });
  });
  // Pass the request the express server, or serve the loading page
  app.use((req, res, next) => {
    var _config$graphql;
    // If both the express server and Admin UI Middleware are ready, we're go!
    if (expressServer && hasAddedAdminUIMiddleware) {
      return expressServer(req, res, next);
    }
    // Otherwise, we may be able to serve the GraphQL API
    const {
      pathname
    } = url__default["default"].parse(req.url);
    if (expressServer && pathname === (((_config$graphql = config.graphql) === null || _config$graphql === void 0 ? void 0 : _config$graphql.path) || '/api/graphql')) {
      return expressServer(req, res, next);
    }
    // Serve the loading page
    res.sendFile(devLoadingHTMLFilepath);
  });
  let initKeystonePromiseResolve;
  let initKeystonePromiseReject;
  let initKeystonePromise = new Promise((resolve, reject) => {
    initKeystonePromiseResolve = resolve;
    initKeystonePromiseReject = reject;
  });
  const httpOptions = {
    port: 3000
  };
  if (config !== null && config !== void 0 && config.server && 'port' in config.server) {
    httpOptions.port = config.server.port;
  }
  if (config !== null && config !== void 0 && config.server && 'options' in config.server && config.server.options) {
    Object.assign(httpOptions, config.server.options);
  }

  // preference env.PORT if supplied
  if ('PORT' in process.env) {
    httpOptions.port = parseInt(process.env.PORT || '');
  }

  // preference env.HOST if supplied
  if ('HOST' in process.env) {
    httpOptions.host = process.env.HOST || '';
  }
  const server = httpServer.listen(httpOptions, err => {
    var _config$graphql2;
    if (err) throw err;
    const easyHost = [undefined, '', '::', '0.0.0.0'].includes(httpOptions.host) ? 'localhost' : httpOptions.host;
    console.log(`⭐️ Server listening on ${httpOptions.host || ''}:${httpOptions.port} (http://${easyHost}:${httpOptions.port}/)`);
    console.log(`⭐️ GraphQL API available at ${((_config$graphql2 = config.graphql) === null || _config$graphql2 === void 0 ? void 0 : _config$graphql2.path) || '/api/graphql'}`);

    // Don't start initialising Keystone until the dev server is ready,
    // otherwise it slows down the first response significantly
    initKeystone().catch(err => {
      server.close(async closeErr => {
        if (closeErr) {
          console.log('There was an error while closing the server');
          console.log(closeErr);
        }
        try {
          var _disconnect;
          await ((_disconnect = disconnect) === null || _disconnect === void 0 ? void 0 : _disconnect());
        } catch (err) {
          console.log('There was an error while disconnecting from the database');
          console.log(err);
        }
        initKeystonePromiseReject(err);
      });
    });
  });
  await initKeystonePromise;
  return () => new Promise((resolve, reject) => {
    server.close(async err => {
      var _initialBuildResult$s;
      (_initialBuildResult$s = initialBuildResult.stop) === null || _initialBuildResult$s === void 0 ? void 0 : _initialBuildResult$s.call(initialBuildResult);
      try {
        var _disconnect2;
        await ((_disconnect2 = disconnect) === null || _disconnect2 === void 0 ? void 0 : _disconnect2());
      } catch (disconnectionError) {
        if (!err) {
          err = disconnectionError;
        } else {
          console.log('There was an error while disconnecting from the database');
          console.log(disconnectionError);
        }
      }
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
async function setupInitialKeystone(config, cwd, shouldDropDatabase) {
  const {
    graphQLSchema,
    adminMeta,
    getKeystone
  } = createSystem.createSystem(config);

  // Generate the Artifacts
  console.log('✨ Generating GraphQL and Prisma schemas');
  const prismaSchema = (await artifacts.generateCommittedArtifacts(graphQLSchema, config, cwd)).prisma;
  let prismaClientGenerationPromise = artifacts.generateNodeModulesArtifacts(graphQLSchema, config, cwd);
  let migrationPromise;

  // Set up the Database
  if (config.db.useMigrations) {
    migrationPromise = migrations.devMigrations(config.db.url, config.db.shadowDatabaseUrl, prismaSchema, artifacts.getSchemaPaths(cwd).prisma, shouldDropDatabase);
  } else {
    migrationPromise = migrations.pushPrismaSchemaToDatabase(config.db.url, config.db.shadowDatabaseUrl, prismaSchema, artifacts.getSchemaPaths(cwd).prisma, shouldDropDatabase);
  }
  await Promise.all([prismaClientGenerationPromise, migrationPromise]);
  const prismaClientModule = artifacts.requirePrismaClient(cwd);
  const keystone = getKeystone(prismaClientModule);

  // Connect to the Database
  console.log('✨ Connecting to the database');
  await keystone.connect();

  // Set up the Express Server
  console.log('✨ Creating server');
  const {
    apolloServer,
    expressServer
  } = await createAdminUIMiddleware.createExpressServer(config, graphQLSchema, keystone.context);
  console.log(`✅ GraphQL API ready`);

  // Make local storage folders if used
  for (const val of Object.values(config.storage || {})) {
    if (val.kind !== 'local') continue;
    fs__namespace["default"].mkdirSync(val.storagePath, {
      recursive: true
    });
    console.warn(`WARNING: 'mkdir -p ${val.storagePath}' won't happen in production`);
  }
  return {
    adminMeta,
    disconnect: () => keystone.disconnect(),
    expressServer,
    apolloServer,
    graphQLSchema,
    context: keystone.context,
    prismaSchema,
    prismaClientModule
  };
}
async function initAdminUI(config, graphQLSchema, adminMeta, cwd) {
  var _config$ui;
  if ((_config$ui = config.ui) !== null && _config$ui !== void 0 && _config$ui.isDisabled) {
    return;
  }
  console.log('✨ Generating Admin UI code');
  await generateAdminUI(config, graphQLSchema, adminMeta, utils.getAdminPath(cwd), false);
  console.log('✨ Preparing Admin UI app');
  const nextApp = await createAdminUIMiddleware.getNextApp(true, utils.getAdminPath(cwd));
  console.log(`✅ Admin UI ready`);
  return nextApp;
}

const start = async cwd => {
  var _config$ui;
  console.log('✨ Starting Keystone');

  // This is the compiled version of the configuration which was generated during the build step.
  const apiFile = utils.getBuiltConfigPath(cwd);
  if (!fs__namespace.existsSync(apiFile)) {
    console.log('🚨 keystone build must be run before running keystone start');
    throw new utils.ExitError(1);
  }
  const config = loadConfig.loadBuiltConfig(cwd);
  const {
    getKeystone,
    graphQLSchema
  } = createSystem.createSystem(config);
  const prismaClient = artifacts.requirePrismaClient(cwd);
  const keystone = getKeystone(prismaClient);
  console.log('✨ Connecting to the database');
  await keystone.connect();
  console.log('✨ Creating server');
  const {
    expressServer,
    httpServer
  } = await createAdminUIMiddleware.createExpressServer(config, graphQLSchema, keystone.context);
  console.log(`✅ GraphQL API ready`);
  if (!((_config$ui = config.ui) !== null && _config$ui !== void 0 && _config$ui.isDisabled)) {
    console.log('✨ Preparing Admin UI Next.js app');
    expressServer.use(await createAdminUIMiddleware.createAdminUIMiddleware(config, keystone.context, false, utils.getAdminPath(cwd)));
    console.log(`✅ Admin UI ready`);
  }
  const httpOptions = {
    port: 3000
  };
  if (config !== null && config !== void 0 && config.server && 'port' in config.server) {
    httpOptions.port = config.server.port;
  }
  if (config !== null && config !== void 0 && config.server && 'options' in config.server && config.server.options) {
    Object.assign(httpOptions, config.server.options);
  }

  // preference env.PORT if supplied
  if ('PORT' in process.env) {
    httpOptions.port = parseInt(process.env.PORT || '');
  }

  // preference env.HOST if supplied
  if ('HOST' in process.env) {
    httpOptions.host = process.env.HOST || '';
  }
  httpServer.listen(httpOptions, err => {
    if (err) throw err;
    const easyHost = [undefined, '', '::', '0.0.0.0'].includes(httpOptions.host) ? 'localhost' : httpOptions.host;
    console.log(`⭐️ Server listening on ${httpOptions.host || ''}:${httpOptions.port} (http://${easyHost}:${httpOptions.port}/)`);
  });
};

async function build(cwd) {
  var _config$ui;
  const config = await loadConfig.loadConfigOnce(cwd);
  const {
    graphQLSchema,
    adminMeta
  } = createSystem.createSystem(config);
  await artifacts.validateCommittedArtifacts(graphQLSchema, config, cwd);
  console.log('✨ Building Keystone');
  // FIXME: This needs to generate clients for the correct build target using binaryTarget
  // https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#binarytargets-options
  await artifacts.generateNodeModulesArtifacts(graphQLSchema, config, cwd);
  if ((_config$ui = config.ui) !== null && _config$ui !== void 0 && _config$ui.isDisabled) {
    console.log('✨ Skipping Admin UI code generation');
  } else {
    console.log('✨ Generating Admin UI code');
    await generateAdminUI(config, graphQLSchema, adminMeta, utils.getAdminPath(cwd), false);
    console.log('✨ Building Admin UI');
    await buildAdminUI(utils.getAdminPath(cwd));
  }
}

async function prisma(cwd, args) {
  const config = await loadConfig.loadConfigOnce(cwd);
  const {
    graphQLSchema
  } = createSystem.createSystem(config);
  await artifacts.validateCommittedArtifacts(graphQLSchema, config, cwd);
  await artifacts.generateNodeModulesArtifacts(graphQLSchema, config, cwd);
  const result = await execa__default["default"]('node', [require.resolve('prisma'), ...args], {
    cwd,
    stdio: 'inherit',
    reject: false,
    env: _objectSpread(_objectSpread({}, process.env), {}, {
      DATABASE_URL: config.db.url,
      PRISMA_HIDE_UPDATE_MESSAGE: '1'
    })
  });
  if (result.exitCode !== 0) {
    throw new utils.ExitError(result.exitCode);
  }
}

// The postinstall step serves two purposes:

// There’s some files that we need to generate into node_modules and it’s
// important to have them available immediately so things like TypeScript
// won’t fail.

// We want to validate that your Prisma and GraphQL schemas are up to date
// to prevent the awkward “this is changing because of a previous PR that
// didn’t update these things”.

// Why do validation in the postinstall rather than a separate validate command?
//
// It means that it’s hard to get it wrong. You have to run the postinstall
// script anyway so it prevents “oh no, you forgot add this to your CI”

// node_modules
//   .prisma/client (this is where Prisma generates the client to by default,
//      this means we can have a conversation about whether we should tell
//      people to use @prisma/client directly for certain things though we
//      are not necessarily saying that’s what we should do)
//   .keystone
//     - All .js files will have a corresponding .d.ts file for TypeScript.
//       We are generating vanilla JavaScript because:
//         * the user may not be using TypeScript
//         * we can’t/shouldn’t rely on files in node_modules being transpiled even if they are
//     - types.{js,.ts}: .d.ts will be the same as current .keystone/schema-types.ts, the .js will be empty
//     - next/graphql-api.js: to be imported into a next app as an api route
//         * only generated with generateNextGraphqlAPI option

async function postinstall(cwd, shouldFix) {
  const config = await loadConfig.loadConfigOnce(cwd);
  const {
    graphQLSchema
  } = createSystem.createSystem(config);
  if (shouldFix) {
    await artifacts.generateCommittedArtifacts(graphQLSchema, config, cwd);
    console.log('✨ Generated GraphQL and Prisma schemas');
  } else {
    await artifacts.validateCommittedArtifacts(graphQLSchema, config, cwd);
    console.log('✨ GraphQL and Prisma schemas are up to date');
  }
  await artifacts.generateNodeModulesArtifacts(graphQLSchema, config, cwd);
}

async function telemetry(cwd, option) {
  const usageText = `
  The telemetry command requires a valid option
  
      Usage
        $ keystone telemetry [option]
      Options
        status      displays the current telemetry configuration
        reset       resets the current telemetry configuration (if any)
        enable      enables telemetry for the current user
        disable     resets the current telemetry configuration (if any) and disables all telemetry for the current user
      `;
  const helpText = `
  ${chalk__default["default"].bold('KeystoneJS Telemetry')}

      Usage
        $ keystone telemetry [option]
      Options
        status      displays the current telemetry configuration
        reset       resets the current telemetry configuration (if any)
        enable      enables telemetry for the current user
        disable     resets the current telemetry configuration (if any) and disables all telemetry for the current user
  
  For more details visit: https://keystonejs.com/telemetry    
        `;
  const disabledText = `
KeystoneJS telemetry: ${chalk__default["default"].red('Disabled')}
    
  Keystone telemetry is disabled on this device.
  For more details visit: https://keystonejs.com/telemetry`;
  const enabledText = telemetryData => `
KeystoneJS telemetry: ${chalk__default["default"].green('Enabled')}
   
  Telemetry is configured as follows:

${JSON.stringify(telemetryData, null, 2)}

  Telemetry is completely anonymous and helps us make Keystone better.
  For more details visit: https://keystonejs.com/telemetry`;
  const setupText = `
KeystoneJS telemetry: ${chalk__default["default"].red('Not Initialized')}

  Please run ${chalk__default["default"].green('keystone dev')} to use the default configuration.


  Telemetry is completely anonymous and helps us make Keystone better.
  For more details visit: https://keystonejs.com/telemetry
  `;
  // Set a generic Keystone project name that we can use across keystone apps
  // e.g. create-keystone-app. By default it uses the package name
  const config = new Conf__default["default"]({
    projectName: 'keystonejs',
    projectSuffix: ''
  });
  switch (option) {
    case 'status':
      const telemetryData = config.get('telemetry');
      if (telemetryData) {
        console.log(enabledText(telemetryData));
      } else if (telemetryData === false) {
        console.log(disabledText);
      } else {
        console.log(setupText);
      }
      break;
    case 'reset':
      config.delete('telemetry');
      console.log(setupText);
      break;
    case 'disable':
      config.set('telemetry', false);
      console.log(disabledText);
      break;
    case 'enable':
      await enableGlobalTelemetry(config);
      break;
    case '--help':
      console.log(helpText);
      break;
    default:
      console.log(option ? `Invalid option: ${option}` : '');
      console.log(usageText);
  }
  return;
}
async function enableGlobalTelemetry(config, cwd) {
  let telemetryConfig = config.get('telemetry');
  if (!telemetryConfig) {
    telemetryConfig = {
      device: {
        informedAt: new Date().toISOString()
      },
      projects: {
        default: {
          informedAt: new Date().toISOString()
        }
      }
    };
  } else {
    telemetryConfig.device = {
      informedAt: new Date().toISOString()
    };
    telemetryConfig.projects.default = {
      informedAt: new Date().toISOString()
    };
  }
  config.set('telemetry', telemetryConfig);
  console.log(`
KeystoneJS telemetry: ${chalk__default["default"].green('Enabled')}
  `);
}

const commands = {
  dev,
  start,
  build,
  prisma,
  postinstall,
  telemetry
};
async function cli(cwd, argv) {
  const {
    input,
    help,
    flags
  } = meow__default["default"](`
    Usage
      $ keystone [command]
    Commands
        dev           start the project in development mode (default)
        postinstall   generate client APIs and types (optional)
        build         build the project (must be done before using start)
        start         start the project in production mode
        prisma        run Prisma CLI commands safely
        telemetry     sets telemetry preference (enable/disable/status)
    `, {
    flags: {
      fix: {
        default: false,
        type: 'boolean'
      },
      resetDb: {
        default: false,
        type: 'boolean'
      }
    },
    argv
  });
  const command = input[0] || 'dev';
  if (!isCommand(command)) {
    console.log(`${command} is not a command that keystone accepts`);
    console.log(help);
    throw new utils.ExitError(1);
  }
  if (command === 'prisma') {
    return prisma(cwd, argv.slice(1));
  } else if (command === 'postinstall') {
    return postinstall(cwd, flags.fix);
  } else if (command === 'dev') {
    return dev(cwd, flags.resetDb);
  } else if (command === 'telemetry') {
    return telemetry(cwd, argv[1]);
  } else {
    return commands[command](cwd);
  }
}
function isCommand(command) {
  return command in commands;
}

exports.cli = cli;
