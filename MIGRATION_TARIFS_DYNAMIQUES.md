# 🚀 Guide de Migration - Tarifs Dynamiques

**Date**: 18 Octobre 2025
**Statut**: ✅ **Architecture Senior-Level Implémentée**

---

## 📋 Vue d'Ensemble

Le système de tarifs est maintenant **entièrement dynamique** grâce à un **Context Provider React** global qui sert de **source unique de vérité** pour toute l'application web.

### ✨ Avantages de la Nouvelle Architecture

1. **Single Source of Truth**: Tous les composants utilisent les mêmes données
2. **Auto-Refresh**: Mise à jour automatique toutes les 30 secondes
3. **Performance**: Les settings sont chargés une seule fois au niveau root
4. **Type Safety**: TypeScript complet avec IntelliSense
5. **Developer Experience**: API simple et intuitive

---

## 🏗️ Architecture Implémentée

### 1. Context Provider Global (`SettingsContext.tsx`)

**Fichier**: `src/contexts/SettingsContext.tsx`

```typescript
import { useSettings } from '@/contexts/SettingsContext';

const {
  shippingRates,      // { serviceFee, rateCapHaitien, ratePortAuPrince }
  specialItems,       // { items: [...] }
  isLoading,          // boolean
  error,              // Error | null
  refetchSettings,    // () => Promise<void>
  getRate,            // (destination: string) => number
  getSpecialItemPrice,// (categoryOrName: string) => number | null
  calculateShippingCost,
  calculateSpecialItemCost,
  calculateTotalCost,
} = useSettings();
```

### 2. Intégration dans App.tsx

```typescript
import { SettingsProvider } from "./contexts/SettingsContext";

<SettingsProvider autoRefreshInterval={30000}>
  <YourApp />
</SettingsProvider>
```

---

## ✅ Composants Déjà Migrés

### 1. **PricingCalculator** (`src/components/PricingCalculator.tsx`)

**Avant**:
```typescript
const [shippingRates, setShippingRates] = useState({...});
const [specialItems, setSpecialItems] = useState([]);

useEffect(() => {
  async function fetchSettings() {
    const rates = await getShippingRates();
    setShippingRates(rates);
  }
  fetchSettings();
}, []);
```

**Après**:
```typescript
const { shippingRates, specialItems, getRate } = useSettings();
const perLbsRate = getRate(destination); // Simple!
```

### 2. **ShipmentView** (`src/components/ShipmentView.tsx`)

**Avant**:
```typescript
const [shippingRates, setShippingRates] = useState({...});
// Fetch dans useEffect...
```

**Après**:
```typescript
const { shippingRates, specialItems } = useSettings();
// Pas de fetch nécessaire!
```

### 3. **Home.tsx** (`src/pages/Home.tsx`)

**Avant**:
```typescript
{
  title: "Tarification",
  items: [
    "Frais de service : 10 $",              // ❌ Hardcoded
    "Tarif au poids : 4,50 $ par livre",   // ❌ Hardcoded
  ]
}
```

**Après**:
```typescript
const { shippingRates, specialItems } = useSettings();
const shippingTerms = getShippingTerms(shippingRates, specialItems);
// Tous les tarifs sont maintenant dynamiques!
```

### 4. **Pricing.tsx** (`src/pages/Pricing.tsx`) ✨ **NOUVEAU**

**Avant**:
```typescript
// Hardcoded values in JSX
10$  // Service fee
4.5$ // Per pound rate
+90$ // Laptops
+60$ // Phones
```

**Après**:
```typescript
const { shippingRates, specialItems } = useSettings();
const laptopItem = specialItems.items.find(item => item.category === 'computer');
const phoneItem = specialItems.items.find(item => item.category === 'phone');

// In JSX:
{shippingRates.serviceFee}$
{shippingRates.rateCapHaitien}$ - {shippingRates.ratePortAuPrince}$
{laptopItem ? `+${laptopItem.price}$` : "+90$"}
{phoneItem ? `+${phoneItem.price}$` : "+60$"}
```

---

## 🔧 Comment Migrer un Composant

### Étape 1: Importer le Hook

```typescript
import { useSettings } from '@/contexts/SettingsContext';
```

### Étape 2: Remplacer les useState + useEffect

**Supprimer**:
```typescript
const [shippingRates, setShippingRates] = useState({...});
const [specialItems, setSpecialItems] = useState([]);

useEffect(() => {
  async function fetchSettings() {
    const [rates, items] = await Promise.all([
      getShippingRates(),
      getSpecialItems(),
    ]);
    setShippingRates(rates);
    setSpecialItems(items);
  }
  fetchSettings();
}, []);
```

