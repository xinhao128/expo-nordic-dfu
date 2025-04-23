package com.getquip.nordic

import android.app.NotificationManager
import android.content.Context
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.annotation.RequiresApi
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import no.nordicsemi.android.dfu.*
import androidx.core.net.toUri
import no.nordicsemi.android.dfu.DfuServiceInitiator.createDfuNotificationChannel

class ExpoNordicDfuModule : Module() {
    private var controller: DfuServiceController? = null
    private var currentPromise: Promise? = null
    private lateinit var context: Context

    @RequiresApi(Build.VERSION_CODES.O)
    override fun definition() = ModuleDefinition {
        Name("ExpoNordicDfuModule")

        Events("DFUStateChanged", "DFUProgress")

        OnStartObserving {
            DfuServiceListenerHelper.registerProgressListener(
                requireNotNull(appContext.reactContext),
                dfuProgressListener
            )
        }

        OnStopObserving {
            DfuServiceListenerHelper.unregisterProgressListener(
                requireNotNull(appContext.reactContext),
                dfuProgressListener
            )
        }

        AsyncFunction("startAndroidDfu") {
            address: String,
            uri: String,
            name: String?,
            prepareDataObjectDelay: Long?,
            retries: Int?,
            promise: Promise ->

            context = requireNotNull(appContext.reactContext)
            currentPromise = promise

            val starter = DfuServiceInitiator(address).apply {
                setZip(uri.toUri())
                createDfuNotificationChannel(context)
                setKeepBond(false)
                // If you want to have experimental buttonless DFU feature (DFU from SDK 12.x only!) supported call
                // but be aware of this: https://devzone.nordicsemi.com/question/100609/sdk-12-bootloader-erased-after-programming/
                // and other issues related to this experimental service.
                setUnsafeExperimentalButtonlessServiceInSecureDfuEnabled(true)
                // The device name is not required
                name?.let { setDeviceName(it) }
                // For DFU bootloaders from SDK 15 and 16 it may be required to add a delay before sending each
                // data packet. This delay gives the DFU target more time to prepare flash memory, causing less
                // packets being dropped and more reliable transfer. Detection of packets being lost would cause
                // automatic switch to PRN = 1, making the DFU very slow (but reliable).
                prepareDataObjectDelay?.let { setPrepareDataObjectDelay(it) }
                retries?.let { setNumberOfRetries(it) }
            }
            controller = starter.start(context, DfuService::class.java)
        }

        AsyncFunction("abortAndroidDfu") { promise: Promise ->
            controller?.let {
                it.abort()
                promise.resolve(it.isAborted)
            } ?: run { promise.reject("10", "Controller not set, use startDfu first", null) }
        }
    }

    private val dfuProgressListener = object : DfuProgressListenerAdapter() {
        override fun onDeviceConnecting(deviceAddress: String) =
            emitState("CONNECTING", deviceAddress)

        override fun onDeviceConnected(deviceAddress: String) =
            emitState("CONNECTED", deviceAddress)

        override fun onDfuProcessStarting(deviceAddress: String) =
            emitState("DFU_PROCESS_STARTING", deviceAddress)

        override fun onDfuProcessStarted(deviceAddress: String) =
            emitState("DFU_PROCESS_STARTED", deviceAddress)

        override fun onEnablingDfuMode(deviceAddress: String) =
            emitState("ENABLING_DFU_MODE", deviceAddress)

        override fun onProgressChanged(
            deviceAddress: String,
            percent: Int,
            speed: Float,
            avgSpeed: Float,
            currentPart: Int,
            partsTotal: Int
        ) {
            sendEvent(
                "DFUProgress",
                mapOf(
                    "deviceAddress" to deviceAddress,
                    "percent" to percent,
                    "speed" to speed,
                    "avgSpeed" to avgSpeed,
                    "currentPart" to currentPart,
                    "partsTotal" to partsTotal
                )
            )
        }

        override fun onFirmwareValidating(deviceAddress: String) =
            emitState("FIRMWARE_VALIDATING", deviceAddress)

        override fun onDeviceDisconnecting(deviceAddress: String) =
            emitState("DEVICE_DISCONNECTING", deviceAddress)

        override fun onDeviceDisconnected(deviceAddress: String) =
            emitState("DEVICE_DISCONNECTED", deviceAddress)

        override fun onDfuCompleted(deviceAddress: String) {
            currentPromise?.resolve(mapOf("deviceAddress" to deviceAddress))
            emitState("DFU_COMPLETED", deviceAddress)
            cleanUpNotifications()
            currentPromise = null
        }

        override fun onDfuAborted(deviceAddress: String) {
            emitState("DFU_ABORTED", deviceAddress)
            currentPromise?.reject("2", "DFU ABORTED", null)
            cleanUpNotifications()
            currentPromise = null
        }

        override fun onError(
                deviceAddress: String,
                error: Int,
                errorType: Int,
                message: String
        ) {
            emitState("DFU_FAILED", deviceAddress)
            val combinedMessage = "Error: $error, Error Type: $errorType, Message: $message"
            currentPromise?.reject(error.toString(), combinedMessage, null)
            cleanUpNotifications()
            currentPromise = null
        }
    }

    private fun cleanUpNotifications() {
        Handler(Looper.getMainLooper()).postDelayed({
            // Cancel any existing DFU notification
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.cancel(DfuBaseService.NOTIFICATION_ID)
        }, 500) // 0.5 second delay
    }

    private fun emitState(state: String, deviceAddress: String) {
        Log.d("NordicDfu", "State: $state")
        sendEvent("DFUStateChanged", mapOf("state" to state, "deviceAddress" to deviceAddress))
    }
}
