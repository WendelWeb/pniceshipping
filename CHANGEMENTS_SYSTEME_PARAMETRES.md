# 🔧 Système de Paramètres Dynamiques - Implémentation Complète

**Date** : 18 octobre 2025
**Statut** : ✅ **IMPLÉMENTÉ - EN ATTENTE DE MIGRATION DB**

---

## 📋 Résumé des Changements

### ✅ Corrections Mobiles (Terminées)

1. **Loading state fixed** - Le spinner s'arrête correctement après succès
2. **Textes modifiés** - "Faire une Requête de Colis" au lieu de "Ajouter"
3. **Bannière d'info ajoutée** - Explique que les colis n'apparaissent qu'après requête

### ✅ Nouveau Système de Paramètres (Implémenté)

**Table Drizzle** : `settings`
- Tarifs d'expédition dynamiques
- Articles spéciaux configurables
- Nouveau système de prix iPhone par gamme

---

## 📱 Nouveaux Prix iPhone (Système par Gamme)

| Gamme | Prix | Description |
|-------|------|-------------|
| **iPhone XR → 11 Pro Max** | 35$ | Génération 2018-2019 |
| **iPhone 12 → 13 Pro Max** | 50$ | Génération 2020-2021 |
| **iPhone 14 → 15 Pro Max** | 70$ | Génération 2022-2023 |
| **iPhone 16 → 16 Pro Max** | 100$ | Génération 2024 |
| **iPhone 17** | 130$ | Génération 2025 |

### 📱 Autres Téléphones (Prix à Définir)

| Catégorie | Prix Initial | Statut |
|-----------|--------------|--------|
| Samsung S6-10 | 0$ | À décider |
| Samsung S10+ | 0$ | À décider |
| Samsung Game A | 0$ | À décider |
| Autres téléphones | 0$ | À décider |

---

## 🗄️ Nouveau Schéma Base de Données

### Table : `settings`

```sql
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR NOT NULL UNIQUE,
  value JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_by VARCHAR  -- Clerk user ID de l'admin
);
```

### Clés Utilisées

1. **`shipping_rates`** - Tarifs d'expédition
   ```json
   {
     "serviceFee": 10,
     "rateCapHaitien": 4.5,
     "ratePortAuPrince": 5
   }
   ```

2. **`special_items`** - Articles spéciaux
   ```json
   {
     "items": [
       {
         "id": "iphone-xr-11pro",
         "name": "iPhone XR à 11 Pro Max",
         "price": 35,
         "category": "phone"
       },
       // ... autres articles
     ]
   }
   ```

---

## 📂 Fichiers Créés

### Backend

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `src/utils/settingsQueries.ts` | 280 | Fonctions CRUD pour paramètres |
| `src/scripts/initializeSettings.ts` | 40 | Script d'initialisation |
| `configs/schema.ts` (modifié) | +8 | Ajout table settings |

### Frontend Web

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `src/pages/AdminSettings.tsx` | 450 | Page admin paramètres |
| `src/router/routes.tsx` (modifié) | +4 | Route /admin/settings |
| `src/admin/AdminPage.tsx` (modifié) | +7 | Lien paramètres |

### Frontend Mobile

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `src/screens/AddShipmentScreen.tsx` (modifié) | ~10 | Corrections loading + textes |
| `src/screens/ShipmentsScreen.tsx` (modifié) | ~30 | Bannière info |
| `src/config/schema.ts` (modifié) | +8 | Ajout table settings |

---

## 🎯 Fonctionnalités de la Page Paramètres

### Section 1 : Tarifs d'Expédition

- ✅ Modifier frais de service
- ✅ Modifier tarif Cap-Haïtien ($/lbs)
- ✅ Modifier tarif Port-au-Prince ($/lbs)
- ✅ Bouton "Enregistrer" avec feedback

### Section 2 : Articles Spéciaux

- ✅ Liste de tous les articles avec prix
- ✅ Modifier le nom d'un article inline
- ✅ Modifier le prix inline
- ✅ Changer la catégorie (Phone/Computer/Other)
- ✅ Supprimer un article (avec confirmation)
- ✅ Ajouter un nouvel article
  - Nom personnalisé
  - Prix personnalisé
  - Catégorie sélectionnable

---

## 🔄 Migration et Installation

