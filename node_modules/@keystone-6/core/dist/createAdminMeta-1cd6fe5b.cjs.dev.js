'use strict';

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var path = require('path');
var utils = require('./utils-c845278f.cjs.dev.js');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefault(path);

function createAdminMeta(config, initialisedLists) {
  var _config$ui;
  const {
    lists
  } = config;
  const adminMetaRoot = {
    listsByKey: {},
    lists: [],
    views: [],
    isAccessAllowed: (_config$ui = config.ui) === null || _config$ui === void 0 ? void 0 : _config$ui.isAccessAllowed
  };
  const omittedLists = [];
  for (const [listKey, list] of Object.entries(initialisedLists)) {
    var _listConfig$ui, _listConfig$ui$listVi, _listConfig$ui$listVi2, _listConfig$ui2, _listConfig$ui2$listV, _list$types$findManyA, _ref, _listConfig$ui$descri, _listConfig$ui3, _ref2, _listConfig$ui4, _listConfig$ui4$listV, _listConfig$ui$hideCr, _listConfig$ui5, _listConfig$ui$hideDe, _listConfig$ui6, _listConfig$ui$isHidd, _listConfig$ui7;
    const listConfig = lists[listKey];
    if (list.graphql.isEnabled.query === false) {
      omittedLists.push(listKey);
      continue;
    }
    let initialColumns;
    if ((_listConfig$ui = listConfig.ui) !== null && _listConfig$ui !== void 0 && (_listConfig$ui$listVi = _listConfig$ui.listView) !== null && _listConfig$ui$listVi !== void 0 && _listConfig$ui$listVi.initialColumns) {
      // If they've asked for a particular thing, give them that thing
      initialColumns = listConfig.ui.listView.initialColumns;
    } else {
      // Otherwise, we'll start with the labelField on the left and then add
      // 2 more fields to the right of that. We don't include the 'id' field
      // unless it happened to be the labelField
      initialColumns = [list.ui.labelField, ...Object.keys(list.fields).filter(fieldKey => list.fields[fieldKey].graphql.isEnabled.read).filter(fieldKey => fieldKey !== list.ui.labelField).filter(fieldKey => fieldKey !== 'id')].slice(0, 3);
    }
    const maximumPageSize = Math.min((_listConfig$ui$listVi2 = (_listConfig$ui2 = listConfig.ui) === null || _listConfig$ui2 === void 0 ? void 0 : (_listConfig$ui2$listV = _listConfig$ui2.listView) === null || _listConfig$ui2$listV === void 0 ? void 0 : _listConfig$ui2$listV.pageSize) !== null && _listConfig$ui$listVi2 !== void 0 ? _listConfig$ui$listVi2 : 50, (_list$types$findManyA = list.types.findManyArgs.take.defaultValue) !== null && _list$types$findManyA !== void 0 ? _list$types$findManyA : Infinity);
    adminMetaRoot.listsByKey[listKey] = {
      key: listKey,
      labelField: list.ui.labelField,
      description: (_ref = (_listConfig$ui$descri = (_listConfig$ui3 = listConfig.ui) === null || _listConfig$ui3 === void 0 ? void 0 : _listConfig$ui3.description) !== null && _listConfig$ui$descri !== void 0 ? _listConfig$ui$descri : listConfig.description) !== null && _ref !== void 0 ? _ref : null,
      label: list.adminUILabels.label,
      singular: list.adminUILabels.singular,
      plural: list.adminUILabels.plural,
      path: list.adminUILabels.path,
      fields: [],
      fieldsByKey: {},
      groups: [],
      pageSize: maximumPageSize,
      initialColumns,
      initialSort: (_ref2 = (_listConfig$ui4 = listConfig.ui) === null || _listConfig$ui4 === void 0 ? void 0 : (_listConfig$ui4$listV = _listConfig$ui4.listView) === null || _listConfig$ui4$listV === void 0 ? void 0 : _listConfig$ui4$listV.initialSort) !== null && _ref2 !== void 0 ? _ref2 : null,
      // TODO: probably remove this from the GraphQL schema and here
      itemQueryName: listKey,
      listQueryName: list.pluralGraphQLName,
      hideCreate: normalizeMaybeSessionFunction(list.graphql.isEnabled.create ? (_listConfig$ui$hideCr = (_listConfig$ui5 = listConfig.ui) === null || _listConfig$ui5 === void 0 ? void 0 : _listConfig$ui5.hideCreate) !== null && _listConfig$ui$hideCr !== void 0 ? _listConfig$ui$hideCr : false : false),
      hideDelete: normalizeMaybeSessionFunction(list.graphql.isEnabled.delete ? (_listConfig$ui$hideDe = (_listConfig$ui6 = listConfig.ui) === null || _listConfig$ui6 === void 0 ? void 0 : _listConfig$ui6.hideDelete) !== null && _listConfig$ui$hideDe !== void 0 ? _listConfig$ui$hideDe : false : false),
      isHidden: normalizeMaybeSessionFunction((_listConfig$ui$isHidd = (_listConfig$ui7 = listConfig.ui) === null || _listConfig$ui7 === void 0 ? void 0 : _listConfig$ui7.isHidden) !== null && _listConfig$ui$isHidd !== void 0 ? _listConfig$ui$isHidd : false),
      isSingleton: list.isSingleton
    };
    adminMetaRoot.lists.push(adminMetaRoot.listsByKey[listKey]);
  }
  let uniqueViewCount = -1;
  const stringViewsToIndex = {};
  function getViewId(view) {
    if (stringViewsToIndex[view] !== undefined) {
      return stringViewsToIndex[view];
    }
    uniqueViewCount++;
    stringViewsToIndex[view] = uniqueViewCount;
    adminMetaRoot.views.push(view);
    return uniqueViewCount;
  }

  // populate .fields array
  for (const [listKey, list] of Object.entries(initialisedLists)) {
    if (omittedLists.includes(listKey)) continue;
    for (const [fieldKey, field] of Object.entries(list.fields)) {
      var _field$label, _field$ui$description, _field$ui, _field$ui2, _list$ui$searchableFi, _field$ui$createView$, _field$ui3, _field$ui3$createView, _field$ui$itemView$fi, _field$ui4, _field$ui4$itemView, _field$ui5, _field$ui5$itemView, _field$ui$listView$fi, _field$ui6, _field$ui6$listView, _field$input, _field$input2;
      // If the field is a relationship field and is related to an omitted list, skip.
      if (field.dbField.kind === 'relation' && omittedLists.includes(field.dbField.list)) continue;
      // Disabling this entirely for now until we properly decide what the Admin UI
      // should do when `omit: ['read']` is used.
      if (field.graphql.isEnabled.read === false) continue;
      assertValidView(field.views, `The \`views\` on the implementation of the field type at lists.${listKey}.fields.${fieldKey}`);
      const baseOrderFilterArgs = {
        fieldKey,
        listKey: list.listKey
      };
      const fieldMeta = {
        key: fieldKey,
        label: (_field$label = field.label) !== null && _field$label !== void 0 ? _field$label : utils.humanize(fieldKey),
        description: (_field$ui$description = (_field$ui = field.ui) === null || _field$ui === void 0 ? void 0 : _field$ui.description) !== null && _field$ui$description !== void 0 ? _field$ui$description : null,
        viewsIndex: getViewId(field.views),
        customViewsIndex: ((_field$ui2 = field.ui) === null || _field$ui2 === void 0 ? void 0 : _field$ui2.views) === undefined ? null : (assertValidView(field.views, `lists.${listKey}.fields.${fieldKey}.ui.views`), getViewId(field.ui.views)),
        fieldMeta: null,
        listKey: listKey,
        search: (_list$ui$searchableFi = list.ui.searchableFields.get(fieldKey)) !== null && _list$ui$searchableFi !== void 0 ? _list$ui$searchableFi : null,
        createView: {
          fieldMode: normalizeMaybeSessionFunction(field.graphql.isEnabled.create ? (_field$ui$createView$ = (_field$ui3 = field.ui) === null || _field$ui3 === void 0 ? void 0 : (_field$ui3$createView = _field$ui3.createView) === null || _field$ui3$createView === void 0 ? void 0 : _field$ui3$createView.fieldMode) !== null && _field$ui$createView$ !== void 0 ? _field$ui$createView$ : 'edit' : 'hidden')
        },
        itemView: {
          fieldMode: field.graphql.isEnabled.update ? (_field$ui$itemView$fi = (_field$ui4 = field.ui) === null || _field$ui4 === void 0 ? void 0 : (_field$ui4$itemView = _field$ui4.itemView) === null || _field$ui4$itemView === void 0 ? void 0 : _field$ui4$itemView.fieldMode) !== null && _field$ui$itemView$fi !== void 0 ? _field$ui$itemView$fi : 'edit' : 'read',
          fieldPosition: ((_field$ui5 = field.ui) === null || _field$ui5 === void 0 ? void 0 : (_field$ui5$itemView = _field$ui5.itemView) === null || _field$ui5$itemView === void 0 ? void 0 : _field$ui5$itemView.fieldPosition) || 'form'
        },
        listView: {
          fieldMode: normalizeMaybeSessionFunction((_field$ui$listView$fi = (_field$ui6 = field.ui) === null || _field$ui6 === void 0 ? void 0 : (_field$ui6$listView = _field$ui6.listView) === null || _field$ui6$listView === void 0 ? void 0 : _field$ui6$listView.fieldMode) !== null && _field$ui$listView$fi !== void 0 ? _field$ui$listView$fi : 'read')
        },
        isFilterable: normalizeIsOrderFilter((_field$input = field.input) !== null && _field$input !== void 0 && _field$input.where ? field.graphql.isEnabled.filter : false, baseOrderFilterArgs),
        isOrderable: normalizeIsOrderFilter((_field$input2 = field.input) !== null && _field$input2 !== void 0 && _field$input2.orderBy ? field.graphql.isEnabled.orderBy : false, baseOrderFilterArgs),
        // DEPRECATED
        path: fieldKey
      };
      adminMetaRoot.listsByKey[listKey].fields.push(fieldMeta);
      adminMetaRoot.listsByKey[listKey].fieldsByKey[fieldKey] = fieldMeta;
    }
    for (const group of list.groups) {
      adminMetaRoot.listsByKey[listKey].groups.push({
        label: group.label,
        description: group.description,
        fields: group.fields.map(fieldKey => adminMetaRoot.listsByKey[listKey].fieldsByKey[fieldKey])
      });
    }
  }

  // we do this seperately to the above so that fields can check other fields to validate their config or etc.
  // (ofc they won't necessarily be able to see other field's fieldMeta)
  for (const [key, list] of Object.entries(initialisedLists)) {
    if (list.graphql.isEnabled.query === false) continue;
    for (const fieldMetaRootVal of adminMetaRoot.listsByKey[key].fields) {
      const dbField = list.fields[fieldMetaRootVal.path].dbField;
      // If the field is a relationship field and is related to an omitted list, skip.
      if (dbField.kind === 'relation' && omittedLists.includes(dbField.list)) {
        continue;
      }
      currentAdminMeta = adminMetaRoot;
      try {
        var _list$fields$fieldMet, _list$fields$fieldMet2, _list$fields$fieldMet3;
        fieldMetaRootVal.fieldMeta = (_list$fields$fieldMet = (_list$fields$fieldMet2 = (_list$fields$fieldMet3 = list.fields[fieldMetaRootVal.path]).getAdminMeta) === null || _list$fields$fieldMet2 === void 0 ? void 0 : _list$fields$fieldMet2.call(_list$fields$fieldMet3)) !== null && _list$fields$fieldMet !== void 0 ? _list$fields$fieldMet : null;
      } finally {
        currentAdminMeta = undefined;
      }
    }
  }
  return adminMetaRoot;
}
let currentAdminMeta;
function getAdminMetaForRelationshipField() {
  if (currentAdminMeta === undefined) {
    throw new Error('unexpected call to getAdminMetaInRelationshipField');
  }
  return currentAdminMeta;
}
function assertValidView(view, location) {
  if (view.includes('\\')) {
    throw new Error(`${location} contains a backslash, which is invalid. You need to use a module path that is resolved from where 'keystone start' is run (see https://github.com/keystonejs/keystone/pull/7805)`);
  }
  if (path__default["default"].isAbsolute(view)) {
    throw new Error(`${location} is an absolute path, which is invalid. You need to use a module path that is resolved from where 'keystone start' is run (see https://github.com/keystonejs/keystone/pull/7805)`);
  }
}
function normalizeMaybeSessionFunction(input) {
  if (typeof input !== 'function') {
    return () => input;
  }
  return context => input({
    context,
    session: context.session
  });
}
function normalizeIsOrderFilter(input, baseOrderFilterArgs) {
  if (typeof input !== 'function') {
    return () => input;
  }
  return context => input(_objectSpread({
    context,
    session: context.session
  }, baseOrderFilterArgs));
}

exports.createAdminMeta = createAdminMeta;
exports.getAdminMetaForRelationshipField = getAdminMetaForRelationshipField;
