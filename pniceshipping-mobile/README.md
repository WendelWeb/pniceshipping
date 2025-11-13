# 📦 Pnice Shipping Mobile App

Application mobile React Native Expo ultra-premium pour la gestion d'expéditions de colis vers Haïti.

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+ installé
- npm ou yarn
- Expo Go app sur votre téléphone (iOS/Android)
- Émulateur Android/iOS (optionnel)

### Installation des dépendances

```bash
cd pniceshipping-mobile
npm install --legacy-peer-deps
```

**Note:** Le flag `--legacy-peer-deps` est nécessaire pour résoudre les conflits de dépendances entre Clerk et React 19.

### Démarrage de l'application

```bash
# Démarrer avec cache nettoyé (recommandé première fois)
npx expo start --clear

# Ou sans nettoyage
npx expo start

# Si le port 8081 est occupé
npx expo start --port 19000
```

### Options de lancement

Une fois le serveur démarré, vous pouvez :
- **Appuyer sur `w`** → Ouvrir dans le navigateur web
- **Appuyer sur `a`** → Ouvrir sur émulateur Android
- **Appuyer sur `i`** → Ouvrir sur simulateur iOS (Mac requis)
- **Scanner le QR code** avec Expo Go sur votre téléphone

## 🛠️ Résolution de Problèmes

### Erreur: "Cannot find module 'react-native-worklets/plugin'"

**Solution:**
```bash
npm install --legacy-peer-deps react-native-worklets react-native-worklets-core
npx expo start --clear
```

### Erreur: "Port already in use"

**Solution:**
```bash
# Utiliser un autre port
npx expo start --port 19000
```

### Erreur: "Clerk authentication failed"

**Vérifiez que:**
1. Le fichier `.env` existe avec `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
2. La clé Clerk est correcte
3. Le scheme `pniceshipping` est configuré dans `app.json`

### Metro Bundler prend trop de temps

**Solution:**
```bash
# Nettoyer complètement le cache
rm -rf node_modules
npm install --legacy-peer-deps
npx expo start --clear
```

## 📱 Structure de l'Application

### Navigation (5 Tabs)

1. **News** 📰 - Actualités et promotions
2. **Track** 🔍 - Tracking public de colis
3. **Mes Colis** 📦 - Écran principal (au centre)
4. **Calculator** 🧮 - Calculateur de frais
5. **Profile** 👤 - Profil utilisateur

### Fonctionnalités Principales

#### Mes Colis (Écran Principal)
- Visualisation de tous vos colis
- 6 stats cards: Total, En Attente, Reçus, Transit, Disponible, Livrés
- Filtrage par statut
- Modal détaillé avec historique complet
- Pull-to-refresh

#### Calculator
- Sélection destination (Cap-Haïtien $4.5/lbs, Port-au-Prince $5/lbs)
- Mode Standard (par poids) ou Article spécial (prix fixe)
- Articles spéciaux: Téléphone ($60), Laptop ($90), Starlink ($120)
- Calcul automatique avec frais de service ($10)

#### Track
- Recherche publique par numéro de tracking
- Affichage de l'historique complet
- Timeline verticale animée

#### Profile
- Informations utilisateur (Clerk)
- Statistiques de colis
- Paramètres de l'app
- Déconnexion

## 🎨 Design System

### Couleurs
- **Fond:** Noir pur (#000000)
- **Cartes:** rgba(28, 28, 30, 0.95) - Glassmorphism
- **Accents:** Bleu (#007AFF), Indigo, Orange, Violet, Vert
- **Texte:** Blanc avec opacités variées

### Animations
- React Native Reanimated pour performances natives
- Haptic feedback sur toutes les interactions
- Animations spring naturelles
- FadeInDown séquentiels

### Espacements
- xs: 4px, sm: 8px, base: 16px, lg: 20px, xl: 24px

## 🔧 Technologies Utilisées

### Core
- **React Native** - Framework mobile
- **Expo SDK 54** - Toolchain et services
- **TypeScript** - Typage statique
- **React Navigation** - Navigation bottom tabs

### UI & Animations
- **React Native Reanimated** - Animations natives
- **Expo Linear Gradient** - Gradients
- **Expo Blur** - Effets de flou (iOS)
- **Expo Haptics** - Retours haptiques

### Backend & Auth
- **Clerk** - Authentification
- **Neon PostgreSQL** - Base de données
- **Drizzle ORM** - ORM TypeScript

### Icons
- **@expo/vector-icons** (Ionicons)

## 📂 Structure des Fichiers

```
pniceshipping-mobile/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── Button.tsx       # Bouton avec haptics
│   │   ├── Card.tsx         # Carte glassmorphism
│   │   ├── LoadingScreen.tsx
│   │   ├── ShipmentCard.tsx
│   │   └── StatusBadge.tsx
│   ├── config/              # Configuration
│   │   ├── database.ts      # Connexion Neon
│   │   └── schema.ts        # Schema Drizzle
│   ├── constants/           # Constantes
│   │   ├── shippingRates.ts # Tarifs
│   │   └── theme.ts         # Design system
│   ├── navigation/          # Navigation
│   │   └── TabNavigator.tsx # 5 tabs bottom
│   ├── screens/             # Écrans
│   │   ├── NewsScreen.tsx
│   │   ├── TrackScreen.tsx
│   │   ├── ShipmentsScreen.tsx
│   │   ├── CalculatorScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/            # Services API
│   │   └── shipmentService.ts
│   └── types/               # Types TypeScript
│       └── index.ts
├── App.tsx                  # Point d'entrée
├── app.json                 # Config Expo
├── babel.config.js          # Config Babel
├── .env                     # Variables d'env
└── package.json             # Dépendances
```

## 🔐 Configuration de l'Authentification

### Clerk Setup

1. Créer un compte sur [Clerk](https://clerk.com)
2. Créer une application
3. Copier la "Publishable Key"
4. Ajouter dans `.env`:
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Database Setup

1. Créer une base de données sur [Neon](https://neon.tech)
2. Copier l'URL de connexion
3. Ajouter dans `.env`:
```env
EXPO_PUBLIC_DATABASE_URL=postgresql://...
```

## 📝 Variables d'Environnement

Créer un fichier `.env` à la racine avec:

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGVsaWNhdGUtZG9yeS05OC5jbGVyay5hY2NvdW50cy5kZXYk
EXPO_PUBLIC_DATABASE_URL=postgresql://pniceshipping_owner:npg_...@ep-falling-sea-a58tf9ru-pooler.us-east-2.aws.neon.tech/pniceshipping?sslmode=require
```

