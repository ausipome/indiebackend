import { CacheHint } from 'apollo-server-types';
import { GraphQLTypesForList, NextFieldType, BaseListTypeInfo, ListHooks, KeystoneConfig, CacheHintArgs, MaybePromise } from '../../types';
import { FieldHooks } from '../../types/config/hooks';
import { FilterOrderArgs } from '../../types/config/fields';
import { ResolvedFieldAccessControl, ResolvedListAccessControl } from './access-control';
import { ResolvedDBField } from './resolve-relationships';
export declare type InitialisedField = Omit<NextFieldType, 'dbField' | 'access' | 'graphql'> & {
    dbField: ResolvedDBField;
    access: ResolvedFieldAccessControl;
    hooks: FieldHooks<BaseListTypeInfo>;
    graphql: {
        isEnabled: {
            read: boolean;
            create: boolean;
            update: boolean;
            filter: boolean | ((args: FilterOrderArgs<BaseListTypeInfo>) => MaybePromise<boolean>);
            orderBy: boolean | ((args: FilterOrderArgs<BaseListTypeInfo>) => MaybePromise<boolean>);
        };
        cacheHint: CacheHint | undefined;
    };
};
export declare type FieldGroupConfig = {
    fields: string[];
    label: string;
    description: string | null;
};
export declare type InitialisedList = {
    fields: Record<string, InitialisedField>;
    /** This will include the opposites to one-sided relationships */
    resolvedDbFields: Record<string, ResolvedDBField>;
    groups: FieldGroupConfig[];
    pluralGraphQLName: string;
    types: GraphQLTypesForList;
    access: ResolvedListAccessControl;
    hooks: ListHooks<BaseListTypeInfo>;
    adminUILabels: {
        label: string;
        singular: string;
        plural: string;
        path: string;
    };
    cacheHint: ((args: CacheHintArgs) => CacheHint) | undefined;
    listKey: string;
    ui: {
        labelField: string;
        searchFields: Set<string>;
        searchableFields: Map<string, 'default' | 'insensitive' | null>;
    };
    lists: Record<string, InitialisedList>;
    dbMap: string | undefined;
    graphql: {
        isEnabled: IsEnabled;
    };
    isSingleton: boolean;
};
declare type IsEnabled = {
    type: boolean;
    query: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    filter: boolean | ((args: FilterOrderArgs<BaseListTypeInfo>) => MaybePromise<boolean>);
    orderBy: boolean | ((args: FilterOrderArgs<BaseListTypeInfo>) => MaybePromise<boolean>);
};
/**
 * 1. Get the `isEnabled` config object from the listConfig - the returned object will be modified later
 * 2. Instantiate `lists` object - it is done here as the object will be added to the listGraphqlTypes
 * 3. Get graphqlTypes
 * 4. Initialise fields - field functions are called
 * 5. Handle relationships - ensure correct linking between two sides of all relationships (including one-sided relationships)
 * 6.
 */
export declare function initialiseLists(config: KeystoneConfig): Record<string, InitialisedList>;
export {};
