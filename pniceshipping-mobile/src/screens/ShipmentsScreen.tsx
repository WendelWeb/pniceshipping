import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Modal,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import ShipmentCard from '../components/ShipmentCard';
import LoadingScreen from '../components/LoadingScreen';
import { translateHistoryStatus } from '../utils/translateHistoryStatus';
import { translateHistoryLocation } from '../utils/translateHistoryLocation';
import {
  findShipmentsByOwnerId,
  getShipmentStats,
  filterShipmentsByStatus,
  sortShipmentsByDate,
} from '../services/shipmentService';
import { Shipment, StatusDates } from '../types';
import { getShippingRates, getSpecialItems, type ShippingRates, type SpecialItem } from '../utils/settingsQueries';
import { useSettingsPolling } from '../hooks/useSettingsPolling';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  ICON_SIZES,
  SHADOWS,
  ANIMATIONS,
} from '../constants/theme';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  color: string;
  isActive: boolean;
  onPress: () => void;
}

function StatCard({ icon, label, value, color, isActive, onPress }: StatCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.95, ANIMATIONS.spring.snappy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, ANIMATIONS.spring.smooth);
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress();
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Card
          blur={false}
          shadow={isActive ? 'lg' : 'sm'}
          intensity="medium"
          style={[
            styles.statCard,
            isActive && styles.activeStatCard,
            isActive && { borderColor: color },
          ]}
        >
          {/* Top row: icon + value */}
          <View style={styles.statTopRow}>
            <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
              <Ionicons name={icon} size={14} color={color} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
          </View>
          {/* Bottom: label */}
          <Text style={styles.statLabel} numberOfLines={1} ellipsizeMode="tail">{label}</Text>
          {isActive && (
            <View style={[styles.activeIndicator, { backgroundColor: color }]} />
          )}
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ShipmentsScreen() {
  const { user } = useUser();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Dynamic rates from database
  const [shippingRates, setShippingRates] = useState<ShippingRates>({
    serviceFee: 10,
    rateCapHaitien: 4.5,
    ratePortAuPrince: 5,
  });
  const [specialItems, setSpecialItems] = useState<SpecialItem[]>([]);

  const stats = getShipmentStats(shipments);

  // Function to calculate shipment cost
  const calculateShipmentCost = (shipment: Shipment): number => {
    const weight = parseFloat(shipment.weight || '0');
    const destination = shipment.destination?.toLowerCase() || '';
    const perLbRate = destination.includes('port-au-prince')
      ? shippingRates.ratePortAuPrince
      : shippingRates.rateCapHaitien;

    // Normalize category
    const normalizedCategory = shipment.category
      ?.toLowerCase()
      .replace(/[\s-]/g, '')
      .replace('portbable', 'portables')
      .replace(/[éèê]/g, 'e');

    // Check if it's a special item
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

    if (matchingSpecialItem) {
      // Fixed rate + service fee
      return matchingSpecialItem.price + shippingRates.serviceFee;
    } else {
      // Weight-based + service fee
      return (weight * perLbRate) + shippingRates.serviceFee;
    }
  };

  const loadShipments = useCallback(async () => {
    if (!user?.id) return;

    try {
      const data = await findShipmentsByOwnerId(user.id);
      const sorted = sortShipmentsByDate(data);
      setShipments(sorted);

      // Réappliquer le filtre actif
      if (selectedFilter === 'all') {
        setFilteredShipments(sorted);
      } else {
        const filtered = filterShipmentsByStatus(sorted, selectedFilter);
        setFilteredShipments(filtered);
      }
    } catch (error) {
      console.error('Error loading shipments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, selectedFilter]);

  // Load settings function
  const loadSettings = useCallback(async () => {
    try {
      const [rates, itemsConfig] = await Promise.all([
        getShippingRates(),
        getSpecialItems(),
      ]);
      setShippingRates(rates);
      setSpecialItems(itemsConfig.items);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Enable real-time settings polling
  useSettingsPolling({
    enabled: true,
    onUpdate: loadSettings,
    silent: false,
  });

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadShipments();
  }, [loadShipments]);

  const handleFilterPress = (filter: string) => {
    setSelectedFilter(filter);
    if (filter === 'all') {
      setFilteredShipments(shipments);
    } else {
      const filtered = filterShipmentsByStatus(shipments, filter);
      setFilteredShipments(filtered);
    }
  };

  const handleShipmentPress = (shipment: Shipment) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedShipment(shipment);
    setModalVisible(true);
  };

  const closeModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalVisible(false);
  };

  // Listen for navigation focus to refresh shipments
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadShipments();
    });
    return unsubscribe;
  }, [navigation]);

  const handleAddShipment = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // @ts-ignore - Navigation types will be defined in app
    navigation.navigate('AddShipment');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background.primary, COLORS.gray[900]]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Fixed Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>{t('shipments.title')}</Text>
              <Text style={styles.headerSubtitle}>
                {t('shipments.totalPackages', { count: stats.total })}
              </Text>
            </View>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[COLORS.accent.blue, COLORS.accent.indigo]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || 'U'}
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Card blur={false} style={styles.infoBannerCard}>
              <View style={styles.infoBannerContent}>
                <Ionicons name="information-circle" size={20} color={COLORS.accent.blue} />
                <Text style={styles.infoBannerText}>
                  {t('shipments.infoBanner')}
                </Text>
              </View>
            </Card>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsContainer}
          >
            <StatCard
              icon="cube"
              label={t('shipments.filterAll')}
              value={stats.total}
              color={COLORS.accent.blue}
              isActive={selectedFilter === 'all'}
              onPress={() => handleFilterPress('all')}
            />
            <StatCard
              icon="hourglass"
              label={t('shipments.filterPending')}
              value={stats.pending}
              color={COLORS.status.pending}
              isActive={selectedFilter === 'En attente⏳'}
              onPress={() => handleFilterPress('En attente⏳')}
            />
            <StatCard
              icon="arrow-down-circle"
              label={t('shipments.filterReceived')}
              value={stats.received}
              color={COLORS.status.received}
              isActive={selectedFilter === 'Recu📦'}
              onPress={() => handleFilterPress('Recu📦')}
            />
            <StatCard
              icon="airplane"
              label={t('shipments.filterTransit')}
              value={stats.inTransit}
              color={COLORS.status.transit}
              isActive={selectedFilter === 'En Transit✈️'}
              onPress={() => handleFilterPress('En Transit✈️')}
            />
            <StatCard
              icon="checkmark-circle"
              label={t('shipments.filterAvailable')}
              value={stats.available}
              color={COLORS.status.available}
              isActive={selectedFilter === 'Disponible🟢'}
              onPress={() => handleFilterPress('Disponible🟢')}
            />
            <StatCard
              icon="checkbox"
              label={t('shipments.filterDelivered')}
              value={stats.delivered}
              color={COLORS.status.delivered}
              isActive={selectedFilter === 'Livré✅'}
              onPress={() => handleFilterPress('Livré✅')}
            />
          </ScrollView>
        </View>

        <FlatList
          data={filteredShipments}
          renderItem={({ item, index }) => (
            <ShipmentCard
              shipment={item}
              onPress={handleShipmentPress}
              index={index}
              shippingRates={shippingRates}
              specialItems={specialItems}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
          maxToRenderPerBatch={10}
          windowSize={10}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.accent.blue}
              colors={[COLORS.accent.blue]}
            />
          }
          ListEmptyComponent={
            <Animated.View entering={FadeIn} style={styles.emptyState}>
              <Ionicons name="cube-outline" size={80} color={COLORS.text.tertiary} />
              <Text style={styles.emptyTitle}>{t('shipments.noPackages')}</Text>
              <Text style={styles.emptyText}>
                {selectedFilter === 'all'
                  ? t('shipments.noPackagesMessage')
                  : t('shipments.noPackagesFiltered')}
              </Text>
              {selectedFilter === 'all' && (
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={handleAddShipment}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[COLORS.accent.blue, COLORS.accent.indigo]}
                    style={styles.emptyButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="add-circle" size={24} color={COLORS.text.primary} />
                    <Text style={styles.emptyButtonText}>{t('shipments.makeRequest')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </Animated.View>
          }
        />
      </SafeAreaView>

      {/* Premium Bottom Sheet Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
            onPress={closeModal}
          />
          <View style={styles.modalContent}>
            {/* Modal Handle */}
            <View style={styles.modalHandle} />

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>{t('shipments.detailsTitle')}</Text>
                    <Text style={styles.modalSubtitle}>
                      {selectedShipment?.trackingNumber}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={styles.closeButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-circle" size={32} color={COLORS.text.secondary} />
                  </TouchableOpacity>
                </View>

              {selectedShipment && (() => {
                const isPending = selectedShipment.status?.toLowerCase().includes('en attente') ||
                                  selectedShipment.status?.toLowerCase().includes('an atant') ||
                                  selectedShipment.status?.toLowerCase().includes('pendiente') ||
                                  selectedShipment.status?.toLowerCase().includes('pending');

                // Minimal info for pending shipments
                if (isPending) {
                  return (
                    <>
                      <Card blur={false} style={styles.modalCard}>
                        {/* Row 1: Tracking Number + Recipient */}
                        <View style={styles.modalInfoGrid}>
                          <View style={styles.modalInfoColumn}>
                            <Text style={styles.modalLabel}>{t('shipments.trackingNumber')}</Text>
                            <Text style={styles.modalValue}>{selectedShipment.trackingNumber}</Text>
                          </View>
                          <View style={styles.modalInfoColumn}>
                            <Text style={styles.modalLabel}>{t('shipments.recipient')}</Text>
                            <Text style={styles.modalValue} numberOfLines={1}>{selectedShipment.fullName}</Text>
                          </View>
                        </View>

                        {/* Row 2: Destination + Status */}
                        <View style={styles.modalInfoGrid}>
                          <View style={styles.modalInfoColumn}>
                            <Text style={styles.modalLabel}>{t('shipments.destination')}</Text>
                            <Text style={styles.modalValue} numberOfLines={1}>{selectedShipment.destination}</Text>
                          </View>
                          <View style={styles.modalInfoColumn}>
                            <Text style={styles.modalLabel}>{t('shipments.status')}</Text>
                            <Text style={[styles.modalValue, styles.pendingStatusText]}>
                              {t('shipments.pendingConfirmation')}
                            </Text>
                          </View>
                        </View>
                      </Card>
                    </>
                  );
                }

                // Full info for confirmed shipments
                return (
                  <>
                    <Card blur={false} style={styles.modalCard}>
                      {/* Row 1: Tracking Number + Recipient */}
                      <View style={styles.modalInfoGrid}>
                        <View style={styles.modalInfoColumn}>
                          <Text style={styles.modalLabel}>{t('shipments.trackingNumber')}</Text>
                          <Text style={styles.modalValue}>{selectedShipment.trackingNumber}</Text>
                        </View>
                        <View style={styles.modalInfoColumn}>
                          <Text style={styles.modalLabel}>{t('shipments.recipient')}</Text>
                          <Text style={styles.modalValue} numberOfLines={1}>{selectedShipment.fullName}</Text>
                        </View>
                      </View>

                      {/* Row 2: Destination + Weight */}
                      <View style={styles.modalInfoGrid}>
                        <View style={styles.modalInfoColumn}>
                          <Text style={styles.modalLabel}>{t('shipments.destination')}</Text>
                          <Text style={styles.modalValue} numberOfLines={1}>{selectedShipment.destination}</Text>
                        </View>
                        <View style={styles.modalInfoColumn}>
                          <Text style={styles.modalLabel}>{t('shipments.weight')}</Text>
                          <Text style={styles.modalValue}>{selectedShipment.weight}</Text>
                        </View>
                      </View>

                      {/* Row 3: Category + Status */}
                      <View style={styles.modalInfoGrid}>
                        <View style={styles.modalInfoColumn}>
                          <Text style={styles.modalLabel}>{t('shipments.category')}</Text>
                          <Text style={styles.modalValue} numberOfLines={1}>{selectedShipment.category}</Text>
                        </View>
                        <View style={styles.modalInfoColumn}>
                          <Text style={styles.modalLabel}>{t('shipments.status')}</Text>
                          <StatusBadge status={selectedShipment.status} />
                        </View>
                      </View>
                    </Card>

                    {/* Cost Breakdown Card */}
                    <Card blur={false} style={[styles.modalCard, styles.costBreakdownCard]}>
                      <View style={styles.costBreakdownHeader}>
                        <Ionicons name="cash-outline" size={24} color={COLORS.accent.green} />
                        <Text style={styles.costBreakdownTitle}>{t('shipments.costBreakdown')}</Text>
                      </View>

                      {(() => {
                        const weight = parseFloat(selectedShipment.weight || '0');
                        const destination = selectedShipment.destination?.toLowerCase() || '';
                        const perLbRate = destination.includes('port-au-prince')
                          ? shippingRates.ratePortAuPrince
                          : shippingRates.rateCapHaitien;

                        const normalizedCategory = selectedShipment.category
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

                        return (
                          <>
                            <View style={styles.costRow}>
                              <View style={styles.costRowLeft}>
                                <Ionicons name="cube-outline" size={18} color={COLORS.accent.blue} />
                                <Text style={styles.costLabel}>
                                  {isFixedRate
                                    ? `${t('shipments.fixedRate')} (${matchingSpecialItem?.name})`
                                    : `${t('shipments.weight')} (${weight} ${t('common.lbs')} × $${perLbRate}/${t('common.lbs')})`}
                                </Text>
                              </View>
                              <Text style={styles.costValue}>${shippingCost.toFixed(2)}</Text>
                            </View>

                            <View style={styles.costRow}>
                              <View style={styles.costRowLeft}>
                                <Ionicons name="settings-outline" size={18} color={COLORS.accent.purple} />
                                <Text style={styles.costLabel}>{t('shipments.serviceFee')}</Text>
                              </View>
                              <Text style={styles.costValue}>${serviceFee.toFixed(2)}</Text>
                            </View>

                            <View style={styles.costDivider} />

                            <View style={[styles.costRow, styles.costTotalRow]}>
                              <View style={styles.costRowLeft}>
                                <Ionicons name="wallet-outline" size={20} color={COLORS.accent.green} />
                                <Text style={styles.costTotalLabel}>{t('shipments.totalToPay')}</Text>
                              </View>
                              <Text style={styles.costTotalValue}>${totalCost.toFixed(2)}</Text>
                            </View>
                          </>
                        );
                      })()}
                    </Card>
                  </>
                );
              })()}

                  {selectedShipment && selectedShipment.statusDates && selectedShipment.statusDates.length > 0 && (
                    <Card blur={false} style={styles.modalCard}>
                      <View style={styles.historyHeader}>
                        <Ionicons name="time" size={24} color={COLORS.accent.blue} />
                        <Text style={styles.historyTitle}>{t('shipments.history')}</Text>
                      </View>

                      {selectedShipment.statusDates.map((statusDate: StatusDates, index: number) => (
                        <View key={index} style={styles.historyItem}>
                          <View style={styles.timelineDot} />
                          {index < selectedShipment.statusDates.length - 1 && (
                            <View style={styles.timelineLine} />
                          )}
                          <View style={styles.historyContent}>
                            <Text style={styles.historyStatus}>
                              {translateHistoryStatus(statusDate.status, t)}
                            </Text>
                            <Text style={styles.historyLocation}>
                              {translateHistoryLocation(statusDate.location, t)}
                            </Text>
                            <Text style={styles.historyDate}>{formatDate(statusDate.date)}</Text>
                          </View>
                        </View>
                      ))}
                    </Card>
                  )}

                <Button
                  title={t('shipments.close')}
                  onPress={closeModal}
                  variant="secondary"
                  style={styles.closeModalButton}
                  fullWidth
                />
              </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Floating Action Button */}
      {shipments.length > 0 && (
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={styles.fabContainer}
        >
          <TouchableOpacity
            style={styles.fab}
            onPress={handleAddShipment}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[COLORS.accent.blue, COLORS.accent.indigo]}
              style={styles.fabGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="add" size={32} color={COLORS.text.primary} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  safeArea: {
    flex: 1,
  },
  headerSection: {
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: 0,
    paddingBottom: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZES['4xl'],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text.tertiary,
  },
  avatarContainer: {},
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text.primary,
    textTransform: 'uppercase',
  },
  statsContainer: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.xs,
    gap: SPACING.xs / 2,
  },
  statCard: {
    width: 72,
    padding: SPACING.xs,
    paddingVertical: SPACING.sm,
    position: 'relative',
  },
  activeStatCard: {
    borderWidth: 1.5,
    borderColor: COLORS.accent.blue,
    ...SHADOWS.sm,
  },
  statTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs / 2,
    marginBottom: SPACING.xs / 2,
  },
  statIconContainer: {
    width: 20,
    height: 20,
    borderRadius: BORDER_RADIUS.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    letterSpacing: -0.2,
    lineHeight: 11,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 140,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING['6xl'],
  },
  emptyTitle: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.secondary,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
    letterSpacing: -0.5,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background.elevated,
    borderTopLeftRadius: BORDER_RADIUS['4xl'],
    borderTopRightRadius: BORDER_RADIUS['4xl'],
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING['4xl'],
    maxHeight: '92%',
    borderWidth: 1,
    borderColor: COLORS.border.medium,
    borderBottomWidth: 0,
    ...SHADOWS.xl,
  },
  modalHandle: {
    width: 48,
    height: 5,
    backgroundColor: COLORS.gray[500],
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING['2xl'],
  },
  modalTitle: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.tertiary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    padding: SPACING.lg,
    marginBottom: SPACING.base,
  },
  modalInfoRow: {
    marginBottom: SPACING.base,
  },
  modalInfoGrid: {
    flexDirection: 'row',
    gap: SPACING.base,
    marginBottom: SPACING.base,
  },
  modalInfoColumn: {
    flex: 1,
  },
  modalLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.xs / 2,
  },
  modalValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  pendingStatusText: {
    color: COLORS.accent.orange,
    fontSize: FONT_SIZES.sm,
  },
  costText: {
    color: COLORS.accent.green,
  },
  costBreakdownCard: {
    borderWidth: 1,
    borderColor: COLORS.accent.green + '30',
    backgroundColor: COLORS.accent.green + '08',
  },
  costBreakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  costBreakdownTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    letterSpacing: -0.3,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  costRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  costLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHTS.medium,
    flex: 1,
  },
  costValue: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.primary,
  },
  costDivider: {
    height: 1,
    backgroundColor: COLORS.border.medium,
    marginVertical: SPACING.md,
  },
  costTotalRow: {
    marginBottom: 0,
    paddingTop: SPACING.sm,
  },
  costTotalLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    flex: 1,
  },
  costTotalValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.accent.green,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  historyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginLeft: SPACING.sm,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    position: 'relative',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent.blue,
    marginRight: SPACING.base,
    marginTop: SPACING.xs / 2,
    zIndex: 1,
  },
  timelineLine: {
    position: 'absolute',
    left: 5,
    top: 16,
    bottom: -SPACING.lg,
    width: 2,
    backgroundColor: COLORS.border.medium,
  },
  historyContent: {
    flex: 1,
  },
  historyStatus: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs / 2,
  },
  historyLocation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs / 2,
  },
  historyDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.tertiary,
  },
  closeModalButton: {
    marginTop: SPACING.base,
  },
  emptyButton: {
    marginTop: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  emptyButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 100,
    right: SPACING.xl,
    zIndex: 999,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.xl,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBanner: {
    paddingHorizontal: SPACING.xl,
    marginTop: 0,
    marginBottom: SPACING.xs,
  },
  infoBannerCard: {
    padding: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  infoBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  infoBannerText: {
    flex: 1,
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.secondary,
    lineHeight: 16,
  },
});
