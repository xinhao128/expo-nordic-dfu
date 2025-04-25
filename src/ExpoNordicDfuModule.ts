import { NativeModule, requireNativeModule } from 'expo';
import { ExpoSettingsModuleEvents, StartDFUParams } from './ExpoNordicDfu.types';
import { Platform } from 'react-native';

declare class ExpoNordicDfuModule extends NativeModule<ExpoSettingsModuleEvents> {
  startAndroidDfu(
    deviceAddress: string,
    fileUri: string,
    deviceName?: string,
    keepBond?: boolean,
    numberOfRetries?: number,
    packetReceiptNotificationParameter?: number,
    prepareDataObjectDelay?: number,
    rebootTime?: number,
    restoreBond?: boolean,
  ): Promise<void>;
  abortAndroidDfu(value: string): Promise<boolean>;
  startIosDfu(
    deviceAddress: string,
    fileUri: string,
    connectionTimeout?: number,
    disableResume?: boolean,
    packetReceiptNotificationParameter?: number,
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
      return await this.dfuModule.startIosDfu(
        params.deviceAddress,
        params.fileUri,
        params.ios?.connectionTimeout,
        params.ios?.disableResume,
        params.packetReceiptNotificationParameter,
        params.prepareDataObjectDelay,
      );
    } else {
      return await this.dfuModule.startAndroidDfu(
        params.deviceAddress,
        params.fileUri,
        params.android?.deviceName,
        params.android?.keepBond,
        params.android?.numberOfRetries,
        params.packetReceiptNotificationParameter,
        params.prepareDataObjectDelay,
        params.android?.rebootTime,
        params.android?.restoreBond,
      );
    }
  }

  async abortDfu(deviceAddress: string): Promise<boolean> {
    if (Platform.OS === 'ios') {
      return await this.dfuModule.abortIosDfu(deviceAddress);
    } else {
      return await this.dfuModule.abortAndroidDfu(deviceAddress);
    }
  }
};

export default new CrossplatformWrapper(DfuModule);
