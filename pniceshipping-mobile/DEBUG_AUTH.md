# 🐛 Debug de l'Authentification

## ✅ Modifications Appliquées

### 1. **Logs de Debug Ajoutés**

Tous les fichiers ont maintenant des `console.log()` pour tracer ce qui se passe :

#### **AuthScreen.tsx**
- OAuth Google/Facebook : Logs de toutes les étapes
- Vérification email : Logs du code, de la réponse, et de l'activation

#### **App.tsx**
- Logs de `isLoaded` et `isSignedIn` à chaque render
- Logs pour savoir quel écran est affiché

### 2. **redirectUrl Explicite pour OAuth**

```typescript
const { createdSessionId, signIn, signUp, setActive } = await startGoogleOAuth({
  redirectUrl: 'pniceshipping://oauth-callback',
});
```

### 3. **Gestion Améliorée de la Vérification**

```typescript
// Vérifie différents états possibles
if (completeSignUp.createdSessionId) {
  await setActiveSignUp({ session: completeSignUp.createdSessionId });
} else if (completeSignUp.status === 'complete') {
  // Session déjà active
}
```

---

## 🔍 Comment Débugger

### **Étape 1: Ouvre la Console**

Dans le terminal où tu as lancé `npx expo start`, tu verras les logs en temps réel.

### **Étape 2: Test OAuth Google**

1. Appuie sur "Continuer avec Google"
2. **Regarde la console**, tu devrais voir :
   ```
   [LOG] Google OAuth response: { createdSessionId: 'sess_...', signIn: ..., signUp: ... }
   ```

3. **Si `createdSessionId` est `null`:**
   - L'OAuth a été annulé par l'utilisateur
   - Ou erreur de configuration Clerk

4. **Si `createdSessionId` existe mais pas de redirection:**
   - Regarde si tu vois : `[LOG] Session activated successfully`
   - Puis regarde App.tsx logs : `[LOG] RootNavigator - isSignedIn: true`
   - Si `isSignedIn` reste `false`, le problème vient de Clerk

### **Étape 3: Test Vérification Email**

1. Inscris-toi avec email
2. Entre le code à 6 chiffres
3. **Regarde la console**, tu devrais voir :
   ```
   [LOG] Attempting email verification with code: 123456
   [LOG] Verification response: { status: 'complete', createdSessionId: 'sess_...' }
   [LOG] Activating session with ID: sess_...
   [LOG] Session activated successfully - should redirect now
   [LOG] RootNavigator - isSignedIn: true
   [LOG] Showing TabNavigator - User is signed in
   ```

4. **Si ça s'arrête avant "Session activated successfully":**
   - Le code est invalide ou expiré
   - Erreur de Clerk

5. **Si "Session activated" mais `isSignedIn` reste `false`:**
   - Problème avec le token cache
   - Ou configuration Clerk

---

## 🚨 Erreurs Communes et Solutions

### **Erreur 1: "setActive is null"**

**Cause:** Clerk ne retourne pas la fonction `setActive`

**Solution:**
1. Vérifie que tu es connecté à internet
2. Vérifie la clé Clerk dans `.env`:
   ```
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```
3. Redémarre l'app avec `npx expo start --clear`

### **Erreur 2: OAuth s'ouvre mais revient à AuthScreen**

**Cause:** Le `redirectUrl` n'est pas configuré dans Clerk

