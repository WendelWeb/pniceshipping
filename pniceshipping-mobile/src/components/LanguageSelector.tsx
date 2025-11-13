import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { saveLanguage } from '../i18n';
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
} from '../constants/theme';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: Language[] = [
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen', flag: '🇭🇹' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇩🇴' },
];

export default function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
  const { i18n, t } = useTranslation();

  const handleSelectLanguage = async (languageCode: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await i18n.changeLanguage(languageCode);
    await saveLanguage(languageCode);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>{t('profile.selectLanguage')}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={COLORS.text.secondary} />
                </TouchableOpacity>
              </View>

              {/* Language Options */}
              <View style={styles.languageList}>
                {LANGUAGES.map((language, index) => {
                  const isSelected = i18n.language === language.code;
                  const isLast = index === LANGUAGES.length - 1;

                  return (
                    <View key={language.code}>
                      <TouchableOpacity
                        style={[
                          styles.languageItem,
                          isSelected && styles.languageItemSelected,
                        ]}
                        onPress={() => handleSelectLanguage(language.code)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.languageLeft}>
                          <Text style={styles.flag}>{language.flag}</Text>
                          <View style={styles.languageInfo}>
                            <Text style={styles.languageName}>{language.nativeName}</Text>
                            <Text style={styles.languageSubname}>{language.name}</Text>
                          </View>
                        </View>
                        {isSelected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color={COLORS.accent.blue}
                          />
                        )}
                      </TouchableOpacity>
                      {!isLast && <View style={styles.divider} />}
                    </View>
                  );
                })}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: COLORS.background.elevated,
    borderRadius: BORDER_RADIUS['2xl'],
    borderWidth: 1,
    borderColor: COLORS.border.light,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  languageList: {
    padding: SPACING.md,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
  },
  languageItemSelected: {
    backgroundColor: `${COLORS.accent.blue}10`,
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 32,
    marginRight: SPACING.base,
  },
  languageInfo: {
    flexDirection: 'column',
  },
  languageName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs / 2,
  },
  languageSubname: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.tertiary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border.light,
    marginVertical: SPACING.xs,
  },
});
