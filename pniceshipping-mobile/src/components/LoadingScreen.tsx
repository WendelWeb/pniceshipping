import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

// Premium loading screen with animated logo
export default function LoadingScreen() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    // Pulse animation for the icon
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800, easing: Easing.ease }),
        withTiming(1, { duration: 800, easing: Easing.ease })
      ),
      -1,
      false
    );

    // Fade animation
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 800, easing: Easing.ease }),
        withTiming(1, { duration: 800, easing: Easing.ease })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background.primary, COLORS.gray[900], COLORS.primary[900]]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, animatedStyle]}>
          <View style={styles.iconBackground}>
            <Ionicons name="cube" size={60} color={COLORS.accent.blue} />
          </View>
        </Animated.View>

        <Text style={styles.title}>Pnice Shipping</Text>
        <Text style={styles.subtitle}>Votre partenaire de confiance</Text>

        <ActivityIndicator
          size="large"
          color={COLORS.accent.blue}
          style={styles.spinner}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  iconContainer: {
    marginBottom: SPACING['3xl'],
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: COLORS.background.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  title: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
    marginBottom: SPACING['3xl'],
  },
  spinner: {
    marginTop: SPACING.xl,
  },
});
