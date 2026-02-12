import React from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  ViewStyle
} from 'react-native';

interface CoinDisplayProps {
  coins: number;
  style?: ViewStyle;
}

export default function CoinDisplay({ coins, style }: CoinDisplayProps) {
  return (
    <View style={[styles.container, style]}>
      {/* <Text style={styles.coinIcon}>🪙</Text> */}
      <Image
        source={require('@assets/images/coin.png')} 
        style={styles.coinIcon}
        resizeMode='contain'
      />
      <Text style={styles.coinText}>{coins}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 12
  },
  coinIcon: {
    width: 40,
    height: 40,
  },
  coinText: {
    fontSize: 18,
    fontFamily: 'Knewave-Regular',
    color: '#FFE777',
    fontWeight: 'bold',
  },
});

