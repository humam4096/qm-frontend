import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../../locales/en.json';
import arTranslation from '../../locales/ar.json';

const resources = {
  en: { translation: enTranslation },
  ar: { translation: arTranslation }
};

i18n
  // detect user language automatically based on browser settings
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    // fallback language if detection fails or a translation is missing
    fallbackLng: 'en',

    // We want the app to default to whatever the browser says, but if preferred,
    // you can hardcode `lng: 'en'` here.

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
