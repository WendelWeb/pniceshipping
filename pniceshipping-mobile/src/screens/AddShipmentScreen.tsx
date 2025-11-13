import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { db } from '../config/database';
import { shipmentListing } from '../config/schema';
import { findShipmentByTrackingNumber } from '../services/shipmentService';
import { sql } from 'drizzle-orm';
import Button from '../components/Button';
import Card from '../components/Card';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  SHADOWS,
} from '../constants/theme';

const COMPANY_USER_ID = 'user_2v0TyYr3oFSH1ZqHhlas0sPkEyq';

const DESTINATIONS = [
  'Cap-haitien, Rue 6 j-k',
  'Cap-Haitien, Vertiere Village Christophe',
  'Port-Au-Prince (Local Le Grand Nord) Delmas 33 a coté parc midoré',
];

type ModalType = 'success' | 'error-delivered' | 'error-claimed' | 'error-generic' | null;

type AddShipmentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddShipment'>;

function addDays(date: Date, days: number): string {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
}

export default function AddShipmentScreen() {
  const { t } = useTranslation();
  const { user } = useUser();
  const navigation = useNavigation<AddShipmentScreenNavigationProp>();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [destination, setDestination] = useState('');
  const [showDestinationPicker, setShowDestinationPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isTransfer, setIsTransfer] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  // Force stop loading when modal appears
  React.useEffect(() => {
    if (modalType) {
      setLoading(false);
    }
  }, [modalType]);

  const handleSubmit = async () => {
    if (!trackingNumber.trim() || !destination.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrorMessage(t('addShipment.errorAllFields'));
      setModalType('error-generic');
      return;
    }

    if (!user?.id || !user?.emailAddresses?.[0]?.emailAddress) {
      setErrorMessage(t('addShipment.errorUserInfo'));
      setModalType('error-generic');
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const userName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
      const now = new Date();
      const formattedDate = now.toISOString().split('T')[0];
      const formattedTime = now.toLocaleTimeString('fr-FR', { hour12: false });
      const requestStatusEntry = {
        date: `${formattedDate} ${formattedTime}`,
        status: t('addShipment.historyRequestStatus'),
        location: t('addShipment.historyRequestLocation', { userName }),
      };

      // Check if shipment exists
      const existingShipment = await findShipmentByTrackingNumber(trackingNumber.trim());

      if (existingShipment) {
        // Shipment exists - check conditions for transfer
        if (existingShipment.status === 'Livré✅') {
          setModalType('error-delivered');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          return;
        }

        if (existingShipment.ownerId !== COMPANY_USER_ID) {
          setModalType('error-claimed');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          return;
        }

        // Transfer shipment to user
        const updatedData = {
          ownerId: user.id,
          fullName: userName,
          userName: user.username ?? '',
          emailAdress: user.emailAddresses[0].emailAddress,
          phone: user.phoneNumbers?.[0]?.phoneNumber || t('common.unknown'),
          destination: destination || existingShipment.destination,
        };

        const currentStatusDates = Array.isArray(existingShipment.statusDates)
          ? existingShipment.statusDates
          : [];
        const updatedStatusDates = [...currentStatusDates, requestStatusEntry];

        await db
          .update(shipmentListing)
          .set({ ...updatedData, statusDates: updatedStatusDates })
          .where(sql`${shipmentListing.trackingNumber} = ${existingShipment.trackingNumber}`);

        // Try to send email (don't block on failure)
        try {
          const response = await fetch('https://pnice-shipping-emails.onrender.com/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userName: updatedData.fullName,
              userEmail: updatedData.emailAdress,
              packageId: trackingNumber.trim(),
              status: t('addShipment.historyPendingStatus'),
              message: t('addShipment.emailTransferMessage'),
            }),
          });
          if (response.ok) {
            console.log('✅ Email sent successfully');
          }
        } catch (emailError) {
          console.error('⚠️ Email error (shipment transferred anyway):', emailError);
        }

        setIsTransfer(true);
        setModalType('success');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        // New shipment request
        const statusDates = [
          requestStatusEntry,
          {
            date: `${formattedDate} ${formattedTime}`,
            status: t('addShipment.historyPendingStatus'),
            location: t('addShipment.historyPendingLocation'),
          },
        ];

        const data = {
          fullName: userName,
          userName: user.username ?? '',
          emailAdress: user.emailAddresses[0].emailAddress,
          trackingNumber: trackingNumber.trim(),
          category: t('categories.standard'),
          weight: '',
          status: t('addShipment.historyPendingStatus'),
          ownerId: user.id,
          destination: destination || t('common.notSpecified'),
          estimatedDelivery: addDays(new Date(), 7),
          phone: user.phoneNumbers?.[0]?.phoneNumber || t('common.unknown'),
          statusDates,
        };

        await db.insert(shipmentListing).values(data);

        // Try to send email
        try {
          const response = await fetch('https://pnice-shipping-emails.onrender.com/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userName: data.fullName,
              userEmail: data.emailAdress,
              packageId: trackingNumber.trim(),
              status: t('addShipment.historyPendingStatus'),
              message: t('addShipment.emailRequestMessage'),
            }),
          });
          if (response.ok) {
            console.log('✅ Email sent successfully');
          }
        } catch (emailError) {
          console.error('⚠️ Email error (request saved anyway):', emailError);
        }

        setIsTransfer(false);
        setModalType('success');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Reset form
      setTrackingNumber('');
      setDestination('');
    } catch (error: any) {
      console.error('Error submitting shipment:', error);
      setErrorMessage(
        error.message?.includes('not-null')
          ? 'Erreur : Une date de livraison estimée valide est requise.'
          : 'Une erreur s\'est produite. Veuillez réessayer.'
      );
      setModalType('error-generic');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const closeModal = () => {
    const wasSuccess = modalType === 'success';
    setModalType(null);
    setLoading(false); // Ensure loading stops
    if (wasSuccess) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background.primary, COLORS.gray[900]]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
              </TouchableOpacity>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>{t('addShipment.title')}</Text>
                <Text style={styles.headerSubtitle}>{t('addShipment.subtitle')}</Text>
              </View>
            </View>

            {/* Security Notice */}
            <Animated.View entering={FadeInDown.delay(100)}>
              <Card blur={false} style={styles.securityCard}>
                <View style={styles.securityHeader}>
                  <View style={styles.securityIconContainer}>
                    <Ionicons name="shield-checkmark" size={24} color={COLORS.accent.blue} />
                  </View>
                  <Text style={styles.securityTitle}>{t('addShipment.securityTitle')}</Text>
                </View>
                <Text style={styles.securityText}>
                  {t('addShipment.securityDescription')}
                </Text>
                <View style={styles.securityFeatures}>
                  <View style={styles.securityFeature}>
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.accent.green} />
                    <Text style={styles.securityFeatureText}>{t('addShipment.securityFeature1')}</Text>
                  </View>
                  <View style={styles.securityFeature}>
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.accent.green} />
                    <Text style={styles.securityFeatureText}>{t('addShipment.securityFeature2')}</Text>
                  </View>
                  <View style={styles.securityFeature}>
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.accent.green} />
                    <Text style={styles.securityFeatureText}>{t('addShipment.securityFeature3')}</Text>
                  </View>
                </View>
              </Card>
            </Animated.View>

            {/* Form */}
            <Animated.View entering={FadeInDown.delay(200)}>
              <Card blur={false} style={styles.formCard}>
                <Text style={styles.formTitle}>{t('addShipment.formTitle')}</Text>

                {/* Tracking Number Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    <Ionicons name="barcode-outline" size={16} color={COLORS.accent.blue} /> {t('addShipment.trackingNumberLabel')}
                  </Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder={t('addShipment.trackingNumberPlaceholder')}
                      placeholderTextColor={COLORS.text.tertiary}
                      value={trackingNumber}
                      onChangeText={setTrackingNumber}
                      autoCapitalize="characters"
                      editable={!loading}
                    />
                  </View>
                </View>

                {/* Destination Picker */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    <Ionicons name="location-outline" size={16} color={COLORS.accent.green} />{' '}
                    {t('addShipment.destinationLabel')}
                  </Text>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => {
                      if (!loading) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setShowDestinationPicker(true);
                      }
                    }}
                    activeOpacity={0.7}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.pickerButtonText,
                        !destination && styles.pickerButtonPlaceholder,
                      ]}
                    >
                      {destination || t('addShipment.destinationPlaceholder')}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={COLORS.text.tertiary} />
                  </TouchableOpacity>
                </View>

                {/* Submit Button */}
                <Button
                  title={loading ? t('addShipment.submitButtonLoading') : t('addShipment.submitButton')}
                  onPress={handleSubmit}
                  loading={loading}
                  disabled={loading}
                  fullWidth
                  style={styles.submitButton}
                  icon={loading ? undefined : 'send'}
                />
              </Card>
            </Animated.View>

            {/* Info Cards */}
            <Animated.View entering={FadeInDown.delay(300)}>
              <Card blur={false} style={styles.infoCard}>
                <View style={styles.infoHeader}>
                  <Ionicons name="information-circle" size={24} color={COLORS.accent.indigo} />
                  <Text style={styles.infoTitle}>{t('addShipment.howItWorksTitle')}</Text>
                </View>
                <View style={styles.infoSteps}>
                  <View style={styles.infoStep}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>1</Text>
                    </View>
                    <Text style={styles.stepText}>
                      {t('addShipment.howItWorksStep1')}
                    </Text>
                  </View>
                  <View style={styles.infoStep}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>2</Text>
                    </View>
                    <Text style={styles.stepText}>
                      {t('addShipment.howItWorksStep2')}
                    </Text>
                  </View>
                  <View style={styles.infoStep}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>3</Text>
                    </View>
                    <Text style={styles.stepText}>
                      {t('addShipment.howItWorksStep3')}
                    </Text>
                  </View>
                </View>
              </Card>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Destination Picker Modal */}
      <Modal
        visible={showDestinationPicker}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowDestinationPicker(false)}
        statusBarTranslucent
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowDestinationPicker(false)}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFillObject} />
          <Animated.View
            entering={SlideInDown.duration(250).damping(20)}
            exiting={SlideOutDown.duration(200)}
            style={styles.pickerModal}
          >
            <Pressable>
              <View style={styles.modalHandle} />
              <Text style={styles.pickerModalTitle}>{t('addShipment.selectDestination')}</Text>
              {DESTINATIONS.map((dest, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.destinationOption,
                    destination === dest && styles.destinationOptionSelected,
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setDestination(dest);
                    setShowDestinationPicker(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.destinationOptionText,
                      destination === dest && styles.destinationOptionTextSelected,
                    ]}
                  >
                    {dest}
                  </Text>
                  {destination === dest && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.accent.blue} />
                  )}
                </TouchableOpacity>
              ))}
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Result Modals */}
      {modalType && (
        <Modal
          visible={true}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
          statusBarTranslucent
        >
          <Pressable style={styles.modalOverlay} onPress={closeModal}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFillObject} />
            <Animated.View
              entering={SlideInDown.duration(250).damping(20)}
              exiting={SlideOutDown.duration(200)}
              style={styles.resultModal}
            >
              <Pressable>
                {modalType === 'success' && (
                  <>
                    <View style={styles.resultIconContainer}>
                      <Ionicons name="checkmark-circle" size={80} color={COLORS.accent.green} />
                    </View>
                    <Text style={styles.resultTitle}>
                      {isTransfer ? t('addShipment.transferSuccess') : t('addShipment.requestSuccess')}
                    </Text>
                    <Text style={styles.resultMessage}>
                      {isTransfer
                        ? t('addShipment.transferMessage', { trackingNumber })
                        : t('addShipment.requestMessage', { trackingNumber })}
                    </Text>
                  </>
                )}

                {modalType === 'error-delivered' && (
                  <>
                    <View style={styles.resultIconContainer}>
                      <Ionicons name="close-circle" size={80} color={COLORS.status.error} />
                    </View>
                    <Text style={styles.resultTitle}>{t('addShipment.errorDeliveredTitle')}</Text>
                    <Text style={styles.resultMessage}>
                      {t('addShipment.errorDeliveredMessage', { trackingNumber })}
                    </Text>
                  </>
                )}

                {modalType === 'error-claimed' && (
                  <>
                    <View style={styles.resultIconContainer}>
                      <Ionicons name="alert-circle" size={80} color={COLORS.status.warning} />
                    </View>
                    <Text style={styles.resultTitle}>{t('addShipment.errorClaimedTitle')}</Text>
                    <Text style={styles.resultMessage}>
                      {t('addShipment.errorClaimedMessage', { trackingNumber })}
                    </Text>
                  </>
                )}

                {modalType === 'error-generic' && (
                  <>
                    <View style={styles.resultIconContainer}>
                      <Ionicons name="close-circle" size={80} color={COLORS.status.error} />
                    </View>
                    <Text style={styles.resultTitle}>{t('addShipment.errorGenericTitle')}</Text>
                    <Text style={styles.resultMessage}>
                      {errorMessage || t('addShipment.errorGenericMessage')}
                    </Text>
                  </>
                )}

                <Button
                  title={t('addShipment.close')}
                  onPress={closeModal}
                  variant={modalType === 'success' ? 'primary' : 'secondary'}
                  fullWidth
                  style={styles.resultButton}
                />
              </Pressable>
            </Animated.View>
          </Pressable>
        </Modal>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING['6xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    gap: SPACING.base,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.base,
    backgroundColor: COLORS.background.elevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs / 2,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.tertiary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  securityCard: {
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  securityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.base,
    backgroundColor: `${COLORS.accent.blue}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  securityTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
  },
  securityText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginBottom: SPACING.base,
  },
  securityFeatures: {
    gap: SPACING.sm,
  },
  securityFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  securityFeatureText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  formCard: {
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  formTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.base,
    borderWidth: 1.5,
    borderColor: COLORS.border.medium,
  },
  input: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
    fontSize: FONT_SIZES.base,
    color: COLORS.text.primary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.base,
    borderWidth: 1.5,
    borderColor: COLORS.border.medium,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
  },
  pickerButtonText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.primary,
    fontWeight: FONT_WEIGHTS.medium,
    flex: 1,
  },
  pickerButtonPlaceholder: {
    color: COLORS.text.tertiary,
  },
  submitButton: {
    marginTop: SPACING.base,
  },
  infoCard: {
    padding: SPACING.xl,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.base,
    gap: SPACING.sm,
  },
  infoTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
  },
  infoSteps: {
    gap: SPACING.base,
  },
  infoStep: {
    flexDirection: 'row',
    gap: SPACING.base,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.accent.indigo,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
  },
  stepText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
    paddingTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  pickerModal: {
    backgroundColor: COLORS.background.elevated,
    borderTopLeftRadius: BORDER_RADIUS['4xl'],
    borderTopRightRadius: BORDER_RADIUS['4xl'],
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING['4xl'],
    maxHeight: '70%',
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
  pickerModalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xl,
  },
  destinationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.base,
    borderRadius: BORDER_RADIUS.base,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.background.primary,
  },
  destinationOptionSelected: {
    backgroundColor: `${COLORS.accent.blue}20`,
  },
  destinationOptionText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
    fontWeight: FONT_WEIGHTS.medium,
    flex: 1,
  },
  destinationOptionTextSelected: {
    color: COLORS.text.primary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  resultModal: {
    backgroundColor: COLORS.background.elevated,
    borderTopLeftRadius: BORDER_RADIUS['4xl'],
    borderTopRightRadius: BORDER_RADIUS['4xl'],
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING['3xl'],
    paddingBottom: SPACING['4xl'],
    ...SHADOWS.xl,
  },
  resultIconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  resultTitle: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.base,
  },
  resultMessage: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING['2xl'],
  },
  resultButton: {
    marginTop: SPACING.base,
  },
});
