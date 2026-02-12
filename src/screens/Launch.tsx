import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  View,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LaunchScreenProps = {
  onFinish: () => void;
};

export default function LaunchScreen({ onFinish }: LaunchScreenProps) {
  return (
    <ImageBackground
      source={require('@assets/images/bg.png')}
      style={styles.bg}
      resizeMode="cover"
      blurRadius={3}
    >
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.safeContainer}>
          
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              {/* Welcome message */}
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeTitle}>Welcome to</Text>
                <Text style={styles.gameTitle}>Treasures of Egypt</Text>
              </View>

              {/* Motivation text */}
              <View style={styles.motivationContainer}>
                <Text style={styles.motivationText}>
                  Embark on an epic journey through the ancient sands of Egypt!
                  Collect precious treasures, discover hidden secrets, and unlock
                  the mysteries of the pharaohs. Every treasure you find brings
                  you closer to unlocking the ultimate knowledge of the universe.
                </Text>
                <Text style={styles.motivationSubtext}>
                  Run through the desert, jump over obstacles, and gather coins
                  to unlock all 24 legendary treasures. The adventure awaits!
                </Text>

                <Image
                  source={require('@assets/images/launch-decor-coins.png')}
                  style={styles.coinsImage}
                  resizeMode="contain"
                />
              </View>

              {/* Start button with treasures decoration */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={async () => {
                    await AsyncStorage.setItem('wasOnLaunch', 'true');
                    onFinish();
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.startButtonText}>Start Adventure</Text>

                  <Image
                    source={require('@assets/images/launch-decor-treasures.png')}
                    style={styles.treasuresImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    </ImageBackground>
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
    position: 'relative',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    zIndex: 1,
  },
  coinsImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 120,
    zIndex: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 15,
    zIndex: 2,
  },
  treasuresImage: {
    width: 80,
    height: 80,
    flex: 1
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 22,
    fontFamily: 'Fredoka',
    color: '#FFE777',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  gameTitle: {
    fontSize: 48,
    lineHeight: 48,
    fontFamily: 'Hanalei',
    color: '#3e2105ff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  motivationContainer: {
    backgroundColor: 'rgba(139, 90, 43, 0.6)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFE777',
    zIndex: 2,
  },
  motivationText: {
    fontSize: 18,
    fontFamily: 'Fredoka',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  motivationSubtext: {
    fontSize: 16,
    fontFamily: 'Knewave-Regular',
    color: '#3e2105ff',
    textAlign: 'center',
    lineHeight: 24,
    textShadowColor: '#FFE777',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    zIndex: 1
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#250600',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#FFE777',
    shadowColor: '#FFE777',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    justifyContent: 'space-between'
  },
  startButtonText: {
    flex: 1,
    flexShrink: 1,
    fontSize: 20,
    fontFamily: 'Knewave-Regular',
    color: '#FFE777',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});
