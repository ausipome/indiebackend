/// <reference types="express-serve-static-core" />
import { IncomingMessage, Server, ServerResponse } from 'http';
import express from 'express';
import { GraphQLSchema } from 'graphql';
import { ApolloServer } from 'apollo-server-express';
import type { KeystoneConfig, KeystoneContext } from '../../types';
export declare const createExpressServer: (config: KeystoneConfig, graphQLSchema: GraphQLSchema, context: KeystoneContext) => Promise<{
    expressServer: express.Express;
    apolloServer: ApolloServer<{
        req: IncomingMessage;
        res: ServerResponse;
    }>;
    httpServer: Server;
}>;
