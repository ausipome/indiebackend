import { i as initConfig } from '../../../dist/initConfig-c29e1934.esm.js';
import { c as createSystem } from '../../../dist/createSystem-86342e70.esm.js';
import { c as createApolloServerMicro } from '../../../dist/createApolloServer-b38a5e63.esm.js';
import '@babel/runtime/helpers/objectSpread2';
import 'uuid';
import 'cuid';
import '../../../dist/next-fields-d3605624.esm.js';
import 'decimal.js';
import '../../../dist/graphql-ts-schema-9020a95a.esm.js';
import '@graphql-ts/schema';
import 'graphql-upload/GraphQLUpload.js';
import 'graphql';
import '@graphql-ts/schema/api-without-context';
import '@graphql-ts/extend';
import '@graphql-ts/schema/api-with-context';
import '../../../dist/graphql-errors-e6d55894.esm.js';
import 'apollo-server-errors';
import 'p-limit';
import '../../../dist/core-c6bc4160.esm.js';
import '../../../dist/createAdminMeta-6f70c326.esm.js';
import 'path';
import '../../../dist/utils-e5778e55.esm.js';
import '@babel/runtime/helpers/classPrivateFieldInitSpec';
import '@babel/runtime/helpers/classPrivateFieldGet';
import '@babel/runtime/helpers/classPrivateFieldSet';
import '../../../dist/types-for-lists-6eb29eda.esm.js';
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
import 'apollo-server-micro';
import 'apollo-server-express';
import 'apollo-server-core';

function nextGraphQLAPIRoute(keystoneConfig, prismaClient) {
  const initializedKeystoneConfig = initConfig(keystoneConfig);
  const {
    graphQLSchema,
    getKeystone
  } = createSystem(initializedKeystoneConfig);
  const {
    connect,
    context
  } = getKeystone(prismaClient);
  connect();
  const apolloServer = createApolloServerMicro({
    graphQLSchema,
    context,
    sessionStrategy: initializedKeystoneConfig.session,
    graphqlConfig: initializedKeystoneConfig.graphql,
    connectionPromise: connect()
  });
  let startPromise = apolloServer.start();
  return async (req, res) => {
    var _keystoneConfig$graph;
    await startPromise;
    return apolloServer.createHandler({
      path: ((_keystoneConfig$graph = keystoneConfig.graphql) === null || _keystoneConfig$graph === void 0 ? void 0 : _keystoneConfig$graph.path) || '/api/graphql'
    })(req, res);
  };
}

export { nextGraphQLAPIRoute };
