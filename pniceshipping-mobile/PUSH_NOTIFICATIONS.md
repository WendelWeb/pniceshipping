# 📱 Push Notifications Setup Guide

## ⚠️ Important: Expo Go Limitation

**Les notifications push ne fonctionnent PAS dans Expo Go** (depuis SDK 53). Vous devez créer un **development build** ou un **production build** pour tester les notifications.

## 🔧 Status Actuel

✅ Code des notifications implémenté
✅ Hook `usePushNotifications` créé
✅ Détection automatique d'Expo Go (désactive les notifs automatiquement)
✅ Packages installés (`expo-device`, `expo-notifications`)
⏳ Development build requis pour tester

## 📋 Options pour Tester les Notifications

### Option 1: Development Build (Recommandé pour le développement)

Un development build est comme Expo Go mais avec les fonctionnalités natives compilées.

```bash
# Installer EAS CLI
npm install -g eas-cli

# Login à votre compte Expo
eas login

# Créer un development build pour Android
eas build --profile development --platform android

# Ou pour iOS
eas build --profile development --platform ios
```

Après le build, téléchargez et installez l'APK/IPA sur votre appareil physique.

### Option 2: Production Build

Pour un vrai test en production:

```bash
# Android
eas build --profile production --platform android

# iOS
eas build --profile production --platform ios
```

### Option 3: Local Development Build (Gratuit mais plus complexe)

```bash
# Android (nécessite Android Studio)
npx expo run:android

# iOS (nécessite Xcode et Mac)
npx expo run:ios
```

## 📝 Configuration Requise

### 1. app.json / app.config.js

Les permissions sont déjà configurées dans votre `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ]
  }
}
```

### 2. Database Setup

Créer la table `pushTokens` dans la base de données:

```bash
# Dans le projet web (root)
npm run db:push
```

Cela créera la table pour stocker les tokens de notification.

## 🧪 Comment Tester

### Une fois le development/production build installé:

1. **Ouvrir l'app** sur un appareil physique (pas un émulateur)
2. **Accepter les permissions** de notification
3. **Vérifier la console** - vous devriez voir:
   ```
   📱 Push notification token: ExponentPushToken[xxxxxxxxxxxxxx]
   ```
4. **Tester l'envoi** depuis le backend

### Test d'envoi depuis le backend (Web app):

```typescript
import { sendPushNotification } from '@/utils/pushNotifications';

// Envoyer une notification
await sendPushNotification({
  to: 'ExponentPushToken[xxxxxx]',
  title: 'Colis Mis à Jour',
  body: 'Votre colis #12345 est maintenant en transit',
  data: { shipmentId: '12345' }
});
```

## 🚀 Workflow de Production

1. **Client ouvre l'app** → Token généré et sauvegardé dans la DB
2. **Admin met à jour un colis** → Notification envoyée au token du client
3. **Client reçoit la notification** → Peut cliquer pour voir les détails

## 📚 Resources

- [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)

## 💡 Notes

- **Expo Go**: Notifications désactivées automatiquement (pas d'erreur)
- **Development Build**: Notifications fonctionnent pleinement
- **Production Build**: Notifications fonctionnent pleinement
- **Émulateurs**: Les notifications peuvent ne pas fonctionner, utilisez un appareil physique

## 🔍 Debugging

Si les notifications ne fonctionnent pas:

1. Vérifier que c'est un appareil physique
2. Vérifier que ce n'est PAS Expo Go
3. Vérifier les permissions dans les paramètres de l'appareil
4. Vérifier les logs console pour le token
5. Tester l'envoi avec l'outil Expo: https://expo.dev/notifications

## ✅ Checklist Avant Production

- [ ] Development build créé et testé
- [ ] Table `pushTokens` créée dans la DB
- [ ] Tokens sauvegardés lors de l'enregistrement
- [ ] Système d'envoi testé depuis le backend
- [ ] Gestion des erreurs d'envoi implémentée
- [ ] Icon de notification créé (192x192 PNG)
- [ ] Permissions configurées dans app.json
- [ ] Production build créé
