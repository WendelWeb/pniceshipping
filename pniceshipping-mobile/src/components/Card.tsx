// 🎴 Premium Card Component - Apple-inspired Glassmorphism
// Subtle depth, smooth animations & touch interactions

import React, { ReactNode, useEffect } from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  ANIMATIONS,
  createGlassmorphism,
} from '../constants/theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  blur?: boolean;
  intensity?: 'subtle' | 'medium' | 'strong';
  shadow?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  pressable?: boolean;
  onPress?: () => void;
  animated?: boolean;
  animationDelay?: number;
  hapticFeedback?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// 🎨 Premium glassmorphism card with micro-interactions
export default function Card({
  children,
  style,
  blur = false,
  intensity = 'medium',
  shadow = 'md',
  pressable = false,
  onPress,
  animated = true,
  animationDelay = 0,
  hapticFeedback = true,
}: CardProps) {
  // 🌀 Animation values
  const scale = useSharedValue(animated ? 0.95 : 1);
  const opacity = useSharedValue(animated ? 0 : 1);
  const translateY = useSharedValue(animated ? 10 : 0);

  // 🎭 Entry animation
  useEffect(() => {
    if (animated) {
      const delay = animationDelay;

      setTimeout(() => {
        scale.value = withSpring(1, ANIMATIONS.spring.smooth);
        opacity.value = withTiming(1, {
          duration: ANIMATIONS.duration.normal,
          easing: Easing.out(Easing.ease),
        });
        translateY.value = withSpring(0, ANIMATIONS.spring.gentle);
      }, delay);
    }
  }, [animated, animationDelay]);

  // 🎯 Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  // 👆 Press interactions
  const handlePressIn = () => {
    if (pressable && onPress) {
      if (hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      scale.value = withSpring(0.98, ANIMATIONS.spring.snappy);
    }
  };

  const handlePressOut = () => {
    if (pressable && onPress) {
      scale.value = withSpring(1, ANIMATIONS.spring.smooth);
    }
  };

  const handlePress = () => {
    if (pressable && onPress) {
      if (hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress();
    }
  };

  // 🎨 Get shadow style
  const shadowStyle = shadow !== 'none' ? SHADOWS[shadow] : {};

  // 🪟 Blur variant with glassmorphism
  if (blur) {
    const Component = pressable ? AnimatedPressable : AnimatedView;

    return (
      <Component
        onPressIn={pressable ? handlePressIn : undefined}
        onPressOut={pressable ? handlePressOut : undefined}
        onPress={pressable ? handlePress : undefined}
        style={[
          styles.container,
          shadowStyle,
          animatedStyle,
          style,
        ]}
      >
        <BlurView
          intensity={intensity === 'subtle' ? 30 : intensity === 'medium' ? 50 : 80}
          tint="dark"
          style={styles.blurContainer}
        >
          <View style={[styles.innerContainer, createGlassmorphism(intensity)]}>
            {children}
          </View>
        </BlurView>
      </Component>
    );
  }

  // 🎴 Solid variant (no blur)
  const Component = pressable ? AnimatedPressable : AnimatedView;

  return (
    <Component
      onPressIn={pressable ? handlePressIn : undefined}
      onPressOut={pressable ? handlePressOut : undefined}
      onPress={pressable ? handlePress : undefined}
      style={[
        styles.solidContainer,
        createGlassmorphism(intensity),
        shadowStyle,
        animatedStyle,
        style,
      ]}
    >
      {children}
    </Component>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
  },
  blurContainer: {
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS.xl,
  },
  innerContainer: {
    padding: SPACING.base,
  },
  solidContainer: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.base,
    overflow: 'hidden',
  },
});