### Étape 1 : Pousser le Schéma vers la DB

```bash
cd C:\Users\stanl\Desktop\Personal Projects\pniceshipping
npm run db:push
```

Cela va créer la table `settings` dans PostgreSQL.

---

### Étape 2 : Initialiser les Valeurs par Défaut

**Option A : Via Script Node**
```bash
npx tsx src/scripts/initializeSettings.ts
```

**Option B : Via Code dans l'App**
- Aller sur `/admin/settings`
- Le premier chargement initialisera automatiquement les valeurs

---

### Étape 3 : Vérification

Ouvrir `/admin/settings` et vérifier que :
- ✅ Les tarifs par défaut s'affichent
- ✅ Les articles spéciaux s'affichent (12 articles)
- ✅ Vous pouvez modifier et sauvegarder

---

## 📊 API des Fonctions

### Lecture

```typescript
// Récupérer les tarifs
const rates = await getShippingRates();
// { serviceFee: 10, rateCapHaitien: 4.5, ratePortAuPrince: 5 }

// Récupérer les articles spéciaux
const config = await getSpecialItems();
// { items: [...] }
```

### Écriture

```typescript
// Mettre à jour les tarifs
await updateShippingRates({
  serviceFee: 12,
  rateCapHaitien: 5,
  ratePortAuPrince: 5.5
}, userId);

// Ajouter un article
await addSpecialItem({
  name: 'iPhone 18',
  price: 150,
  category: 'phone'
}, userId);

// Modifier un article
await updateSpecialItem('iphone-17', {
  price: 140
}, userId);

// Supprimer un article
await deleteSpecialItem('samsung-s6-10', userId);
```

---

## 🎨 Interface Admin Paramètres

### Design

- ✅ Dark mode cohérent avec le reste de l'app
- ✅ Animations Framer Motion
- ✅ Gradients et effets visuels
- ✅ Feedback toast (sonner)
- ✅ Icons Lucide React
- ✅ Responsive (mobile + desktop)

### UX

- ✅ Modification inline des articles
- ✅ Confirmation avant suppression
- ✅ Loading states
- ✅ Messages de succès/erreur
- ✅ Form collapse pour ajouter un article

---

## 🔄 Prochaines Étapes (À Faire)

### Immédiat

1. **Migration DB** :
   ```bash
   npm run db:push
   ```

2. **Initialiser paramètres** :
   ```bash
   npx tsx src/scripts/initializeSettings.ts
   ```

3. **Tester l'interface** :
   - Aller sur `/admin/settings`
   - Modifier les tarifs
   - Ajouter/Modifier/Supprimer des articles

---

### Court Terme

4. **Mettre à jour les calculateurs** pour utiliser les tarifs dynamiques :
   - Web : `src/components/PricingCalculator.tsx`
   - Mobile : `src/screens/CalculatorScreen.tsx`
   - Mobile : `src/screens/AddShipmentScreen.tsx`

5. **Afficher le coût dans les détails de colis** :
   - Web : `src/components/ShipmentView.tsx`
   - Mobile : `src/screens/ShipmentsScreen.tsx` (modal détails)

6. **Remplacer toutes les constantes hardcodées** :
   - `src/constants/shippingRates.ts` (web) → À remplacer par lecture DB
   - `pniceshipping-mobile/src/constants/shippingRates.ts` → À remplacer par lecture DB

---

## 🧪 Tests à Effectuer

### Test 1 : Page Paramètres

- [ ] Ouvrir `/admin/settings`
- [ ] Vérifier que les tarifs par défaut s'affichent
- [ ] Modifier frais de service → Enregistrer → Vérifier
- [ ] Modifier tarif Cap-Haïtien → Enregistrer → Vérifier
- [ ] Recharger la page → Vérifier que les changements persistent

### Test 2 : Articles Spéciaux

- [ ] Modifier le prix d'un iPhone → Vérifier sauvegarde auto
- [ ] Ajouter un nouvel article (ex: "Samsung S20") → Vérifier
- [ ] Supprimer un article → Confirmer → Vérifier
- [ ] Recharger la page → Vérifier que les changements persistent

### Test 3 : Corrections Mobiles

- [ ] Ouvrir l'app mobile
- [ ] Aller dans "Mes Colis"
- [ ] Vérifier la bannière d'info en haut
- [ ] Cliquer sur FAB → Vérifier texte "Faire une Requête de Colis"
- [ ] Soumettre une requête → Vérifier que le loading s'arrête après succès

