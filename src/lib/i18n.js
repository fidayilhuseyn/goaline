import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationAZ from '../locales/az/translation.json';
import translationEN from '../locales/en/translation.json';
import translationRU from '../locales/ru/translation.json';
import translationTR from '../locales/tr/translation.json';

const resources = {
  az: { translation: translationAZ },
  en: { translation: translationEN },
  ru: { translation: translationRU },
  tr: { translation: translationTR }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'az',
    lng: localStorage.getItem('i18nextLng') || 'az', // Default to 'az' if nothing is in localStorage
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    }
  });

export default i18n;
