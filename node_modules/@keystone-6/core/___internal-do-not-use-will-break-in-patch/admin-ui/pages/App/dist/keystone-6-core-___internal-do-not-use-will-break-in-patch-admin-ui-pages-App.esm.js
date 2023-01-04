import React from 'react';
import { Core } from '@keystone-ui/core';
import '@babel/runtime/helpers/extends';
import '@babel/runtime/helpers/objectWithoutProperties';
import 'next/router';
import 'next/link';
import { E as ErrorBoundary } from '../../../../../dist/Errors-f59723d8.esm.js';
import { KeystoneProvider } from '../../../../../admin-ui/context/dist/keystone-6-core-admin-ui-context.esm.js';
import '@keystone-ui/button';
import '@keystone-ui/popover';
import '@keystone-ui/icons/icons/MoreHorizontalIcon';
import '@keystone-ui/icons/icons/ChevronRightIcon';
import '../../../../../dist/SignoutButton-ef277bf5.esm.js';
import '@keystone-ui/modals';
import '@keystone-ui/loading';
import '../../../../../dist/Fields-70a0115d.esm.js';
import '@keystone-ui/toast';
import 'fast-deep-equal';
import '@apollo/client';
import '@keystone-ui/notice';
import '@babel/runtime/helpers/defineProperty';
import '@keystone-ui/icons/icons/AlertTriangleIcon';
import 'apollo-upload-client';
import '@babel/runtime/helpers/objectSpread2';
import '@emotion/hash';
import '../../../../../dist/core-c6bc4160.esm.js';
import '../../../../../dist/next-fields-d3605624.esm.js';
import 'decimal.js';
import '../../../../../dist/graphql-ts-schema-9020a95a.esm.js';
import '@graphql-ts/schema';
import 'graphql-upload/GraphQLUpload.js';
import 'graphql';
import '@graphql-ts/schema/api-without-context';
import '@graphql-ts/extend';
import '@graphql-ts/schema/api-with-context';
import '../../../../../dist/admin-meta-graphql-81d6aaf0.esm.js';
import '../../../../../dist/dataGetter-aebb736f.esm.js';
import '@keystone-ui/fields';

const getApp = props => _ref => {
  let {
    Component,
    pageProps
  } = _ref;
  return /*#__PURE__*/React.createElement(Core, null, /*#__PURE__*/React.createElement(KeystoneProvider, props, /*#__PURE__*/React.createElement(ErrorBoundary, null, /*#__PURE__*/React.createElement(Component, pageProps))));
};

export { getApp };
