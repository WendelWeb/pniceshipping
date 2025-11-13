# Guide Complet de Déploiement - Pnice Shipping Mobile

Ce guide vous accompagne de A à Z pour publier votre application sur Google Play Store et Apple App Store.

---

## 📋 PRÉREQUIS

### Comptes nécessaires:
1. **Compte Expo** (gratuit) - https://expo.dev
2. **Google Play Console** (25 USD unique) - https://play.google.com/console
3. **Apple Developer Program** (99 USD/an) - https://developer.apple.com

### Logiciels à installer:
```bash
# Si pas déjà installé
npm install -g eas-cli
```

---

## 🎯 ÉTAPE 1: PRÉPARATION DES ASSETS

### 1.1 Icône de l'application
- **Taille**: 1024x1024 px (PNG)
- **Pas d'alpha/transparence** (sauf pour iOS)
- **Fichier**: `./assets/icon.png`

### 1.2 Splash Screen
- **Taille**: 1284x2778 px minimum
- **Fichier**: `./assets/splash-icon.png`

### 1.3 Adaptive Icon (Android uniquement)
- **Taille**: 1024x1024 px
- **Fichier**: `./assets/adaptive-icon.png`
- L'icône doit être centrée dans un carré de 432x432 px (safe zone)

### ✅ Vérifier que ces fichiers existent et sont corrects

---

## 🚀 ÉTAPE 2: CONFIGURATION EXPO EAS

### 2.1 Se connecter à Expo
```bash
cd pniceshipping-mobile
eas login
```
Entrez vos identifiants Expo (créez un compte sur expo.dev si nécessaire)

### 2.2 Initialiser le projet EAS
```bash
eas init
```
Cette commande va:
- Créer un projet sur Expo
- Générer un Project ID
- Mettre à jour automatiquement `app.json`

### 2.3 Vérifier la configuration
```bash
eas build:configure
```

---

## 📱 ÉTAPE 3: BUILD ANDROID (Google Play Store)

### 3.1 Créer un compte Google Play Console
1. Allez sur https://play.google.com/console
2. Créez un compte développeur (25 USD unique)
3. Remplissez toutes les informations requises
4. Attendez la vérification (peut prendre 48h)

### 3.2 Générer le premier build Android
```bash
eas build --platform android --profile production
```

Ce processus va:
- Créer automatiquement les clés de signature (keystore)
- Générer un fichier `.aab` (Android App Bundle)
- Le build prend environ 10-20 minutes

### 3.3 Télécharger le build
Une fois terminé, téléchargez le fichier `.aab` depuis:
- Le lien dans votre terminal, OU
- https://expo.dev/accounts/[votre-compte]/projects/pniceshipping-mobile/builds

---

## 📤 ÉTAPE 4: PUBLICATION SUR GOOGLE PLAY STORE

### 4.1 Créer l'application dans Play Console
1. Connectez-vous à https://play.google.com/console
2. Cliquez sur "Create app"
3. Remplissez:
   - **Nom**: Pnice Shipping
   - **Langue par défaut**: Français (ou Anglais)
   - **Type**: Application
   - **Gratuit/Payant**: Gratuit

### 4.2 Configurer le contenu de l'application

#### a) Catégorie de l'application
- **Catégorie**: Business
- **Balises**: Shipping, Logistics, Tracking

