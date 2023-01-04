import { BaseListTypeInfo, CreateListItemAccessControl, FieldAccessControl, IndividualFieldAccessControl, ListAccessControl, DeleteListItemAccessControl, FieldCreateItemAccessArgs, FieldReadItemAccessArgs, FieldUpdateItemAccessArgs, UpdateListItemAccessControl, ListOperationAccessControl, ListFilterAccessControl, KeystoneContext } from '../../types';
import { InitialisedList } from './types-for-lists';
import { InputFilter } from './where-inputs';
export declare function cannotForItem(operation: string, list: InitialisedList): string;
export declare function cannotForItemFields(operation: string, list: InitialisedList, fieldsDenied: string[]): string;
export declare function getOperationAccess(list: InitialisedList, context: KeystoneContext, operation: 'delete' | 'create' | 'update' | 'query'): Promise<boolean>;
export declare function getAccessFilters(list: InitialisedList, context: KeystoneContext, operation: keyof typeof list.access.filter): Promise<boolean | InputFilter>;
export declare type ResolvedFieldAccessControl = {
    create: IndividualFieldAccessControl<FieldCreateItemAccessArgs<BaseListTypeInfo>>;
    read: IndividualFieldAccessControl<FieldReadItemAccessArgs<BaseListTypeInfo>>;
    update: IndividualFieldAccessControl<FieldUpdateItemAccessArgs<BaseListTypeInfo>>;
};
export declare function parseFieldAccessControl(access: FieldAccessControl<BaseListTypeInfo> | undefined): ResolvedFieldAccessControl;
export declare type ResolvedListAccessControl = {
    operation: {
        query: ListOperationAccessControl<'query', BaseListTypeInfo>;
        create: ListOperationAccessControl<'create', BaseListTypeInfo>;
        update: ListOperationAccessControl<'update', BaseListTypeInfo>;
        delete: ListOperationAccessControl<'delete', BaseListTypeInfo>;
    };
    filter: {
        query: ListFilterAccessControl<'query', BaseListTypeInfo>;
        update: ListFilterAccessControl<'update', BaseListTypeInfo>;
        delete: ListFilterAccessControl<'delete', BaseListTypeInfo>;
    };
    item: {
        create: CreateListItemAccessControl<BaseListTypeInfo>;
        update: UpdateListItemAccessControl<BaseListTypeInfo>;
        delete: DeleteListItemAccessControl<BaseListTypeInfo>;
    };
};
export declare function parseListAccessControl(access: ListAccessControl<BaseListTypeInfo>): ResolvedListAccessControl;
