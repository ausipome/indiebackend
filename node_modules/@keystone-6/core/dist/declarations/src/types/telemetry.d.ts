import { DatabaseProvider } from './core';
export declare type Status = false | {
    lastSentDate?: string;
    informedAt: string;
};
export declare type Configuration = {
    telemetry: {
        device: Status;
        projects: {
            default: Status;
            [projectPath: string]: Status;
        };
    } | false | undefined;
};
export declare type Device = {
    previous: string | null;
    os: string;
    node: string;
};
export declare type PackageName = '@keystone-6/core' | '@keystone-6/auth' | '@keystone-6/fields-document' | '@keystone-6/cloudinary' | '@keystone-6/session-store-redis' | '@opensaas/keystone-nextjs-auth';
export declare type Project = {
    previous: string | null;
    versions: Partial<Record<PackageName, string>>;
    lists: number;
    database: DatabaseProvider;
    fields: {
        [key: string]: number;
    };
};
