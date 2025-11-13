// 🎯 Premium Button Component - Apple-inspired
// With advanced micro-interactions & haptic feedback

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  SHADOWS,
  ANIMATIONS,
  LAYOUT,
  FONT_WEIGHTS,
} from '../constants/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

// 🎨 Premium button with advanced micro-interactions
export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  // 🌀 Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const shadowOpacity = useSharedValue(variant === 'primary' ? 0.4 : 0.2);

  // 🎭 Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const animatedShadowStyle = useAnimatedStyle(() => ({
    shadowOpacity: shadowOpacity.value,
  }));

  // 🎯 Handlers with haptic feedback
  const handlePressIn = () => {
    if (!isDisabled) {
      // Haptic feedback
      Haptics.impactAsync(
        size === 'large'
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light
      );

      // Scale down animation
      scale.value = withSpring(0.96, ANIMATIONS.spring.snappy);

      // Subtle opacity change
      opacity.value = withTiming(0.92, { duration: 100 });

      // Shadow intensity
      shadowOpacity.value = withTiming(
        variant === 'primary' ? 0.2 : 0.1,
        { duration: 100 }
      );
    }
  };

  const handlePressOut = () => {
    if (!isDisabled) {
      // Bounce back animation
      scale.value = withSequence(
        withSpring(1.02, ANIMATIONS.spring.snappy),
        withSpring(1, ANIMATIONS.spring.smooth)
      );

      // Restore opacity
      opacity.value = withTiming(1, {
        duration: ANIMATIONS.duration.fast,
        easing: Easing.out(Easing.ease),
      });

      // Restore shadow
      shadowOpacity.value = withTiming(
        variant === 'primary' ? 0.4 : 0.2,
        { duration: ANIMATIONS.duration.fast }
      );
    }
  };

  const handlePress = () => {
    if (!isDisabled) {
      // Success haptic on press
      Haptics.impactAsync(
        variant === 'danger'
          ? Haptics.ImpactFeedbackStyle.Heavy
          : Haptics.ImpactFeedbackStyle.Medium
      );
      onPress();
    }
  };

  const isDisabled = disabled || loading;

  // 📏 Size configurations
  const sizeConfig = {
    small: {
      height: LAYOUT.buttonHeightSmall,
      paddingHorizontal: SPACING.lg,
      fontSize: FONT_SIZES.base,
      iconSize: 18,
    },
    medium: {
      height: LAYOUT.buttonHeight,
      paddingHorizontal: SPACING.xl,
      fontSize: FONT_SIZES.md,
      iconSize: 20,
    },
    large: {
      height: LAYOUT.buttonHeightLarge,
      paddingHorizontal: SPACING['2xl'],
      fontSize: FONT_SIZES.lg,
      iconSize: 24,
    },
  };

  const currentSize = sizeConfig[size];

  // 🎨 Render based on variant
  if (variant === 'primary' || variant === 'success') {
    const gradientColors = variant === 'success'
      ? [COLORS.accent.green, COLORS.accent.mint]
      : isDisabled
      ? [COLORS.gray[700], COLORS.gray[700]]
      : [COLORS.accent.blue, COLORS.accent.indigo];

    return (
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={0.9}
        style={[
          animatedStyle,
          fullWidth && styles.fullWidth,
          style,
        ]}
      >
        <Animated.View style={[animatedShadowStyle]}>
          <LinearGradient
            colors={gradientColors as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.primaryButton,
              {
                height: currentSize.height,
                paddingHorizontal: currentSize.paddingHorizontal,
              },
              variant === 'primary' ? SHADOWS.blue : SHADOWS.md,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.text.primary} size="small" />
            ) : (
              <View style={styles.content}>
                {icon && iconPosition === 'left' && (
                  <Ionicons
                    name={icon}
                    size={currentSize.iconSize}
                    color={COLORS.text.primary}
                    style={styles.iconLeft}
                  />
                )}
                <Text
                  style={[
                    styles.primaryText,
                    { fontSize: currentSize.fontSize },
                    textStyle,
                  ]}
                  numberOfLines={1}
                >
                  {title}
                </Text>
                {icon && iconPosition === 'right' && (
                  <Ionicons
                    name={icon}
                    size={currentSize.iconSize}
                    color={COLORS.text.primary}
                    style={styles.iconRight}
                  />
                )}
              </View>
            )}
          </LinearGradient>
        </Animated.View>
      </AnimatedTouchable>
    );
  }

  if (variant === 'secondary') {
    return (
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={0.9}
        style={[
          animatedStyle,
          styles.secondaryButton,
          {
            height: currentSize.height,
            paddingHorizontal: currentSize.paddingHorizontal,
          },
          isDisabled && styles.disabled,
          fullWidth && styles.fullWidth,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.text.secondary} size="small" />
        ) : (
          <View style={styles.content}>
            {icon && iconPosition === 'left' && (
              <Ionicons
                name={icon}
                size={currentSize.iconSize}
                color={COLORS.text.secondary}
                style={styles.iconLeft}
              />
            )}
            <Text
              style={[
                styles.secondaryText,
                { fontSize: currentSize.fontSize },
                textStyle,
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Ionicons
                name={icon}
                size={currentSize.iconSize}
                color={COLORS.text.secondary}
                style={styles.iconRight}
              />
            )}
          </View>
        )}
      </AnimatedTouchable>
    );
  }

  if (variant === 'danger') {
    return (
      <AnimatedTouchable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={0.9}
        style={[
          animatedStyle,
          fullWidth && styles.fullWidth,
          style,
        ]}
      >
        <Animated.View style={[animatedShadowStyle]}>
          <LinearGradient
            colors={
              (isDisabled
                ? [COLORS.gray[700], COLORS.gray[700]]
                : [COLORS.status.error, COLORS.accent.pink]) as [string, string]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.primaryButton,
              {
                height: currentSize.height,
                paddingHorizontal: currentSize.paddingHorizontal,
              },
              SHADOWS.md,
            ]}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.text.primary} size="small" />
            ) : (
              <View style={styles.content}>
                {icon && iconPosition === 'left' && (
                  <Ionicons
                    name={icon}
                    size={currentSize.iconSize}
                    color={COLORS.text.primary}
                    style={styles.iconLeft}
                  />
                )}
                <Text
                  style={[
                    styles.primaryText,
                    { fontSize: currentSize.fontSize },
                    textStyle,
                  ]}
                  numberOfLines={1}
                >
                  {title}
                </Text>
                {icon && iconPosition === 'right' && (
                  <Ionicons
                    name={icon}
                    size={currentSize.iconSize}
                    color={COLORS.text.primary}
                    style={styles.iconRight}
                  />
                )}
              </View>
            )}
          </LinearGradient>
        </Animated.View>
      </AnimatedTouchable>
    );
  }

  // Ghost variant (transparent)
  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        animatedStyle,
        styles.ghostButton,
        {
          height: currentSize.height,
          paddingHorizontal: currentSize.paddingHorizontal,
        },
        isDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.text.tertiary} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={currentSize.iconSize}
              color={COLORS.text.secondary}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={[
              styles.ghostText,
              { fontSize: currentSize.fontSize },
              textStyle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={currentSize.iconSize}
              color={COLORS.text.secondary}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.base,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.base,
    backgroundColor: COLORS.background.elevated,
    borderWidth: 1.5,
    borderColor: COLORS.border.medium,
  },
  ghostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'transparent',
  },
  primaryText: {
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
    letterSpacing: 0.3,
  },
  secondaryText: {
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.secondary,
    letterSpacing: 0.2,
  },
  ghostText: {
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text.secondary,
    letterSpacing: 0.1,
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});
