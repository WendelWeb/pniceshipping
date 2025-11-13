/**
 * Script d'initialisation des paramètres
 * À exécuter UNE FOIS pour créer la table settings et insérer les valeurs par défaut
 */

import { eq } from 'drizzle-orm';
import { db } from '../../configs/db-node.js';
import { settings } from '../../configs/schema.js';

// Default values
const DEFAULT_SHIPPING_RATES = {
  serviceFee: 10,
  rateCapHaitien: 4.5,
  ratePortAuPrince: 5,
};

const DEFAULT_SPECIAL_ITEMS = {
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

async function initializeSettings() {
  try {
    // Check if shipping_rates already exists
    const existingRates = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'shipping_rates'))
      .limit(1);

    if (existingRates.length === 0) {
      await db.insert(settings).values({
        key: 'shipping_rates',
        value: DEFAULT_SHIPPING_RATES,
      });
      console.log('✅ Shipping rates initialized');
    } else {
      console.log('ℹ️  Shipping rates already exist');
    }

    // Check if special_items already exists
    const existingItems = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'special_items'))
      .limit(1);

    if (existingItems.length === 0) {
      await db.insert(settings).values({
        key: 'special_items',
        value: DEFAULT_SPECIAL_ITEMS,
      });
      console.log('✅ Special items initialized');
    } else {
      console.log('ℹ️  Special items already exist');
    }

    return true;
  } catch (error) {
    console.error('Error initializing settings:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Initialisation des paramètres...');
  console.log('');

  try {
    const success = await initializeSettings();

    if (success) {
      console.log('');
      console.log('✅ Paramètres initialisés avec succès !');
      console.log('');
      console.log('📋 Valeurs par défaut :');
      console.log('  - Frais de service : 10$');
      console.log('  - Cap-Haïtien : 4.5$ /lbs');
      console.log('  - Port-au-Prince : 5$ /lbs');
      console.log('  - iPhones (5 catégories) : 35$ - 130$');
      console.log('  - Samsung (4 catégories - à configurer) : 0$');
      console.log('  - Ordinateurs : 90$');
      console.log('  - Starlink : 120$');
      console.log('');
      console.log('🎉 Vous pouvez maintenant gérer les tarifs depuis /admin/settings');
      process.exit(0);
    } else {
      console.error('❌ Erreur lors de l\'initialisation');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Erreur fatale :', error);
    process.exit(1);
  }
}

main();
