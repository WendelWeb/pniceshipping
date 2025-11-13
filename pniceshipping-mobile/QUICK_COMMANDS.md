# 🚀 Commandes Rapides - Déploiement

Copiez-collez ces commandes dans votre terminal.

---

## 📦 INSTALLATION & CONFIGURATION

```bash
# 1. Installer EAS CLI globalement
npm install -g eas-cli

# 2. Se connecter à Expo
eas login

# 3. Initialiser EAS (première fois seulement)
eas init

# 4. Configurer les builds
eas build:configure
```

---

## 🏗️ BUILDS DE PRODUCTION

### Android (Google Play Store)

```bash
# Build production Android (.aab)
eas build --platform android --profile production

# Voir le statut du build
eas build:list --platform android

# Télécharger le dernier build
# (Le lien sera dans le terminal après le build)
```

### iOS (Apple App Store)

```bash
# Build production iOS (.ipa)
eas build --platform ios --profile production

# Voir le statut du build
eas build:list --platform ios
```

### Les deux plateformes en même temps

```bash
# Build Android + iOS en parallèle
eas build --platform all --profile production
```

---

## 🧪 BUILDS DE TEST

### Test interne (Preview)

```bash
# Build Android APK (plus rapide, pour tests)
eas build --platform android --profile preview

# Build iOS pour TestFlight
eas build --platform ios --profile preview
```

### Build local (développement)

```bash
# Build de développement
eas build --platform android --profile development
```

---

## 📤 SOUMISSION AUX STORES

### Automatique (après le build)

```bash
# Android: Build + Submit en une commande
eas build --platform android --profile production --auto-submit

# iOS: Build + Submit en une commande
eas build --platform ios --profile production --auto-submit
```

### Manuel (si build déjà fait)

```bash
# Soumettre le dernier build Android
eas submit --platform android --latest

# Soumettre le dernier build iOS
eas submit --platform ios --latest

# Soumettre les deux
eas submit --platform all --latest
```

---

## 🔑 GESTION DES CREDENTIALS

```bash
# Voir toutes les credentials (keystores, certificats)
eas credentials

# Supprimer et régénérer les credentials Android
eas credentials --platform android

# Supprimer et régénérer les credentials iOS
eas credentials --platform ios
```

---

## 📊 MONITORING & INFORMATIONS

```bash
# Voir tous les builds (historique)
eas build:list

# Voir les builds récents pour Android
eas build:list --platform android --limit 5

# Voir les builds récents pour iOS
eas build:list --platform ios --limit 5

# Voir les détails d'un build spécifique
eas build:view [BUILD_ID]

# Annuler un build en cours
eas build:cancel [BUILD_ID]

# Voir les informations du projet
eas project:info

# Voir les webhooks (notifications de build)
eas webhook:list
```

---

## 🔄 MISE À JOUR DE VERSION

Avant de faire un nouveau build pour une mise à jour:

```bash
# 1. Mettez à jour la version dans app.json
# Editez manuellement ou utilisez:

# Pour Android, incrémenter versionCode
# Dans app.json: "android": { "versionCode": 2 }

# Pour iOS, incrémenter buildNumber
# Dans app.json: "ios": { "buildNumber": "2" }

# Et incrémenter la version générale
# Dans app.json: "version": "1.0.1"

# 2. Puis lancez le build
eas build --platform all --profile production
```

---

## 🧹 NETTOYAGE

```bash
# Nettoyer le cache local
npx expo start --clear

# Nettoyer node_modules et réinstaller
rm -rf node_modules
npm install

# Sur Windows:
rmdir /s /q node_modules
npm install
```

---

## ⚡ WORKFLOW COMPLET (PREMIÈRE PUBLICATION)

Copiez ce workflow complet pour la première publication:

```bash
# === SETUP (une seule fois) ===
npm install -g eas-cli
eas login
cd pniceshipping-mobile
eas init

# === BUILD ANDROID ===
eas build --platform android --profile production
# Attendez que le build se termine (10-20 min)
# Téléchargez le .aab depuis le lien dans le terminal

# === BUILD iOS ===
eas build --platform ios --profile production
# Entrez votre Apple ID quand demandé
# Attendez que le build se termine (15-30 min)

# === VÉRIFIER LES BUILDS ===
eas build:list

# Une fois les apps créées dans Play Console et App Store Connect:
# === SOUMISSION AUTOMATIQUE ===
eas submit --platform android --latest
eas submit --platform ios --latest
```

---

## 🔄 WORKFLOW MISE À JOUR

Pour les mises à jour futures:

```bash
# 1. Modifiez app.json avec les nouvelles versions
# version: "1.0.1"
# android.versionCode: 2
# ios.buildNumber: "2"

# 2. Build et submit en une commande
eas build --platform all --profile production --auto-submit

# Ou séparément:
eas build --platform android --profile production
eas submit --platform android --latest

eas build --platform ios --profile production
eas submit --platform ios --latest
```

---

## 🆘 DÉPANNAGE

### Build échoue

```bash
# Voir les logs détaillés
eas build:list
# Cliquez sur le build qui a échoué pour voir les logs

# Nettoyer et réessayer
npx expo start --clear
eas build --platform [android/ios] --profile production --clear-cache
```

### Problème de credentials

```bash
# Régénérer les credentials
eas credentials --platform android
# Choisissez "Remove keystore" puis refaites le build

eas credentials --platform ios
# Choisissez "Remove all credentials" puis refaites le build
```

### Tester localement avant le build

```bash
# Prévisualisation locale
npx expo start

# Build preview (APK) pour tester
eas build --platform android --profile preview
```

---

## 📱 TESTER LES BUILDS

### Android

```bash
# 1. Build en mode preview (APK)
eas build --platform android --profile preview

# 2. Télécharger et installer sur votre appareil
# Le lien QR code sera affiché dans le terminal
```

### iOS

```bash
# 1. Build pour TestFlight
eas build --platform ios --profile production

# 2. Une fois le build terminé, il apparaîtra dans TestFlight
# Invitez des testeurs via App Store Connect
```

---

## 💡 ASTUCES

```bash
# Build non-interactif (pour CI/CD)
eas build --platform android --profile production --non-interactive

# Spécifier une version Android spécifique
eas build --platform android --profile production --android-version 33

# Voir la configuration résultante (sans build)
eas build:inspect --platform android --profile production

# Télécharger un build spécifique
eas build:download [BUILD_ID]
```

---

## 📞 AIDE

```bash
# Aide générale
eas --help

# Aide pour une commande spécifique
eas build --help
eas submit --help
eas credentials --help

# Version EAS
eas --version

# Mettre à jour EAS CLI
npm install -g eas-cli@latest
```

---

**Gardez ce fichier à portée de main pendant le déploiement! 📌**
