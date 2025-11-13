import { db } from "../../configs";
import { settings } from "../../configs/schema";
import { eq } from "drizzle-orm";

// Types pour les paramètres
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

// Valeurs par défaut
export const DEFAULT_SHIPPING_RATES: ShippingRates = {
  serviceFee: 10,
  rateCapHaitien: 4.5,
  ratePortAuPrince: 5,
};

export const DEFAULT_SPECIAL_ITEMS: SpecialItemsConfig = {
  items: [
    // iPhones
    { id: 'iphone-xr-11pro', name: 'iPhone XR à 11 Pro Max', price: 35, category: 'phone' },
    { id: 'iphone-12-13pro', name: 'iPhone 12 à 13 Pro Max', price: 50, category: 'phone' },
    { id: 'iphone-14-15pro', name: 'iPhone 14 à 15 Pro Max', price: 70, category: 'phone' },
    { id: 'iphone-16-16pro', name: 'iPhone 16 à 16 Pro Max', price: 100, category: 'phone' },
    { id: 'iphone-17', name: 'iPhone 17', price: 130, category: 'phone' },

    // Samsung (À décider - prix 0 pour l'instant)
    { id: 'samsung-s6-10', name: 'Samsung S6-10', price: 0, category: 'phone' },
    { id: 'samsung-s10plus', name: 'Samsung S10+', price: 0, category: 'phone' },
    { id: 'samsung-game-a', name: 'Samsung Game A', price: 0, category: 'phone' },
    { id: 'other-phones', name: 'Autres téléphones', price: 0, category: 'phone' },

    // Autres catégories
    { id: 'laptop', name: 'Ordinateurs Portables', price: 90, category: 'computer' },
    { id: 'starlink', name: 'Starlink', price: 120, category: 'other' },
  ],
};

/**
 * Récupérer les tarifs d'expédition
 */
export async function getShippingRates(): Promise<ShippingRates> {
  try {
    const result = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'shipping_rates'))
      .limit(1);

    if (result.length > 0) {
      return result[0].value as ShippingRates;
    }

    // Si pas de données, retourner les valeurs par défaut
    return DEFAULT_SHIPPING_RATES;
  } catch (error) {
    console.error('Error fetching shipping rates:', error);
    return DEFAULT_SHIPPING_RATES;
  }
}

/**
 * Mettre à jour les tarifs d'expédition
 */
export async function updateShippingRates(
  rates: ShippingRates,
  updatedBy?: string
): Promise<boolean> {
  try {
    const existing = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'shipping_rates'))
      .limit(1);

    if (existing.length > 0) {
      // Update
      await db
        .update(settings)
        .set({
          value: rates,
          updatedAt: new Date(),
          updatedBy,
        })
        .where(eq(settings.key, 'shipping_rates'));
    } else {
      // Insert
      await db.insert(settings).values({
        key: 'shipping_rates',
        value: rates,
        updatedBy,
      });
    }

    return true;
  } catch (error) {
    console.error('Error updating shipping rates:', error);
    return false;
  }
}

/**
 * Récupérer les articles spéciaux
 */
export async function getSpecialItems(): Promise<SpecialItemsConfig> {
  try {
    const result = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'special_items'))
      .limit(1);

    if (result.length > 0) {
      return result[0].value as SpecialItemsConfig;
    }

    // Si pas de données, retourner les valeurs par défaut
    return DEFAULT_SPECIAL_ITEMS;
  } catch (error) {
    console.error('Error fetching special items:', error);
    return DEFAULT_SPECIAL_ITEMS;
  }
}

/**
 * Mettre à jour les articles spéciaux
 */
export async function updateSpecialItems(
  items: SpecialItemsConfig,
  updatedBy?: string
): Promise<boolean> {
  try {
    const existing = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'special_items'))
      .limit(1);

    if (existing.length > 0) {
      // Update
      await db
        .update(settings)
        .set({
          value: items,
          updatedAt: new Date(),
          updatedBy,
        })
        .where(eq(settings.key, 'special_items'));
    } else {
      // Insert
      await db.insert(settings).values({
        key: 'special_items',
        value: items,
        updatedBy,
      });
    }

    return true;
  } catch (error) {
    console.error('Error updating special items:', error);
    return false;
  }
}

/**
 * Ajouter un nouvel article spécial
 */
export async function addSpecialItem(
  item: Omit<SpecialItem, 'id'>,
  updatedBy?: string
): Promise<boolean> {
  try {
    const config = await getSpecialItems();
    const newId = item.name.toLowerCase().replace(/\s+/g, '-');

    const newItem: SpecialItem = {
      ...item,
      id: newId,
    };

    config.items.push(newItem);
    return await updateSpecialItems(config, updatedBy);
  } catch (error) {
    console.error('Error adding special item:', error);
    return false;
  }
}

/**
 * Supprimer un article spécial
 */
export async function deleteSpecialItem(
  itemId: string,
  updatedBy?: string
): Promise<boolean> {
  try {
    const config = await getSpecialItems();
    config.items = config.items.filter(item => item.id !== itemId);
    return await updateSpecialItems(config, updatedBy);
  } catch (error) {
    console.error('Error deleting special item:', error);
    return false;
  }
}

/**
 * Mettre à jour un article spécial
 */
export async function updateSpecialItem(
  itemId: string,
  updates: Partial<Omit<SpecialItem, 'id'>>,
  updatedBy?: string
): Promise<boolean> {
  try {
    const config = await getSpecialItems();
    const itemIndex = config.items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      console.error('Item not found:', itemId);
      return false;
    }

    config.items[itemIndex] = {
      ...config.items[itemIndex],
      ...updates,
    };

    return await updateSpecialItems(config, updatedBy);
  } catch (error) {
    console.error('Error updating special item:', error);
    return false;
  }
}

/**
 * Initialiser les paramètres par défaut (à exécuter une fois)
 */
export async function initializeSettings(): Promise<boolean> {
  try {
    // Vérifier si les paramètres existent déjà
    const existingRates = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'shipping_rates'))
      .limit(1);

    const existingItems = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'special_items'))
      .limit(1);

    // Insérer les valeurs par défaut si elles n'existent pas
    if (existingRates.length === 0) {
      await db.insert(settings).values({
        key: 'shipping_rates',
        value: DEFAULT_SHIPPING_RATES,
      });
      console.log('✅ Shipping rates initialized');
    }

    if (existingItems.length === 0) {
      await db.insert(settings).values({
        key: 'special_items',
        value: DEFAULT_SPECIAL_ITEMS,
      });
      console.log('✅ Special items initialized');
    }

    return true;
  } catch (error) {
    console.error('Error initializing settings:', error);
    return false;
  }
}
