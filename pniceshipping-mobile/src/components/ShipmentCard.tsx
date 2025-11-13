import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import Card from './Card';
import StatusBadge from './StatusBadge';
import { Shipment } from '../types';
import { ShippingRates, SpecialItem } from '../utils/settingsQueries';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  ICON_SIZES,
} from '../constants/theme';

interface ShipmentCardProps {
  shipment: Shipment;
  onPress?: (shipment: Shipment) => void;
  index?: number;
  shippingRates?: ShippingRates;
  specialItems?: SpecialItem[];
}

// Get category icon and color based on shipment category
const getCategoryIconAndColor = (category?: string): { icon: keyof typeof Ionicons.glyphMap; colors: string[] } => {
  const cat = category?.toLowerCase() || '';

  // iPhone specific
  if (cat.includes('iphone') || cat.includes('apple')) {
    return {
      icon: 'phone-portrait',
      colors: ['#007AFF', '#5856D6'], // Apple blue & purple
    };
  }

  // Laptop/Computer
  if (cat.includes('laptop') || cat.includes('ordinateur') || cat.includes('macbook') || cat.includes('computer')) {
    return {
      icon: 'laptop',
      colors: ['#5856D6', '#AF52DE'], // Purple gradient
    };
  }

  // Phone generic
  if (cat.includes('phone') || cat.includes('téléphone') || cat.includes('samsung') || cat.includes('galaxy')) {
    return {
      icon: 'phone-portrait',
      colors: ['#34C759', '#32D74B'], // Green gradient
    };
  }

  // Electronics
  if (cat.includes('électronique') || cat.includes('electronic') || cat.includes('tv') || cat.includes('télé')) {
    return {
      icon: 'desktop',
      colors: ['#FF9500', '#FFCC00'], // Orange gradient
    };
  }

  // Standard/Default
  return {
    icon: 'cube',
    colors: [COLORS.accent.blue, COLORS.accent.indigo],
  };
};

// Translate category based on its name
const translateCategory = (category: string | undefined, t: any): string => {
  if (!category) return t('categories.standard');

  const lowerCategory = category.toLowerCase();

  if (lowerCategory.includes('iphone') || lowerCategory.includes('apple')) {
    return t('categories.iphone');
  }
  if (lowerCategory.includes('laptop') || lowerCategory.includes('ordinateur') || lowerCategory.includes('macbook')) {
    return t('categories.laptop');
  }
  if (lowerCategory.includes('phone') || lowerCategory.includes('téléphone') || lowerCategory.includes('telefon') || lowerCategory.includes('samsung') || lowerCategory.includes('galaxy')) {
    return t('categories.phone');
  }
  if (lowerCategory.includes('computer') || lowerCategory.includes('pc')) {
    return t('categories.computer');
  }
  if (lowerCategory.includes('électronique') || lowerCategory.includes('electronic') || lowerCategory.includes('elektwonik')) {
    return t('categories.electronics');
  }
  if (lowerCategory.includes('tv') || lowerCategory.includes('télé') || lowerCategory.includes('televizyon') || lowerCategory.includes('television')) {
    return t('categories.tv');
  }
  if (lowerCategory.includes('tablet') || lowerCategory.includes('tablette') || lowerCategory.includes('tablèt')) {
    return t('categories.tablet');
  }

  // If no match, return Standard or the original if it's already a simple word
  if (lowerCategory === 'standard' || lowerCategory === 'estanda' || lowerCategory === 'estándar') {
    return t('categories.standard');
  }

  return category; // Return original if no translation found
};

