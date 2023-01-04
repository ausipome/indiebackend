import { GraphQLSchema } from 'graphql';
import type { KeystoneConfig, AdminFileToWrite } from '../../types';
import { AdminMetaRootVal } from '../system/createAdminMeta';
export declare const writeAdminFiles: (config: KeystoneConfig, graphQLSchema: GraphQLSchema, adminMeta: AdminMetaRootVal, configFileExists: boolean) => AdminFileToWrite[];
