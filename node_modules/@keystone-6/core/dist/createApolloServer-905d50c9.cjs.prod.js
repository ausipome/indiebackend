'use strict';

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var apolloServerMicro = require('apollo-server-micro');
var apolloServerExpress = require('apollo-server-express');
var apolloServerCore = require('apollo-server-core');

const createApolloServerMicro = _ref => {
  let {
    graphQLSchema,
    context,
    sessionStrategy,
    graphqlConfig,
    connectionPromise
  } = _ref;
  const userContext = async _ref2 => {
    let {
      req,
      res
    } = _ref2;
    await connectionPromise;
    return context.withRequest(req, res);
  };
  const serverConfig = _createApolloServerConfig({
    graphQLSchema,
    graphqlConfig
  });
  return new apolloServerMicro.ApolloServer(_objectSpread(_objectSpread({}, serverConfig), {}, {
    context: userContext
  }));
};
const createApolloServerExpress = _ref3 => {
  let {
    graphQLSchema,
    context,
    sessionStrategy,
    graphqlConfig
  } = _ref3;
  const userContext = async _ref4 => {
    let {
      req,
      res
    } = _ref4;
    return context.withRequest(req, res);
  };
  const serverConfig = _createApolloServerConfig({
    graphQLSchema,
    graphqlConfig
  });
  return new apolloServerExpress.ApolloServer(_objectSpread(_objectSpread({}, serverConfig), {}, {
    context: userContext
  }));
};
const _createApolloServerConfig = _ref5 => {
  var _graphqlConfig$playgr;
  let {
    graphQLSchema,
    graphqlConfig
  } = _ref5;
  const apolloConfig = graphqlConfig === null || graphqlConfig === void 0 ? void 0 : graphqlConfig.apolloConfig;
  const playgroundOption = (_graphqlConfig$playgr = graphqlConfig === null || graphqlConfig === void 0 ? void 0 : graphqlConfig.playground) !== null && _graphqlConfig$playgr !== void 0 ? _graphqlConfig$playgr :         "production" !== 'production';
  return _objectSpread(_objectSpread({
    schema: graphQLSchema,
    debug: graphqlConfig === null || graphqlConfig === void 0 ? void 0 : graphqlConfig.debug,
    // If undefined, use Apollo default of NODE_ENV !== 'production'
    cache: 'bounded',
    persistedQueries: false
  }, apolloConfig), {}, {
    plugins: playgroundOption === 'apollo' ? apolloConfig === null || apolloConfig === void 0 ? void 0 : apolloConfig.plugins : [playgroundOption ? apolloServerCore.ApolloServerPluginLandingPageGraphQLPlayground({
      settings: {
        'request.credentials': 'same-origin'
      }
    }) : apolloServerCore.ApolloServerPluginLandingPageDisabled(), ...((apolloConfig === null || apolloConfig === void 0 ? void 0 : apolloConfig.plugins) || [])],
    formatError: formatError(graphqlConfig)
  });
};
const formatError = graphqlConfig => {
  return err => {
    var _graphqlConfig$apollo;
    let debug = graphqlConfig === null || graphqlConfig === void 0 ? void 0 : graphqlConfig.debug;
    if (debug === undefined) {
      debug =         "production" !== 'production';
    }
    if (!debug && err.extensions) {
      // Strip out any `debug` extensions
      delete err.extensions.debug;
      delete err.extensions.exception;
    }
    if (graphqlConfig !== null && graphqlConfig !== void 0 && (_graphqlConfig$apollo = graphqlConfig.apolloConfig) !== null && _graphqlConfig$apollo !== void 0 && _graphqlConfig$apollo.formatError) {
      return graphqlConfig.apolloConfig.formatError(err);
    } else {
      return err;
    }
  };
};

exports.createApolloServerExpress = createApolloServerExpress;
exports.createApolloServerMicro = createApolloServerMicro;
