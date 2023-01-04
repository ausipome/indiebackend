import { GraphQLSchema } from 'graphql';
import { KeystoneContext, GqlNames, KeystoneConfig } from '../../types';
import { PrismaClient } from '../core/utils';
import { InitialisedList } from '../core/types-for-lists';
export declare function makeCreateContext({ graphQLSchema, sudoGraphQLSchema, prismaClient, gqlNamesByList, config, lists, }: {
    graphQLSchema: GraphQLSchema;
    sudoGraphQLSchema: GraphQLSchema;
    config: KeystoneConfig;
    prismaClient: PrismaClient;
    gqlNamesByList: Record<string, GqlNames>;
    lists: Record<string, InitialisedList>;
}): KeystoneContext<import("../../types").BaseKeystoneTypeInfo>;
