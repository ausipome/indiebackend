import { graphql } from '../../..';
import { InitialisedList } from '../types-for-lists';
export declare function getQueriesForList(list: InitialisedList): {
    [x: string]: import("@graphql-ts/schema").Field<unknown, import("../../../types").FindManyArgs, graphql.ListType<graphql.NonNullType<graphql.ObjectType<import("../../../types").BaseItem>>>, string, import("../../../types").KeystoneContext<import("../../../types").BaseKeystoneTypeInfo>> | import("@graphql-ts/schema").Field<unknown, {
        where: graphql.Arg<graphql.NonNullType<graphql.InputObjectType<{
            [key: string]: graphql.Arg<graphql.NullableInputType, boolean>;
            id: graphql.Arg<graphql.ScalarType<string>, boolean>;
        }>>, boolean>;
    }, graphql.ObjectType<import("../../../types").BaseItem>, string, import("../../../types").KeystoneContext<import("../../../types").BaseKeystoneTypeInfo>> | import("@graphql-ts/schema").Field<unknown, {
        where: graphql.Arg<graphql.NonNullType<{
            kind: "input";
            __fields: Record<string, graphql.Arg<graphql.InputType, boolean>>;
            __context: (context: unknown) => void;
            graphQLType: import("graphql").GraphQLInputObjectType;
        }>, true>;
    }, graphql.ScalarType<number>, string, import("../../../types").KeystoneContext<import("../../../types").BaseKeystoneTypeInfo>>;
};
