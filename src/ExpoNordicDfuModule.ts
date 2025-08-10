import { NativeModule, requireNativeModule } from 'expo'
import { ExpoSettingsModuleEvents, StartDFUParams } from './ExpoNordicDfu.types'
import { Platform } from 'react-native'

type DfuOptions = {
  disableResume?: boolean
  forceScanningForNewAddressInLegacyDfu?: boolean
  packetReceiptNotificationParameter?: number
  prepareDataObjectDelay?: number
}

type IosDfuOptions = {
  connectionTimeout?: number
}

type AndroidDfuOptions = {
  deviceName?: string
  keepBond?: boolean
  numberOfRetries?: number
  rebootTime?: number
  restoreBond?: boolean
}

declare class ExpoNordicDfuModule extends NativeModule<ExpoSettingsModuleEvents> {
  startAndroidDfu(
    deviceAddress: string,
    fileUri: string,
    options?: DfuOptions,
    androidOptions?: AndroidDfuOptions
  ): Promise<void>
  abortAndroidDfu(): Promise<void>
  startIosDfu(deviceAddress: string, fileUri: string, options?: DfuOptions, iosOptions?: IosDfuOptions): Promise<void>
  abortIosDfu(): Promise<void>
}

const DfuModule = requireNativeModule<ExpoNordicDfuModule>('ExpoNordicDfuModule')

class CrossplatformWrapper {
  constructor(private dfuModule: ExpoNordicDfuModule) {}

  get module() {
    return this.dfuModule
  }

  async startDfu(params: StartDFUParams): Promise<void> {
    if (Platform.OS === 'ios') {
      return await this.dfuModule.startIosDfu(
        params.deviceAddress,
        params.fileUri,
        {
          disableResume: params.disableResume,
          forceScanningForNewAddressInLegacyDfu: params.forceScanningForNewAddressInLegacyDfu,
          packetReceiptNotificationParameter: params.packetReceiptNotificationParameter,
          prepareDataObjectDelay: params.prepareDataObjectDelay,
        },
        {
          connectionTimeout: params.ios?.connectionTimeout,
        }
      )
    } else {
      return await this.dfuModule.startAndroidDfu(
        params.deviceAddress,
        params.fileUri,
        {
          disableResume: params.disableResume,
          forceScanningForNewAddressInLegacyDfu: params.forceScanningForNewAddressInLegacyDfu,
          packetReceiptNotificationParameter: params.packetReceiptNotificationParameter,
          prepareDataObjectDelay: params.prepareDataObjectDelay,
        },
        {
          deviceName: params.android?.deviceName,
          keepBond: params.android?.keepBond,
          numberOfRetries: params.android?.numberOfRetries,
          // See android/src/main/java/com/getquip/nordic/ExpoNordicDfuModule.kt
          rebootTime: params.android?.rebootTime,
          restoreBond: params.android?.restoreBond,
        }
      )
    }
  }

  async abortDfu(): Promise<void> {
    if (Platform.OS === 'ios') {
      return await this.dfuModule.abortIosDfu()
    } else {
      return await this.dfuModule.abortAndroidDfu()
    }
  }
}

export default new CrossplatformWrapper(DfuModule)
