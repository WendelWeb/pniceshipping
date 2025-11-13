# 🚀 Installation Rapide - Mobile App

## 📦 Nouvelle Fonctionnalité : Ajout de Colis

### ⚡ Installation en 2 Minutes

#### 1. Installer la dépendance manquante

```bash
cd pniceshipping-mobile
npm install @react-navigation/native-stack@^7.3.28 --legacy-peer-deps
```

#### 2. Vérifier les variables d'environnement

Assurez-vous que `.env` contient :

```env
EXPO_PUBLIC_DATABASE_URL=postgresql://...votre_url_neon...
```

#### 3. Lancer l'application

```bash
npm start
```

#### 4. Tester la fonctionnalité

1. Ouvrir l'app sur votre appareil/émulateur
2. Aller dans l'onglet "Mes Colis"
3. Cliquer sur le bouton **+** (en bas à droite)
4. Remplir le formulaire et soumettre
5. ✅ Le colis apparaît **immédiatement** dans la liste !

---

## 🎯 Qu'est-ce qui a été ajouté ?

### Nouveaux Fichiers

1. **AddShipmentScreen.tsx** - Écran de soumission de requête
2. **RootNavigator.tsx** - Navigateur stack pour les modales
3. **MOBILE_SHIPMENT_FEATURE.md** - Documentation complète

### Fichiers Modifiés

1. **ShipmentsScreen.tsx** - Ajout du FAB button + empty state button
2. **App.tsx** - Intégration du RootNavigator
3. **package.json** - Ajout de @react-navigation/native-stack

---

## ✅ Vérification

Après installation, vérifiez que tout fonctionne :

```bash
# Tester la compilation TypeScript
npx tsc --noEmit

# Lancer l'app en mode dev
npm start
```

---

## 📚 Documentation Complète

Pour plus de détails, consultez :
- `MOBILE_SHIPMENT_FEATURE.md` - Guide complet avec tests
- `../CHANGEMENTS_WEB_MOBILE.md` - Comparaison web vs mobile

---

## 🐛 Problèmes Courants

### Erreur : "Cannot find module '@react-navigation/native-stack'"

**Solution :**
```bash
npm install @react-navigation/native-stack@^7.4.3
```

### Erreur : "DATABASE_URL environment variable is not set"

**Solution :**
Créez un fichier `.env` avec :
```env
EXPO_PUBLIC_DATABASE_URL=postgresql://your_neon_url
```

### Le colis n'apparaît pas après soumission

**Solution :**
Vérifiez que :
1. `onShipmentAdded` est bien passé dans les params de navigation
2. `loadShipments()` est appelé dans le callback
3. L'utilisateur Clerk est bien connecté

---

## 🎉 C'est Prêt !

Vous pouvez maintenant :
- ✅ Soumettre des requêtes de colis depuis mobile
- ✅ Transférer des colis existants
- ✅ Voir les colis apparaître instantanément
- ✅ Recevoir des notifications par email

Profitez de la nouvelle fonctionnalité ! 🚀
