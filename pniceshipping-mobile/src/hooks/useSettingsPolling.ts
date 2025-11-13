/**
 * Hook for polling settings updates in real-time
 * Checks for changes every 30 seconds and notifies when settings change
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { getShippingRates, getSpecialItems, type ShippingRates, type SpecialItemsConfig } from '../utils/settingsQueries';
import * as Haptics from 'expo-haptics';
import { Alert } from 'react-native';

const POLLING_INTERVAL = 30000; // 30 seconds

interface UseSettingsPollingOptions {
  enabled?: boolean;
  onUpdate?: () => void;
  silent?: boolean; // Don't show alerts when updates are detected
}

export function useSettingsPolling(options: UseSettingsPollingOptions = {}) {
  const { enabled = true, onUpdate, silent = false } = options;
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastRatesRef = useRef<ShippingRates | null>(null);
  const lastItemsRef = useRef<SpecialItemsConfig | null>(null);

  const checkForUpdates = useCallback(async () => {
    try {
      const [rates, items] = await Promise.all([
        getShippingRates(),
        getSpecialItems(),
      ]);

      // Check if rates have changed
      const ratesChanged = lastRatesRef.current && (
        lastRatesRef.current.serviceFee !== rates.serviceFee ||
        lastRatesRef.current.rateCapHaitien !== rates.rateCapHaitien ||
        lastRatesRef.current.ratePortAuPrince !== rates.ratePortAuPrince
      );

      // Check if special items have changed
      const itemsChanged = lastItemsRef.current &&
        JSON.stringify(lastItemsRef.current.items) !== JSON.stringify(items.items);

      if (ratesChanged || itemsChanged) {
        console.log('🔄 Settings updated!', { ratesChanged, itemsChanged });

        // Provide haptic feedback
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Show alert unless silent mode
        if (!silent) {
          Alert.alert(
            'Tarifs Mis à Jour',
            'Les tarifs d\'expédition ont été mis à jour. Les nouveaux prix sont maintenant actifs.',
            [{ text: 'OK' }]
          );
        }

        // Update timestamp
        setLastUpdate(Date.now());

        // Call callback
        onUpdate?.();
      }

      // Store current values for next comparison
      lastRatesRef.current = rates;
      lastItemsRef.current = items;
    } catch (error) {
      console.error('Error checking for settings updates:', error);
    }
  }, [onUpdate, silent]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    // Initial check
    checkForUpdates();

    // Set up polling
    intervalRef.current = setInterval(checkForUpdates, POLLING_INTERVAL);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, checkForUpdates]);

  return { lastUpdate };
}
