import { Migrate } from '@prisma/migrate';
export declare function runMigrateWithDbUrl<T>(dbUrl: string, shadowDbUrl: string | undefined, cb: () => T): T;
export declare function withMigrate<T>(schemaPath: string, cb: (migrate: Migrate) => Promise<T>): Promise<T>;
export declare function pushPrismaSchemaToDatabase(dbUrl: string, shadowDbUrl: string | undefined, schema: string, schemaPath: string, shouldDropDatabase?: boolean): Promise<void>;
export declare function devMigrations(dbUrl: string, shadowDbUrl: string | undefined, prismaSchema: string, schemaPath: string, shouldDropDatabase: boolean): Promise<void>;
