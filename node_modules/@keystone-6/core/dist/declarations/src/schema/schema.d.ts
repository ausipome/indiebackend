import type { BaseFields, BaseListTypeInfo, KeystoneConfig, BaseKeystoneTypeInfo, ListConfig } from '../types';
export declare function config<TypeInfo extends BaseKeystoneTypeInfo>(config: KeystoneConfig<TypeInfo>): KeystoneConfig<TypeInfo>;
export declare function group<Fields extends BaseFields<ListTypeInfo>, ListTypeInfo extends BaseListTypeInfo>(config: {
    label: string;
    description?: string;
    fields: Fields;
}): Fields;
export declare function list<Fields extends BaseFields<ListTypeInfo>, ListTypeInfo extends BaseListTypeInfo>(config: ListConfig<ListTypeInfo, Fields>): ListConfig<ListTypeInfo, any>;