// Premium shipment card with glassmorphism
export default function ShipmentCard({
  shipment,
  onPress,
  index = 0,
  shippingRates,
  specialItems = [],
}: ShipmentCardProps) {
  const { t } = useTranslation();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(shipment);
  };

  const { icon: categoryIcon, colors: iconColors } = getCategoryIconAndColor(shipment.category);

  // Calculate cost details
  const calculateCostDetails = () => {
    if (!shippingRates) return null;

    const weight = parseFloat(shipment.weight || '0');
    const destination = shipment.destination?.toLowerCase() || '';
    const perLbRate = destination.includes('port-au-prince')
      ? shippingRates.ratePortAuPrince
      : shippingRates.rateCapHaitien;

    const normalizedCategory = shipment.category
      ?.toLowerCase()
      .replace(/[\s-]/g, '')
      .replace('portbable', 'portables')
      .replace(/[éèê]/g, 'e');

    const matchingSpecialItem = specialItems.find(item => {
      const itemId = item.id.toLowerCase();
      const itemName = item.name.toLowerCase();
      return normalizedCategory && (
        itemId.includes(normalizedCategory) ||
        normalizedCategory.includes(itemId) ||
        itemName.includes(normalizedCategory) ||
        normalizedCategory.includes(itemName)
      );
    });

    const isFixedRate = !!matchingSpecialItem;
    const shippingCost = isFixedRate
      ? matchingSpecialItem.price
      : weight * perLbRate;
    const serviceFee = shippingRates.serviceFee;
    const totalCost = shippingCost + serviceFee;

    return {
      isFixedRate,
      shippingCost,
      serviceFee,
      totalCost,
      perLbRate,
      weight,
    };
  };

  const costDetails = calculateCostDetails();
  const isPending = shipment.status?.toLowerCase().includes('en attente') ||
                    shipment.status?.toLowerCase().includes('an atant') ||
                    shipment.status?.toLowerCase().includes('pendiente') ||
                    shipment.status?.toLowerCase().includes('pending');

  // Compact design for pending shipments, show only confirmation message
  if (isPending) {
    return (
      <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.8}
          disabled={!onPress}
        >
          <Card blur={false} style={styles.compactCard}>
            <View style={styles.compactHeader}>
              <View style={styles.compactIconContainer}>
                <LinearGradient
                  colors={[COLORS.accent.orange, '#FF9500']}
                  style={styles.compactIconGradient}
                >
                  <Ionicons name="time-outline" size={20} color={COLORS.text.primary} />
                </LinearGradient>
              </View>
              <View style={styles.compactHeaderInfo}>
                <Text style={styles.compactTrackingNumber} numberOfLines={1}>
                  {shipment.trackingNumber}
                </Text>
                <Text style={styles.compactDestination} numberOfLines={1}>
                  <Ionicons name="location" size={12} color={COLORS.text.tertiary} />{' '}
                  {shipment.destination}
                </Text>
              </View>
              {onPress && (
                <Ionicons name="chevron-forward" size={18} color={COLORS.text.tertiary} />
              )}
            </View>
            <View style={styles.pendingMessageContainer}>
              <Text style={styles.pendingMessageText}>{t('shipments.pendingConfirmation')}</Text>
            </View>
          </Card>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // Compact design for confirmed shipments
  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={!onPress}
      >
        <Card blur={false} style={styles.compactCard}>
          {/* Header Row */}
          <View style={styles.compactHeader}>
            <View style={styles.compactIconContainer}>
              <LinearGradient
                colors={iconColors}
                style={styles.compactIconGradient}
              >
                <Ionicons name={categoryIcon} size={20} color={COLORS.text.primary} />
              </LinearGradient>
            </View>
            <View style={styles.compactHeaderInfo}>
              <Text style={styles.compactTrackingNumber} numberOfLines={1}>
                {shipment.trackingNumber}
              </Text>
              <View style={styles.compactMetaRow}>
                <Text style={styles.compactMeta}>
                  {shipment.weight} {t('common.lbs')}
                </Text>
                <Text style={styles.compactMetaDivider}>•</Text>
                <Text style={styles.compactMeta} numberOfLines={1}>
                  {translateCategory(shipment.category, t)}
                </Text>
              </View>
            </View>
            <StatusBadge status={shipment.status} animated />
          </View>

          {/* Footer Row with price */}
          {costDetails && (
            <View style={styles.compactFooter}>
              <Text style={styles.compactDestination} numberOfLines={1}>
                <Ionicons name="location" size={12} color={COLORS.text.tertiary} />{' '}
                {shipment.destination}
              </Text>
              <View style={styles.compactPriceContainer}>
                <Text style={styles.compactPrice}>${costDetails.totalCost.toFixed(2)}</Text>
                {onPress && (
                  <Ionicons name="chevron-forward" size={18} color={COLORS.text.tertiary} />
                )}
              </View>
            </View>
          )}
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // New compact card styles
  compactCard: {
    marginBottom: SPACING.md,
    padding: SPACING.base,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  compactIconContainer: {
    // No margin needed
  },
  compactIconGradient: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactHeaderInfo: {
    flex: 1,
  },
  compactTrackingNumber: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  compactDestination: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.tertiary,
    flex: 1,
  },
  compactMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  compactMeta: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  compactMetaDivider: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.tertiary,
  },
  compactFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  compactPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  compactPrice: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: COLORS.accent.green,
  },
  // Pending shipment styles
  pendingMessageContainer: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  pendingMessageText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.accent.orange,
    textAlign: 'center',
  },
  // Legacy styles (kept for compatibility if needed elsewhere)
  card: {
    marginBottom: SPACING.base,
    padding: SPACING.lg,
  },
});