**Remplacer par**:
```typescript
const { shippingRates, specialItems, getRate } = useSettings();
```

### Étape 3: Utiliser les Utilitaires

```typescript
// Au lieu de:
const rate = destination === 'port-au-prince' ? 5 : 4.5;

// Utiliser:
const rate = getRate(destination);

// Au lieu de:
const specialItem = specialItems.find(item => ...);

// Utiliser:
const price = getSpecialItemPrice('iphone-14');
```

---

## 📝 API Complète du Hook `useSettings()`

### Données

#### `shippingRates: ShippingRates`
```typescript
{
  serviceFee: number;           // 10
  rateCapHaitien: number;       // 4.5
  ratePortAuPrince: number;     // 5
}
```

#### `specialItems: SpecialItemsConfig`
```typescript
{
  items: Array<{
    id: string;                 // 'iphone-14-15pro'
    name: string;               // 'iPhone 14 à 15 Pro Max'
    price: number;              // 70
    category: 'phone' | 'computer' | 'other';
  }>
}
```

#### `isLoading: boolean`
Indique si les settings sont en cours de chargement

#### `error: Error | null`
Erreur éventuelle lors du chargement

### Fonctions Utilitaires

#### `getRate(destination: string): number`
```typescript
const rate = getRate('Cap-Haïtien');        // 4.5
const rate = getRate('Port-au-Prince');     // 5
const rate = getRate('PAP');                // 5 (normalise automatiquement)
```

#### `getSpecialItemPrice(categoryOrName: string): number | null`
```typescript
const price = getSpecialItemPrice('iphone-14');      // 70
const price = getSpecialItemPrice('laptop');         // 90
const price = getSpecialItemPrice('ordinateur');     // 90 (match partiel)
const price = getSpecialItemPrice('unknown');        // null
```

#### `calculateShippingCost(weight: number, destination: string): number`
```typescript
const cost = calculateShippingCost(5, 'Cap-Haïtien');  // 5 * 4.5 = 22.5
```

#### `calculateSpecialItemCost(categoryOrName: string): number | null`
```typescript
const cost = calculateSpecialItemCost('iphone-16');    // 100
```

#### `calculateTotalCost(shippingCost: number): number`
```typescript
const total = calculateTotalCost(22.5);  // 22.5 + 10 (serviceFee) = 32.5
```

#### `refetchSettings(): Promise<void>`
```typescript
await refetchSettings();  // Force un reload depuis la DB
```

---

## 🎯 Exemples d'Utilisation

### Exemple 1: Calculateur Simple

```typescript
function SimpleCalculator() {
  const { getRate, shippingRates, calculateTotalCost } = useSettings();
  const [weight, setWeight] = useState(5);
  const [destination, setDestination] = useState('Cap-Haïtien');

  const rate = getRate(destination);
  const shippingCost = weight * rate;
  const total = calculateTotalCost(shippingCost);

  return (
    <div>
      <p>Tarif: ${rate}/lbs</p>
      <p>Expédition: ${shippingCost}</p>
      <p>Service: ${shippingRates.serviceFee}</p>
      <p>Total: ${total}</p>
    </div>
  );
}
```

### Exemple 2: Article Spécial

```typescript
function SpecialItemCalculator() {
  const { getSpecialItemPrice, calculateTotalCost } = useSettings();
  const [item, setItem] = useState('iphone-14');

  const price = getSpecialItemPrice(item);
  const total = price ? calculateTotalCost(price) : 0;

  return (
    <div>
      {price ? (
        <>
          <p>Prix fixe: ${price}</p>
          <p>Total: ${total}</p>
        </>
      ) : (
        <p>Article non trouvé</p>
      )}
    </div>
  );
}
```

### Exemple 3: Détails de Colis

```typescript
function ShipmentDetails({ shipment }) {
  const { shippingRates, specialItems } = useSettings();

  const weight = parseFloat(shipment.weight);
  const destination = shipment.destination;
  const category = shipment.category;

  const rate = destination.includes('Port-au-Prince')
    ? shippingRates.ratePortAuPrince
    : shippingRates.rateCapHaitien;

  const matchingItem = specialItems.items.find(item =>
    item.name.toLowerCase().includes(category.toLowerCase())
  );

  const shippingCost = matchingItem
    ? matchingItem.price
    : weight * rate;

  const total = shippingCost + shippingRates.serviceFee;

  return (
    <div>
      <p>Type: {matchingItem ? 'Tarif fixe' : 'Par poids'}</p>
      <p>Expédition: ${shippingCost}</p>
      <p>Service: ${shippingRates.serviceFee}</p>
      <p className="font-bold">Total: ${total}</p>
    </div>
  );
}
```

