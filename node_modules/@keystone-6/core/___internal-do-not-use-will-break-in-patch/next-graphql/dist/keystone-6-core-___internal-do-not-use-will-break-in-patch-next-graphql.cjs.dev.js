'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var initConfig = require('../../../dist/initConfig-d6be2710.cjs.dev.js');
var createSystem = require('../../../dist/createSystem-e6a7a86b.cjs.dev.js');
var createApolloServer = require('../../../dist/createApolloServer-dcab13c4.cjs.dev.js');
require('@babel/runtime/helpers/objectSpread2');
require('uuid');
require('cuid');
require('../../../dist/next-fields-112c1555.cjs.dev.js');
require('decimal.js');
require('../../../dist/graphql-ts-schema-db7cad71.cjs.dev.js');
require('@graphql-ts/schema');
require('graphql-upload/GraphQLUpload.js');
require('graphql');
require('@graphql-ts/schema/api-without-context');
require('@graphql-ts/extend');
require('@graphql-ts/schema/api-with-context');
require('../../../dist/graphql-errors-0bcd0ecf.cjs.dev.js');
require('apollo-server-errors');
require('p-limit');
require('../../../dist/core-3a9d46a1.cjs.dev.js');
require('../../../dist/createAdminMeta-1cd6fe5b.cjs.dev.js');
require('path');
require('../../../dist/utils-c845278f.cjs.dev.js');
require('@babel/runtime/helpers/classPrivateFieldInitSpec');
require('@babel/runtime/helpers/classPrivateFieldGet');
require('@babel/runtime/helpers/classPrivateFieldSet');
require('../../../dist/types-for-lists-e86af58f.cjs.dev.js');
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
require('apollo-server-micro');
require('apollo-server-express');
require('apollo-server-core');

function nextGraphQLAPIRoute(keystoneConfig, prismaClient) {
  const initializedKeystoneConfig = initConfig.initConfig(keystoneConfig);
  const {
    graphQLSchema,
    getKeystone
  } = createSystem.createSystem(initializedKeystoneConfig);
  const {
    connect,
    context
  } = getKeystone(prismaClient);
  connect();
  const apolloServer = createApolloServer.createApolloServerMicro({
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

exports.nextGraphQLAPIRoute = nextGraphQLAPIRoute;
