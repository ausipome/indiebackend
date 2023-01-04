import type { GraphQLResolveInfo } from 'graphql';
import type { GqlNames } from './utils';
import type { KeystoneContext } from './context';
export declare type DatabaseProvider = 'sqlite' | 'postgresql' | 'mysql';
export declare type GraphQLResolver<Context extends KeystoneContext> = (root: any, args: any, context: Context, info: GraphQLResolveInfo) => any;
export declare type GraphQLSchemaExtension<Context extends KeystoneContext> = {
    typeDefs: string;
    resolvers: Record<string, Record<string, GraphQLResolver<Context>>>;
};
export declare function getGqlNames({ listKey, pluralGraphQLName, }: {
    listKey: string;
    pluralGraphQLName: string;
}): GqlNames;
