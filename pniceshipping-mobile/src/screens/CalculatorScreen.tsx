import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import Button from '../components/Button';
import { DestinationType } from '../types';
import { getShippingRates, getSpecialItems, type ShippingRates, type SpecialItem } from '../utils/settingsQueries';
import { useSettingsPolling } from '../hooks/useSettingsPolling';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  ICON_SIZES,
} from '../constants/theme';

interface DestinationOption {
  label: string;
  value: DestinationType;
  rate: number;
}

interface SpecialItemDisplay {
  id: string;
  label: string;
  price: number;
  icon: keyof typeof Ionicons.glyphMap;
}

// Helper function to get icon for category
const getIconForCategory = (category: string): keyof typeof Ionicons.glyphMap => {
  if (category === 'phone') return 'phone-portrait';
  if (category === 'computer') return 'laptop';
  return 'wifi';
};

export default function CalculatorScreen() {
  const { t } = useTranslation();
  const [destination, setDestination] = useState<DestinationType>('cap-haitien');
  const [isSpecial, setIsSpecial] = useState(false);
  const [weight, setWeight] = useState('');
  const [selectedSpecialItem, setSelectedSpecialItem] = useState<string | null>(null);
  const [result, setResult] = useState<{
    shippingCost: number;
    serviceFee: number;
    totalCost: number;
  } | null>(null);

  // Dynamic settings from database
  const [shippingRates, setShippingRates] = useState<ShippingRates>({
    serviceFee: 10,
    rateCapHaitien: 4.5,
    ratePortAuPrince: 5,
  });
  const [specialItems, setSpecialItems] = useState<SpecialItemDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Fetch settings function
  const fetchSettings = useCallback(async () => {
    try {
      const [rates, itemsConfig] = await Promise.all([
        getShippingRates(),
        getSpecialItems(),
      ]);

      setShippingRates(rates);

      // Transform special items for display
      const displayItems: SpecialItemDisplay[] = itemsConfig.items.map(item => ({
        id: item.id,
        label: item.name,
        price: item.price,
        icon: getIconForCategory(item.category),
      }));
      setSpecialItems(displayItems);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Enable real-time settings polling
  useSettingsPolling({
    enabled: true,
    onUpdate: fetchSettings,
    silent: false,
  });

  useEffect(() => {
    // Reset when switching between standard and special
    setWeight('');
    setSelectedSpecialItem(null);
    setResult(null);
  }, [isSpecial]);

  const handleCalculate = () => {
    if (isSpecial) {
      if (!selectedSpecialItem) {
        Alert.alert(t('common.error'), t('calculator.errorSelectItem'));
        return;
      }

      // Find the selected special item
      const item = specialItems.find(i => i.id === selectedSpecialItem);
      if (!item) return;

      // Calculate with special item price
      const calculation = {
        shippingCost: item.price,
        serviceFee: shippingRates.serviceFee,
        totalCost: item.price + shippingRates.serviceFee,
      };
      setResult(calculation);
    } else {
      const weightNum = parseFloat(weight);
      if (!weight || isNaN(weightNum) || weightNum <= 0) {
        Alert.alert(t('common.error'), t('calculator.errorWeight'));
        return;
      }

      // Calculate with dynamic rates
      const perLbsRate = destination === 'port-au-prince'
        ? shippingRates.ratePortAuPrince
        : shippingRates.rateCapHaitien;

      const shippingCost = weightNum * perLbsRate;
      const calculation = {
        shippingCost,
        serviceFee: shippingRates.serviceFee,
        totalCost: shippingCost + shippingRates.serviceFee,
      };
      setResult(calculation);
    }

    // Animate result card
    scale.value = withSpring(1.05, { damping: 15 }, () => {
      scale.value = withSpring(1);
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDestinationSelect = (value: DestinationType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDestination(value);
    setResult(null);
  };

  const handleSpecialItemSelect = (value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSpecialItem(value);
    setResult(null);
  };

  // Build destinations dynamically from rates
  const destinations: DestinationOption[] = [
    { label: 'Cap-Haïtien', value: 'cap-haitien', rate: shippingRates.rateCapHaitien },
    { label: 'Port-au-Prince', value: 'port-au-prince', rate: shippingRates.ratePortAuPrince },
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LinearGradient
          colors={[COLORS.background.primary, COLORS.gray[900]]}
          style={StyleSheet.absoluteFillObject}
        />
        <ActivityIndicator size="large" color={COLORS.accent.blue} />
        <Text style={styles.loadingText}>{t('calculator.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background.primary, COLORS.gray[900]]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View entering={FadeIn} style={styles.header}>
            <View style={styles.iconWrapper}>
              <LinearGradient
                colors={[COLORS.accent.orange, COLORS.accent.pink]}
                style={styles.iconGradient}
              >
                <Ionicons name="calculator" size={32} color={COLORS.text.primary} />
              </LinearGradient>
            </View>
            <Text style={styles.headerTitle}>{t('calculator.title')}</Text>
            <Text style={styles.headerSubtitle}>
              {t('calculator.subtitle')}
            </Text>
          </Animated.View>

          {/* Info Banner */}
          <Animated.View entering={FadeInDown.delay(50)}>
            <Card blur={false} style={styles.infoBanner}>
              <View style={styles.infoHeader}>
                <Ionicons name="information-circle" size={24} color={COLORS.accent.blue} />
                <Text style={styles.infoTitle}>{t('calculator.howItWorks')}</Text>
              </View>
              <View style={styles.infoContent}>
                <View style={styles.infoRow}>
                  <Ionicons name="cube-outline" size={18} color={COLORS.accent.green} />
                  <Text style={styles.infoText}>
                    <Text style={styles.infoBold}>{t('calculator.standardShipping')}</Text> {t('calculator.standardDesc', { fee: shippingRates.serviceFee })}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="phone-portrait-outline" size={18} color={COLORS.accent.purple} />
                  <Text style={styles.infoText}>
                    <Text style={styles.infoBold}>{t('calculator.specialItem')}</Text> {t('calculator.specialDesc', { fee: shippingRates.serviceFee })}
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Destination Selection */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <Card blur={false} style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{t('calculator.destination')}</Text>
              <View style={styles.destinationContainer}>
                {destinations.map((dest) => (
                  <TouchableOpacity
                    key={dest.value}
                    onPress={() => handleDestinationSelect(dest.value)}
                    activeOpacity={0.7}
                    style={styles.destinationButton}
                  >
                    <View
                      style={[
                        styles.destinationOption,
                        destination === dest.value && styles.destinationOptionActive,
                      ]}
                    >
                      <View style={styles.destinationInfo}>
                        <Ionicons
                          name="location"
                          size={24}
                          color={
                            destination === dest.value
                              ? COLORS.accent.blue
                              : COLORS.text.tertiary
                          }
                        />
                        <View style={styles.destinationText}>
                          <Text
                            style={[
                              styles.destinationLabel,
                              destination === dest.value && styles.destinationLabelActive,
                            ]}
                          >
                            {dest.label}
                          </Text>
                          <Text style={styles.destinationRate}>${dest.rate}/{t('common.lbs')}</Text>
                        </View>
                      </View>
                      {destination === dest.value && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={COLORS.accent.blue}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          </Animated.View>

          {/* Type Selection */}
          <Animated.View entering={FadeInDown.delay(200)}>
            <Card blur={false} style={styles.sectionCard}>
              <View style={styles.typeHeader}>
                <View>
                  <Text style={styles.sectionTitle}>{t('calculator.hasSpecialItems')}</Text>
                  <Text style={styles.sectionSubtitle}>
                    {isSpecial ? t('calculator.yesSpecial') : t('calculator.noStandard')}
                  </Text>
                </View>
                <Switch
                  value={isSpecial}
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setIsSpecial(value);
                  }}
                  trackColor={{
                    false: COLORS.gray[700],
                    true: COLORS.accent.blue,
                  }}
                  thumbColor={COLORS.text.primary}
                  ios_backgroundColor={COLORS.gray[700]}
                />
              </View>
            </Card>
          </Animated.View>

          {/* Standard Weight Input */}
          {!isSpecial && (
            <Animated.View entering={FadeInDown.delay(300)}>
              <Card blur={false} style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>{t('calculator.weight')}</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="scale"
                    size={20}
                    color={COLORS.text.tertiary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={t('calculator.weightPlaceholder')}
                    placeholderTextColor={COLORS.text.quaternary}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.inputUnit}>{t('common.lbs')}</Text>
                </View>
              </Card>
            </Animated.View>
          )}

          {/* Special Items Selection */}
          {isSpecial && (
            <Animated.View entering={FadeInDown.delay(300)}>
              <Card blur={false} style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>{t('calculator.selectArticle')}</Text>
                <View style={styles.specialItemsContainer}>
                  {specialItems.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => handleSpecialItemSelect(item.id)}
                      activeOpacity={0.7}
                      style={styles.specialItemButton}
                    >
                      <View
                        style={[
                          styles.specialItem,
                          selectedSpecialItem === item.id && styles.specialItemActive,
                        ]}
                      >
                        <View
                          style={[
                            styles.specialItemIcon,
                            selectedSpecialItem === item.id && styles.specialItemIconActive,
                          ]}
                        >
                          <Ionicons
                            name={item.icon}
                            size={28}
                            color={
                              selectedSpecialItem === item.id
                                ? COLORS.accent.blue
                                : COLORS.text.tertiary
                            }
                          />
                        </View>
                        <Text
                          style={[
                            styles.specialItemLabel,
                            selectedSpecialItem === item.id && styles.specialItemLabelActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                        <Text style={styles.specialItemPrice}>${item.price}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card>
            </Animated.View>
          )}

          {/* Calculate Button */}
          <Animated.View entering={FadeInDown.delay(400)}>
            <Button
              title={t('calculator.calculate')}
              onPress={handleCalculate}
              icon="calculator"
              style={styles.calculateButton}
            />
          </Animated.View>

          {/* Result */}
          {result && (
            <Animated.View entering={FadeInDown.delay(500)} style={animatedStyle}>
              <Card blur={false} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Ionicons name="document-text" size={28} color={COLORS.accent.green} />
                  <Text style={styles.resultTitle}>{t('calculator.estimation')}</Text>
                </View>

                <View style={styles.resultDivider} />

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{t('calculator.shippingFee')}</Text>
                  <Text style={styles.resultValue}>${result.shippingCost.toFixed(2)}</Text>
                </View>

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>{t('calculator.serviceFee')}</Text>
                  <Text style={styles.resultValue}>${result.serviceFee.toFixed(2)}</Text>
                </View>

                <View style={styles.resultDivider} />

                <View style={styles.resultRow}>
                  <Text style={styles.resultTotalLabel}>{t('calculator.total')}</Text>
                  <Text style={styles.resultTotalValue}>
                    ${result.totalCost.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.infoBox}>
                  <Ionicons name="information-circle" size={20} color={COLORS.accent.blue} />
                  <Text style={styles.infoBoxText}>
                    <Text style={styles.infoBold}>{t('calculator.note')}</Text> {t('calculator.variationNote')}
                  </Text>
                </View>
              </Card>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.base,
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING['2xl'],
  },
  iconWrapper: {
    marginBottom: SPACING.lg,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.tertiary,
    textAlign: 'center',
  },
  infoBanner: {
    padding: SPACING.lg,
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.accent.blue + '30',
    backgroundColor: COLORS.accent.blue + '08',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  infoTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  infoContent: {
    gap: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  sectionCard: {
    padding: SPACING.lg,
    marginBottom: SPACING.base,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.tertiary,
    marginTop: SPACING.xs / 2,
  },
  destinationContainer: {
    gap: SPACING.md,
  },
  destinationButton: {
    width: '100%',
  },
  destinationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray[800],
    borderWidth: 2,
    borderColor: 'transparent',
  },
  destinationOptionActive: {
    backgroundColor: `${COLORS.accent.blue}15`,
    borderColor: COLORS.accent.blue,
  },
  destinationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  destinationText: {
    marginLeft: SPACING.md,
  },
  destinationLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs / 2,
  },
  destinationLabelActive: {
    color: COLORS.text.primary,
  },
  destinationRate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.tertiary,
  },
  typeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    paddingVertical: SPACING.base,
  },
  inputUnit: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text.tertiary,
    marginLeft: SPACING.sm,
  },
  specialItemsContainer: {
    gap: SPACING.md,
  },
  specialItemButton: {
    width: '100%',
  },
  specialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray[800],
    borderWidth: 2,
    borderColor: 'transparent',
  },
  specialItemActive: {
    backgroundColor: `${COLORS.accent.blue}15`,
    borderColor: COLORS.accent.blue,
  },
  specialItemIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray[700],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.base,
  },
  specialItemIconActive: {
    backgroundColor: `${COLORS.accent.blue}20`,
  },
  specialItemLabel: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  specialItemLabelActive: {
    color: COLORS.text.primary,
  },
  specialItemPrice: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.accent.green,
  },
  calculateButton: {
    marginVertical: SPACING.base,
  },
  resultCard: {
    padding: SPACING.lg,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  resultTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginLeft: SPACING.sm,
  },
  resultDivider: {
    height: 1,
    backgroundColor: COLORS.border.light,
    marginVertical: SPACING.base,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  resultLabel: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
  },
  resultValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  resultTotalLabel: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  resultTotalValue: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.accent.green,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.base,
    backgroundColor: `${COLORS.accent.blue}15`,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.base,
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginLeft: SPACING.sm,
    lineHeight: 20,
  },
  infoBoxText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginLeft: SPACING.sm,
    lineHeight: 20,
  },
});
