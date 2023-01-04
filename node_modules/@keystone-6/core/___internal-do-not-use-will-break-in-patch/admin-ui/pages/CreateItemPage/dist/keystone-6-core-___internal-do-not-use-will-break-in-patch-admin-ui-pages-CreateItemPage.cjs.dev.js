'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@keystone-ui/core');
var loading = require('@keystone-ui/loading');
var button = require('@keystone-ui/button');
var router = require('next/router');
var Fields = require('../../../../../dist/Fields-203e4e26.cjs.dev.js');
require('../../../../../dist/getRootGraphQLFieldsFromFieldController-e2b649ed.cjs.dev.js');
require('react');
require('fast-deep-equal');
var PageContainer = require('../../../../../dist/PageContainer-10546ed3.cjs.dev.js');
var adminUi_context_dist_keystone6CoreAdminUiContext = require('../../../../../admin-ui/context/dist/keystone-6-core-admin-ui-context.cjs.dev.js');
require('@babel/runtime/helpers/extends');
require('@babel/runtime/helpers/objectWithoutProperties');
require('next/link');
require('@babel/runtime/helpers/defineProperty');
require('@keystone-ui/icons/icons/AlertTriangleIcon');
require('@keystone-ui/popover');
require('@keystone-ui/icons/icons/MoreHorizontalIcon');
require('@keystone-ui/icons/icons/ChevronRightIcon');
require('../../../../../dist/SignoutButton-94652c56.cjs.dev.js');
require('@keystone-ui/modals');
var useCreateItem = require('../../../../../dist/useCreateItem-0e2c9570.cjs.dev.js');
var GraphQLErrorNotice = require('../../../../../dist/GraphQLErrorNotice-6d33121b.cjs.dev.js');
var common = require('../../../../../dist/common-0bf36fb4.cjs.dev.js');
require('@babel/runtime/helpers/objectSpread2');
require('@keystone-ui/fields');
require('@emotion/weak-memoize');
require('graphql');
require('../../../../../admin-ui/router/dist/keystone-6-core-admin-ui-router.cjs.dev.js');
require('@keystone-ui/toast');
require('apollo-upload-client');
require('@emotion/hash');
require('../../../../../dist/core-3a9d46a1.cjs.dev.js');
require('../../../../../dist/next-fields-112c1555.cjs.dev.js');
require('decimal.js');
require('../../../../../dist/graphql-ts-schema-db7cad71.cjs.dev.js');
require('@graphql-ts/schema');
require('graphql-upload/GraphQLUpload.js');
require('@graphql-ts/schema/api-without-context');
require('@graphql-ts/extend');
require('@graphql-ts/schema/api-with-context');
require('@apollo/client');
require('../../../../../dist/admin-meta-graphql-d825f8e4.cjs.dev.js');
require('../../../../../dist/dataGetter-a86f5aeb.cjs.dev.js');
require('@keystone-ui/notice');

/** @jsxRuntime classic */
function CreatePageForm(props) {
  var _createItem$error, _createItem$error2;
  const createItem = useCreateItem.useCreateItem(props.list);
  const router$1 = router.useRouter();
  return core.jsx(core.Box, {
    paddingTop: "xlarge"
  }, createItem.error && core.jsx(GraphQLErrorNotice.GraphQLErrorNotice, {
    networkError: (_createItem$error = createItem.error) === null || _createItem$error === void 0 ? void 0 : _createItem$error.networkError,
    errors: (_createItem$error2 = createItem.error) === null || _createItem$error2 === void 0 ? void 0 : _createItem$error2.graphQLErrors
  }), core.jsx("form", {
    onSubmit: async event => {
      event.preventDefault();
      const item = await createItem.create();
      if (item) {
        router$1.push(`/${props.list.path}/${item.id}`);
      }
    }
  }, core.jsx(Fields.Fields, createItem.props), core.jsx(common.BaseToolbar, null, core.jsx(button.Button, {
    isLoading: createItem.state === 'loading',
    type: "submit",
    weight: "bold",
    tone: "active"
  }, "Create ", props.list.singular))));
}
const getCreateItemPage = props => () => core.jsx(CreateItemPage, props);
function CreateItemPage(props) {
  const list = adminUi_context_dist_keystone6CoreAdminUiContext.useList(props.listKey);
  const {
    createViewFieldModes
  } = adminUi_context_dist_keystone6CoreAdminUiContext.useKeystone();
  return core.jsx(PageContainer.PageContainer, {
    title: `Create ${list.singular}`,
    header: core.jsx(common.ItemPageHeader, {
      list: list,
      label: "Create"
    })
  }, core.jsx(common.ColumnLayout, null, core.jsx(core.Box, null, createViewFieldModes.state === 'error' && core.jsx(GraphQLErrorNotice.GraphQLErrorNotice, {
    networkError: createViewFieldModes.error instanceof Error ? createViewFieldModes.error : undefined,
    errors: createViewFieldModes.error instanceof Error ? undefined : createViewFieldModes.error
  }), createViewFieldModes.state === 'loading' && core.jsx(loading.LoadingDots, {
    label: "Loading create form"
  }), core.jsx(CreatePageForm, {
    list: list
  }))));
}

exports.getCreateItemPage = getCreateItemPage;
