import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { translateHistoryStatus } from '../utils/translateHistoryStatus';
import { translateHistoryLocation } from '../utils/translateHistoryLocation';
import { findShipmentByTrackingNumber } from '../services/shipmentService';
import { Shipment, StatusDates } from '../types';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
} from '../constants/theme';

export default function TrackScreen() {
  const { t } = useTranslation();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!trackingNumber.trim()) {
      Alert.alert(t('common.error'), t('track.errorEmpty'));
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const result = await findShipmentByTrackingNumber(trackingNumber.trim());
      setShipment(result);

      if (!result) {
        Alert.alert(
          t('track.notFound'),
          t('track.errorNotFound')
        );
      }
    } catch (error) {
      console.error('Error tracking shipment:', error);
      Alert.alert(
        t('common.error'),
        t('track.errorSearch')
      );
      setShipment(null);
    } finally {
      setLoading(false);
    }
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={[COLORS.background.primary, COLORS.gray[900]]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeIn} style={styles.header}>
            <View style={styles.iconWrapper}>
              <LinearGradient
                colors={[COLORS.accent.blue, COLORS.accent.indigo]}
                style={styles.iconGradient}
              >
                <Ionicons name="search" size={32} color={COLORS.text.primary} />
              </LinearGradient>
            </View>
            <Text style={styles.headerTitle}>{t('track.title')}</Text>
            <Text style={styles.headerSubtitle}>
              {t('track.subtitle')}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100)} style={styles.searchSection}>
            <Card blur={false} style={styles.searchCard}>
              <Text style={styles.inputLabel}>{t('track.trackingNumber')}</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="barcode"
                  size={20}
                  color={COLORS.text.tertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder={t('track.trackingPlaceholder')}
                  placeholderTextColor={COLORS.text.quaternary}
                  value={trackingNumber}
                  onChangeText={setTrackingNumber}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>
              <Button
                title={t('track.search')}
                onPress={handleSearch}
                loading={loading}
                icon="search"
                style={styles.searchButton}
              />
            </Card>
          </Animated.View>

          {shipment && (
            <Animated.View entering={FadeInDown.delay(200)} style={styles.resultSection}>
              <Card blur={false} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Ionicons name="checkmark-circle" size={48} color={COLORS.accent.green} />
                  <Text style={styles.resultTitle}>{t('track.found')}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('track.trackingNumber')}</Text>
                  <Text style={styles.infoValue}>{shipment.trackingNumber}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('track.recipient')}</Text>
                  <Text style={styles.infoValue}>{shipment.fullName}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('track.destination')}</Text>
                  <Text style={styles.infoValue}>{shipment.destination}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('track.weight')}</Text>
                  <Text style={styles.infoValue}>{shipment.weight}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('track.category')}</Text>
                  <Text style={styles.infoValue}>{shipment.category}</Text>
                </View>

                <View style={styles.statusRow}>
                  <Text style={styles.infoLabel}>{t('track.currentStatus')}</Text>
                  <StatusBadge status={shipment.status} />
                </View>
              </Card>

              {shipment.statusDates && shipment.statusDates.length > 0 && (
                <Card blur={false} style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <Ionicons name="time" size={24} color={COLORS.accent.blue} />
                    <Text style={styles.historyTitle}>{t('track.history')}</Text>
                  </View>

                  {shipment.statusDates.map((statusDate: StatusDates, index: number) => (
                    <View key={index} style={styles.historyItem}>
                      <View style={styles.timelineDot} />
                      {index < shipment.statusDates.length - 1 && (
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
            </Animated.View>
          )}

          {searched && !shipment && !loading && (
            <Animated.View entering={FadeInDown.delay(200)} style={styles.emptyState}>
              <Ionicons name="search-circle-outline" size={80} color={COLORS.text.tertiary} />
              <Text style={styles.emptyTitle}>{t('track.notFound')}</Text>
              <Text style={styles.emptyText}>
                {t('track.notFoundMessage')}
              </Text>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    paddingHorizontal: SPACING.xl,
  },
  searchSection: {
    marginBottom: SPACING.xl,
  },
  searchCard: {
    padding: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[800],
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.base,
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
  searchButton: {
    marginTop: SPACING.sm,
  },
  resultSection: {
    gap: SPACING.base,
  },
  resultCard: {
    padding: SPACING.lg,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  resultTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginTop: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border.light,
    marginBottom: SPACING.base,
  },
  infoRow: {
    marginBottom: SPACING.base,
  },
  infoLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.xs / 2,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  statusRow: {
    marginTop: SPACING.sm,
  },
  historyCard: {
    padding: SPACING.lg,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING['4xl'],
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text.secondary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.tertiary,
    textAlign: 'center',
  },
});
