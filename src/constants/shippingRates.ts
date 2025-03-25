// @/config/shippingRates.ts
export const SERVICE_FEE = 10; // Frais de service fixes en $

export const SHIPPING_RATES: Record<string, number> = {
  "cap-haitien": 4, // 4$/lbs
  "port-au-prince": 4.5, // 4.5$/lbs
  // Exemple d'extension future : "gonaives": 5
} as const;

export const getShippingRate = (destination: string): number => {
  const normalizedDestination = destination.toLowerCase().replace(/[\s-]/g, "");
  
  for (const city in SHIPPING_RATES) {
    if (normalizedDestination.includes(city.replace(/[\s-]/g, ""))) {
      return SHIPPING_RATES[city];
    }
  }
  
  // Tarif par défaut si aucune ville ne correspond
  return 4.5; // Port-au-Prince comme défaut
};