#### b) Questionnaire de contenu
- Répondez aux questions sur la confidentialité
- Politique de confidentialité: Vous devez créer une page (vous pouvez utiliser https://app-privacy-policy-generator.firebaseapp.com/)

#### c) Classification du contenu
- Indiquez que c'est une application de logistique/business
- Pas de contenu pour adultes

### 4.3 Préparer le Store Listing

#### Screenshots requis:
- **Téléphone**: Minimum 2 screenshots (1080x1920 ou 1080x2340)
- **Tablette 7"**: Minimum 2 screenshots (1200x1920)
- **Tablette 10"**: Minimum 2 screenshots (1800x2560)

Utilisez un émulateur ou appareil réel pour prendre les screenshots.

#### Textes:
```
Titre: Pnice Shipping - Track & Ship

Description courte (80 caractères max):
Track shipments between Miami and Haiti. Real-time updates.

Description complète:
Pnice Shipping est votre application de référence pour le suivi et la gestion de vos envois entre Miami et Haïti.

Fonctionnalités principales:
✈️ Suivi en temps réel de vos colis
📦 Gestion de tous vos envois
💰 Calculateur de frais de port
🌍 Support multilingue (Français, Anglais, Espagnol, Créole haïtien)
🔔 Notifications instantanées
📱 Interface moderne et intuitive

Que vous soyez un particulier ou une entreprise, Pnice Shipping vous offre une solution complète pour gérer vos envois en toute simplicité.

Suivez vos colis depuis Miami jusqu'en Haïti, calculez vos frais de port à l'avance, et restez informé à chaque étape du processus.

Support client disponible pour toute question.
```

#### Graphiques:
- **Icône**: 512x512 (déjà préparée)
- **Bannière**: 1024x500 (créer une image avec logo + slogan)

### 4.4 Upload du build
1. Dans Play Console → votre app → "Production"
2. Cliquez sur "Create new release"
3. Uploadez le fichier `.aab` téléchargé
4. Remplissez les notes de version:
   ```
   Version 1.0.0
   - Lancement initial de l'application
   - Suivi de colis en temps réel
   - Calculateur de frais
   - Support multilingue
   ```

### 4.5 Soumettre pour examen
1. Vérifiez toutes les sections (toutes doivent être ✅)
2. Cliquez sur "Review release"
3. Puis "Start rollout to Production"

⏰ **Temps d'examen**: Généralement 1-3 jours

---

## 🍎 ÉTAPE 5: BUILD iOS (Apple App Store)

### 5.1 S'inscrire au Apple Developer Program
1. Allez sur https://developer.apple.com
2. Inscrivez-vous (99 USD/an)
3. Attendez l'approbation (24-48h)

### 5.2 Créer l'App dans App Store Connect
1. Connectez-vous à https://appstoreconnect.apple.com
2. "My Apps" → "+" → "New App"
3. Remplissez:
   - **Platform**: iOS
   - **Name**: Pnice Shipping
   - **Primary Language**: French ou English
   - **Bundle ID**: com.pniceshipping.mobile
   - **SKU**: pniceshipping-mobile-001

### 5.3 Configurer l'identifiant Apple dans eas.json
Dans `app.json`, mettez à jour:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.pniceshipping.mobile",
      "buildNumber": "1"
    }
  }
}
```

### 5.4 Générer le build iOS
```bash
eas build --platform ios --profile production
```

Vous aurez besoin de:
- Votre Apple ID
- Votre Apple Team ID (trouvez-le sur developer.apple.com)

Le build prend environ 15-30 minutes.

---

## 📤 ÉTAPE 6: PUBLICATION SUR APPLE APP STORE

### 6.1 Préparer les assets

#### Screenshots requis:
- **iPhone 6.7"** (1290x2796): Minimum 3 screenshots
- **iPhone 6.5"** (1242x2688): Minimum 3 screenshots
- **iPad Pro 12.9"** (2048x2732): Minimum 2 screenshots

#### Icône:
- 1024x1024 PNG (sans transparence)

### 6.2 Remplir les informations

Dans App Store Connect:

#### App Information:
```
Name: Pnice Shipping
Subtitle: Track & Ship Haiti-Miami
Category: Business
Secondary Category: Utilities

Privacy Policy URL: [Votre URL de politique de confidentialité]
```

#### Version Information:
```
Description:
Pnice Shipping est votre application de référence pour le suivi et la gestion de vos envois entre Miami et Haïti.

Fonctionnalités principales:
• Suivi en temps réel de vos colis
• Gestion de tous vos envois
• Calculateur de frais de port
• Support multilingue (Français, Anglais, Espagnol, Créole haïtien)
• Notifications instantanées
• Interface moderne et intuitive

