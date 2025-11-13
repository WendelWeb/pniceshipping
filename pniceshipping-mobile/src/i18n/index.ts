import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import fr from './locales/fr';
import ht from './locales/ht';
import en from './locales/en';
import es from './locales/es';

// Language storage key
const LANGUAGE_KEY = '@pnice_language';

// Get saved language or default to French
const getLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    return savedLanguage || 'fr';
  } catch (error) {
    return 'fr';
  }
};

// Save language preference
export const saveLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

// Initialize i18n
export const initI18n = async () => {
  const language = await getLanguage();

  i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      resources: {
        fr: { translation: fr },
        ht: { translation: ht },
        en: { translation: en },
        es: { translation: es },
      },
      lng: language,
      fallbackLng: 'fr',
      interpolation: {
        escapeValue: false,
      },
    });

  return i18n;
};

export default i18n;
