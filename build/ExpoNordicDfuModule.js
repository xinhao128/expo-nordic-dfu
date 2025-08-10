import { requireNativeModule } from 'expo';
import { Platform } from 'react-native';
const DfuModule = requireNativeModule('ExpoNordicDfuModule');
class CrossplatformWrapper {
    dfuModule;
    constructor(dfuModule) {
        this.dfuModule = dfuModule;
    }
    get module() {
        return this.dfuModule;
    }
    async startDfu(params) {
        if (Platform.OS === 'ios') {
            return await this.dfuModule.startIosDfu(params.deviceAddress, params.fileUri, {
                disableResume: params.disableResume,
                forceScanningForNewAddressInLegacyDfu: params.forceScanningForNewAddressInLegacyDfu,
                packetReceiptNotificationParameter: params.packetReceiptNotificationParameter,
                prepareDataObjectDelay: params.prepareDataObjectDelay,
            }, {
                connectionTimeout: params.ios?.connectionTimeout,
            });
        }
        else {
            return await this.dfuModule.startAndroidDfu(params.deviceAddress, params.fileUri, {
                disableResume: params.disableResume,
                forceScanningForNewAddressInLegacyDfu: params.forceScanningForNewAddressInLegacyDfu,
                packetReceiptNotificationParameter: params.packetReceiptNotificationParameter,
                prepareDataObjectDelay: params.prepareDataObjectDelay,
            }, {
                deviceName: params.android?.deviceName,
                keepBond: params.android?.keepBond,
                numberOfRetries: params.android?.numberOfRetries,
                // See android/src/main/java/com/getquip/nordic/ExpoNordicDfuModule.kt
                rebootTime: params.android?.rebootTime,
                restoreBond: params.android?.restoreBond,
            });
        }
    }
    async abortDfu() {
        if (Platform.OS === 'ios') {
            return await this.dfuModule.abortIosDfu();
        }
        else {
            return await this.dfuModule.abortAndroidDfu();
        }
    }
}
export default new CrossplatformWrapper(DfuModule);
//# sourceMappingURL=ExpoNordicDfuModule.js.map