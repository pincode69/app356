/**
 * App content.
 *
 * @format
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import appsFlyer from 'react-native-appsflyer';
import AppBootstrap from './AppBootstrap';

const ANDROID_APP_ID = 'com.treasuresofegypt.bookofdesert.thegodisra';
const APPSFLYER_DEV_KEY = 'VafzokzJj7k6iT75JztHBU';

export const AppContent = () => {
  useEffect(() => {
    (async () => {
      appsFlyer.onInstallConversionData(async () => { });

      appsFlyer.initSdk(
        {
          devKey: APPSFLYER_DEV_KEY,
          appId: ANDROID_APP_ID,
        },
        () => { },
        error => {
          console.error('[AppContent] AppsFlyer Init Error:', error);
        },
      );
    })();
  }, []);

  return (
    <View style={styles.container}>
      <AppBootstrap useRootNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
