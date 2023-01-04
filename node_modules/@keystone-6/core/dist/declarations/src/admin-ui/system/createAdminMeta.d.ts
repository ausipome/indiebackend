import { KeystoneConfig, MaybePromise, BaseListTypeInfo, KeystoneContext, JSONValue, MaybeItemFunction } from '../../types';
import { InitialisedList } from '../../lib/core/types-for-lists';
declare type ContextFunction<Return> = (context: KeystoneContext) => MaybePromise<Return>;
export declare type FieldMetaRootVal = {
    key: string;
    /**
     * @deprecated use .key, not .path
     */
    path: string;
    label: string;
    description: string | null;
    fieldMeta: JSONValue | null;
    viewsIndex: number;
    customViewsIndex: number | null;
    listKey: string;
    search: 'default' | 'insensitive' | null;
    isOrderable: ContextFunction<boolean>;
    isFilterable: ContextFunction<boolean>;
    createView: {
        fieldMode: ContextFunction<'edit' | 'hidden'>;
    };
    itemView: {
        fieldMode: MaybeItemFunction<'edit' | 'read' | 'hidden', BaseListTypeInfo>;
        fieldPosition: MaybeItemFunction<'form' | 'sidebar', BaseListTypeInfo>;
    };
    listView: {
        fieldMode: ContextFunction<'read' | 'hidden'>;
    };
};
export declare type FieldGroupMeta = {
    label: string;
    description: string | null;
    fields: Array<FieldMetaRootVal>;
};
export declare type ListMetaRootVal = {
    key: string;
    path: string;
    label: string;
    singular: string;
    plural: string;
    initialColumns: string[];
    pageSize: number;
    labelField: string;
    initialSort: {
        field: string;
        direction: 'ASC' | 'DESC';
    } | null;
    fields: FieldMetaRootVal[];
    fieldsByKey: Record<string, FieldMetaRootVal>;
    groups: Array<FieldGroupMeta>;
    itemQueryName: string;
    listQueryName: string;
    description: string | null;
    isHidden: ContextFunction<boolean>;
    hideCreate: ContextFunction<boolean>;
    hideDelete: ContextFunction<boolean>;
    isSingleton: boolean;
};
export declare type AdminMetaRootVal = {
    lists: ListMetaRootVal[];
    listsByKey: Record<string, ListMetaRootVal>;
    views: string[];
    isAccessAllowed: undefined | ((context: KeystoneContext) => MaybePromise<boolean>);
};
export declare function createAdminMeta(config: KeystoneConfig, initialisedLists: Record<string, InitialisedList>): AdminMetaRootVal;
export declare function getAdminMetaForRelationshipField(): AdminMetaRootVal;
export {};
