# Project ProGuard / R8 rules for TreasuresOfEgypt.
# Applied when minifyEnabled=true. Does NOT auto-upload mapping to Play Console —
# you must upload mapping.txt with the AAB to clear the deobfuscation warning.

# --- Crash reports: keep line numbers ---
-keepattributes SourceFile,LineNumberTable
-keepattributes *Annotation*
-keepattributes Signature,Exceptions,InnerClasses,EnclosingMethod
-renamesourcefileattribute SourceFile

# --- React Native core ---
-keep,includedescriptorclasses class com.facebook.react.bridge.** { *; }
-keep,includedescriptorclasses class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.react.fabric.** { *; }
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

-keep class * implements com.facebook.react.bridge.NativeModule { *; }
-keep class * implements com.facebook.react.bridge.JavaScriptModule { *; }

# --- OkHttp / Okio ---
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep class okio.** { *; }
-keep class sun.misc.Unsafe { *; }

# --- App entrypoints (must match applicationId / namespace) ---
-keep class com.treasuresofegypt.bookofdesert.thegodisra.MainActivity { *; }
-keep class com.treasuresofegypt.bookofdesert.thegodisra.MainApplication { *; }

# --- Fresco animated GIF ---
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

# --- react-native-reanimated / worklets ---
-keep class com.swmansion.reanimated.** { *; }
-dontwarn com.swmansion.reanimated.**
-keep class com.swmansion.worklets.** { *; }
-dontwarn com.swmansion.worklets.**

# --- react-native-svg ---
-keep class com.horcrux.svg.** { *; }
-dontwarn com.horcrux.svg.**

# --- Kotlin ---
-keepattributes RuntimeVisibleAnnotations,AnnotationDefault
-dontwarn kotlin.**
-dontwarn kotlinx.**
