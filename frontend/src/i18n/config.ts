import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en/translation.json';
import hiTranslations from './locales/hi/translation.json';
import knTranslations from './locales/kn/translation.json';

const resources = {
  en: {
    translation: enTranslations
  },
  hi: {
    translation: hiTranslations
  },
  kn: {
    translation: knTranslations
  }
};

i18n
  .use(LanguageDetector) // Auto-detect browser language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Fallback to English if translation missing
    supportedLngs: ['en', 'hi', 'kn'],
    debug: false, // Set to true for development debugging

    interpolation: {
      escapeValue: false // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    }
  });

export default i18n;
