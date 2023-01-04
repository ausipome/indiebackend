'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var internals = require('@prisma/internals');
var migrations = require('../../dist/migrations-c84b9f1e.cjs.prod.js');
require('@prisma/migrate');
require('chalk');
require('@sindresorhus/slugify');
require('../../dist/utils-4cb70885.cjs.prod.js');
require('@babel/runtime/helpers/defineProperty');
require('../../dist/prompts-82cbb393.cjs.prod.js');
require('prompts');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefault(path);

async function resetDatabase(dbUrl, prismaSchemaPath) {
  await internals.createDatabase(dbUrl, path__default["default"].dirname(prismaSchemaPath));
  await migrations.withMigrate(prismaSchemaPath, async migrate => {
    await migrations.runMigrateWithDbUrl(dbUrl, undefined, () => migrate.reset());
    await migrations.runMigrateWithDbUrl(dbUrl, undefined, () => migrate.push({
      force: true
    }));
  });
}

exports.resetDatabase = resetDatabase;
