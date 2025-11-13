import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { StyleSheet, View } from 'react-native';

import RootNavigator from './src/navigation/RootNavigator';
import LoadingScreen from './src/components/LoadingScreen';
import AuthScreen from './src/screens/AuthScreen';
import { COLORS } from './src/constants/theme';
import { usePushNotifications } from './src/hooks/usePushNotifications';
import { registerPushToken } from './src/utils/pushTokenQueries';
import { initI18n } from './src/i18n';

// Clerk token cache implementation
const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      console.error('SecureStore get error:', err);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error('SecureStore save error:', err);
    }
  },
};

// Clerk publishable key
const CLERK_PUBLISHABLE_KEY = 'pk_test_ZGVsaWNhdGUtZG9yeS05OC5jbGVyay5hY2NvdW50cy5kZXYk';

// Root component with Clerk authentication
function AuthNavigator() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  // Setup push notifications
  const { expoPushToken } = usePushNotifications();

  // Register push token when user is signed in and token is available
  useEffect(() => {
    if (isSignedIn && user && expoPushToken) {
      console.log('📱 Registering push token for user:', user.id);
      registerPushToken(user.id, expoPushToken.data);
    }
  }, [isSignedIn, user, expoPushToken]);

  // Debug logs
  console.log('AuthNavigator - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn);

  // Show loading screen while Clerk is initializing
  if (!isLoaded) {
    console.log('Showing LoadingScreen - Clerk not loaded yet');
    return <LoadingScreen />;
  }

  // Show auth screen if not signed in
  if (!isSignedIn) {
    console.log('Showing AuthScreen - User not signed in');
    return <AuthScreen />;
  }

  // Show main app if signed in
  console.log('Showing RootNavigator - User is signed in');
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: COLORS.primary[500],
          background: COLORS.background.primary,
          card: COLORS.background.elevated,
          text: COLORS.text.primary,
          border: COLORS.border.light,
          notification: COLORS.accent.blue,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '900' },
        },
      }}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// Main App component
export default function App() {
  const [i18nInitialized, setI18nInitialized] = useState(false);

  useEffect(() => {
    initI18n().then(() => {
      setI18nInitialized(true);
    });
  }, []);

  if (!i18nInitialized) {
    return <LoadingScreen />;
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <View style={styles.container}>
            <StatusBar style="light" />
            <AuthNavigator />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
});
