import { KeystoneConfig } from '../../types';
export declare function initConfig(config: KeystoneConfig): {
    lists: import("../../types").ListSchemaConfig;
    db: import("../../types").DatabaseConfig<import("../../types").BaseKeystoneTypeInfo>;
    ui?: import("../../types").AdminUIConfig<import("../../types").BaseKeystoneTypeInfo> | undefined;
    server?: import("../../types").ServerConfig<import("../../types").BaseKeystoneTypeInfo> | undefined;
    session?: import("../../types").SessionStrategy<any, never> | undefined;
    graphql?: import("../../types").GraphQLConfig | undefined;
    extendGraphqlSchema?: import("../../types").ExtendGraphqlSchema | undefined;
    storage?: Record<string, import("../../types").StorageConfig> | undefined;
    telemetry?: boolean | undefined;
    experimental?: {
        generateNextGraphqlAPI?: boolean | undefined;
        contextInitialisedLists?: boolean | undefined;
    } | undefined;
};
