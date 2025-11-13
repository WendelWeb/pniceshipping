# 🚀 DÉMARRAGE - Déploiement Pnice Shipping

## ✅ Configuration Terminée

Les fichiers suivants ont été préparés:
- ✅ `app.json` - Configuration de production
- ✅ `eas.json` - Configuration des builds
- ✅ `GUIDE_DEPLOYMENT.md` - Guide complet A à Z
- ✅ `DEPLOYMENT_CHECKLIST.md` - Checklist détaillée
- ✅ `QUICK_COMMANDS.md` - Commandes rapides

---

## 📋 PROCHAINES ÉTAPES (À FAIRE MAINTENANT)

### Étape 1: Initialiser EAS (5 minutes)

Ouvrez un terminal dans le dossier `pniceshipping-mobile` et exécutez:

```bash
cd "C:\Users\stanl\Desktop\Personal Projects\pniceshipping\pniceshipping-mobile"
eas init
```

Quand il demande:
- **"Would you like to create a project for @tegrwfewdsq/pniceshipping-mobile?"**
  - Répondez: `Y` (Oui)

Cela va:
- Créer un projet sur Expo
- Générer un Project ID
- Mettre à jour automatiquement `app.json`

---

### Étape 2: Vérifier la configuration

```bash
eas project:info
```

Vous devriez voir:
```
Project: pniceshipping-mobile
ID: [un UUID généré]
```

---

### Étape 3: Préparer les assets (IMPORTANT ⚠️)

Avant de faire les builds, vérifiez que ces fichiers existent et sont de bonne qualité:

1. **`./assets/icon.png`** (1024x1024 px)
   - Icône principale de l'app
   - Pas de transparence
   - Format PNG

2. **`./assets/splash-icon.png`** (1284x2778 px ou plus grand)
   - Écran de démarrage
   - Format PNG

3. **`./assets/adaptive-icon.png`** (1024x1024 px)
   - Icône Android adaptative
   - Format PNG

Si ces fichiers n'existent pas ou ne sont pas de bonne qualité, l'app ne pourra pas être publiée.

**📁 Vérifiez maintenant:**
```bash
ls ./assets/
```

Vous devriez voir:
- icon.png
- splash-icon.png
- adaptive-icon.png

---

### Étape 4: Créer les comptes nécessaires (si pas déjà fait)

#### Google Play Console (pour Android)
- URL: https://play.google.com/console
- Coût: 25 USD (paiement unique)
- Temps de vérification: 24-48h

**Actions à faire:**
1. Créer le compte développeur
2. Payer les 25 USD
3. Remplir les informations de compte
4. Attendre la vérification

#### Apple Developer (pour iOS)
- URL: https://developer.apple.com
- Coût: 99 USD/an
- Temps d'approbation: 24-48h

**Actions à faire:**
1. S'inscrire au programme
2. Payer les 99 USD
3. Attendre l'approbation

⚠️ **Vous pouvez faire les builds AVANT d'avoir ces comptes approuvés!**

---

### Étape 5: Premier build Android (20 minutes)

Une fois EAS initialisé:

```bash
eas build --platform android --profile production
```

Ce qui va se passer:
1. EAS va créer une keystore Android (clés de signature)
2. Le build va commencer sur les serveurs Expo
3. Vous recevrez un lien pour suivre la progression
4. Le build prend 10-20 minutes
5. Vous recevrez un fichier `.aab` à télécharger

**Pendant le build:**
- Vous pouvez fermer le terminal
- Suivez la progression sur: https://expo.dev/accounts/tegrwfewdsq/projects/pniceshipping-mobile/builds

---

### Étape 6: Premier build iOS (30 minutes)

```bash
eas build --platform ios --profile production
```

Ce qui va se passer:
1. EAS va demander votre Apple ID
2. EAS va créer les certificats iOS nécessaires
3. Le build va commencer
4. Le build prend 15-30 minutes
5. Le build sera automatiquement envoyé à TestFlight

⚠️ **Vous devez avoir un compte Apple Developer approuvé pour iOS**

---

## 🎯 WORKFLOW RECOMMANDÉ

### Semaine 1: Préparation
- [ ] Vérifier/créer les assets (icônes, screenshots)
- [ ] S'inscrire à Google Play Console (25 USD)
- [ ] S'inscrire à Apple Developer (99 USD)
- [ ] Attendre les vérifications

### Semaine 2: Builds
- [ ] Initialiser EAS (`eas init`)
- [ ] Faire le build Android (`eas build --platform android --profile production`)
- [ ] Faire le build iOS (`eas build --platform ios --profile production`)
- [ ] Tester les builds

### Semaine 3: Store Listings
- [ ] Créer l'app dans Google Play Console
- [ ] Créer l'app dans App Store Connect
- [ ] Remplir toutes les informations (descriptions, screenshots, etc.)
- [ ] Préparer la politique de confidentialité

### Semaine 4: Publication
- [ ] Upload et soumission sur Play Store
- [ ] Upload et soumission sur App Store
- [ ] Attendre les examens (1-7 jours)
- [ ] 🎉 Publication!

---

## 📚 DOCUMENTATION

Consultez ces fichiers pour plus de détails:

1. **GUIDE_DEPLOYMENT.md** - Guide complet étape par étape
2. **DEPLOYMENT_CHECKLIST.md** - Checklist à cocher
3. **QUICK_COMMANDS.md** - Toutes les commandes utiles

---

## ⚡ COMMANDES RAPIDES

```bash
# Initialiser EAS
eas init

# Voir les informations du projet
eas project:info

# Build Android production
eas build --platform android --profile production

# Build iOS production
eas build --platform ios --profile production

# Build les deux en même temps
eas build --platform all --profile production

# Voir l'historique des builds
eas build:list

# Soumettre aux stores (après avoir créé les apps)
eas submit --platform android --latest
eas submit --platform ios --latest
```

---

## 🆘 BESOIN D'AIDE?

1. **Documentation officielle:**
   - https://docs.expo.dev/build/introduction/
   - https://docs.expo.dev/submit/introduction/

2. **Problèmes courants:**
   - Build qui échoue → Vérifiez les logs: `eas build:list`
   - Credentials manquantes → `eas credentials`
   - Questions sur le processus → Consultez `GUIDE_DEPLOYMENT.md`

---

## 🎯 COMMENCEZ MAINTENANT!

Exécutez cette commande pour commencer:

```bash
cd "C:\Users\stanl\Desktop\Personal Projects\pniceshipping\pniceshipping-mobile"
eas init
```

Puis suivez les instructions à l'écran! 🚀

---

**Bonne chance! Vous êtes prêt à publier votre application! 🎉**
