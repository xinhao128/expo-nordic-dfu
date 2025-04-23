import { NativeModule } from 'expo';
import { ExpoSettingsModuleEvents } from './ExpoNordicDfu.types';
declare class ExpoNordicDfuModule extends NativeModule<ExpoSettingsModuleEvents> {
    startAndroidDfu(address: string, uri: string, name?: string, prepareDataObjectDelay?: number, retries?: number): Promise<void>;
    abortAndroidDfu(value: string): Promise<boolean>;
}
declare const _default: ExpoNordicDfuModule;
export default _default;
//# sourceMappingURL=ExpoNordicDfuModule.d.ts.map