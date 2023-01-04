import { BaseListTypeInfo } from '../types';
import { AccessOperation, BaseAccessArgs } from '../types/config/access-control';
export declare function allowAll(): boolean;
export declare function denyAll(): boolean;
export declare function allOperations<ListTypeInfo extends BaseListTypeInfo>(func: (args: BaseAccessArgs<ListTypeInfo> & {
    operation: AccessOperation;
}) => boolean): {
    query: (args: BaseAccessArgs<ListTypeInfo> & {
        operation: AccessOperation;
    }) => boolean;
    create: (args: BaseAccessArgs<ListTypeInfo> & {
        operation: AccessOperation;
    }) => boolean;
    update: (args: BaseAccessArgs<ListTypeInfo> & {
        operation: AccessOperation;
    }) => boolean;
    delete: (args: BaseAccessArgs<ListTypeInfo> & {
        operation: AccessOperation;
    }) => boolean;
};
