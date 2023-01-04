import type { JSONValue } from './utils';
import { KeystoneContext } from '.';
export declare type SessionStrategy<StoredSessionData, StartSessionData = never> = {
    get: (args: {
        context: KeystoneContext;
    }) => Promise<StoredSessionData | undefined>;
    start: (args: {
        data: StoredSessionData | StartSessionData;
        context: KeystoneContext;
    }) => Promise<unknown>;
    end: (args: {
        context: KeystoneContext;
    }) => Promise<unknown>;
};
export declare type SessionStore = {
    get(key: string): undefined | JSONValue | Promise<JSONValue | undefined>;
    set(key: string, value: JSONValue): any | Promise<void>;
    delete(key: string): void | boolean | Promise<void>;
};
export declare type SessionStoreFunction = (args: {
    /**
     * The number of seconds that a cookie session be valid for
     */
    maxAge: number;
}) => SessionStore;
