# 🎨 Guide de Création des Icônes - Pnice Shipping

Votre logo a été copié dans: `./assets/pnicelogo-original.png`

---

## 📐 MÉTHODE 1: Automatique avec Expo (RECOMMANDÉ)

Expo peut générer automatiquement toutes les icônes nécessaires à partir d'une seule image 1024x1024.

### Étape 1: Préparer l'icône principale

Vous devez créer **UNE SEULE** image:
- **Taille**: 1024x1024 px
- **Format**: PNG
- **Fond**: Transparent OU couleur de votre choix
- **Contenu**: Votre logo centré

**Outils en ligne gratuits:**
1. **Canva** (https://www.canva.com)
   - Créer un design → Dimensions personnalisées → 1024x1024
   - Importer votre logo `pnicelogo-original.png`
   - Centrer et redimensionner
   - Télécharger en PNG

2. **Photopea** (https://www.photopea.com) - Alternative gratuite à Photoshop
   - Fichier → Nouveau → 1024x1024
   - Importer votre logo
   - Centrer
   - Exporter en PNG

3. **Remove.bg + Canva** (si votre logo a un fond)
   - D'abord: https://remove.bg pour retirer le fond
   - Puis: Canva pour créer l'icône 1024x1024

### Étape 2: Sauvegarder comme icon.png

Une fois votre icône 1024x1024 prête:
```bash
# Remplacer l'icône actuelle
# Copiez votre nouvelle icône et nommez-la:
./assets/icon.png
```

### Étape 3: Générer automatiquement toutes les icônes

```bash
npx expo prebuild --clean
```

Cette commande va automatiquement générer:
- ✅ adaptive-icon.png (Android)
- ✅ Toutes les tailles iOS
- ✅ Splash screen

---

## 📐 MÉTHODE 2: Manuelle avec App Icon Generator

### Utiliser un générateur en ligne:

**1. AppIcon.co** (https://www.appicon.co/)
- Upload votre logo 1024x1024
- Génère toutes les tailles nécessaires
- Télécharge un ZIP avec toutes les icônes

**2. MakeAppIcon** (https://makeappicon.com/)
- Upload votre logo
- Génère pour iOS et Android
- Gratuit

**3. Icon Kitchen** (https://icon.kitchen/)
- Spécialisé pour Android
- Créer adaptive icon
- Prévisualisation en direct

### Fichiers nécessaires:

#### Pour Android:
```
./assets/icon.png             (1024x1024)
./assets/adaptive-icon.png    (1024x1024)
```

L'adaptive icon doit avoir:
- **Safe zone**: Le contenu important dans un cercle de 432x432 au centre
- **Background**: Couleur unie ou dégradé

#### Pour iOS:
```
./assets/icon.png             (1024x1024)
```

iOS utilise automatiquement cette image et la redimensionne.

---

## 📐 MÉTHODE 3: Avec Figma (Pour designers)

Si vous utilisez Figma:

1. Créer un frame 1024x1024
2. Importer votre logo
3. Centrer avec auto-layout
4. Exporter en PNG @1x
5. Plugin "App Icon" pour générer toutes les tailles

---

## 🎨 SPLASH SCREEN

Le splash screen est l'écran affiché pendant le chargement de l'app.

### Option 1: Logo simple sur fond uni
```
Créez une image:
- Taille: 1284x2778 px (iPhone 14 Pro Max)
- Fond: Couleur de votre choix (#000000 actuellement)
- Logo: Centré, environ 400x400 px

Sauvegardez comme:
./assets/splash-icon.png
```

### Option 2: Design personnalisé
Créez un design complet dans Canva:
- Taille: 1284x2778 px
- Ajoutez:
  - Votre logo
  - Nom de l'app "Pnice Shipping"
  - Tagline (optionnel)
  - Couleurs de votre marque

---

## 🎨 CONFIGURATION ACTUELLE (app.json)

Votre configuration actuelle:
```json
{
  "icon": "./assets/icon.png",
  "splash": {
    "image": "./assets/splash-icon.png",
    "resizeMode": "contain",
    "backgroundColor": "#000000"
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#000000"
    }
  }
}
```

---

## ✅ CHECKLIST ICÔNES

Avant de faire les builds de production:

- [ ] **icon.png** (1024x1024)
  - [ ] Bonne qualité (pas pixelisé)
  - [ ] Logo bien centré
  - [ ] Visible sur fond clair ET foncé

- [ ] **splash-icon.png** (1284x2778)
  - [ ] Logo centré
  - [ ] Bonne qualité
  - [ ] Couleur de fond choisie dans app.json

- [ ] **adaptive-icon.png** (1024x1024) - Android uniquement
  - [ ] Logo dans la safe zone (cercle de 432x432 au centre)
  - [ ] Teste sur différentes formes:
    - Cercle (Samsung)
    - Carré arrondi (Google)
    - Goutte d'eau (OnePlus)
    - Écusson (autres)

---

## 🧪 TESTER VOS ICÔNES

### Méthode 1: Build Preview
```bash
# Build un APK pour tester
eas build --platform android --profile preview

# Une fois installé, vérifiez:
# - L'icône sur l'écran d'accueil
# - L'icône dans les paramètres
# - Le splash screen au lancement
```

### Méthode 2: Prévisualisation en ligne

1. **Android Asset Studio** (https://romannurik.github.io/AndroidAssetStudio/)
   - Adaptive icon generator
   - Voir le rendu sur différentes formes

2. **Icon Previewer** (https://icon.kitchen/)
   - Upload votre adaptive icon
   - Voir en temps réel sur différents appareils

---

## 💡 ASTUCES

### Pour un rendu professionnel:

1. **Utilisez des SVG** si possible
   - Puis convertissez en PNG aux bonnes dimensions
   - Gardez le SVG pour les futures mises à jour

2. **Testez sur fond clair ET foncé**
   - Certains téléphones ont des thèmes clairs/foncés
   - Votre logo doit être visible dans les deux cas

3. **Simplifiez pour les petites tailles**
   - L'icône 1024x1024 sera réduite à 48x48 sur certains écrans
   - Évitez les détails trop fins
   - Utilisez des couleurs contrastées

4. **Respectez les guidelines**
   - **iOS**: https://developer.apple.com/design/human-interface-guidelines/app-icons
   - **Android**: https://m3.material.io/styles/icons/designing-icons

---

## 🚀 WORKFLOW RECOMMANDÉ

1. **Préparer le logo principal**
   - Nettoyage (remove.bg si besoin)
   - Redimensionner à 1024x1024
   - Sauvegarder comme `icon.png`

2. **Créer le splash screen**
   - Design dans Canva (1284x2778)
   - Logo + fond noir
   - Sauvegarder comme `splash-icon.png`

3. **Créer l'adaptive icon Android**
   - Même logo que icon.png
   - Vérifier la safe zone
   - Sauvegarder comme `adaptive-icon.png`

4. **Vérifier dans app.json**
   - Tous les chemins sont corrects
   - Couleur de fond splash correspond

5. **Tester**
   - `eas build --platform android --profile preview`
   - Installer sur un appareil réel
   - Vérifier le rendu

6. **Ajuster si nécessaire**
   - Recolorer, redimensionner, repositionner
   - Refaire un build preview
   - Répéter jusqu'à satisfaction

7. **Build de production**
   - Quand tout est parfait
   - `eas build --platform all --profile production`

---

## 📞 OUTILS UTILES

### Éditeurs d'image en ligne (Gratuits):
- **Canva**: https://www.canva.com
- **Photopea**: https://www.photopea.com (clone de Photoshop)
- **Remove.bg**: https://remove.bg (retirer le fond)
- **Squoosh**: https://squoosh.app (optimiser PNG)

### Générateurs d'icônes:
- **AppIcon.co**: https://www.appicon.co
- **MakeAppIcon**: https://makeappicon.com
- **Icon Kitchen**: https://icon.kitchen

### Prévisualisation:
- **Android Asset Studio**: https://romannurik.github.io/AndroidAssetStudio/
- **iOS Icon Gallery**: https://www.iosicongallery.com

---

**Votre logo original est sauvegardé dans:**
`./assets/pnicelogo-original.png`

**Prochaine étape:**
Créez les trois fichiers nécessaires avec les bonnes dimensions, puis testez avec un build preview! 🎨
