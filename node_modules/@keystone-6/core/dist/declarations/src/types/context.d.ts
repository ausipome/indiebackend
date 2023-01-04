/// <reference types="node" />
/// <reference types="node" />
import { IncomingMessage, ServerResponse } from 'http';
import { Readable } from 'stream';
import { GraphQLSchema, ExecutionResult, DocumentNode } from 'graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { InitialisedList } from '../lib/core/types-for-lists';
import { BaseListTypeInfo } from './type-info';
import { GqlNames, BaseKeystoneTypeInfo, SessionStrategy } from '.';
export declare type KeystoneContext<TypeInfo extends BaseKeystoneTypeInfo = BaseKeystoneTypeInfo> = {
    req?: IncomingMessage;
    res?: ServerResponse;
    db: KeystoneDbAPI<TypeInfo['lists']>;
    query: KeystoneListsAPI<TypeInfo['lists']>;
    graphql: KeystoneGraphQLAPI;
    sudo: () => KeystoneContext<TypeInfo>;
    exitSudo: () => KeystoneContext<TypeInfo>;
    withSession: (session: any) => KeystoneContext<TypeInfo>;
    withRequest: (req: IncomingMessage, res?: ServerResponse) => Promise<KeystoneContext<TypeInfo>>;
    prisma: TypeInfo['prisma'];
    files: FilesContext;
    images: ImagesContext;
    /** @deprecated */
    gqlNames: (listKey: string) => GqlNames;
    experimental?: {
        /** @deprecated This value is only available if you have config.experimental.contextInitialisedLists = true.
         * This is not a stable API and may contain breaking changes in `patch` level releases.
         */
        initialisedLists: Record<string, InitialisedList>;
    };
    sessionStrategy?: SessionStrategy<any>;
    session?: any;
};
declare type UniqueWhereInput<ListTypeInfo extends BaseListTypeInfo> = false extends ListTypeInfo['isSingleton'] ? {
    readonly where: ListTypeInfo['inputs']['uniqueWhere'];
} : {
    readonly where?: ListTypeInfo['inputs']['uniqueWhere'];
};
export declare type KeystoneListsAPI<KeystoneListsTypeInfo extends Record<string, BaseListTypeInfo>> = {
    [Key in keyof KeystoneListsTypeInfo]: {
        findMany(args?: {
            readonly where?: KeystoneListsTypeInfo[Key]['inputs']['where'];
            readonly take?: number;
            readonly skip?: number;
            readonly orderBy?: KeystoneListsTypeInfo[Key]['inputs']['orderBy'] | readonly KeystoneListsTypeInfo[Key]['inputs']['orderBy'][];
        } & ResolveFields): Promise<readonly Record<string, any>[]>;
        findOne(args: UniqueWhereInput<KeystoneListsTypeInfo[Key]> & ResolveFields): Promise<Record<string, any>>;
        count(args?: {
            readonly where?: KeystoneListsTypeInfo[Key]['inputs']['where'];
        }): Promise<number>;
        updateOne(args: UniqueWhereInput<KeystoneListsTypeInfo[Key]> & {
            readonly data: KeystoneListsTypeInfo[Key]['inputs']['update'];
        } & ResolveFields): Promise<Record<string, any>>;
        updateMany(args: {
            readonly data: readonly (UniqueWhereInput<KeystoneListsTypeInfo[Key]> & {
                readonly data: KeystoneListsTypeInfo[Key]['inputs']['update'];
            })[];
        } & ResolveFields): Promise<Record<string, any>[]>;
        createOne(args: {
            readonly data: KeystoneListsTypeInfo[Key]['inputs']['create'];
        } & ResolveFields): Promise<Record<string, any>>;
        createMany(args: {
            readonly data: readonly KeystoneListsTypeInfo[Key]['inputs']['create'][];
        } & ResolveFields): Promise<Record<string, any>[]>;
        deleteOne(args: UniqueWhereInput<KeystoneListsTypeInfo[Key]> & ResolveFields): Promise<Record<string, any> | null>;
        deleteMany(args: {
            readonly where: readonly KeystoneListsTypeInfo[Key]['inputs']['uniqueWhere'][];
        } & ResolveFields): Promise<Record<string, any>[]>;
    };
};
declare type ResolveFields = {
    /**
     * @default 'id'
     */
    readonly query?: string;
};
export declare type KeystoneDbAPI<KeystoneListsTypeInfo extends Record<string, BaseListTypeInfo>> = {
    [Key in keyof KeystoneListsTypeInfo]: {
        findMany(args?: {
            readonly where?: KeystoneListsTypeInfo[Key]['inputs']['where'];
            readonly take?: number;
            readonly skip?: number;
            readonly orderBy?: KeystoneListsTypeInfo[Key]['inputs']['orderBy'] | readonly KeystoneListsTypeInfo[Key]['inputs']['orderBy'][];
        }): Promise<readonly KeystoneListsTypeInfo[Key]['item'][]>;
        findOne(args: UniqueWhereInput<KeystoneListsTypeInfo[Key]>): Promise<KeystoneListsTypeInfo[Key]['item'] | null>;
        count(args?: {
            readonly where?: KeystoneListsTypeInfo[Key]['inputs']['where'];
        }): Promise<number>;
        updateOne(args: UniqueWhereInput<KeystoneListsTypeInfo[Key]> & {
            readonly data: KeystoneListsTypeInfo[Key]['inputs']['update'];
        }): Promise<KeystoneListsTypeInfo[Key]['item']>;
        updateMany(args: {
            readonly data: readonly (UniqueWhereInput<KeystoneListsTypeInfo[Key]> & {
                readonly data: KeystoneListsTypeInfo[Key]['inputs']['update'];
            })[];
        }): Promise<KeystoneListsTypeInfo[Key]['item'][]>;
        createOne(args: {
            readonly data: KeystoneListsTypeInfo[Key]['inputs']['create'];
        }): Promise<KeystoneListsTypeInfo[Key]['item']>;
        createMany(args: {
            readonly data: readonly KeystoneListsTypeInfo[Key]['inputs']['create'][];
        }): Promise<KeystoneListsTypeInfo[Key]['item'][]>;
        deleteOne(args: UniqueWhereInput<KeystoneListsTypeInfo[Key]>): Promise<KeystoneListsTypeInfo[Key]['item']>;
        deleteMany(args: {
            readonly where: readonly KeystoneListsTypeInfo[Key]['inputs']['uniqueWhere'][];
        }): Promise<KeystoneListsTypeInfo[Key]['item'][]>;
    };
};
export declare type KeystoneGraphQLAPI = {
    schema: GraphQLSchema;
    run: <TData, TVariables extends Record<string, any>>(args: GraphQLExecutionArguments<TData, TVariables>) => Promise<TData>;
    raw: <TData, TVariables extends Record<string, any>>(args: GraphQLExecutionArguments<TData, TVariables>) => Promise<ExecutionResult<TData>>;
};
declare type GraphQLExecutionArguments<TData, TVariables> = {
    query: string | DocumentNode | TypedDocumentNode<TData, TVariables>;
    variables?: TVariables;
};
export declare type AssetMode = 'local' | 's3';
export declare type FileMetadata = {
    filename: string;
    filesize: number;
};
export declare type FileData = {
    filename: string;
} & FileMetadata;
export declare type FilesContext = (storage: string) => {
    getUrl: (filename: string) => Promise<string>;
    getDataFromStream: (stream: Readable, filename: string) => Promise<FileData>;
    deleteAtSource: (filename: string) => Promise<void>;
};
export declare type ImageExtension = 'jpg' | 'png' | 'webp' | 'gif';
export declare type ImageMetadata = {
    extension: ImageExtension;
    filesize: number;
    width: number;
    height: number;
};
export declare type ImageData = {
    id: string;
} & ImageMetadata;
export declare type ImagesContext = (storage: string) => {
    getUrl: (id: string, extension: ImageExtension) => Promise<string>;
    getDataFromStream: (stream: Readable, filename: string) => Promise<ImageData>;
    deleteAtSource: (id: string, extension: ImageExtension) => Promise<void>;
};
export {};
