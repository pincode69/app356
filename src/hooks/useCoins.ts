import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COINS_KEY = 'player_coins';

export function useCoins() {
  const [coins, setCoins] = useState(0);

  const loadCoins = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(COINS_KEY);
      if (stored !== null) {
        setCoins(parseInt(stored, 10));
      } else {
        setCoins(0);
      }
    } catch (e) {
      console.warn('Failed to load coins', e);
      setCoins(0);
    }
  }, []);

  const addCoins = useCallback(async (amount: number) => {
    try {
      const newAmount = coins + amount;
      await AsyncStorage.setItem(COINS_KEY, newAmount.toString());
      setCoins(newAmount);
    } catch (e) {
      console.warn('Failed to add coins', e);
    }
  }, [coins]);

  const spendCoins = useCallback(async (amount: number): Promise<boolean> => {
    if (coins < amount) {
      return false;
    }
    try {
      const newAmount = coins - amount;
      await AsyncStorage.setItem(COINS_KEY, newAmount.toString());
      setCoins(newAmount);
      return true;
    } catch (e) {
      console.warn('Failed to spend coins', e);
      return false;
    }
  }, [coins]);

  useEffect(() => {
    loadCoins();
  }, [loadCoins]);

  return {
    coins,
    addCoins,
    spendCoins,
    refreshCoins: loadCoins,
  };
}

