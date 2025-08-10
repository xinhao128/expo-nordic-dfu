import { NativeModule } from 'expo';
import { ExpoSettingsModuleEvents, StartDFUParams } from './ExpoNordicDfu.types';
type DfuOptions = {
    disableResume?: boolean;
    forceScanningForNewAddressInLegacyDfu?: boolean;
    packetReceiptNotificationParameter?: number;
    prepareDataObjectDelay?: number;
};
type IosDfuOptions = {
    connectionTimeout?: number;
};
type AndroidDfuOptions = {
    deviceName?: string;
    keepBond?: boolean;
    numberOfRetries?: number;
    rebootTime?: number;
    restoreBond?: boolean;
};
declare class ExpoNordicDfuModule extends NativeModule<ExpoSettingsModuleEvents> {
    startAndroidDfu(deviceAddress: string, fileUri: string, options?: DfuOptions, androidOptions?: AndroidDfuOptions): Promise<void>;
    abortAndroidDfu(): Promise<void>;
    startIosDfu(deviceAddress: string, fileUri: string, options?: DfuOptions, iosOptions?: IosDfuOptions): Promise<void>;
    abortIosDfu(): Promise<void>;
}
declare class CrossplatformWrapper {
    private dfuModule;
    constructor(dfuModule: ExpoNordicDfuModule);
    get module(): ExpoNordicDfuModule;
    startDfu(params: StartDFUParams): Promise<void>;
    abortDfu(): Promise<void>;
}
declare const _default: CrossplatformWrapper;
export default _default;
//# sourceMappingURL=ExpoNordicDfuModule.d.ts.map