/** @jsxRuntime classic */
/** @jsx jsx */
import 'intersection-observer';
import { jsx } from '@keystone-ui/core';
import { ListMeta } from '../../../../types';
export declare function useFilter(search: string, list: ListMeta, searchFields: string[]): {
    OR: Record<string, any>[];
};
export declare const RelationshipSelect: ({ autoFocus, controlShouldRenderValue, isDisabled, isLoading, labelField, searchFields, list, placeholder, portalMenu, state, extraSelection, }: {
    autoFocus?: boolean | undefined;
    controlShouldRenderValue: boolean;
    isDisabled: boolean;
    isLoading?: boolean | undefined;
    labelField: string;
    searchFields: string[];
    list: ListMeta;
    placeholder?: string | undefined;
    portalMenu?: true | undefined;
    state: {
        kind: 'many';
        value: {
            label: string;
            id: string;
            data?: Record<string, any>;
        }[];
        onChange(value: {
            label: string;
            id: string;
            data: Record<string, any>;
        }[]): void;
    } | {
        kind: 'one';
        value: {
            label: string;
            id: string;
            data?: Record<string, any>;
        } | null;
        onChange(value: {
            label: string;
            id: string;
            data: Record<string, any>;
        } | null): void;
    };
    extraSelection?: string | undefined;
}) => jsx.JSX.Element;
