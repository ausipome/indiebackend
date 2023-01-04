/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@keystone-ui/core';
import { FieldGroupMeta, FieldMeta } from '../../types';
import { Value } from '.';
declare type FieldsProps = {
    fields: Record<string, FieldMeta>;
    groups?: FieldGroupMeta[];
    value: Value;
    fieldModes?: Record<string, 'hidden' | 'edit' | 'read'> | null;
    fieldPositions?: Record<string, 'form' | 'sidebar'> | null;
    forceValidation: boolean;
    position?: 'form' | 'sidebar';
    invalidFields: ReadonlySet<string>;
    onChange(value: (value: Value) => Value): void;
};
export declare function Fields({ fields, value, fieldModes, fieldPositions, forceValidation, invalidFields, position, groups, onChange, }: FieldsProps): jsx.JSX.Element;
export {};