**Solution:**
1. Va sur [Clerk Dashboard](https://dashboard.clerk.com)
2. Sélectionne ton app
3. **User & Authentication** → **Social Connections** → **Google**
4. Dans "Redirect URLs", ajoute:
   ```
   pniceshipping://oauth-callback
   exp://192.168.x.x:19000 (remplace par ton IP local)
   ```
5. Sauvegarde

### **Erreur 3: "Session activated" mais pas de redirection**

**Cause:** `isSignedIn` de `useAuth()` ne détecte pas le changement

**Solution:**
1. Vérifie les logs dans la console:
   ```
   [LOG] RootNavigator - isSignedIn: false (devrait être true)
   ```
2. Si c'est le cas, redémarre complètement l'app:
   - Ferme l'app sur ton téléphone
   - Dans le terminal, `Ctrl+C`
   - Relance : `npx expo start --clear`

### **Erreur 4: Code de vérification invalide**

**Cause:** Code expiré (10 minutes) ou déjà utilisé

**Solution:**
1. Appuie sur "Renvoyer" dans l'app
2. Nouveau code envoyé par email
3. Entre le nouveau code rapidement

### **Erreur 5: OAuth ne s'ouvre pas du tout**

**Cause:** `expo-web-browser` pas configuré correctement

**Solution:**
1. Vérifie que `WebBrowser.maybeCompleteAuthSession()` est appelé
   - AuthScreen.tsx ligne 25
2. Vérifie le scheme dans `app.json`:
   ```json
   "scheme": "pniceshipping"
   ```

---

## 📱 Test Complet - Checklist

### **Avant de tester:**
- [ ] Redémarre l'app avec `npx expo start --clear`
- [ ] Ouvre la console dans le terminal
- [ ] Supprime l'app de ton téléphone et réinstalle

### **Test OAuth Google:**
1. [ ] Appuie sur "Continuer avec Google"
2. [ ] Vérifie console : `OAuth response` avec `createdSessionId`
3. [ ] Vérifie console : `Session activated successfully`
4. [ ] Vérifie console : `RootNavigator - isSignedIn: true`
5. [ ] **Résultat:** TabNavigator s'affiche

### **Test Inscription Email:**
1. [ ] Appuie sur "S'inscrire"
2. [ ] Remplis tous les champs
3. [ ] Appuie sur "S'inscrire"
4. [ ] Vérifie email, copie le code
5. [ ] Entre le code dans l'app
6. [ ] Appuie sur "Vérifier"
7. [ ] Vérifie console : Logs de vérification
8. [ ] **Résultat:** TabNavigator s'affiche

---

## 🔧 Vérifications Configuration Clerk

### **1. OAuth Providers Activés**

Dashboard Clerk → **User & Authentication** → **Social Connections**

- [ ] **Google OAuth** : ✅ Activé
- [ ] **Facebook OAuth** : ✅ Activé

### **2. Redirect URLs Configurées**

Pour chaque provider (Google & Facebook):

```
pniceshipping://oauth-callback
exp://localhost:19000
exp://[TON_IP_LOCAL]:19000
```

Trouve ton IP local dans les logs Expo :
```
Metro waiting on exp://192.168.1.x:19000
                   ^^^^^^^^^^^^^^^^^^^^ Ton IP
```

### **3. Email Verification Activée**

Dashboard Clerk → **User & Authentication** → **Email, Phone, Username**

- [ ] **Email address** : ✅ Requis
- [ ] **Verification** : ✅ Code de vérification activé
- [ ] **Code length** : 6 chiffres
- [ ] **Expiration** : 10 minutes

---

## 💡 Que Faire Si Ça Ne Marche Toujours Pas

### **Option 1: Copie-Colle les Logs Ici**

Quand tu testes, copie TOUS les logs de la console et envoie-les moi.

### **Option 2: Vérifie la Clé Clerk**

Dans `.env`, vérifie que la clé est correcte:
```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGVsaWNhdGUtZG9yeS05OC5jbGVyay5hY2NvdW50cy5kZXYk
```

Cette clé est la même que dans ton projet web ?

### **Option 3: Test avec Email Seulement (Pas OAuth)**

Si OAuth ne marche pas, teste d'abord avec email :

1. Mode "Se connecter" (pas S'inscrire)
2. Entre email et password d'un compte existant
3. Regarde les logs

Si ça marche avec email mais pas OAuth, c'est un problème de config OAuth dans Clerk.

---

## 📊 Logs Attendus (Succès)

### **OAuth Google Succès:**
```
[LOG] Google OAuth response: {
  createdSessionId: 'sess_2abc...',
  signIn: {...},
  signUp: {...}
}
[LOG] Session activated successfully
[LOG] RootNavigator - isLoaded: true isSignedIn: true
[LOG] Showing TabNavigator - User is signed in
```

### **Vérification Email Succès:**
```
[LOG] Attempting email verification with code: 123456
[LOG] Verification response: {
  status: 'complete',
  createdSessionId: 'sess_2abc...'
}
[LOG] Activating session with ID: sess_2abc...
[LOG] Session activated successfully - should redirect now
[LOG] RootNavigator - isLoaded: true isSignedIn: true
[LOG] Showing TabNavigator - User is signed in
```

---

## 🎯 Prochaines Étapes

1. **Redémarre l'app** avec `npx expo start --clear`
2. **Teste OAuth Google** et regarde les logs
3. **Copie les logs** et dis-moi ce que tu vois
4. On va identifier exactement où ça bloque

**Les logs vont nous dire précisément quel est le problème ! 🔍**
