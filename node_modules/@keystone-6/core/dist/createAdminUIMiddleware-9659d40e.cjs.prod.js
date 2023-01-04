'use strict';

var http = require('http');
var cors = require('cors');
var express = require('express');
var graphqlUploadExpress = require('graphql-upload/graphqlUploadExpress.js');
var createApolloServer = require('./createApolloServer-905d50c9.cjs.prod.js');
var url = require('url');
var path = require('path');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var cors__default = /*#__PURE__*/_interopDefault(cors);
var express__default = /*#__PURE__*/_interopDefault(express);
var graphqlUploadExpress__default = /*#__PURE__*/_interopDefault(graphqlUploadExpress);
var url__default = /*#__PURE__*/_interopDefault(url);
var path__default = /*#__PURE__*/_interopDefault(path);

const defaults = {
  healthCheckPath: '/_healthcheck',
  telemetryEndpoint: 'https://telemetry.keystonejs.com'
};

const addHealthCheck = async _ref => {
  var _config$server;
  let {
    config,
    server
  } = _ref;
  if (!((_config$server = config.server) !== null && _config$server !== void 0 && _config$server.healthCheck)) return;
  const healthCheck = config.server.healthCheck === true ? {} : config.server.healthCheck;
  const path = healthCheck.path || defaults.healthCheckPath;
  server.use(path, (req, res) => {
    const data = (typeof healthCheck.data === 'function' ? healthCheck.data() : healthCheck.data) || {
      status: 'pass',
      timestamp: Date.now()
    };
    res.json(data);
  });
};

/*
NOTE: This creates the main Keystone express server, including the
GraphQL API, but does NOT add the Admin UI middleware.

The Admin UI takes a while to build for dev, and is created separately
so the CLI can bring up the dev server early to handle GraphQL requests.
*/

const DEFAULT_MAX_FILE_SIZE = 200 * 1024 * 1024; // 200 MiB

const addApolloServer = async _ref => {
  var _config$server, _config$graphql, _config$graphql2;
  let {
    server,
    config,
    graphQLSchema,
    context,
    sessionStrategy,
    graphqlConfig
  } = _ref;
  const apolloServer = createApolloServer.createApolloServerExpress({
    graphQLSchema,
    context,
    sessionStrategy,
    graphqlConfig
  });
  const maxFileSize = ((_config$server = config.server) === null || _config$server === void 0 ? void 0 : _config$server.maxFileSize) || DEFAULT_MAX_FILE_SIZE;
  server.use(graphqlUploadExpress__default["default"]({
    maxFileSize
  }));
  await apolloServer.start();
  apolloServer.applyMiddleware({
    app: server,
    path: ((_config$graphql = config.graphql) === null || _config$graphql === void 0 ? void 0 : _config$graphql.path) || '/api/graphql',
    cors: false,
    bodyParserConfig: (_config$graphql2 = config.graphql) === null || _config$graphql2 === void 0 ? void 0 : _config$graphql2.bodyParser
  });
  return apolloServer;
};
const createExpressServer = async (config, graphQLSchema, context) => {
  var _config$server2, _config$server3, _config$server4;
  const expressServer = express__default["default"]();
  const httpServer = http.createServer(expressServer);
  if ((_config$server2 = config.server) !== null && _config$server2 !== void 0 && _config$server2.cors) {
    // Setting config.server.cors = true will provide backwards compatible defaults
    // Otherwise, the user can provide their own config object to use
    const corsConfig = typeof config.server.cors === 'boolean' ? {
      origin: true,
      credentials: true
    } : config.server.cors;
    expressServer.use(cors__default["default"](corsConfig));
  }
  addHealthCheck({
    config,
    server: expressServer
  });
  if ((_config$server3 = config.server) !== null && _config$server3 !== void 0 && _config$server3.extendExpressApp) {
    await config.server.extendExpressApp(expressServer, context);
  }
  if ((_config$server4 = config.server) !== null && _config$server4 !== void 0 && _config$server4.extendHttpServer) {
    var _config$server5;
    (_config$server5 = config.server) === null || _config$server5 === void 0 ? void 0 : _config$server5.extendHttpServer(httpServer, context, graphQLSchema);
  }
  if (config.storage) {
    for (const val of Object.values(config.storage)) {
      if (val.kind !== 'local' || !val.serverRoute) continue;
      expressServer.use(val.serverRoute.path, express__default["default"].static(val.storagePath, {
        setHeaders(res) {
          if (val.type === 'file') {
            res.setHeader('Content-Type', 'application/octet-stream');
          }
        },
        index: false,
        redirect: false,
        lastModified: false
      }));
    }
  }
  const apolloServer = await addApolloServer({
    server: expressServer,
    config,
    graphQLSchema,
    context,
    sessionStrategy: config.session,
    graphqlConfig: config.graphql
  });
  return {
    expressServer,
    apolloServer,
    httpServer
  };
};

