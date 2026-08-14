import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../_layout';
import { treasures, Treasure } from '../data/treasures';
import { useCoins } from '../hooks/useCoins';
import { useTreasures } from '../hooks/useTreasures';
import CoinDisplay from '../components/CoinDisplay';
import TreasureInfoModal from '../components/TreasureInfoModal';
import { BackIcon } from '../components/BackIcon';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DiscoveryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedTreasure, setSelectedTreasure] = useState<Treasure | null>(null);
  const { coins, spendCoins, refreshCoins } = useCoins();
  const { isTreasurePurchased, purchaseTreasure, refreshTreasures } = useTreasures();

  useFocusEffect(
    useCallback(() => {
      refreshCoins();
      refreshTreasures();
    }, [refreshCoins, refreshTreasures])
  );

  const handleTreasurePress = (treasure: Treasure) => {
    if (isTreasurePurchased(treasure.id)) {
      setSelectedTreasure(treasure);
    }
  };

  const handlePurchase = async (treasure: Treasure) => {
    const success = await purchaseTreasure(treasure.id, treasure.price, spendCoins);
    if (success) {
      await refreshCoins();
      await refreshTreasures();
      setSelectedTreasure(treasure);
    }
  };

  const closeModal = () => {
    setSelectedTreasure(null);
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
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <BackIcon />
              </TouchableOpacity>
              <CoinDisplay coins={coins} style={styles.coinContainer} />
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>TREASURE ROOM</Text>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>
                The ancient chamber of treasures. Unlock all 24 artifacts to open the doors to all knowledge of the universe. Each discovery brings you closer to the ultimate wisdom of the pharaohs.
              </Text>
            </View>

            <View style={styles.grid}>
              {treasures.map(item => {
                const isPurchased = isTreasurePurchased(item.id);
                const canAfford = !isPurchased && coins >= item.price;

                return (
                  <View key={item.id} style={styles.card}>
                    <TouchableOpacity
                      style={[
                        styles.itemBtn,
                        isPurchased && styles.itemBtnPurchased,
                      ]}
                      onPress={() => handleTreasurePress(item)}
                      activeOpacity={0.8}
                    >
                      {isPurchased ? (
                        <View style={styles.treasureContainer}>
                          <Image
                            source={item.image}
                            style={styles.treasureImage}
                            resizeMode="contain"
                          />
                          <Text style={styles.treasureName} numberOfLines={1}>
                            {item.name}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.lockedContainer}>
                          <View style={styles.questionMarkContainer}>
                            <Text style={styles.questionMark}>?</Text>
                          </View>
                          <View style={styles.priceContainer}>
                            <Image
                              source={require('@assets/images/coin.png')}
                              style={styles.coinIcon}
                              resizeMode="contain"
                            />
                            <Text
                              style={[
                                styles.priceText,
                                !canAfford && styles.priceTextDisabled,
                              ]}
                            >
                              {item.price}
                            </Text>
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>

                    {!isPurchased && (
                      <TouchableOpacity
                        style={[
                          styles.buyButton,
                          !canAfford && styles.buyButtonDisabled,
                        ]}
                        onPress={() => handlePurchase(item)}
                        disabled={!canAfford}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.buyButtonText,
                            !canAfford && styles.buyButtonTextDisabled,
                          ]}
                        >
                          Buy
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {selectedTreasure && (
            <TreasureInfoModal
              treasure={selectedTreasure}
              visible={!!selectedTreasure}
              onClose={closeModal}
            />
          )}
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
  },
  backButton: {
    width: 44,
    height: 38,
  },
  coinContainer: {
    marginRight: 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 52,
    fontFamily: 'Hanalei',
    color: '#3e2105ff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    backgroundColor: 'rgba(139, 90, 43, 0.5)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFE777',
    padding: 16,
    marginBottom: 20,
    marginHorizontal: 4,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Fredoka',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: 'transparent',
    position: 'relative',
    marginBottom: 16,
  },
  itemBtn: {
    padding: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.4)',
    borderRadius: 16,
    minHeight: 180,
    width: '100%',
    borderWidth: 2,
    borderColor: '#FFE777',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBtnPurchased: {
    backgroundColor: 'rgba(212, 175, 55, 0.6)',
    borderColor: '#FFE777',
  },
  treasureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  treasureImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  treasureName: {
    fontSize: 14,
    fontFamily: 'Knewave',
    color: '#FFE777',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    width: '100%',
    minHeight: 140,
  },
  questionMarkContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(128, 128, 128, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionMark: {
    fontSize: 28,
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Knewave',
    color: 'white',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coinIcon: {
    width: 20,
    height: 20,
  },
  priceText: {
    fontSize: 18,
    fontFamily: 'Knewave',
    color: '#FFE777',
  },
  priceTextDisabled: {
    color: '#888888',
  },
  buyButton: {
    backgroundColor: '#D4AF37',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE777',
  },
  buyButtonDisabled: {
    backgroundColor: '#8B5A2B',
    borderColor: '#666666',
  },
  buyButtonText: {
    color: '#8B4513',
    fontSize: 14,
    fontFamily: 'Knewave',
  },
  buyButtonTextDisabled: {
    color: '#CCCCCC',
  },
});
