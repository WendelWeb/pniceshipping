// Shipping Rates Configuration
export const SERVICE_FEE = 10; // Fixed service fee in $

export const SHIPPING_RATES: Record<string, number> = {
  'cap-haitien': 4.5, // $4.5/lbs
  'port-au-prince': 5, // $5/lbs
} as const;

// Fixed rates for special items
export const FIXED_ITEM_RATES: Record<string, number> = {
  telephones: 60,
  ordinateurs_portables: 90,
  starlink: 120,
};

export const getShippingRate = (destination: string): number => {
  const normalizedDestination = destination.toLowerCase().replace(/[\s-]/g, '');

  for (const city in SHIPPING_RATES) {
    if (normalizedDestination.includes(city.replace(/[\s-]/g, ''))) {
      return SHIPPING_RATES[city];
    }
  }

  // Default rate if no match found
  return 5; // Port-au-Prince as default
};

export const calculateShippingCost = (
  weight: number,
  destination: string,
  category?: string
): { shippingCost: number; serviceFee: number; totalCost: number } => {
  let shippingCost = 0;

  if (category) {
    const normalizedCategory = category
      .toLowerCase()
      .replace(/[\s-]/g, '')
      .replace(/[éèê]/g, 'e');

    const mappedCategory = {
      telephone: 'telephones',
      telephones: 'telephones',
      ordinateurportable: 'ordinateurs_portables',
      ordinateursportables: 'ordinateurs_portables',
      starlink: 'starlink',
    }[normalizedCategory];

    if (mappedCategory && mappedCategory in FIXED_ITEM_RATES) {
      shippingCost = FIXED_ITEM_RATES[mappedCategory];
    } else {
      const rate = getShippingRate(destination);
      shippingCost = weight * rate;
    }
  } else {
    const rate = getShippingRate(destination);
    shippingCost = weight * rate;
  }

  const totalCost = shippingCost + SERVICE_FEE;

  return {
    shippingCost: Math.round(shippingCost * 100) / 100,
    serviceFee: SERVICE_FEE,
    totalCost: Math.round(totalCost * 100) / 100,
  };
};
