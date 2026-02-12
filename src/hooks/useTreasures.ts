import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Treasure } from '../data/treasures';

const PURCHASED_TREASURES_KEY = 'purchased_treasures';

export function useTreasures() {
  const [purchasedTreasures, setPurchasedTreasures] = useState<Set<number>>(new Set());

  const loadTreasures = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(PURCHASED_TREASURES_KEY);
      if (stored !== null) {
        const ids = JSON.parse(stored) as number[];
        setPurchasedTreasures(new Set(ids));
      } else {
        setPurchasedTreasures(new Set());
      }
    } catch (e) {
      console.warn('Failed to load treasures', e);
      setPurchasedTreasures(new Set());
    }
  }, []);

  const isTreasurePurchased = useCallback((treasureId: number): boolean => {
    return purchasedTreasures.has(treasureId);
  }, [purchasedTreasures]);

  const purchaseTreasure = useCallback(async (
    treasureId: number,
    price: number,
    spendCoins: (amount: number) => Promise<boolean>
  ): Promise<boolean> => {
    if (purchasedTreasures.has(treasureId)) {
      return true; // Already purchased
    }

    const success = await spendCoins(price);
    if (success) {
      const newSet = new Set(purchasedTreasures);
      newSet.add(treasureId);
      setPurchasedTreasures(newSet);
      
      try {
        await AsyncStorage.setItem(PURCHASED_TREASURES_KEY, JSON.stringify(Array.from(newSet)));
      } catch (e) {
        console.warn('Failed to save purchased treasure', e);
      }
      return true;
    }
    return false;
  }, [purchasedTreasures]);

  useEffect(() => {
    loadTreasures();
  }, [loadTreasures]);

  return {
    isTreasurePurchased,
    purchaseTreasure,
    refreshTreasures: loadTreasures,
  };
}

