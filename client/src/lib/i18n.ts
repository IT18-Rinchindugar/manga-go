import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import mn from '../locales/mn.json';

// Get the stored language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem('language') || 'mn';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      mn: { translation: mn }
    },
    lng: savedLanguage,
    fallbackLng: 'mn',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;

