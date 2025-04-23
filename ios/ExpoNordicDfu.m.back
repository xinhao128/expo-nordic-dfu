#import "RNNordicDfu.h"
#import <CoreBluetooth/CoreBluetooth.h>
@import NordicDFU;

static CBCentralManager * (^getCentralManager)(void);
static void (^onDFUComplete)(void);
static void (^onDFUError)(void);

@implementation RNNordicDfu

RCT_EXPORT_MODULE();

NSString * const DFUProgressEvent = @"DFUProgress";
NSString * const DFUStateChangedEvent = @"DFUStateChanged";

- (NSArray<NSString *> *)supportedEvents {
  return @[DFUProgressEvent, DFUStateChangedEvent];
}

- (NSString *)stateDescription:(DFUState)state {
  switch (state) {
    case DFUStateAborted: return @"DFU_ABORTED";
    case DFUStateStarting: return @"DFU_PROCESS_STARTING";
    case DFUStateCompleted: return @"DFU_COMPLETED";
    case DFUStateUploading: return @"DFU_STATE_UPLOADING";
    case DFUStateConnecting: return @"CONNECTING";
    case DFUStateValidating: return @"FIRMWARE_VALIDATING";
    case DFUStateDisconnecting: return @"DEVICE_DISCONNECTING";
    case DFUStateEnablingDfuMode: return @"ENABLING_DFU_MODE";
    default: return @"UNKNOWN_STATE";
  }
}

- (NSString *)errorDescription:(DFUError)error {
  return [NSString stringWithFormat:@"DFUErrorCode_%ld", (long)error];
}

- (void)dfuStateDidChangeTo:(DFUState)state {
  NSDictionary *body = @{
    @"deviceAddress": self.deviceAddress ?: @"",
    @"state": [self stateDescription:state],
  };

  [self sendEventWithName:DFUStateChangedEvent body:body];

  if (state == DFUStateCompleted) {
    if (onDFUComplete) onDFUComplete();
    self.resolve(@{@"deviceAddress": self.deviceAddress ?: @""});
  }
}

- (void)dfuError:(DFUError)error didOccurWithMessage:(nonnull NSString *)message {
  if (onDFUError) onDFUError();

  [self sendEventWithName:DFUStateChangedEvent body:@{
    @"deviceAddress": self.deviceAddress ?: @"",
    @"state": @"DFU_FAILED"
  }];

  self.reject([self errorDescription:error], message, nil);
}

- (void)dfuProgressDidChangeFor:(NSInteger)part
                          outOf:(NSInteger)totalParts
                             to:(NSInteger)progress
     currentSpeedBytesPerSecond:(double)currentSpeedBytesPerSecond
         avgSpeedBytesPerSecond:(double)avgSpeedBytesPerSecond {
  NSDictionary *body = @{
    @"deviceAddress": self.deviceAddress ?: @"",
    @"currentPart": @(part),
    @"partsTotal": @(totalParts),
    @"percent": @(progress),
    @"speed": @(currentSpeedBytesPerSecond),
    @"avgSpeed": @(avgSpeedBytesPerSecond)
  };

  [self sendEventWithName:DFUProgressEvent body:body];
}

- (void)logWith:(LogLevel)level message:(nonnull NSString *)message {
  NSLog(@"[NordicDFU][%ld] %@", (long)level, message);
}

RCT_EXPORT_METHOD(startDFUiOS:(NSString *)deviceAddress
                  deviceName:(NSString *)deviceName
                  filePath:(NSString *)filePath
                  packetReceiptNotificationParameter:(NSInteger)packetReceiptNotificationParameter
                  alternativeAdvertisingNameEnabled:(BOOL)alternativeAdvertisingNameEnabled
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  self.deviceAddress = deviceAddress;
  self.resolve = resolve;
  self.reject = reject;

  if (!getCentralManager) {
    reject(@"nil_central_manager_getter", @"Attempted to start DFU without central manager getter", nil);
    return;
  }

  CBCentralManager *centralManager = getCentralManager();
  if (!centralManager) {
    reject(@"nil_central_manager", @"Call to getCentralManager returned nil", nil);
    return;
  }

  if (!deviceAddress || !filePath) {
    reject(@"invalid_parameters", @"deviceAddress and filePath are required", nil);
    return;
  }

  NSUUID *uuid = [[NSUUID alloc] initWithUUIDString:deviceAddress];
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
    NSArray<CBPeripheral *> *peripherals = [centralManager retrievePeripheralsWithIdentifiers:@[uuid]];
    CBPeripheral *peripheral = peripherals.firstObject;

    if (!peripheral) {
      reject(@"unable_to_find_device", @"Could not find device with deviceAddress", nil);
      return;
    }

    @try {
      NSURL *url = [NSURL URLWithString:filePath];
      DFUFirmware *firmware;
      NSError *initError;
      NSString *extension = [url pathExtension];

      if ([extension caseInsensitiveCompare:@"bin"] == NSOrderedSame ||
          [extension caseInsensitiveCompare:@"hex"] == NSOrderedSame) {
        firmware = [[DFUFirmware alloc] initWithUrlToBinOrHexFile:url urlToDatFile:nil type:4 error:&initError];
      } else {
        firmware = [[DFUFirmware alloc] initWithUrlToZipFile:url error:&initError];
      }

      if (initError || !firmware) {
        reject(@"invalid_firmware", @"Could not create DFUFirmware instance", initError);
        return;
      }

      DFUServiceInitiator *initiator = [[[DFUServiceInitiator alloc]
        initWithCentralManager:centralManager
                       target:peripheral]
        withFirmware:firmware];

      initiator.logger = self;
      initiator.delegate = self;
      initiator.progressDelegate = self;
      initiator.packetReceiptNotificationParameter = packetReceiptNotificationParameter;
      initiator.alternativeAdvertisingNameEnabled = alternativeAdvertisingNameEnabled;
      initiator.connectionTimeout = 20.0;

      self.controller = [initiator startWithTarget:peripheral];

    } @catch (NSException *exception) {
      NSLog(@"DFU Exception: %@", exception.reason);
      reject(@"firmware_init_exception", exception.reason, nil);
    }
  });
}

RCT_EXPORT_METHOD(abortDFU:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  if (self.controller) {
    BOOL aborted = [self.controller abort];
    self.controller = nil;
    resolve(@(aborted));
  } else {
    reject(@"no_controller", @"No DFU controller available", nil);
  }
}

+ (void)setCentralManagerGetter:(CBCentralManager * _Nonnull (^)(void))getter {
  getCentralManager = getter;
}

+ (void)setOnDFUComplete:(void (^ _Nonnull)(void))onComplete {
  onDFUComplete = onComplete;
}

+ (void)setOnDFUError:(void (^ _Nonnull)(void))onError {
  onDFUError = onError;
}

@end
