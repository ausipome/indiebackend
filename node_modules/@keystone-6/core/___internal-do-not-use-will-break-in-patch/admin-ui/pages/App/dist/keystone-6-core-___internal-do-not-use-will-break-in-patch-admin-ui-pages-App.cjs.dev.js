'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var core = require('@keystone-ui/core');
require('@babel/runtime/helpers/extends');
require('@babel/runtime/helpers/objectWithoutProperties');
require('next/router');
require('next/link');
var Errors = require('../../../../../dist/Errors-d7ffd745.cjs.dev.js');
var adminUi_context_dist_keystone6CoreAdminUiContext = require('../../../../../admin-ui/context/dist/keystone-6-core-admin-ui-context.cjs.dev.js');
require('@keystone-ui/button');
require('@keystone-ui/popover');
require('@keystone-ui/icons/icons/MoreHorizontalIcon');
require('@keystone-ui/icons/icons/ChevronRightIcon');
require('../../../../../dist/SignoutButton-94652c56.cjs.dev.js');
require('@keystone-ui/modals');
require('@keystone-ui/loading');
require('../../../../../dist/Fields-203e4e26.cjs.dev.js');
require('@keystone-ui/toast');
require('fast-deep-equal');
require('@apollo/client');
require('@keystone-ui/notice');
require('@babel/runtime/helpers/defineProperty');
require('@keystone-ui/icons/icons/AlertTriangleIcon');
require('apollo-upload-client');
require('@babel/runtime/helpers/objectSpread2');
require('@emotion/hash');
require('../../../../../dist/core-3a9d46a1.cjs.dev.js');
require('../../../../../dist/next-fields-112c1555.cjs.dev.js');
require('decimal.js');
require('../../../../../dist/graphql-ts-schema-db7cad71.cjs.dev.js');
require('@graphql-ts/schema');
require('graphql-upload/GraphQLUpload.js');
require('graphql');
require('@graphql-ts/schema/api-without-context');
require('@graphql-ts/extend');
require('@graphql-ts/schema/api-with-context');
require('../../../../../dist/admin-meta-graphql-d825f8e4.cjs.dev.js');
require('../../../../../dist/dataGetter-a86f5aeb.cjs.dev.js');
require('@keystone-ui/fields');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

const getApp = props => _ref => {
  let {
    Component,
    pageProps
  } = _ref;
  return /*#__PURE__*/React__default["default"].createElement(core.Core, null, /*#__PURE__*/React__default["default"].createElement(adminUi_context_dist_keystone6CoreAdminUiContext.KeystoneProvider, props, /*#__PURE__*/React__default["default"].createElement(Errors.ErrorBoundary, null, /*#__PURE__*/React__default["default"].createElement(Component, pageProps))));
};

exports.getApp = getApp;
