import { i as initConfig } from '../../dist/initConfig-c29e1934.esm.js';
import { c as createSystem } from '../../dist/createSystem-86342e70.esm.js';
import '@babel/runtime/helpers/objectSpread2';
import 'uuid';
import 'cuid';
import '../../dist/next-fields-d3605624.esm.js';
import 'decimal.js';
import '../../dist/graphql-ts-schema-9020a95a.esm.js';
import '@graphql-ts/schema';
import 'graphql-upload/GraphQLUpload.js';
import 'graphql';
import '@graphql-ts/schema/api-without-context';
import '@graphql-ts/extend';
import '@graphql-ts/schema/api-with-context';
import '../../dist/graphql-errors-e6d55894.esm.js';
import 'apollo-server-errors';
import 'p-limit';
import '../../dist/core-c6bc4160.esm.js';
import '../../dist/createAdminMeta-6f70c326.esm.js';
import 'path';
import '../../dist/utils-e5778e55.esm.js';
import '@babel/runtime/helpers/classPrivateFieldInitSpec';
import '@babel/runtime/helpers/classPrivateFieldGet';
import '@babel/runtime/helpers/classPrivateFieldSet';
import '../../dist/types-for-lists-6eb29eda.esm.js';
import 'graphql/execution/values';
import 'pluralize';
import 'dataloader';
import '@babel/runtime/helpers/objectWithoutProperties';
import '@babel/runtime/helpers/defineProperty';
import 'image-type';
import 'image-size';
import 'stream';
import 'fs-extra';
import '@aws-sdk/s3-request-presigner';
import '@aws-sdk/client-s3';
import '@aws-sdk/lib-storage';
import 'crypto';
import 'filenamify';
import '@sindresorhus/slugify';

function getContext(config, PrismaModule) {
  const system = createSystem(initConfig(config));
  const {
    context
  } = system.getKeystone(PrismaModule);
  return context;
}

export { getContext };
