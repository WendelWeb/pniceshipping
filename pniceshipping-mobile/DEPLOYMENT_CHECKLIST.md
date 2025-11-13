# ✅ Checklist de Déploiement - Pnice Shipping

Cochez les étapes au fur et à mesure de votre progression.

---

## 🎨 PHASE 1: PRÉPARATION DES ASSETS

- [ ] **Icône principale** (1024x1024 px)
  - Fichier: `./assets/icon.png`
  - Vérifier: Pas de transparence, bonne qualité

- [ ] **Splash screen** (1284x2778 px)
  - Fichier: `./assets/splash-icon.png`
  - Vérifier: Centrée, bonne qualité

- [ ] **Adaptive icon Android** (1024x1024 px)
  - Fichier: `./assets/adaptive-icon.png`
  - Vérifier: Safe zone respectée (432x432)

- [ ] **Screenshots**
  - Android: 2+ screenshots (1080x1920)
  - iOS: 3+ screenshots (1290x2796)
  - Prendre sur émulateur ou appareil réel

- [ ] **Bannière Play Store** (1024x500 px)
  - Créer avec logo + slogan

---

## ⚙️ PHASE 2: CONFIGURATION

- [ ] **Installer EAS CLI**
  ```bash
  npm install -g eas-cli
  ```

- [ ] **Se connecter à Expo**
  ```bash
  eas login
  ```

- [ ] **Initialiser EAS**
  ```bash
  eas init
  ```

- [ ] **Vérifier app.json**
  - [ ] Version correcte (1.0.0)
  - [ ] Description remplie
  - [ ] Bundle ID unique (com.pniceshipping.mobile)
  - [ ] Permissions configurées

- [ ] **Créer politique de confidentialité**
  - URL: ___________________________
  - Uploadée sur: ___________________________

---

## 🤖 PHASE 3: ANDROID - GOOGLE PLAY STORE

### Compte & Configuration

- [ ] **Créer compte Google Play Console**
  - URL: https://play.google.com/console
  - Coût: 25 USD (paiement unique)
  - Compte vérifié ✅

- [ ] **Créer l'app dans Play Console**
  - Nom: Pnice Shipping
  - Package: com.pniceshipping.mobile
  - Catégorie: Business

### Build

- [ ] **Générer le build de production**
  ```bash
  eas build --platform android --profile production
  ```
  - Build réussi ✅
  - Fichier .aab téléchargé ✅

### Store Listing

- [ ] **Titre de l'app** (50 caractères max)
  - "Pnice Shipping - Track & Ship"

- [ ] **Description courte** (80 caractères max)
  - "Track shipments between Miami and Haiti. Real-time updates."

- [ ] **Description complète** (4000 caractères max)
  - ✅ Copié depuis GUIDE_DEPLOYMENT.md

- [ ] **Uploader les assets**
  - [ ] Icône 512x512
  - [ ] Bannière 1024x500
  - [ ] Screenshots téléphone (min 2)
  - [ ] Screenshots tablette 7" (min 2)
  - [ ] Screenshots tablette 10" (min 2)

- [ ] **Questionnaire de contenu**
  - [ ] Classification complétée
  - [ ] Public cible défini
  - [ ] Politique de confidentialité ajoutée

### Publication

- [ ] **Upload du .aab**
  - Version: 1.0.0 (versionCode: 1)
  - Notes de version remplies

- [ ] **Soumettre pour examen**
  - Date de soumission: ___________________________
  - Statut: ⏳ En attente / ✅ Approuvé

---

## 🍎 PHASE 4: iOS - APPLE APP STORE

### Compte & Configuration

- [ ] **S'inscrire au Apple Developer Program**
  - URL: https://developer.apple.com
  - Coût: 99 USD/an
  - Compte approuvé ✅

- [ ] **Créer l'app dans App Store Connect**
  - URL: https://appstoreconnect.apple.com
  - Nom: Pnice Shipping
  - Bundle ID: com.pniceshipping.mobile
  - SKU: pniceshipping-mobile-001

