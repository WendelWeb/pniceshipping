import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { useTranslation } from 'react-i18next';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingScreen from '../components/LoadingScreen';
import LanguageSelector from '../components/LanguageSelector';
import { findShipmentsByOwnerId, getShipmentStats } from '../services/shipmentService';
import { Shipment } from '../types';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  ICON_SIZES,
} from '../constants/theme';

interface InfoItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoIconContainer}>
        <Ionicons name={icon} size={20} color={COLORS.accent.blue} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

interface StatItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  color: string;
}

function StatItem({ icon, label, value, color }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <View style={[styles.statIconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={ICON_SIZES.lg} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [languageSelectorVisible, setLanguageSelectorVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadShipments = useCallback(async () => {
    if (!user?.id) return;

    try {
      const data = await findShipmentsByOwnerId(user.id);
      setShipments(data);
    } catch (error) {
      console.error('Error loading shipments:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initialiser les champs avec les valeurs actuelles
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  const handleOpenEditModal = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Demander les permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        t('common.error'),
        'Désolé, nous avons besoin de la permission pour accéder à vos photos!'
      );
      return;
    }

    // Ouvrir le sélecteur d'image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImageUri(result.assets[0].uri);
      setEditModalVisible(true);
    }
  };

  const handleConfirmUpdate = async () => {
    if (!user) return;

    try {
      setUpdating(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Mettre à jour le nom et prénom si changés
      if (firstName !== user.firstName || lastName !== user.lastName) {
        await user.update({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        });
      }

      // Mettre à jour la photo si une nouvelle a été sélectionnée
      if (selectedImageUri) {
        // Utiliser base64 au lieu de blob pour React Native
        const base64 = await fetch(selectedImageUri)
          .then(res => res.blob())
          .then(blob => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          });

        await user.setProfileImage({ file: base64 });
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(t('common.success'), 'Profil mis à jour avec succès!');
      setEditModalVisible(false);
      setSelectedImageUri(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t('common.error'), 'Impossible de mettre à jour le profil. Réessayez.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setSelectedImageUri(null);
    // Réinitialiser les valeurs
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  useEffect(() => {
    if (isLoaded) {
      loadShipments();
    }
  }, [isLoaded, loadShipments]);

  const getLanguageName = () => {
    const languageNames: Record<string, string> = {
      fr: 'Français',
      ht: 'Kreyòl',
      en: 'English',
      es: 'Español',
    };
    return languageNames[i18n.language] || 'Français';
  };

  const handleSignOut = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      t('profile.signOut'),
      t('profile.signOutConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
          onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        },
        {
          text: t('profile.signOut'),
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            try {
              await signOut();
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert(t('common.error'), t('profile.signOutError'));
            }
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (!isLoaded || loading) {
    return <LoadingScreen />;
  }

  const stats = getShipmentStats(shipments);
  const memberSince = user?.createdAt ? formatDate(new Date(user.createdAt)) : 'N/A';
  const displayName = user?.firstName || user?.username || 'Utilisateur';
  const email = user?.emailAddresses?.[0]?.emailAddress || 'Non disponible';
  const initials = displayName.substring(0, 2).toUpperCase();

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
          {/* Profile Header */}
          <Animated.View entering={FadeIn} style={styles.profileHeader}>
            <TouchableOpacity
              onPress={handleOpenEditModal}
              activeOpacity={0.8}
            >
              {user?.imageUrl ? (
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: user.imageUrl }}
                    style={styles.avatarImage}
                  />
                  <View style={styles.editBadge}>
                    <Ionicons name="camera" size={16} color={COLORS.white} />
                  </View>
                </View>
              ) : (
                <LinearGradient
                  colors={[COLORS.accent.blue, COLORS.accent.indigo]}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>{initials}</Text>
                  <View style={styles.editBadge}>
                    <Ionicons name="camera" size={16} color={COLORS.white} />
                  </View>
                </LinearGradient>
              )}
            </TouchableOpacity>
            <Text style={styles.displayName}>{displayName}</Text>
            <Text style={styles.email}>{email}</Text>
          </Animated.View>

          {/* Stats Cards */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.statsSection}>
            <Text style={styles.sectionTitle}>{t('profile.stats')}</Text>
            <View style={styles.statsGrid}>
              <StatItem
                icon="cube"
                label={t('profile.total')}
                value={stats.total}
                color={COLORS.accent.blue}
              />
              <StatItem
                icon="time"
                label={t('profile.inProgress')}
                value={stats.pending + stats.received + stats.inTransit}
                color={COLORS.status.transit}
              />
              <StatItem
                icon="checkmark-circle"
                label={t('profile.delivered')}
                value={stats.delivered}
                color={COLORS.accent.green}
              />
            </View>
          </Animated.View>

          {/* User Information */}
          <Animated.View entering={FadeInDown.delay(200)}>
            <Text style={styles.sectionTitle}>{t('profile.myInfo')}</Text>
            <Card blur={false} style={styles.infoCard}>
              <InfoItem
                icon="person"
                label={t('profile.fullName')}
                value={user?.fullName || displayName}
              />
              <View style={styles.divider} />
              <InfoItem
                icon="mail"
                label={t('profile.email')}
                value={email}
              />
              <View style={styles.divider} />
              <InfoItem
                icon="calendar"
                label={t('profile.memberSince')}
                value={memberSince}
              />
              <View style={styles.divider} />
              <InfoItem
                icon="shield-checkmark"
                label={t('profile.accountStatus')}
                value={t('profile.active')}
              />
            </Card>
          </Animated.View>

          {/* Settings Section */}
          <Animated.View entering={FadeInDown.delay(300)}>
            <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>
            <Card blur={false} style={styles.settingsCard}>
              <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <Ionicons name="notifications" size={24} color={COLORS.text.secondary} />
                  <Text style={styles.settingLabel}>{t('profile.notifications')}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.text.tertiary} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.settingItem}
                activeOpacity={0.7}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setLanguageSelectorVisible(true);
                }}
              >
                <View style={styles.settingLeft}>
                  <Ionicons name="language" size={24} color={COLORS.text.secondary} />
                  <Text style={styles.settingLabel}>{t('profile.language')}</Text>
                </View>
                <View style={styles.settingRight}>
                  <Text style={styles.settingValue}>{getLanguageName()}</Text>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.text.tertiary} />
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <Ionicons name="help-circle" size={24} color={COLORS.text.secondary} />
                  <Text style={styles.settingLabel}>{t('profile.helpSupport')}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORS.text.tertiary} />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <Ionicons name="information-circle" size={24} color={COLORS.text.secondary} />
                  <Text style={styles.settingLabel}>{t('profile.about')}</Text>
                </View>
                <View style={styles.settingRight}>
                  <Text style={styles.settingValue}>v1.0.0</Text>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.text.tertiary} />
                </View>
              </TouchableOpacity>
            </Card>
          </Animated.View>

          {/* Sign Out Button */}
          <Animated.View entering={FadeInDown.delay(400)}>
            <Button
              title={t('profile.signOut')}
              onPress={handleSignOut}
              variant="secondary"
              icon="log-out"
              style={styles.signOutButton}
            />
          </Animated.View>

          {/* Footer */}
          <Animated.View entering={FadeInDown.delay(500)} style={styles.footer}>
            <Text style={styles.footerText}>{t('profile.footer')}</Text>
            <Text style={styles.footerSubtext}>{t('profile.footerSubtext')}</Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* Language Selector Modal */}
      <LanguageSelector
        visible={languageSelectorVisible}
        onClose={() => setLanguageSelectorVisible(false)}
      />

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier le profil</Text>
              <TouchableOpacity onPress={handleCancelEdit} disabled={updating}>
                <Ionicons name="close" size={24} color={COLORS.text.secondary} />
              </TouchableOpacity>
            </View>

            {/* Preview de la nouvelle photo */}
            {selectedImageUri && (
              <View style={styles.imagePreview}>
                <Image
                  source={{ uri: selectedImageUri }}
                  style={styles.previewImage}
                />
              </View>
            )}

            {/* Champs de texte */}
            <View style={styles.formSection}>
              <Text style={styles.inputLabel}>Prénom</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Votre prénom"
                placeholderTextColor={COLORS.text.tertiary}
                editable={!updating}
              />

              <Text style={styles.inputLabel}>Nom</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Votre nom"
                placeholderTextColor={COLORS.text.tertiary}
                editable={!updating}
              />
            </View>

            {/* Boutons d'action */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelEdit}
                disabled={updating}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmUpdate}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirmer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 120,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SPACING['2xl'],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'relative',
    marginBottom: SPACING.base,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editBadge: {
    position: 'absolute',
    right: -4,
    bottom: 0,
    backgroundColor: COLORS.accent.blue,
    borderRadius: BORDER_RADIUS.full,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.background.primary,
  },
  avatarText: {
    fontSize: FONT_SIZES['4xl'],
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  displayName: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text.tertiary,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.base,
    marginTop: SPACING.lg,
  },
  statsSection: {
    marginBottom: SPACING.base,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  statItem: {
    flex: 1,
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.base,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs / 2,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.tertiary,
    textAlign: 'center',
  },
  infoCard: {
    padding: SPACING.lg,
    marginBottom: SPACING.base,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: `${COLORS.accent.blue}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.base,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.xs / 2,
  },
  infoValue: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border.light,
    marginVertical: SPACING.sm,
  },
  settingsCard: {
    padding: SPACING.lg,
    marginBottom: SPACING.base,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginLeft: SPACING.base,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.tertiary,
    marginRight: SPACING.sm,
  },
  signOutButton: {
    marginTop: SPACING.base,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING['3xl'],
  },
  footerText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.text.tertiary,
    marginBottom: SPACING.xs / 2,
  },
  footerSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.quaternary,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  imagePreview: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.accent.blue,
  },
  formSection: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.background.elevated,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.base,
    fontSize: FONT_SIZES.base,
    color: COLORS.text.primary,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  modalButton: {
    flex: 1,
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    backgroundColor: COLORS.background.elevated,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  cancelButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  confirmButton: {
    backgroundColor: COLORS.accent.blue,
  },
  confirmButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.white,
  },
});
