/**
 * Settings queries for mobile app
 * Fetches dynamic shipping rates and special items from database
 */

import { db } from '../config/database';
import { settings } from '../config/schema';
import { eq } from 'drizzle-orm';

export interface ShippingRates {
  serviceFee: number;
  rateCapHaitien: number;
  ratePortAuPrince: number;
}

export interface SpecialItem {
  id: string;
  name: string;
  price: number;
  category: 'phone' | 'computer' | 'other';
}

export interface SpecialItemsConfig {
  items: SpecialItem[];
}

// Default values (fallback)
export const DEFAULT_SHIPPING_RATES: ShippingRates = {
  serviceFee: 10,
  rateCapHaitien: 4.5,
  ratePortAuPrince: 5,
};

export const DEFAULT_SPECIAL_ITEMS: SpecialItemsConfig = {
  items: [
    { id: 'iphone-xr-11pro', name: 'iPhone XR à 11 Pro Max', price: 35, category: 'phone' },
    { id: 'iphone-12-13pro', name: 'iPhone 12 à 13 Pro Max', price: 50, category: 'phone' },
    { id: 'iphone-14-15pro', name: 'iPhone 14 à 15 Pro Max', price: 70, category: 'phone' },
    { id: 'iphone-16-16pro', name: 'iPhone 16 à 16 Pro Max', price: 100, category: 'phone' },
    { id: 'iphone-17', name: 'iPhone 17', price: 130, category: 'phone' },
    { id: 'samsung-s6-10', name: 'Samsung S6-10', price: 0, category: 'phone' },
    { id: 'samsung-s10plus', name: 'Samsung S10+', price: 0, category: 'phone' },
    { id: 'samsung-game-a', name: 'Samsung Game A', price: 0, category: 'phone' },
    { id: 'other-phones', name: 'Autres téléphones', price: 0, category: 'phone' },
    { id: 'laptop', name: 'Ordinateurs Portables', price: 90, category: 'computer' },
    { id: 'starlink', name: 'Starlink', price: 120, category: 'other' },
  ],
};

/**
 * Get shipping rates from database
 */
export async function getShippingRates(): Promise<ShippingRates> {
  try {
    const result = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'shipping_rates'))
      .limit(1);

    if (result.length > 0 && result[0].value) {
      return result[0].value as ShippingRates;
    }

    return DEFAULT_SHIPPING_RATES;
  } catch (error) {
    console.error('Error fetching shipping rates:', error);
    return DEFAULT_SHIPPING_RATES;
  }
}

/**
 * Get special items configuration from database
 */
export async function getSpecialItems(): Promise<SpecialItemsConfig> {
  try {
    const result = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'special_items'))
      .limit(1);

    if (result.length > 0 && result[0].value) {
      return result[0].value as SpecialItemsConfig;
    }

    return DEFAULT_SPECIAL_ITEMS;
  } catch (error) {
    console.error('Error fetching special items:', error);
    return DEFAULT_SPECIAL_ITEMS;
  }
}