## 🚢 Déploiement

### Build pour Production

#### Android (APK)
```bash
eas build --platform android --profile preview
```

#### iOS (Simulateur)
```bash
eas build --platform ios --profile preview
```

#### App Store / Play Store
```bash
# Configurer EAS
npm install -g eas-cli
eas login
eas build:configure

# Build production
eas build --platform all
eas submit --platform android
eas submit --platform ios
```

## 📊 Statuts de Colis

- **En attente⏳** - Colis en attente de confirmation
- **Recu📦** - Colis reçu et confirmé
- **En Transit✈️** - Colis en route vers Haïti
- **Disponible🟢** - Colis arrivé, prêt à récupérer
- **Livré✅** - Colis remis au destinataire

## 💰 Tarification

### Standard (par poids)
- Cap-Haïtien: **$4.5/lbs**
- Port-au-Prince: **$5/lbs**
- Frais de service: **$10** (fixe)
- Maximum: **40 lbs** par colis

### Articles Spéciaux (prix fixe)
- Téléphone: **$60**
- Ordinateur Portable: **$90**
- Starlink: **$120**
- Frais de service: **$10** (inclus)

## 🤝 Contribution

Ce projet est privé. Pour toute question, contactez l'équipe Pnice Shipping.

## 📞 Support

- **Email:** pniceshipping@gmail.com
- **Téléphone:** +509 31 97 0548
- **WhatsApp:** [Contactez-nous](https://wa.me/50931970548)
- **Adresse:** 8298 Northwest 68th Street Miami FL, 33195

## 📄 License

© 2025 Pnice Shipping. Tous droits réservés.

---

## 🎯 Checklist Avant Lancement

- [ ] Tester sur iOS (iPhone 11+)
- [ ] Tester sur Android (Android 11+)
- [ ] Vérifier l'authentification Clerk
- [ ] Tester les appels API
- [ ] Vérifier les animations
- [ ] Tester les haptics
- [ ] Vérifier les empty states
- [ ] Tester le pull-to-refresh
- [ ] Vérifier le responsive design
- [ ] Tester la déconnexion
- [ ] Vérifier les permissions
- [ ] Tester sur réseau lent

## 🔥 Features à Venir

- [ ] Notifications push
- [ ] Paiements intégrés
- [ ] Scanner de code-barres
- [ ] Mode hors ligne
- [ ] Partage de tracking
- [ ] Multi-langue (Créole)
- [ ] Mode clair

---

**Développé avec ❤️ pour Pnice Shipping**
