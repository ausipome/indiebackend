'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var internals = require('@prisma/internals');
var migrations = require('../../dist/migrations-e3b5740b.cjs.dev.js');
require('@prisma/migrate');
require('chalk');
require('@sindresorhus/slugify');
require('../../dist/utils-3551d738.cjs.dev.js');
require('@babel/runtime/helpers/defineProperty');
require('../../dist/prompts-1b5b4598.cjs.dev.js');
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
