import type { IncomingMessage, ServerResponse } from 'http';
import { GraphQLSchema } from 'graphql';
import { ApolloServer as ApolloServerMicro } from 'apollo-server-micro';
import { ApolloServer as ApolloServerExpress } from 'apollo-server-express';
import type { KeystoneContext, GraphQLConfig, SessionStrategy } from '../../types';
export declare const createApolloServerMicro: ({ graphQLSchema, context, sessionStrategy, graphqlConfig, connectionPromise, }: {
    graphQLSchema: GraphQLSchema;
    context: KeystoneContext;
    sessionStrategy?: SessionStrategy<any, never> | undefined;
    graphqlConfig?: GraphQLConfig | undefined;
    connectionPromise: Promise<any>;
}) => ApolloServerMicro;
export declare const createApolloServerExpress: ({ graphQLSchema, context, sessionStrategy, graphqlConfig, }: {
    graphQLSchema: GraphQLSchema;
    context: KeystoneContext;
    sessionStrategy?: SessionStrategy<any, never> | undefined;
    graphqlConfig?: GraphQLConfig | undefined;
}) => ApolloServerExpress<{
    req: IncomingMessage;
    res: ServerResponse;
}>;
