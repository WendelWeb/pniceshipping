/**
 * Global Settings Context Provider
 *
 * Single source of truth for all dynamic settings across the app.
 * Provides shipping rates, special items, and other configurable settings.
 *
 * Usage:
 *   import { useSettings } from '@/contexts/SettingsContext';
 *   const { shippingRates, specialItems, isLoading } = useSettings();
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getShippingRates, getSpecialItems, type ShippingRates, type SpecialItemsConfig } from '@/utils/settingsQueries';

// Default values (fallback when DB is unavailable)
const DEFAULT_SHIPPING_RATES: ShippingRates = {
  serviceFee: 10,
  rateCapHaitien: 4.5,
  ratePortAuPrince: 5,
};

const DEFAULT_SPECIAL_ITEMS: SpecialItemsConfig = {
  items: [
    { id: 'iphone-xr-11pro', name: 'iPhone XR à 11 Pro Max', price: 35, category: 'phone' },
    { id: 'iphone-12-13pro', name: 'iPhone 12 à 13 Pro Max', price: 50, category: 'phone' },
    { id: 'iphone-14-15pro', name: 'iPhone 14 à 15 Pro Max', price: 70, category: 'phone' },
    { id: 'iphone-16-16pro', name: 'iPhone 16 à 16 Pro Max', price: 100, category: 'phone' },
    { id: 'iphone-17', name: 'iPhone 17', price: 130, category: 'phone' },
    { id: 'laptop', name: 'Ordinateurs Portables', price: 90, category: 'computer' },
    { id: 'starlink', name: 'Starlink', price: 120, category: 'other' },
  ],
};

interface SettingsContextType {
  // Settings data
  shippingRates: ShippingRates;
  specialItems: SpecialItemsConfig;

  // Loading state
  isLoading: boolean;
  error: Error | null;

  // Refresh function
  refetchSettings: () => Promise<void>;

  // Utility functions
  getRate: (destination: string) => number;
  getSpecialItemPrice: (categoryOrName: string) => number | null;
  calculateShippingCost: (weight: number, destination: string) => number;
  calculateSpecialItemCost: (categoryOrName: string) => number | null;
  calculateTotalCost: (shippingCost: number) => number;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
  autoRefreshInterval?: number; // Optional: auto-refresh every X ms (default: disabled)
}

export function SettingsProvider({ children, autoRefreshInterval }: SettingsProviderProps) {
  const [shippingRates, setShippingRates] = useState<ShippingRates>(DEFAULT_SHIPPING_RATES);
  const [specialItems, setSpecialItems] = useState<SpecialItemsConfig>(DEFAULT_SPECIAL_ITEMS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setError(null);
      const [rates, items] = await Promise.all([
        getShippingRates(),
        getSpecialItems(),
      ]);

      setShippingRates(rates);
      setSpecialItems(items);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      // Keep using default values on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Optional: Auto-refresh interval
  useEffect(() => {
    if (!autoRefreshInterval) return;

    const interval = setInterval(fetchSettings, autoRefreshInterval);
    return () => clearInterval(interval);
  }, [autoRefreshInterval, fetchSettings]);

  // Utility: Get rate for destination
  const getRate = useCallback((destination: string): number => {
    const normalizedDestination = destination.toLowerCase().replace(/[\s-]/g, '');

    if (normalizedDestination.includes('portauprince') || normalizedDestination.includes('pap')) {
      return shippingRates.ratePortAuPrince;
    }

    if (normalizedDestination.includes('caphaitien') || normalizedDestination.includes('cap')) {
      return shippingRates.rateCapHaitien;
    }

    // Default to Port-au-Prince rate
    return shippingRates.ratePortAuPrince;
  }, [shippingRates]);

  // Utility: Get special item price
  const getSpecialItemPrice = useCallback((categoryOrName: string): number | null => {
    const normalized = categoryOrName.toLowerCase().replace(/[\s-]/g, '');

    const item = specialItems.items.find(item => {
      const itemId = item.id.toLowerCase().replace(/[\s-]/g, '');
      const itemName = item.name.toLowerCase().replace(/[\s-]/g, '');
      const itemCategory = item.category.toLowerCase();

      return (
        itemId.includes(normalized) ||
        normalized.includes(itemId) ||
        itemName.includes(normalized) ||
        normalized.includes(itemName) ||
        itemCategory === normalized
      );
    });

    return item ? item.price : null;
  }, [specialItems]);

  // Utility: Calculate shipping cost by weight
  const calculateShippingCost = useCallback((weight: number, destination: string): number => {
    const rate = getRate(destination);
    return weight * rate;
  }, [getRate]);

  // Utility: Calculate special item cost
  const calculateSpecialItemCost = useCallback((categoryOrName: string): number | null => {
    const price = getSpecialItemPrice(categoryOrName);
    return price !== null ? price : null;
  }, [getSpecialItemPrice]);

  // Utility: Calculate total cost (shipping + service fee)
  const calculateTotalCost = useCallback((shippingCost: number): number => {
    return shippingCost + shippingRates.serviceFee;
  }, [shippingRates.serviceFee]);

  const value: SettingsContextType = {
    shippingRates,
    specialItems,
    isLoading,
    error,
    refetchSettings: fetchSettings,
    getRate,
    getSpecialItemPrice,
    calculateShippingCost,
    calculateSpecialItemCost,
    calculateTotalCost,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

/**
 * Hook to use settings context
 *
 * @example
 * const { shippingRates, getRate, calculateTotalCost } = useSettings();
 * const rate = getRate('Cap-Haïtien'); // 4.5
 * const total = calculateTotalCost(22.5); // 22.5 + 10 = 32.5
 */
export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);

  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
}

// Export for convenience
export { DEFAULT_SHIPPING_RATES, DEFAULT_SPECIAL_ITEMS };
