import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { getStatusColor, SPACING, BORDER_RADIUS, FONT_SIZES, COLORS } from '../constants/theme';

interface StatusBadgeProps {
  status: string;
  animated?: boolean;
}

// Translate status based on its value
const translateStatus = (status: string, t: any): string => {
  const lowerStatus = status.toLowerCase();

  if (lowerStatus.includes('en attente') || lowerStatus.includes('an atant') || lowerStatus.includes('pendiente') || lowerStatus.includes('pending')) {
    return t('status.pending');
  }
  if (lowerStatus.includes('reçu') || lowerStatus.includes('resevwa') || lowerStatus.includes('recibido') || lowerStatus.includes('received')) {
    return t('status.received');
  }
  if (lowerStatus.includes('en transit') || lowerStatus.includes('nan transpò') || lowerStatus.includes('en tránsito') || lowerStatus.includes('in transit')) {
    return t('status.inTransit');
  }
  if (lowerStatus.includes('disponible') || lowerStatus.includes('disponib') || lowerStatus.includes('available')) {
    return t('status.available');
  }
  if (lowerStatus.includes('livré') || lowerStatus.includes('livre') || lowerStatus.includes('entregado') || lowerStatus.includes('delivered')) {
    return t('status.delivered');
  }

  return status; // Return original if no translation found
};

// Animated status badge with gradient
export default function StatusBadge({ status, animated = true }: StatusBadgeProps) {
  const { t } = useTranslation();
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (animated && (status === 'En Transit✈️' || status === 'Disponible🟢')) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        false
      );
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        false
      );
    }
  }, [status, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const statusColor = getStatusColor(status);
  const backgroundColor = `${statusColor}20`;
  const borderColor = `${statusColor}40`;

  const translatedStatus = translateStatus(status, t);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor,
          shadowColor: statusColor,
        },
        animatedStyle,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: statusColor }]} />
      <Text style={[styles.text, { color: statusColor }]}>{translatedStatus}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
