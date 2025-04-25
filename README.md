# Expo Nordic DFU

*Note*: First release is not out yet!

This project was highly inspired by the original React Native project at [Pilloxa/react-native-nordic-dfu](https://github.com/Pilloxa/react-native-nordic-dfu). We continued the work so it functions with modern [Expo](http://expo.dev/) projects that use [Expo Modules](https://docs.expo.dev/modules/overview/).

This module allows you to perform a Device Firmware Update (DFU) for Nordic Semiconductors on Expo React Native bridgeless projects. It wraps the official libraries at [NordicSemiconductor/Android-DFU-Library](https://github.com/NordicSemiconductor/Android-DFU-Library) and [NordicSemiconductor/IOS-DFU-Library](https://github.com/NordicSemiconductor/IOS-DFU-Library).

Our intention is to maintain this code for modern Expo projects only. We will not officially support old Expo SDKs. Please keep in mind the our availability to maintain this fork is limited and is based on our project needs.

This project does not provide an interface for scanning/connecting devices via BLE. Check the example app for libraries that can do that.

## Requirements

- Nordic zip firmware file
- Android 14 or 15
- iOS 17 or 18
- Expo SDK 52
- React Native Bridgeless (new architecture) enabled

## Usage

Please checkout the [example app](example)!

### Bluetooth permissions

You need the various Bluetooth permission enabled on Expo project. If you use a Bluetooth management library like [react-native-ble-manager](https://github.com/innoveit/react-native-ble-manager), this might be done for you. For android, you also need Foreground services enabled for the DFU process.

```typescript
// Expo app.json

// Android
expo.android.permissions: [
  "android.permission.FOREGROUND_SERVICE",
  "android.permission.FOREGROUND_SERVICE_CONNECTED_DEVICE",
  "android.permission.BLUETOOTH",
  "android.permission.BLUETOOTH_ADMIN",
  "android.permission.BLUETOOTH_CONNECT"
]

// iOS

```


## Contributing

Before we can accept a pull request from you, you'll need to read and agree to our [Contributor License Agreement (CLA)](https://github.com/getquip/expo-nordic-dfu/blob/main/CONTRIBUTING.md).
