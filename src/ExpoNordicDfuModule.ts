import { NativeModule, requireNativeModule } from 'expo';
import { ExpoSettingsModuleEvents } from './ExpoNordicDfu.types';

declare class ExpoNordicDfuModule extends NativeModule<ExpoSettingsModuleEvents> {
  startAndroidDfu(
    address: string,
    uri: string,
    name?: string,
    prepareDataObjectDelay?: number,
    retries?: number,
  ): Promise<void>;
  abortAndroidDfu(value: string): Promise<boolean>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoNordicDfuModule>('ExpoNordicDfu');
