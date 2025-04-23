package com.getquip.nordic

import android.app.Activity
import android.content.Intent
import android.os.Bundle

class NotificationActivity : Activity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // If this is the root activity, the app isn't running
    if (isTaskRoot) {
      val launchIntent = packageManager.getLaunchIntentForPackage(packageName)?.apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        putExtras(intent?.extras ?: Bundle())
      }

      if (launchIntent != null) {
        startActivity(launchIntent)
      }
    }

    finish()
  }
}
