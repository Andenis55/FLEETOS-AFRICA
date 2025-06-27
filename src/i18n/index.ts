import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json' assert { type: 'json' };
import sw from './locales/sw.json' assert { type: 'json' };

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sw: { translation: sw },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    react: {
      useSuspense: true, // Recommended for lazy loading
    },
  });

export default i18n;
