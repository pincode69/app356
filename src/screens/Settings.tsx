import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackIcon } from '../components/BackIcon';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SETTINGS_KEYS = {
  MUSIC: 'settings_music',
  SOUNDS: 'settings_sounds',
  VIBRATION: 'settings_vibration',
};

const BONUS_RUN_USED_KEY = 'bonus_run_used_date';

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [musicEnabled, setMusicEnabled] = useState(true);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------- Load settings ---------- */
  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      try {
        const [music, sounds, vibration] = await Promise.all([
          AsyncStorage.getItem(SETTINGS_KEYS.MUSIC),
          AsyncStorage.getItem(SETTINGS_KEYS.SOUNDS),
          AsyncStorage.getItem(SETTINGS_KEYS.VIBRATION),
        ]);

        if (isMounted) {
          if (music !== null) setMusicEnabled(music === 'true');
          if (sounds !== null) setSoundsEnabled(sounds === 'true');
          if (vibration !== null) setVibrationEnabled(vibration === 'true');
          setIsLoading(false);
        }
      } catch (e) {
        console.warn('Failed to load settings', e);
        if (isMounted) setIsLoading(false);
      }
    };

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  /* ---------- Toggles ---------- */
  const toggleMusic = async (value: boolean) => {
    setMusicEnabled(value);
    await AsyncStorage.setItem(SETTINGS_KEYS.MUSIC, value.toString());
  };

  const toggleSounds = async (value: boolean) => {
    setSoundsEnabled(value);
    await AsyncStorage.setItem(SETTINGS_KEYS.SOUNDS, value.toString());
  };

  const toggleVibration = async (value: boolean) => {
    setVibrationEnabled(value);
    await AsyncStorage.setItem(SETTINGS_KEYS.VIBRATION, value.toString());
  };

  const onResetProgress = () => {
    Alert.alert(
      'Reset Progress?',
      'This will reset your game progress, scores, and collected coins. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              // Reset bonus run
              await AsyncStorage.removeItem(BONUS_RUN_USED_KEY);
              // Add other reset logic here if needed
              Alert.alert('Success', 'Progress has been reset.');
            } catch (e) {
              Alert.alert('Error', 'Failed to reset progress.');
            }
          },
        },
      ]
    );
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
          {/* ---------- Header ---------- */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <BackIcon />
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>SETTINGS</Text>
          </View>

          {/* ---------- Content ---------- */}
          {!isLoading && (
            <View style={styles.content}>
              {/* Audio */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Audio</Text>

                <SettingRow
                  label="Music"
                  description="Background music"
                  value={musicEnabled}
                  onChange={toggleMusic}
                />

                <SettingRow
                  label="Sounds"
                  description="Sound effects"
                  value={soundsEnabled}
                  onChange={toggleSounds}
                />
              </View>

              {/* Device */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Device</Text>

                <SettingRow
                  label="Vibration"
                  description="Haptic feedback"
                  value={vibrationEnabled}
                  onChange={toggleVibration}
                />
              </View>

              {/* Data */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data</Text>
                <TouchableOpacity
                  style={styles.dangerButton}
                  activeOpacity={0.85}
                  onPress={onResetProgress}
                >
                  <Text style={styles.dangerButtonText}>Reset Progress</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </ImageBackground>
  );
}

/* ---------- Reusable Row ---------- */

type SettingRowProps = {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

function SettingRow({
  label,
  description,
  value,
  onChange,
}: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#8B5A2B', true: '#D4AF37' }}
        thumbColor="#FFE777"
        ios_backgroundColor="#8B5A2B"
      />
    </View>
  );
}

/* ---------- Styles ---------- */

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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    zIndex: 100,
    marginBottom: 10,
  },
  backButton: {
    width: 44,
    height: 38,
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 10,
  },
  title: {
    fontSize: 54,
    fontFamily: 'Hanalei',
    color: '#3e2105ff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  content: {
    paddingHorizontal: 4,
  },
  section: {
    backgroundColor: 'rgba(139, 90, 43, 0.6)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFE777',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#8B5A2B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    // elevation: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Fredoka',
    color: '#FFE777',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.3)',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 18,
    fontFamily: 'Fredoka',
    fontWeight: '600',
    color: '#FFE777',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Fredoka',
    color: 'rgba(255, 215, 0, 0.8)',
    marginTop: 4,
  },
  dangerButton: {
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 77, 77, 0.6)',
    backgroundColor: 'rgba(255, 77, 77, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerButtonText: {
    fontSize: 16,
    fontFamily: 'Knewave-Regular',
    color: '#ff4d4d',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
});
