import { JSONValue } from '../types';
export declare const staticAdminMetaQuery: import("graphql/language/ast").DocumentNode;
export declare type StaticAdminMetaQuery = {
    keystone: {
        __typename: 'KeystoneMeta';
        adminMeta: {
            __typename: 'KeystoneAdminMeta';
            lists: Array<{
                __typename: 'KeystoneAdminUIListMeta';
                key: string;
                itemQueryName: string;
                listQueryName: string;
                path: string;
                label: string;
                singular: string;
                plural: string;
                description: string | null;
                initialColumns: Array<string>;
                pageSize: number;
                labelField: string;
                isSingleton: boolean;
                initialSort: {
                    __typename: 'KeystoneAdminUISort';
                    field: string;
                    direction: KeystoneAdminUISortDirection;
                } | null;
                groups: Array<{
                    __typename: 'KeystoneAdminUIFieldGroupMeta';
                    label: string;
                    description: string | null;
                    fields: Array<{
                        __typename: 'KeystoneAdminUIFieldMeta';
                        path: string;
                    }>;
                }>;
                fields: Array<{
                    __typename: 'KeystoneAdminUIFieldMeta';
                    path: string;
                    label: string;
                    description: string | null;
                    fieldMeta: JSONValue | null;
                    viewsIndex: number;
                    customViewsIndex: number | null;
                    search: QueryMode | null;
                    itemView: {
                        __typename: 'KeystoneAdminUIFieldMetaItemView';
                        fieldPosition: KeystoneAdminUIFieldMetaItemViewFieldPosition | null;
                        fieldMode: KeystoneAdminUIFieldMetaItemViewFieldMode | null;
                    } | null;
                }>;
            }>;
        };
    };
};
declare type QueryMode = 'default' | 'insensitive';
declare type KeystoneAdminUIFieldMetaItemViewFieldMode = 'edit' | 'read' | 'hidden';
declare type KeystoneAdminUIFieldMetaItemViewFieldPosition = 'form' | 'sidebar';
declare type KeystoneAdminUISortDirection = 'ASC' | 'DESC';
export {};
