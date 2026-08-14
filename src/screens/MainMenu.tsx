import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../_layout';
import { useCoins } from '../hooks/useCoins';
import CoinDisplay from '../components/CoinDisplay';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BONUS_RUN_USED_KEY = 'bonus_run_used_date';

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export default function MainMenuScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [showBonusRun, setShowBonusRun] = useState(false);
  const { coins, refreshCoins } = useCoins();

  useFocusEffect(
    useCallback(() => {
      refreshCoins();
    }, [refreshCoins])
  );

  /* ---------- CHECK BONUS ---------- */
  const todayKey = useMemo(() => getTodayKey(), []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const last = await AsyncStorage.getItem(BONUS_RUN_USED_KEY);
        if (!mounted) return;
        setShowBonusRun(last !== todayKey);
      } catch {
        if (!mounted) return;
        setShowBonusRun(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [todayKey]);

  /* ---------- ANIMATION (SAFE, NATIVE) ---------- */
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!showBonusRun) return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [pulse, showBonusRun]);

  const bonusScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  const bonusGlow = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const handleBonusRun = async () => {
    try {
      await AsyncStorage.setItem(BONUS_RUN_USED_KEY, todayKey);
    } catch {
      // ignore
    }
    setShowBonusRun(false);
    navigation.navigate('run', { isBonusRun: true });
  };

  return (
    <ImageBackground
      source={require('@assets/images/bg.png')}
      style={styles.bg}
      blurRadius={5}
      resizeMode="cover"
    >
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.safeContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Top Bar */}
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => navigation.navigate('about')}
                activeOpacity={0.7}
              >
                <Text style={styles.infoButtonText}>i</Text>
              </TouchableOpacity>
              <CoinDisplay coins={coins} style={styles.coinDisplay} />
            </View>

            <View style={styles.content}>
              {/* HEADER */}
              <View style={styles.header}>
                <Text style={styles.title}>TREASURES OF EGYPT</Text>
                <Text style={styles.subtitle}>Desert Adventure</Text>
              </View>

              {/* MENU */}
              <View style={styles.menuContainer}>
                {showBonusRun && (
                  <Animated.View
                    style={[
                      styles.menuButton,
                      styles.bonusButton,
                      {
                        transform: [{ scale: bonusScale }],
                        opacity: bonusGlow,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.88}
                      onPress={handleBonusRun}
                      style={styles.bonusButtonInner}
                    >
                      <Text style={[styles.menuButtonText, styles.bonusButtonText]}>
                        Bonus Run
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}

                <MenuButton
                  title="Run"
                  image={require('@assets/images/design-icon-1.png')}
                  onPress={() => navigation.navigate('run')}
                />
                <MenuButton
                  title="Discovery"
                  image={require('@assets/images/design-icon-2.png')}
                  onPress={() => navigation.navigate('discovery')}
                />
                <MenuButton
                  title="Settings"
                  image={require('@assets/images/design-icon-3.png')}
                  onPress={() => navigation.navigate('settings')}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </ImageBackground>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function MenuButton({ title, image, onPress }: { title: string; image: any; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={styles.menuButton}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.menuButtonText}>{title}</Text>
      <View style={styles.iconPlaceholder}>
        <Image
          source={image}
          style={styles.iconImage}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 4,
  },
  coinDisplay: {
    marginRight: 0,
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFE777',
  },
  infoButtonText: {
    color: '#FFE777',
    fontSize: 24,
    fontFamily: 'Knewave-Regular',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 54,
    fontFamily: 'Hanalei',
    color: '#3e2105ff',
    textAlign: 'center',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Fredoka',
    color: '#D4AF37',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  menuContainer: {
    width: '100%',
    maxWidth: 340,
    gap: 18,
  },
  menuButton: {
    height: 100,
    backgroundColor: '#FFE777',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8B5A2B',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#8B5A2B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    // elevation: 8,
    gap: 12,
  },
  bonusButton: {
    backgroundColor: 'rgba(212, 175, 55, 0.95)',
    borderColor: '#FFE777',
    borderWidth: 3,
    shadowColor: '#FFE777',
    shadowOpacity: 0.8,
  },
  bonusButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  bonusButtonText: {
    color: '#8B4513',
    fontWeight: 'bold',
  },
  iconPlaceholder: {
    height: 100,
    width: 32,
    position: 'absolute',
    right: 0,
    borderLeftWidth: 2,
    borderColor: '#250600',
    padding: 30,
    backgroundColor: '#5b2c00ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopEndRadius: 12,
    borderBottomEndRadius: 12
  },
  iconImage: {
    width: 50,
    height: 50,
  },
  menuButtonText: {
    fontSize: 22,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    color: '#250600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
