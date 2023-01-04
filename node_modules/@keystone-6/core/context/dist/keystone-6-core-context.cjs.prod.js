'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var initConfig = require('../../dist/initConfig-e90b5265.cjs.prod.js');
var createSystem = require('../../dist/createSystem-3273dd8c.cjs.prod.js');
require('@babel/runtime/helpers/objectSpread2');
require('uuid');
require('cuid');
require('../../dist/next-fields-98c83ec4.cjs.prod.js');
require('decimal.js');
require('../../dist/graphql-ts-schema-e1666bd5.cjs.prod.js');
require('@graphql-ts/schema');
require('graphql-upload/GraphQLUpload.js');
require('graphql');
require('@graphql-ts/schema/api-without-context');
require('@graphql-ts/extend');
require('@graphql-ts/schema/api-with-context');
require('../../dist/graphql-errors-d408b25e.cjs.prod.js');
require('apollo-server-errors');
require('p-limit');
require('../../dist/core-ee045966.cjs.prod.js');
require('../../dist/createAdminMeta-6e1de6fb.cjs.prod.js');
require('path');
require('../../dist/utils-da6352ea.cjs.prod.js');
require('@babel/runtime/helpers/classPrivateFieldInitSpec');
require('@babel/runtime/helpers/classPrivateFieldGet');
require('@babel/runtime/helpers/classPrivateFieldSet');
require('../../dist/types-for-lists-2f8b1685.cjs.prod.js');
require('graphql/execution/values');
require('pluralize');
require('dataloader');
require('@babel/runtime/helpers/objectWithoutProperties');
require('@babel/runtime/helpers/defineProperty');
require('image-type');
require('image-size');
require('stream');
require('fs-extra');
require('@aws-sdk/s3-request-presigner');
require('@aws-sdk/client-s3');
require('@aws-sdk/lib-storage');
require('crypto');
require('filenamify');
require('@sindresorhus/slugify');

function getContext(config, PrismaModule) {
  const system = createSystem.createSystem(initConfig.initConfig(config));
  const {
    context
  } = system.getKeystone(PrismaModule);
  return context;
}

exports.getContext = getContext;
