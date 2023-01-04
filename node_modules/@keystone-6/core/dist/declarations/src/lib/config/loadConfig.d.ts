import { BuildOptions } from 'esbuild';
import { KeystoneConfig } from '../../types';
export declare function getEsbuildConfig(cwd: string): BuildOptions;
export declare function loadBuiltConfig(cwd: string): KeystoneConfig;
export declare function loadConfigOnce(cwd: string): Promise<KeystoneConfig>;