Que vous soyez un particulier ou une entreprise, Pnice Shipping vous offre une solution complète pour gérer vos envois en toute simplicité.

Keywords: shipping, haiti, miami, tracking, colis, envoi, logistics
```

#### What's New (Release Notes):
```
Version 1.0.0
• Lancement initial de l'application
• Suivi de colis en temps réel
• Calculateur de frais de port
• Support multilingue (FR, EN, ES, HT)
```

### 6.3 Upload du build
1. Dans App Store Connect → votre app → TestFlight
2. Le build devrait apparaître automatiquement après le build EAS
3. Une fois le build "Ready to Submit":
   - Retournez dans "App Store" (pas TestFlight)
   - Sélectionnez le build
   - Remplissez toutes les sections obligatoires

### 6.4 Soumettre pour examen
1. Vérifiez toutes les sections
2. "Submit for Review"
3. Répondez au questionnaire de conformité

⏰ **Temps d'examen**: Généralement 24-48h (peut aller jusqu'à 7 jours)

---

## 🔄 MISES À JOUR FUTURES

### Pour publier une mise à jour:

1. **Mettre à jour la version** dans `app.json`:
```json
{
  "version": "1.0.1",  // ou "1.1.0" pour nouvelle fonctionnalité
  "android": {
    "versionCode": 2   // Incrémenter de 1
  },
  "ios": {
    "buildNumber": "2"  // Incrémenter de 1
  }
}
```

2. **Build et submit**:
```bash
# Android
eas build --platform android --profile production
eas submit --platform android --profile production

# iOS
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

---

## 🎯 COMMANDES UTILES

```bash
# Voir l'état de tous les builds
eas build:list

# Build pour les deux plateformes en même temps
eas build --platform all --profile production

# Submit automatique après le build
eas build --platform android --profile production --auto-submit

# Tester le build localement avant production
eas build --platform android --profile preview

# Voir les credentials (keystores, certificats)
eas credentials
```

---

## ⚠️ CHECKLIST AVANT SOUMISSION

### Android:
- [ ] Screenshots préparés (min 2 par format)
- [ ] Icône 512x512
- [ ] Bannière feature graphic 1024x500
- [ ] Politique de confidentialité publiée
- [ ] Descriptions remplies
- [ ] Catégorie sélectionnée
- [ ] Classification du contenu complétée

### iOS:
- [ ] Screenshots préparés (min 3 pour iPhone)
- [ ] Icône 1024x1024
- [ ] Politique de confidentialité publiée
- [ ] Descriptions remplies
- [ ] Catégorie sélectionnée
- [ ] Support URL
- [ ] Marketing URL (optionnel)

### Les deux:
- [ ] Testé sur appareils réels
- [ ] Pas de bugs critiques
- [ ] Politique de confidentialité respecte RGPD
- [ ] Conditions d'utilisation disponibles

---

## 🆘 RÉSOLUTION DE PROBLÈMES

### Erreur: "Build failed"
- Vérifiez les logs: `eas build:list`
- Problème fréquent: Dépendances natives manquantes
- Solution: Ajoutez les plugins nécessaires dans `app.json`

### Erreur: "Invalid bundle identifier"
- Vérifiez que `bundleIdentifier` (iOS) et `package` (Android) sont uniques
- Doivent être en minuscules, format: `com.yourcompany.appname`

### Rejet App Store/Play Store:
- **Crash au lancement**: Testez d'abord avec TestFlight ou Internal Testing
- **Politique de confidentialité**: Doit inclure les permissions et usage des données
- **Metadata rejeté**: Screenshots ne correspondent pas à l'app

---

## 📞 SUPPORT

Pour toute question:
- Documentation Expo: https://docs.expo.dev
- EAS Build: https://docs.expo.dev/build/introduction/
- Submit: https://docs.expo.dev/submit/introduction/

---

**Bonne chance pour le lancement! 🚀**
