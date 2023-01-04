import express from 'express';
import type { KeystoneConfig, KeystoneContext } from '../../types';
declare type NextApp = {
    prepare(): Promise<void>;
    getRequestHandler(): express.Application;
    render(req: express.Request, res: express.Response, url: string): void;
};
export declare function getNextApp(dev: boolean, projectAdminPath: string): Promise<NextApp>;
export declare function createAdminUIMiddlewareWithNextApp(config: KeystoneConfig, commonContext: KeystoneContext, nextApp: NextApp): (req: express.Request, res: express.Response) => Promise<void>;
export declare function createAdminUIMiddleware(config: KeystoneConfig, context: KeystoneContext, dev: boolean, projectAdminPath: string): Promise<(req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: express.Response<any, Record<string, any>>) => Promise<void>>;
export {};
