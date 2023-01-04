export declare function setSkipWatching(): void;
export declare const dev: (cwd: string, shouldDropDatabase: boolean) => Promise<() => Promise<void>>;
