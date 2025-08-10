export type ExpoSettingsModuleEvents = {
    DFUStateChanged: (params: DFUStateChangedPayload) => void;
    DFUProgress: (params: DFUProgressPayload) => void;
};
export type DFUStateChangedPayload = {
    state: string;
    deviceAddress: string;
};
export type DFUProgressPayload = {
    deviceAddress: string;
    percent: number;
    speed: number;
    avgSpeed: number;
    currentPart: number;
    totalParts: number;
};
export type StartDFUParams = {
    deviceAddress: string;
    fileUri: string;
    packetReceiptNotificationParameter?: number;
    prepareDataObjectDelay?: number;
    disableResume?: boolean;
    forceScanningForNewAddressInLegacyDfu?: boolean;
    android?: {
        deviceName?: string;
        keepBond?: boolean;
        numberOfRetries?: number;
        rebootTime?: number;
        restoreBond?: boolean;
    };
    ios?: {
        connectionTimeout?: number;
    };
};
//# sourceMappingURL=ExpoNordicDfu.types.d.ts.map