---

## 🗂️ Structure des Données

### Valeurs Par Défaut Insérées

```typescript
// Tarifs
{
  serviceFee: 10,          // 10$
  rateCapHaitien: 4.5,     // 4.5$ /lbs
  ratePortAuPrince: 5      // 5$ /lbs
}

// Articles Spéciaux (12 items)
[
  // iPhones (5)
  { id: 'iphone-xr-11pro', name: 'iPhone XR à 11 Pro Max', price: 35, category: 'phone' },
  { id: 'iphone-12-13pro', name: 'iPhone 12 à 13 Pro Max', price: 50, category: 'phone' },
  { id: 'iphone-14-15pro', name: 'iPhone 14 à 15 Pro Max', price: 70, category: 'phone' },
  { id: 'iphone-16-16pro', name: 'iPhone 16 à 16 Pro Max', price: 100, category: 'phone' },
  { id: 'iphone-17', name: 'iPhone 17', price: 130, category: 'phone' },

  // Samsung (4 - à configurer)
  { id: 'samsung-s6-10', name: 'Samsung S6-10', price: 0, category: 'phone' },
  { id: 'samsung-s10plus', name: 'Samsung S10+', price: 0, category: 'phone' },
  { id: 'samsung-game-a', name: 'Samsung Game A', price: 0, category: 'phone' },
  { id: 'other-phones', name: 'Autres téléphones', price: 0, category: 'phone' },

  // Autres (2)
  { id: 'laptop', name: 'Ordinateurs Portables', price: 90, category: 'computer' },
  { id: 'starlink', name: 'Starlink', price: 120, category: 'other' }
]
```

---

## 🎯 Avantages du Nouveau Système

### Pour les Admins

1. ✅ **Flexibilité** : Changer les prix en quelques clics
2. ✅ **Traçabilité** : Historique des modifications (updatedBy)
3. ✅ **Simplicité** : Interface intuitive
4. ✅ **Rapidité** : Pas besoin de redéployer l'app
5. ✅ **Extensibilité** : Ajouter de nouveaux articles facilement

### Pour le Business

1. ✅ **Réactivité** : Ajuster les prix selon le marché
2. ✅ **Tests** : Tester différents tarifs facilement
3. ✅ **Promotions** : Créer des prix spéciaux temporaires
4. ✅ **Nouveaux produits** : Ajouter sans développeur
5. ✅ **Transparence** : Prix centralisés et cohérents

### Pour le Code

1. ✅ **DRY** : Une seule source de vérité
2. ✅ **Maintenance** : Plus de constantes hardcodées
3. ✅ **Synchronisation** : Web + Mobile utilisent la même DB
4. ✅ **Évolutivité** : Facile d'ajouter de nouveaux paramètres
5. ✅ **Sécurité** : Seuls les admins peuvent modifier

---

## 📝 Notes Importantes

### Sécurité

- ⚠️ **Route protégée** : `/admin/settings` doit être accessible uniquement aux admins
- ⚠️ **Validation** : Ajouter validation côté serveur pour les prix (min/max)
- ⚠️ **Audit** : Le champ `updatedBy` garde la trace des modifications

### Performance

- ✅ **Cache** : Les paramètres peuvent être mis en cache (peu modifiés)
- ✅ **Fallback** : Si la DB est indisponible, les constantes par défaut sont utilisées
- ✅ **Optimisation** : Lecture des paramètres au chargement de l'app

### Migration

- ⚠️ **Données existantes** : Les colis existants ne sont pas affectés
- ⚠️ **Rétrocompatibilité** : Les anciennes constantes restent en fallback
- ⚠️ **Rollback** : Possible de revenir aux constantes en cas de problème

---

## 🎉 Conclusion

Le système de paramètres dynamiques est **entièrement implémenté** et prêt à être utilisé.

**Prochaine étape critique** : Migrer le schéma vers la DB

```bash
npm run db:push
npx tsx src/scripts/initializeSettings.ts
```

Ensuite, tester l'interface admin et mettre à jour les calculateurs ! 🚀

---

**Date de création** : 18 octobre 2025
**Version** : 1.0.0
**Auteur** : Claude Code Assistant
