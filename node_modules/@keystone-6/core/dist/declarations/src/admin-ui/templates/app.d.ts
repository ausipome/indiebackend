import { GraphQLSchema } from 'graphql';
import { AdminMetaRootVal } from '../system/createAdminMeta';
declare type AppTemplateOptions = {
    configFileExists: boolean;
};
export declare const appTemplate: (adminMetaRootVal: AdminMetaRootVal, graphQLSchema: GraphQLSchema, { configFileExists }: AppTemplateOptions, apiPath: string) => string;
export {};
