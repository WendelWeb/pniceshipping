import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

// Screens
import NewsScreen from '../screens/NewsScreen';
import TrackScreen from '../screens/TrackScreen';
import ShipmentsScreen from '../screens/ShipmentsScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { COLORS, SPACING, ICON_SIZES } from '../constants/theme';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'News') {
            iconName = 'newspaper';
          } else if (route.name === 'Track') {
            iconName = 'search';
          } else if (route.name === 'Shipments') {
            iconName = 'cube';
          } else if (route.name === 'Calculator') {
            iconName = 'calculator';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          // Make center tab bigger
          const iconSize = route.name === 'Shipments' ? ICON_SIZES.xl : size;

          // Fix: center icon should be white when active (on blue background)
          const iconColor = route.name === 'Shipments' && focused
            ? COLORS.text.primary
            : color;

          return (
            <View
              style={[
                styles.iconContainer,
                route.name === 'Shipments' && styles.centerIconContainer,
              ]}
            >
              <Ionicons name={iconName} size={iconSize} color={iconColor} />
            </View>
          );
        },
        tabBarActiveTintColor: COLORS.accent.blue,
        tabBarInactiveTintColor: COLORS.text.tertiary,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : COLORS.background.elevated,
          borderTopWidth: 0,
          elevation: 0,
          height: 80 + insets.bottom,
          paddingBottom: insets.bottom || SPACING.base,
          paddingTop: SPACING.md,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={100}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: SPACING.xs / 2,
        },
      })}
    >
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{ tabBarLabel: t('nav.news') }}
      />
      <Tab.Screen
        name="Track"
        component={TrackScreen}
        options={{ tabBarLabel: t('nav.track') }}
      />
      <Tab.Screen
        name="Shipments"
        component={ShipmentsScreen}
        options={({ route }) => ({
          tabBarLabel: t('nav.shipments'),
          // White text when active (on blue background)
          tabBarActiveTintColor: COLORS.text.primary,
        })}
      />
      <Tab.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{ tabBarLabel: t('nav.calculator') }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: t('nav.profile') }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -SPACING.lg,
    shadowColor: COLORS.accent.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
