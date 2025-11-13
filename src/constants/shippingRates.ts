/**
 * @deprecated This file is deprecated. Use the SettingsContext instead.
 *
 * For React components:
 *   import { useSettings } from '@/contexts/SettingsContext';
 *   const { shippingRates, getRate } = useSettings();
 *
 * These constants are kept only for backward compatibility and will be removed.
 * All values should now come from the database via SettingsContext.
 */

// @deprecated - Use useSettings().shippingRates.serviceFee instead
export const SERVICE_FEE = 10; // Frais de service fixes en $

// @deprecated - Use useSettings().getRate(destination) instead
export const SHIPPING_RATES: Record<string, number> = {
  "cap-haitien": 4.5, // 4.5$/lbs
  "port-au-prince": 5, // 5$/lbs
} as const;

// @deprecated - Use useSettings().getSpecialItemPrice(category) instead
export const FIXED_ITEM_RATES: Record<string, number> = {
  "telephones": 60,
  "ordinateurs_portables": 90,
  "starlink": 120
};

// @deprecated - Use useSettings().getRate(destination) instead
export const getShippingRate = (destination: string): number => {
  console.warn('getShippingRate is deprecated. Use useSettings().getRate() instead.');

  const normalizedDestination = destination.toLowerCase().replace(/[\s-]/g, "");

  for (const city in SHIPPING_RATES) {
    if (normalizedDestination.includes(city.replace(/[\s-]/g, ""))) {
      return SHIPPING_RATES[city];
    }
  }

  // Tarif par défaut si aucune ville ne correspond
  return 5; // Port-au-Prince comme défaut
};