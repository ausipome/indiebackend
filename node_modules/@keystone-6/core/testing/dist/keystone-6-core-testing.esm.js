import path__default from 'path';
import { createDatabase } from '@prisma/internals';
import { w as withMigrate, r as runMigrateWithDbUrl } from '../../dist/migrations-6186d51a.esm.js';
import '@prisma/migrate';
import 'chalk';
import '@sindresorhus/slugify';
import '../../dist/utils-a8fea457.esm.js';
import '@babel/runtime/helpers/defineProperty';
import '../../dist/prompts-97fdb385.esm.js';
import 'prompts';

async function resetDatabase(dbUrl, prismaSchemaPath) {
  await createDatabase(dbUrl, path__default.dirname(prismaSchemaPath));
  await withMigrate(prismaSchemaPath, async migrate => {
    await runMigrateWithDbUrl(dbUrl, undefined, () => migrate.reset());
    await runMigrateWithDbUrl(dbUrl, undefined, () => migrate.push({
      force: true
    }));
  });
}

export { resetDatabase };
