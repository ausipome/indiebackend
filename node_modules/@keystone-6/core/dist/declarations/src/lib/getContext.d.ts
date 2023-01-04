import { BaseKeystoneTypeInfo, KeystoneConfig, KeystoneContext } from '../types';
export declare function getContext<TypeInfo extends BaseKeystoneTypeInfo>(config: KeystoneConfig<TypeInfo>, PrismaModule: unknown): KeystoneContext<TypeInfo>;
