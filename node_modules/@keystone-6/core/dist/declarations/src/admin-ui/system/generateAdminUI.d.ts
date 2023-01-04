import { GraphQLSchema } from 'graphql';
import type { KeystoneConfig, AdminFileToWrite } from '../../types';
import { AdminMetaRootVal } from './createAdminMeta';
export declare function writeAdminFile(file: AdminFileToWrite, projectAdminPath: string): Promise<string>;
export declare const generateAdminUI: (config: KeystoneConfig, graphQLSchema: GraphQLSchema, adminMeta: AdminMetaRootVal, projectAdminPath: string, isLiveReload: boolean) => Promise<void>;