---

## 🔍 Fichiers à Migrer Manuellement

Les fichiers suivants contiennent encore des références hardcodées et nécessitent une migration manuelle:

### Pages Admin
- `src/admin/add-shipment/AddShipment.tsx`
- `src/pages/ConfirmDeliveryPage.tsx`
- `src/pages/MarkShipmentAsAvailable.tsx`
- `src/pages/MarkShipmentAsTransit.tsx`
- `src/pages/MarkShipmentAsConfirmed.tsx`
- `src/pages/MarkShipmentAsDelivered.tsx`

### Pages Publiques
- ✅ ~~`src/pages/Home.tsx`~~ **MIGRÉ**
- ✅ ~~`src/pages/Pricing.tsx`~~ **MIGRÉ**
- `src/components/ShippingGuide.tsx`
- `src/components/HeroSection.tsx`
- `src/components/GetAQuote.tsx`

### Utilitaires
- `src/utils/shipmentQueries.ts`
- `src/services/emailServices.ts`

**Pour chaque fichier**:
1. Chercher les valeurs hardcodées: `4.5`, `5`, `10`, `SERVICE_FEE`, `SHIPPING_RATES`
2. Remplacer par `useSettings()` comme montré ci-dessus
3. Tester que les calculs sont corrects

---

## 🚨 Points d'Attention

### 1. Structure de `specialItems`

**Important**: `specialItems` est maintenant un objet avec une propriété `items`:

```typescript
// ❌ Ancien
specialItems.map(item => ...)

// ✅ Nouveau
specialItems.items.map(item => ...)
```

### 2. Auto-Refresh

Le Context Provider rafraîchit automatiquement les settings toutes les 30 secondes. Vous n'avez pas besoin de gérer ça manuellement.

### 3. Loading State

```typescript
const { isLoading } = useSettings();

if (isLoading) {
  return <LoadingSpinner />;
}
```

### 4. Error Handling

```typescript
const { error } = useSettings();

if (error) {
  // Le Context utilise les valeurs par défaut
  // Vous pouvez montrer un avertissement
  console.warn('Using default settings:', error);
}
```

---

## 📊 Comparaison Avant/Après

### Avant (❌ Ancien Système)

```typescript
// Chaque composant fetch individuellement
const [rates, setRates] = useState({...});

useEffect(() => {
  const fetchRates = async () => {
    const data = await getShippingRates();
    setRates(data);
  };
  fetchRates();
}, []);

// 🔴 Problèmes:
// - Plusieurs fetches inutiles
// - Pas de synchronisation
// - Pas de type safety
// - Difficile à maintenir
```

### Après (✅ Nouveau Système)

```typescript
// Un seul fetch global, partagé par tous
const { shippingRates, getRate } = useSettings();

// ✅ Avantages:
// - Un seul fetch au démarrage
// - Auto-refresh toutes les 30s
// - Type safety complet
// - API simple et claire
```

---

## 🧪 Tests

Pour tester qu'un composant utilise bien les tarifs dynamiques:

1. Modifier un tarif dans `/admin/settings`
2. Attendre 30 secondes maximum
3. Vérifier que le composant affiche le nouveau tarif

---

## 🎓 Best Practices

### DO ✅

```typescript
// Utiliser le hook
const { getRate, shippingRates } = useSettings();

// Utiliser les fonctions utilitaires
const rate = getRate(destination);

// Destructurer uniquement ce dont vous avez besoin
const { shippingRates } = useSettings();
```

### DON'T ❌

```typescript
// Ne pas hardcoder de valeurs
const rate = 4.5;  // ❌

// Ne pas fetch manuellement
const rates = await getShippingRates();  // ❌

// Ne pas importer les anciennes constantes
import { SHIPPING_RATES } from '@/constants/shippingRates';  // ❌ Deprecated
```

---

## 🔗 Fichiers Clés

1. **Context Provider**: `src/contexts/SettingsContext.tsx`
2. **App Root**: `src/App.tsx`
3. **Queries**: `src/utils/settingsQueries.ts`
4. **Constantes (deprecated)**: `src/constants/shippingRates.ts`

---

## 📞 Support

Si vous rencontrez des problèmes lors de la migration:

1. Vérifiez que le composant est bien dans l'arbre du `<SettingsProvider>`
2. Vérifiez les logs console pour les erreurs
3. Utilisez `isLoading` et `error` pour le debugging

---

**✨ Le système est maintenant production-ready avec une architecture senior-level ! ✨**
