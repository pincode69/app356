# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# --- Keep line numbers for readable crash reports (mapping.txt still deobfuscates names) ---
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

# Keep native methods and JS-exposed members
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
    native <methods>;
}
-keepclassmembers class *  { @com.facebook.react.uimanager.annotations.ReactProp <methods>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>; }

# --- OkHttp / Okio (networking used by fetch) ---
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep class okio.** { *; }

# --- App entrypoints / ContentBrowser CCT ---
-keep class com.treasuresofegypt.bookofdesert.thegodisra.MainActivity { *; }
-keep class com.treasuresofegypt.bookofdesert.thegodisra.MainApplication { *; }
-keep class com.treasuresofegypt.bookofdesert.thegodisra.ContentBrowser* { *; }
-keepclassmembers class com.treasuresofegypt.bookofdesert.thegodisra.ContentBrowserModule {
    public static <fields>;
}
-keep class androidx.browser.** { *; }
-dontwarn androidx.browser.**

# --- Fresco animated GIF (running-camel.gif etc.) ---
-keep class com.facebook.animated.gif.** { *; }
-keep class com.facebook.imagepipeline.animated.** { *; }
-dontwarn com.facebook.animated.gif.**

# --- AsyncStorage ---
-keep class com.reactnativecommunity.asyncstorage.** { *; }
-dontwarn com.reactnativecommunity.asyncstorage.**

# --- react-native-safe-area-context ---
-keep class com.th3rdwave.safeareacontext.** { *; }
-dontwarn com.th3rdwave.safeareacontext.**

# --- react-native-screens ---
-keep class com.swmansion.rnscreens.** { *; }
-dontwarn com.swmansion.rnscreens.**

# --- react-native-reanimated / worklets / Fabric ---
-keep class com.swmansion.reanimated.** { *; }
-dontwarn com.swmansion.reanimated.**
-keep class com.swmansion.worklets.** { *; }
-dontwarn com.swmansion.worklets.**
-keep class com.facebook.react.fabric.** { *; }

# --- react-native-svg ---
-keep class com.horcrux.svg.** { *; }
-dontwarn com.horcrux.svg.**

# --- Kotlin ---
-keepattributes RuntimeVisibleAnnotations,AnnotationDefault
-dontwarn kotlin.**
-dontwarn kotlinx.**
