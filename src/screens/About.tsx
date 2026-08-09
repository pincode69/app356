import React from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../_layout';
import { BackIcon } from '../components/BackIcon';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AboutScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ImageBackground
      source={require('@assets/images/bg.png')}
      style={styles.bg}
      blurRadius={5}
      resizeMode="cover"
    >
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.safeContainer}>
          {/* Header with back button */}
          <View style={styles.topBar}>
            
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <BackIcon />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Image
              source={require('@assets/images/history.png')} 
              style={styles.historyIcon}
              resizeMode='cover'
            />

            {/* Title */}
            <View style={styles.header}>
              <Text style={styles.title}>THE DESERT QUEST</Text>
            </View>

            {/* Story Content */}
            <View style={styles.contentContainer}>
              <Text style={styles.storyText}>
                In the vast, golden sands of ancient Egypt, precious gems and treasures lie scattered across the endless desert. These are no ordinary stones—they are the keys to unlocking the most valuable secrets of the pharaohs.
              </Text>

              <Text style={styles.storyText}>
                Your journey begins as a brave explorer, riding through the desert on your loyal camel. The sun beats down mercilessly, but you must never stop. The desert rewards only those who move forward with unwavering determination.
              </Text>

              <Text style={styles.storyText}>
                As you travel through the shifting sands, you'll encounter obstacles that test your skill and courage. Jump over cacti, collect golden coins, and use your turbo speed to race through the challenges. Each coin you gather brings you closer to discovering the legendary treasures hidden in the ancient chambers.
              </Text>

              <Text style={styles.storyText}>
                The treasures you unlock are not mere decorations—they are fragments of ancient wisdom. Collect all 24 artifacts, and you will open the doors to all knowledge of the universe, just as the pharaohs once did.
              </Text>

              <Text style={styles.motivationText}>
                Keep moving forward. Never stop. The desert never sleeps, and neither should you. Every jump, every coin, every treasure brings you closer to eternal wisdom.
              </Text>

              <Text style={styles.motivationText}>
                The journey is long, but the rewards are infinite. Let the golden sands guide you to greatness.
              </Text>

              <Image
                source={require('@assets/images/history-1.png')} 
                style={styles.historySecond}
                resizeMode='contain'
              />
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
    
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 44,
    height: 38,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  historyIcon: {
    position: 'absolute',
    width: '100%'
  },
  historySecond: {
    alignSelf: 'center',
    width: 120,
    height: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 120,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 48,
    fontFamily: 'Hanalei',
    color: '#3e2105ff',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    textAlign: 'center',
  },
  contentContainer: {
    backgroundColor: 'rgba(139, 90, 43, 0.6)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFE777',
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#8B5A2B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    // elevation: 8,
  },
  storyText: {
    fontSize: 16,
    fontFamily: 'Fredoka',
    color: '#FFFFFF',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'justify',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  motivationText: {
    fontSize: 17,
    fontFamily: 'Knewave',
    color: '#FFE777',
    lineHeight: 26,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
});

