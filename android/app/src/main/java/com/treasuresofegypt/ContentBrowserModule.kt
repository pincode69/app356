package com.treasuresofegypt.bookofdesert.thegodisra

import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import androidx.browser.customtabs.CustomTabsIntent
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ContentBrowserModule(
  private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "ContentBrowser"

  @ReactMethod
  fun open(url: String, promise: Promise) {
    try {
      val activity = reactContext.currentActivity
      if (activity == null) {
        promise.reject("E_NO_ACTIVITY", "Activity is not available")
        return
      }

      val customTabsIntent = CustomTabsIntent.Builder()
        .setShowTitle(true)
        .setUrlBarHidingEnabled(true)
        .build()

      val packageName = resolveBrowserPackage()
      if (packageName != null) {
        customTabsIntent.intent.setPackage(packageName)
      }

      // After the tab is dismissed, MainActivity will finish the task.
      awaitingReturn = true
      leftForBrowser = false

      customTabsIntent.launchUrl(activity, Uri.parse(url))
      promise.resolve(true)
    } catch (error: Exception) {
      awaitingReturn = false
      leftForBrowser = false
      promise.reject("E_OPEN_FAILED", error.message, error)
    }
  }

  private fun resolveBrowserPackage(): String? {
    val pm = reactContext.packageManager
    val candidates = listOf(
      "com.android.chrome",
      "com.chrome.beta",
      "com.chrome.dev",
      "com.google.android.apps.chrome",
    )

    for (candidate in candidates) {
      try {
        pm.getPackageInfo(candidate, 0)
        return candidate
      } catch (_: PackageManager.NameNotFoundException) {
      }
    }

    val serviceIntent = Intent("android.support.customtabs.action.CustomTabsService")
    val resolved = pm.queryIntentServices(serviceIntent, 0)
    return resolved.firstOrNull()?.serviceInfo?.packageName
  }

  companion object {
    @JvmField
    var awaitingReturn: Boolean = false

    @JvmField
    var leftForBrowser: Boolean = false
  }
}