const adminErrorHTMLFilepath = path__default["default"].join(path__default["default"].dirname(require.resolve('@keystone-6/core/package.json')), 'static', 'admin-error.html');
async function getNextApp(dev, projectAdminPath) {
  /** We do this to stop webpack from bundling next inside of next */
  const _next = 'next';
  const next = require(_next);
  const app = next({
    dev,
    dir: projectAdminPath
  });
  await app.prepare();
  return app;
}
function defaultIsAccessAllowed(_ref) {
  let {
    session,
    sessionStrategy
  } = _ref;
  if (!sessionStrategy) return true;
  return session !== undefined;
}
function createAdminUIMiddlewareWithNextApp(config, commonContext, nextApp) {
  const handle = nextApp.getRequestHandler();
  const {
    ui: {
      isAccessAllowed = defaultIsAccessAllowed,
      pageMiddleware,
      publicPages = []
    } = {}
  } = config;
  return async (req, res) => {
    const {
      pathname
    } = url__default["default"].parse(req.url);
    if (pathname !== null && pathname !== void 0 && pathname.startsWith('/_next') || pathname !== null && pathname !== void 0 && pathname.startsWith('/__next')) {
      handle(req, res);
      return;
    }
    try {
      // do nothing if this is a public page
      if (publicPages.includes(pathname)) {
        handle(req, res);
        return;
      }
      const context = await commonContext.withRequest(req, res);
      const isValidSession = await isAccessAllowed(context); // TODO: rename "isValidSession" to "wasAccessAllowed"?
      const shouldRedirect = await (pageMiddleware === null || pageMiddleware === void 0 ? void 0 : pageMiddleware({
        context,
        isValidSession
      }));
      if (shouldRedirect) {
        res.header('Cache-Control', 'no-cache, max-age=0');
        res.header('Location', shouldRedirect.to);
        res.status(302);
        res.send();
        return;
      }
      if (isValidSession) {
        handle(req, res);
      } else {
        nextApp.render(req, res, '/no-access');
      }
    } catch (e) {
      console.error('An error occurred handling a request for the Admin UI:', e);
      res.status(500);
      res.format({
        'text/html': function () {
          res.sendFile(adminErrorHTMLFilepath);
        },
        'application/json': function () {
          res.send({
            error: true
          });
        },
        default: function () {
          res.send('An error occurred handling a request for the Admin UI.');
        }
      });
    }
  };
}
async function createAdminUIMiddleware(config, context, dev, projectAdminPath) {
  const nextApp = await getNextApp(dev, projectAdminPath);
  return createAdminUIMiddlewareWithNextApp(config, context, nextApp);
}

exports.createAdminUIMiddleware = createAdminUIMiddleware;
exports.createAdminUIMiddlewareWithNextApp = createAdminUIMiddlewareWithNextApp;
exports.createExpressServer = createExpressServer;
exports.defaults = defaults;
exports.getNextApp = getNextApp;