### Build

- [ ] **Configurer les credentials**
  - Apple ID: ___________________________
  - Team ID: ___________________________

- [ ] **Générer le build de production**
  ```bash
  eas build --platform ios --profile production
  ```
  - Build réussi ✅
  - Disponible dans TestFlight ✅

### App Store Listing

- [ ] **Informations de l'app**
  - [ ] Nom: Pnice Shipping
  - [ ] Sous-titre: Track & Ship Haiti-Miami
  - [ ] Catégorie principale: Business
  - [ ] Catégorie secondaire: Utilities

- [ ] **Description** (4000 caractères max)
  - ✅ Copié depuis GUIDE_DEPLOYMENT.md

- [ ] **Mots-clés** (100 caractères max)
  - "shipping,haiti,miami,tracking,colis,envoi,logistics"

- [ ] **Uploader les assets**
  - [ ] Icône 1024x1024
  - [ ] Screenshots iPhone 6.7" (min 3)
  - [ ] Screenshots iPhone 6.5" (min 3)
  - [ ] Screenshots iPad Pro (min 2)

- [ ] **URLs**
  - [ ] Politique de confidentialité: ___________________________
  - [ ] Support URL: ___________________________
  - [ ] Marketing URL (optionnel): ___________________________

### Publication

- [ ] **Sélectionner le build**
  - Version: 1.0.0 (Build: 1)
  - Notes de version remplies

- [ ] **Questionnaire de conformité**
  - [ ] Contenu de confidentialité
  - [ ] Utilise le chiffrement: Oui (HTTPS)
  - [ ] Exempté d'exportation: Oui

- [ ] **Soumettre pour examen**
  - Date de soumission: ___________________________
  - Statut: ⏳ En attente / ✅ Approuvé

---

## 🧪 PHASE 5: TESTS PRÉ-LANCEMENT

### Tests Android

- [ ] **Internal Testing (Play Console)**
  - [ ] Build installé sur appareil réel
  - [ ] Toutes les fonctionnalités testées
  - [ ] Pas de crash
  - [ ] Notifications fonctionnelles
  - [ ] Login Clerk fonctionne
  - [ ] Changement de langue OK
  - [ ] Changement de photo de profil OK

### Tests iOS

- [ ] **TestFlight**
  - [ ] Build installé sur appareil réel
  - [ ] Toutes les fonctionnalités testées
  - [ ] Pas de crash
  - [ ] Notifications fonctionnelles
  - [ ] Login Clerk fonctionne
  - [ ] Changement de langue OK
  - [ ] Changement de photo de profil OK

---

## 🚀 PHASE 6: LANCEMENT

- [ ] **Google Play Store**
  - Statut: 📝 Brouillon / ⏳ En examen / ✅ Publié
  - Lien: ___________________________

- [ ] **Apple App Store**
  - Statut: 📝 Brouillon / ⏳ En examen / ✅ Publié
  - Lien: ___________________________

---

## 📊 POST-LANCEMENT

- [ ] **Monitoring**
  - [ ] Vérifier les crashes (Google Play Console)
  - [ ] Vérifier les crashes (App Store Connect)
  - [ ] Surveiller les avis utilisateurs
  - [ ] Répondre aux commentaires

- [ ] **Analytics**
  - [ ] Configurer analytics (optionnel)
  - [ ] Suivre les téléchargements
  - [ ] Suivre l'engagement

---

## 📝 NOTES

### Identifiants importants:
- **Expo Account**: ___________________________
- **Google Play Console**: ___________________________
- **Apple Developer**: ___________________________
- **EAS Project ID**: ___________________________

### Dates clés:
- Configuration terminée: ___________________________
- Premier build Android: ___________________________
- Premier build iOS: ___________________________
- Soumission Play Store: ___________________________
- Soumission App Store: ___________________________
- Publication Play Store: ___________________________
- Publication App Store: ___________________________

### Problèmes rencontrés:
```
[Notez ici les problèmes et solutions]



```

---

**Bon lancement! 🎉**
