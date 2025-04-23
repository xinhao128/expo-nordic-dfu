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
export type DFUStartParams = {};
//# sourceMappingURL=ExpoNordicDfu.types.d.ts.map