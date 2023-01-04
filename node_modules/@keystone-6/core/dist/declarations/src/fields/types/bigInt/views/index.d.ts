/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@keystone-ui/core';
import { CardValueComponent, CellComponent, FieldController, FieldControllerConfig, FieldProps } from '../../../../types';
declare type Validation = {
    isRequired: boolean;
    min: bigint;
    max: bigint;
};
declare type Value = {
    kind: 'create';
    value: string | bigint | null;
} | {
    kind: 'update';
    value: string | bigint | null;
    initial: unknown | null;
};
export declare const Field: ({ field, value, onChange, autoFocus, forceValidation, }: FieldProps<typeof controller>) => jsx.JSX.Element;
export declare const Cell: CellComponent;
export declare const CardValue: CardValueComponent;
export declare const controller: (config: FieldControllerConfig<{
    validation: {
        isRequired: boolean;
        min: string;
        max: string;
    };
    defaultValue: string | null | {
        kind: 'autoincrement';
    };
}>) => FieldController<Value, string> & {
    validation: Validation;
    hasAutoIncrementDefault: boolean;
};
export {};
