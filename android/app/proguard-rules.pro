# Keep line numbers for readable crash reports
-keepattributes SourceFile,LineNumberTable
-keepattributes *Annotation*
-keepattributes Signature,Exceptions,InnerClasses,EnclosingMethod

# --- React Native core ---
-keep,includedescriptorclasses class com.facebook.react.bridge.** { *; }
-keep,includedescriptorclasses class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.** { *; }
-dontwarn com.facebook.react.**
-dontwarn com.facebook.hermes.**

-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
    native <methods>;
}
-keepclassmembers class *  { @com.facebook.react.uimanager.annotations.ReactProp <methods>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>; }

# --- OkHttp / Okio ---
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# --- Reanimated / Worklets ---
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.worklets.** { *; }
-dontwarn com.swmansion.reanimated.**
-dontwarn com.swmansion.worklets.**

# --- Screens ---
-keep class com.swmansion.rnscreens.** { *; }
-dontwarn com.swmansion.rnscreens.**

# --- AsyncStorage ---
-keep class com.reactnativecommunity.asyncstorage.** { *; }
-dontwarn com.reactnativecommunity.asyncstorage.**

# --- Safe Area ---
-keep class com.th3rdwave.safeareacontext.** { *; }
-dontwarn com.th3rdwave.safeareacontext.**

# --- react-native-svg ---
-keep class com.horcrux.svg.** { *; }
-dontwarn com.horcrux.svg.**

# --- Fresco animated GIF ---
-keep class com.facebook.animated.gif.** { *; }
-keep class com.facebook.imagepipeline.animated.** { *; }
-dontwarn com.facebook.animated.gif.**

# --- Chrome Custom Tabs (androidx.browser) ---
-keep class androidx.browser.** { *; }
-dontwarn androidx.browser.**

# --- ContentBrowser native module ---
-keep class com.treasuresofegypt.bookofdesert.thegodisra.ContentBrowserModule { *; }
-keep class com.treasuresofegypt.bookofdesert.thegodisra.ContentBrowserPackage { *; }
-keep class com.treasuresofegypt.bookofdesert.thegodisra.MainActivity { *; }
-keep class com.treasuresofegypt.bookofdesert.thegodisra.MainApplication { *; }

# --- AppsFlyer ---
-keep class com.appsflyer.** { *; }
-keep class kotlin.jvm.internal.** { *; }
-dontwarn com.appsflyer.**
