import { CommonFieldConfig, BaseListTypeInfo, FieldTypeFunc } from '@keystone-6/core/types';
import { graphql } from '@keystone-6/core';
declare type CloudinaryImageFieldConfig<ListTypeInfo extends BaseListTypeInfo> = CommonFieldConfig<ListTypeInfo> & {
    cloudinary: {
        cloudName: string;
        apiKey: string;
        apiSecret: string;
        folder?: string;
    };
    db?: {
        map?: string;
    };
};
declare const CloudinaryImageFormat: graphql.InputObjectType<{
    prettyName: graphql.Arg<graphql.ScalarType<string>, false>;
    width: graphql.Arg<graphql.ScalarType<string>, false>;
    height: graphql.Arg<graphql.ScalarType<string>, false>;
    crop: graphql.Arg<graphql.ScalarType<string>, false>;
    aspect_ratio: graphql.Arg<graphql.ScalarType<string>, false>;
    gravity: graphql.Arg<graphql.ScalarType<string>, false>;
    zoom: graphql.Arg<graphql.ScalarType<string>, false>;
    x: graphql.Arg<graphql.ScalarType<string>, false>;
    y: graphql.Arg<graphql.ScalarType<string>, false>;
    format: graphql.Arg<graphql.ScalarType<string>, false>;
    fetch_format: graphql.Arg<graphql.ScalarType<string>, false>;
    quality: graphql.Arg<graphql.ScalarType<string>, false>;
    radius: graphql.Arg<graphql.ScalarType<string>, false>;
    angle: graphql.Arg<graphql.ScalarType<string>, false>;
    effect: graphql.Arg<graphql.ScalarType<string>, false>;
    opacity: graphql.Arg<graphql.ScalarType<string>, false>;
    border: graphql.Arg<graphql.ScalarType<string>, false>;
    background: graphql.Arg<graphql.ScalarType<string>, false>;
    overlay: graphql.Arg<graphql.ScalarType<string>, false>;
    underlay: graphql.Arg<graphql.ScalarType<string>, false>;
    default_image: graphql.Arg<graphql.ScalarType<string>, false>;
    delay: graphql.Arg<graphql.ScalarType<string>, false>;
    color: graphql.Arg<graphql.ScalarType<string>, false>;
    color_space: graphql.Arg<graphql.ScalarType<string>, false>;
    dpr: graphql.Arg<graphql.ScalarType<string>, false>;
    page: graphql.Arg<graphql.ScalarType<string>, false>;
    density: graphql.Arg<graphql.ScalarType<string>, false>;
    flags: graphql.Arg<graphql.ScalarType<string>, false>;
    transformation: graphql.Arg<graphql.ScalarType<string>, false>;
}>;
declare type CloudinaryImage_File = {
    id: string | null;
    filename: string | null;
    originalFilename: string | null;
    mimetype: string | null;
    encoding: string | null;
    publicUrl: string | null;
    publicUrlTransformed: (args: {
        transformation: graphql.InferValueFromArg<graphql.Arg<typeof CloudinaryImageFormat>>;
    }) => string | null;
};
export declare const outputType: import("@graphql-ts/schema").ObjectType<CloudinaryImage_File, graphql.Context>;
export declare const cloudinaryImage: <ListTypeInfo extends BaseListTypeInfo>({ cloudinary, ...config }: CloudinaryImageFieldConfig<ListTypeInfo>) => FieldTypeFunc<ListTypeInfo>;
export {};
