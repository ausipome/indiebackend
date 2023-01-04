import { graphql } from '../../..';
import { InitialisedList } from '../types-for-lists';
export declare function getMutationsForList(list: InitialisedList): {
    mutations: {
        [x: string]: import("@graphql-ts/schema").Field<unknown, {
            data: graphql.Arg<graphql.NonNullType<{
                kind: "input";
                __fields: Record<string, graphql.Arg<graphql.InputType, boolean>>;
                __context: (context: unknown) => void;
                graphQLType: import("graphql").GraphQLInputObjectType;
            }>, false>;
        }, graphql.ObjectType<import("../../../types").BaseItem>, string, import("../../../types").KeystoneContext<import("../../../types").BaseKeystoneTypeInfo>> | import("@graphql-ts/schema").Field<unknown, {
            data: graphql.Arg<graphql.NonNullType<graphql.ListType<graphql.NonNullType<{
                kind: "input";
                __fields: Record<string, graphql.Arg<graphql.InputType, boolean>>;
                __context: (context: unknown) => void;
                graphQLType: import("graphql").GraphQLInputObjectType;
            }>>>, false>;
        }, graphql.ListType<graphql.ObjectType<import("../../../types").BaseItem>>, string, import("../../../types").KeystoneContext<import("../../../types").BaseKeystoneTypeInfo>> | import("@graphql-ts/schema").Field<unknown, {
            where: graphql.Arg<graphql.NonNullType<graphql.InputObjectType<{
                [key: string]: graphql.Arg<graphql.NullableInputType, boolean>;
                id: graphql.Arg<graphql.ScalarType<string>, boolean>;
            }>>, boolean>;
            data: graphql.Arg<graphql.NonNullType<{
                kind: "input";
                __fields: Record<string, graphql.Arg<graphql.InputType, boolean>>;
                __context: (context: unknown) => void;
                graphQLType: import("graphql").GraphQLInputObjectType;
            }>, false>;
        }, graphql.ObjectType<import("../../../types").BaseItem>, string, import("../../../types").KeystoneContext<import("../../../types").BaseKeystoneTypeInfo>> | import("@graphql-ts/schema").Field<unknown, {
            data: graphql.Arg<graphql.NonNullType<graphql.ListType<graphql.NonNullType<graphql.InputObjectType<{
                where: graphql.Arg<graphql.NonNullType<graphql.InputObjectType<{
                    [key: string]: graphql.Arg<graphql.NullableInputType, boolean>;
                    id: graphql.Arg<graphql.ScalarType<string>, boolean>;
                }>>, boolean>;
                data: graphql.Arg<graphql.NonNullType<{
                    kind: "input";
                    __fields: Record<string, graphql.Arg<graphql.InputType, boolean>>;
                    __context: (context: unknown) => void;
                    graphQLType: import("graphql").GraphQLInputObjectType;
                }>, false>;
            }>>>>, false>;
        }, graphql.ListType<graphql.ObjectType<import("../../../types").BaseItem>>, string, import("../../../types").KeystoneContext<import("../../../types").BaseKeystoneTypeInfo>> | import("@graphql-ts/schema").Field<unknown, {
            where: graphql.Arg<graphql.NonNullType<graphql.InputObjectType<{
                [key: string]: graphql.Arg<graphql.NullableInputType, boolean>;
                id: graphql.Arg<graphql.ScalarType<string>, boolean>;
            }>>, boolean>;
        }, graphql.ObjectType<import("../../../types").BaseItem>, string, import("../../../types").KeystoneContext<import("../../../types").BaseKeystoneTypeInfo>> | import("@graphql-ts/schema").Field<unknown, {
            where: graphql.Arg<graphql.NonNullType<graphql.ListType<graphql.NonNullType<graphql.InputObjectType<{
                [key: string]: graphql.Arg<graphql.NullableInputType, boolean>;
                id: graphql.Arg<graphql.ScalarType<string>, boolean>;
            }>>>>, false>;
        }, graphql.ListType<graphql.ObjectType<import("../../../types").BaseItem>>, string, import("../../../types").KeystoneContext<import("../../../types").BaseKeystoneTypeInfo>>;
    };
    updateManyInput: graphql.InputObjectType<{
        where: graphql.Arg<graphql.NonNullType<graphql.InputObjectType<{
            [key: string]: graphql.Arg<graphql.NullableInputType, boolean>;
            id: graphql.Arg<graphql.ScalarType<string>, boolean>;
        }>>, boolean>;
        data: graphql.Arg<graphql.NonNullType<{
            kind: "input";
            __fields: Record<string, graphql.Arg<graphql.InputType, boolean>>;
            __context: (context: unknown) => void;
            graphQLType: import("graphql").GraphQLInputObjectType;
        }>, false>;
    }>;
};
