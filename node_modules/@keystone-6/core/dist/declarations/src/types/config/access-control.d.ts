import type { MaybePromise } from '../utils';
import type { KeystoneContextFromListTypeInfo } from '..';
import { BaseListTypeInfo } from '../type-info';
export declare type BaseAccessArgs<ListTypeInfo extends BaseListTypeInfo> = {
    session: any;
    listKey: string;
    context: KeystoneContextFromListTypeInfo<ListTypeInfo>;
};
export declare type AccessOperation = 'create' | 'query' | 'update' | 'delete';
export declare type FilterOperation = 'query' | 'update' | 'delete';
export declare type ItemOperation = 'create' | 'update' | 'delete';
export declare type ListOperationAccessControl<Operation extends AccessOperation, ListTypeInfo extends BaseListTypeInfo> = (args: BaseAccessArgs<ListTypeInfo> & {
    operation: Operation;
}) => MaybePromise<boolean>;
export declare type ListFilterAccessControl<Operation extends FilterOperation, ListTypeInfo extends BaseListTypeInfo> = (args: BaseAccessArgs<ListTypeInfo> & {
    operation: Operation;
}) => MaybePromise<boolean | ListTypeInfo['inputs']['where']>;
export declare type CreateListItemAccessControl<ListTypeInfo extends BaseListTypeInfo> = (args: BaseAccessArgs<ListTypeInfo> & {
    operation: 'create';
    /**
     * The input passed in from the GraphQL API
     */
    inputData: ListTypeInfo['inputs']['create'];
}) => MaybePromise<boolean>;
export declare type UpdateListItemAccessControl<ListTypeInfo extends BaseListTypeInfo> = (args: BaseAccessArgs<ListTypeInfo> & {
    operation: 'update';
    /**
     * The item being updated
     */
    item: ListTypeInfo['item'];
    /**
     * The input passed in from the GraphQL API
     */
    inputData: ListTypeInfo['inputs']['update'];
}) => MaybePromise<boolean>;
export declare type DeleteListItemAccessControl<ListTypeInfo extends BaseListTypeInfo> = (args: BaseAccessArgs<ListTypeInfo> & {
    operation: 'delete';
    /**
     * The item being deleted
     */
    item: ListTypeInfo['item'];
}) => MaybePromise<boolean>;
declare type ListAccessControlFunction<ListTypeInfo extends BaseListTypeInfo> = (args: BaseAccessArgs<ListTypeInfo> & {
    operation: AccessOperation;
}) => MaybePromise<boolean>;
declare type ListAccessControlObject<ListTypeInfo extends BaseListTypeInfo> = {
    operation: ListOperationAccessControl<AccessOperation, ListTypeInfo> | {
        query: ListOperationAccessControl<'query', ListTypeInfo>;
        create: ListOperationAccessControl<'create', ListTypeInfo>;
        update: ListOperationAccessControl<'update', ListTypeInfo>;
        delete: ListOperationAccessControl<'delete', ListTypeInfo>;
    };
    filter?: {
        query?: ListFilterAccessControl<'query', ListTypeInfo>;
        update?: ListFilterAccessControl<'update', ListTypeInfo>;
        delete?: ListFilterAccessControl<'delete', ListTypeInfo>;
    };
    item?: {
        create?: CreateListItemAccessControl<ListTypeInfo>;
        update?: UpdateListItemAccessControl<ListTypeInfo>;
        delete?: DeleteListItemAccessControl<ListTypeInfo>;
    };
};
export declare type ListAccessControl<ListTypeInfo extends BaseListTypeInfo> = ListAccessControlFunction<ListTypeInfo> | ListAccessControlObject<ListTypeInfo>;
export declare type IndividualFieldAccessControl<Args> = (args: Args) => MaybePromise<boolean>;
export declare type FieldCreateItemAccessArgs<ListTypeInfo extends BaseListTypeInfo> = BaseAccessArgs<ListTypeInfo> & {
    operation: 'create';
    fieldKey: string;
    /**
     * The input passed in from the GraphQL API
     */
    inputData: ListTypeInfo['inputs']['create'];
};
export declare type FieldReadItemAccessArgs<ListTypeInfo extends BaseListTypeInfo> = BaseAccessArgs<ListTypeInfo> & {
    operation: 'read';
    fieldKey: string;
    /**
     * The item being read
     */
    item: ListTypeInfo['item'];
};
export declare type FieldUpdateItemAccessArgs<ListTypeInfo extends BaseListTypeInfo> = BaseAccessArgs<ListTypeInfo> & {
    operation: 'update';
    fieldKey: string;
    /**
     * The item being updated
     */
    item: ListTypeInfo['item'];
    /**
     * The input passed in from the GraphQL API
     */
    inputData: ListTypeInfo['inputs']['update'];
};
export declare type FieldAccessControl<ListTypeInfo extends BaseListTypeInfo> = IndividualFieldAccessControl<FieldReadItemAccessArgs<ListTypeInfo> | FieldCreateItemAccessArgs<ListTypeInfo> | FieldUpdateItemAccessArgs<ListTypeInfo>> | {
    read?: IndividualFieldAccessControl<FieldReadItemAccessArgs<ListTypeInfo>>;
    create?: IndividualFieldAccessControl<FieldCreateItemAccessArgs<ListTypeInfo>>;
    update?: IndividualFieldAccessControl<FieldUpdateItemAccessArgs<ListTypeInfo>>;
};
export {};
