package com.treasuresofegypt.bookofdesert.thegodisra

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "TreasuresOfEgypt"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onStop() {
    super.onStop()
    if (ContentBrowserModule.awaitingReturn) {
      ContentBrowserModule.leftForBrowser = true
    }
  }

  override fun onResume() {
    super.onResume()
    if (ContentBrowserModule.awaitingReturn && ContentBrowserModule.leftForBrowser) {
      ContentBrowserModule.awaitingReturn = false
      ContentBrowserModule.leftForBrowser = false
      finishAndRemoveTask()
    }
  }
}
