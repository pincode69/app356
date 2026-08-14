import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../_layout';
import { BackIcon } from '../components/BackIcon';
import { useCoins } from '../hooks/useCoins';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/* ================= CONSTANTS ================= */

const GAME_HEIGHT = 350;
const GROUND_LEVEL = 350;

const CAMEL_WIDTH = 120;
const CAMEL_HEIGHT = 120;

const OBSTACLE_WIDTH = 40;
const OBSTACLE_HEIGHT = 40;
const BONUS_WIDTH = 30;
const BONUS_HEIGHT = 30;

const GRAVITY = 1.2;
const JUMP_FORCE = -22;

const BASE_SPEED = 6;
const TURBO_MULTIPLIER = 2;
const TURBO_DURATION = 3000;

/* ================= TYPES ================= */

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: number;
}

interface Bonus {
  x: number;
  y: number;
  width: number;
  height: number;
  type: number;
  collected: boolean;
}

interface GameState {
  score: number;
  gameOver: boolean;
  playerY: number;
  velocityY: number;
  obstacles: Obstacle[];
  bonuses: Bonus[];
  bonusesCollected: number;
  speed: number;
  isTurbo: boolean;
  turboEndTime: number;
}

/* ================= COMPONENT ================= */

export default function RunScreen() {
  const navigation = useNavigation<NavigationProp>();
  const frameRef = useRef<number>();
  const { addCoins } = useCoins();
  const addCoinsRef = useRef(addCoins);
  
  // Keep addCoins ref updated
  useEffect(() => {
    addCoinsRef.current = addCoins;
  }, [addCoins]);

  const [state, setState] = useState<GameState>({
    score: 0,
    gameOver: false,
    playerY: GROUND_LEVEL - CAMEL_HEIGHT,
    velocityY: 0,
    obstacles: [],
    bonuses: [],
    bonusesCollected: 0,
    speed: BASE_SPEED,
    isTurbo: false,
    turboEndTime: 0,
  });

  /* ================= GAME LOOP ================= */

  const gameLoop = () => {
    setState(prev => {
      if (prev.gameOver) return prev;

      let {
        playerY,
        velocityY,
        obstacles,
        bonuses,
        bonusesCollected,
        score,
        speed,
        isTurbo,
        turboEndTime,
      } = prev;

      /* ---- Turbo ---- */
      if (isTurbo && Date.now() > turboEndTime) {
        isTurbo = false;
        speed = BASE_SPEED;
      }

      const currentSpeed = isTurbo ? speed * TURBO_MULTIPLIER : speed;

      /* ---- Physics ---- */
      velocityY += GRAVITY;
      playerY += velocityY;

      if (playerY >= GROUND_LEVEL - CAMEL_HEIGHT) {
        playerY = GROUND_LEVEL - CAMEL_HEIGHT;
        velocityY = 0;
      }

      /* ---- Obstacles move ---- */
      obstacles = obstacles
        .map(o => ({ ...o, x: o.x - currentSpeed }))
        .filter(o => {
          if (o.x + o.width < 0) {
            score += 1;
            return false;
          }
          return true;
        });

      /* ---- Bonuses move ---- */
      bonuses = bonuses
        .map(b => ({ ...b, x: b.x - currentSpeed }))
        .filter(b => b.x > -BONUS_WIDTH);

      /* ---- Spawn obstacles (less frequent) ---- */
      if (Math.random() < 0.008) {
        obstacles.push({
          x: SCREEN_WIDTH,
          y: GROUND_LEVEL - OBSTACLE_HEIGHT,
          width: OBSTACLE_WIDTH,
          height: OBSTACLE_HEIGHT,
          type: Math.floor(Math.random() * 4) + 1,
        });
      }

      /* ---- Spawn bonuses ---- */
      if (Math.random() < 0.012) {
        bonuses.push({
          x: SCREEN_WIDTH,
          y: Math.random() * (GAME_HEIGHT - BONUS_HEIGHT - 100) + 50, // Random Y position
          width: BONUS_WIDTH,
          height: BONUS_HEIGHT,
          type: Math.floor(Math.random() * 5) + 1,
          collected: false,
        });
      }

      /* ---- Collision ---- */
      const playerRect = {
        x: 0,
        y: playerY,
        width: CAMEL_WIDTH - 80,
        height: CAMEL_HEIGHT,
      };

      // Check obstacle collisions
      for (const obs of obstacles) {
        if (isColliding(playerRect, obs)) {
          return { ...prev, gameOver: true };
        }
      }

      // Check bonus collection
      for (const bonus of bonuses) {
        if (!bonus.collected && isColliding(playerRect, bonus)) {
          bonus.collected = true;
          bonusesCollected += 1;
          addCoinsRef.current(1); // Add 1 coin per bonus
        }
      }

      return {
        ...prev,
        score,
        playerY,
        velocityY,
        obstacles,
        bonuses,
        bonusesCollected,
        speed,
        isTurbo,
      };
    });

    frameRef.current = requestAnimationFrame(gameLoop);
  };

  /* ================= HELPERS ================= */

  const isColliding = (a: any, b: any) =>
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;

  const jump = () => {
    setState(prev => {
      if (prev.velocityY !== 0 || prev.gameOver) return prev;
      return { ...prev, velocityY: JUMP_FORCE };
    });
  };

  const turbo = () => {
    setState(prev => {
      if (prev.isTurbo || prev.gameOver) return prev;
      return {
        ...prev,
        isTurbo: true,
        turboEndTime: Date.now() + TURBO_DURATION,
      };
    });
  };

  const restart = () => {
    setState({
      score: 0,
      gameOver: false,
      playerY: GROUND_LEVEL - CAMEL_HEIGHT,
      velocityY: 0,
      obstacles: [],
      bonuses: [],
      bonusesCollected: 0,
      speed: BASE_SPEED,
      isTurbo: false,
      turboEndTime: 0,
    });
  };

  useEffect(() => {
    frameRef.current = requestAnimationFrame(gameLoop);
    return () => frameRef.current && cancelAnimationFrame(frameRef.current);
  }, []);

  /* ================= RENDER HELPERS ================= */

  const getCactusImage = (type: number) => {
    switch (type) {
      case 1:
        return require('@assets/images/game/cactus-1.png');
      case 2:
        return require('@assets/images/game/cactus-2.png');
      case 3:
        return require('@assets/images/game/cactus-3.png');
      case 4:
        return require('@assets/images/game/cactus-4.png');
      default:
        return require('@assets/images/game/cactus-1.png');
    }
  };

  const getBonusImage = (type: number) => {
    switch (type) {
      case 1:
        return require('@assets/images/game/bonus/Bonus-1.png');
      case 2:
        return require('@assets/images/game/bonus/Bonus-2.png');
      case 3:
        return require('@assets/images/game/bonus/Bonus-3.png');
      case 4:
        return require('@assets/images/game/bonus/Bonus-4.png');
      case 5:
        return require('@assets/images/game/bonus/Bonus-5.png');
      default:
        return require('@assets/images/game/bonus/Bonus-1.png');
    }
  };

  /* ================= RENDER ================= */

  return (
    <ImageBackground
      source={require('@assets/images/bg.png')}
      style={styles.bg}
      blurRadius={5}
      resizeMode="cover"
    >
      <SafeAreaProvider style={styles.container}>
        <SafeAreaView style={styles.safe}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Back Button */}
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <BackIcon />
              </TouchableOpacity>
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Run</Text>
              <View style={styles.statsContainer}>
                <Text style={styles.score}>Score: {state.score}</Text>
                <Text style={styles.bonusesText}>Bonuses: {state.bonusesCollected}</Text>
              </View>
            </View>

            {/* Game Area */}
            <View style={styles.gameArea}>
              {/* Camel */}
              <View style={[styles.camel, { top: state.playerY }]}>
                <Image
                  source={require('@assets/images/game/running-camel.gif')}
                  style={styles.camelImage}
                  resizeMode="contain"
                />
              </View>

              {/* Obstacles */}
              {state.obstacles.map((o, i) => (
                <View key={i} style={[styles.cactus, { left: o.x, top: o.y }]}>
                  <Image
                    source={getCactusImage(o.type)}
                    style={styles.cactusImage}
                    resizeMode="contain"
                  />
                </View>
              ))}

              {/* Bonuses */}
              {state.bonuses.map((b, i) => (
                !b.collected && (
                  <View key={`bonus-${i}`} style={[styles.bonus, { left: b.x, top: b.y }]}>
                    <Image
                      source={getBonusImage(b.type)}
                      style={styles.bonusImage}
                      resizeMode="contain"
                    />
                  </View>
                )
              ))}
            </View>

            {/* Controls */}
            <View style={styles.controls}>
              <TouchableOpacity
                onPress={jump}
                style={[styles.btn, styles.jumpButton, state.velocityY !== 0 && styles.btnActive]}
                disabled={state.gameOver || state.velocityY !== 0}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>Jump</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={turbo}
                style={[styles.btn, styles.turboButton, state.isTurbo && styles.turboButtonActive]}
                disabled={state.gameOver || state.isTurbo}
                activeOpacity={0.8}
              >
                <Text style={styles.turboButtonText}>
                  {state.isTurbo ? 'Turbo!' : 'Turbo'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Game Over Modal */}
          <Modal visible={state.gameOver} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <ImageBackground
                  source={require('@assets/images/bg.png')}
                  style={styles.modalBackground}
                  resizeMode="cover"
                >
                  <View style={styles.modalContent}>
                    <Text style={styles.gameOverText}>Game Over!</Text>
                    <Text style={styles.finalScoreText}>Score: {state.score}</Text>
                    <Text style={styles.bonusesCollectedText}>Bonuses Collected: {state.bonusesCollected}</Text>
                    <Text style={styles.coinsEarnedText}>Coins Earned: {state.bonusesCollected}</Text>
                    
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        onPress={restart}
                        style={styles.restartButton}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.restartButtonText}>Restart</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.homeButton}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.homeButtonText}>Home</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </SafeAreaProvider>
    </ImageBackground>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
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
    marginBottom: 20,
  },
  title: {
    fontSize: 54,
    fontFamily: 'Hanalei',
    color: '#3e2105ff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  score: {
    fontSize: 24,
    fontFamily: 'Fredoka',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bonusesText: {
    fontSize: 24,
    fontFamily: 'Fredoka',
    color: '#FFE777',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  gameArea: {
    height: GAME_HEIGHT,
    backgroundColor: 'rgba(139, 90, 43, 0.5)',
    overflow: 'hidden',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFE777',
    marginBottom: 20,
    position: 'relative',
  },
  camel: {
    position: 'absolute',
    left: 0,
    width: CAMEL_WIDTH,
    height: CAMEL_HEIGHT,
    zIndex: 5,
  },
  camelImage: {
    width: '100%',
    height: '100%',
  },
  cactus: {
    position: 'absolute',
    width: OBSTACLE_WIDTH,
    height: OBSTACLE_HEIGHT,
    zIndex: 3,
  },
  cactusImage: {
    width: '100%',
    height: '100%',
  },
  bonus: {
    position: 'absolute',
    width: BONUS_WIDTH,
    height: BONUS_HEIGHT,
    zIndex: 4,
  },
  bonusImage: {
    width: '100%',
    height: '100%',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  btn: {
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  jumpButton: {
    backgroundColor: '#FFE777',
    borderColor: '#8B5A2B',
  },
  turboButton: {
    backgroundColor: '#ff6600',
    borderColor: '#FFE777',
  },
  turboButtonActive: {
    backgroundColor: '#ff3300',
    transform: [{ scale: 1.1 }],
  },
  btnActive: {
    opacity: 0.7,
  },
  btnText: {
    fontSize: 18,
    fontFamily: 'Knewave-Regular',
    fontWeight: 'bold',
    color: '#8B4513',
  },
  turboButtonText: {
    fontSize: 18,
    fontFamily: 'Knewave-Regular',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFE777',
  },
  modalBackground: {
    width: '100%',
  },
  modalContent: {
    alignItems: 'center',
  },
  gameOverText: {
    width: '100%',
    fontSize: 42,
    fontFamily: 'Knewave-Regular',
    fontWeight: 'bold',
    color: '#FFE777',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  finalScoreText: {
    fontSize: 24,
    fontFamily: 'Fredoka',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  bonusesCollectedText: {
    fontSize: 20,
    fontFamily: 'Fredoka',
    color: '#FFE777',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  coinsEarnedText: {
    fontSize: 20,
    fontFamily: 'Fredoka',
    color: '#FFE777',
    marginBottom: 32,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFE777',
    minWidth: 120,
    alignItems: 'center',
  },
  restartButtonText: {
    color: '#8B4513',
    fontSize: 18,
    fontFamily: 'Knewave-Regular',
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: 'rgba(139, 90, 43, 0.8)',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFE777',
    minWidth: 120,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#FFE777',
    fontSize: 18,
    fontFamily: 'Knewave-Regular',
    fontWeight: 'bold',
  },
});
