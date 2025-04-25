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
            return await this.dfuModule.startIosDfu(params.deviceAddress, params.fileUri, params.ios?.connectionTimeout, params.ios?.disableResume, params.packetReceiptNotificationParameter, params.prepareDataObjectDelay);
        }
        else {
            return await this.dfuModule.startAndroidDfu(params.deviceAddress, params.fileUri, params.android?.deviceName, params.android?.keepBond, params.android?.numberOfRetries, params.packetReceiptNotificationParameter, params.prepareDataObjectDelay);
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
;
export default new CrossplatformWrapper(DfuModule);
//# sourceMappingURL=ExpoNordicDfuModule.js.map