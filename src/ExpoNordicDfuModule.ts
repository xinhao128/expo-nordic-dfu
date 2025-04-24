import { NativeModule, requireNativeModule } from 'expo';
import { ExpoSettingsModuleEvents, StartDFUParams } from './ExpoNordicDfu.types';
import { Platform } from 'react-native';

declare class ExpoNordicDfuModule extends NativeModule<ExpoSettingsModuleEvents> {
  startAndroidDfu(
    address: string,
    uri: string,
    name?: string,
    prepareDataObjectDelay?: number,
    retries?: number,
  ): Promise<void>;
  abortAndroidDfu(value: string): Promise<boolean>;
  startIosDfu(
    deviceAddress: string,
    fileUri: string,
    prepareDataObjectDelay?: number,
  ): Promise<void>;
  abortIosDfu(value: string): Promise<boolean>;
}

const DfuModule = requireNativeModule<ExpoNordicDfuModule>('ExpoNordicDfuModule');

class CrossplatformWrapper {
  constructor(private dfuModule: ExpoNordicDfuModule) {}

  get module() {
    return this.dfuModule;
  }

  async startDfu(params: StartDFUParams): Promise<void> {
    if (Platform.OS === 'ios') {
      return await this.dfuModule.startIosDfu(params.deviceAddress, params.file, params.prepareDataObjectDelay);
    } else {
      return await this.dfuModule.startAndroidDfu(params.deviceAddress, params.file, params.android?.deviceName, params.prepareDataObjectDelay, params.android?.retries);
    }
  }
};

export default new CrossplatformWrapper(DfuModule);
