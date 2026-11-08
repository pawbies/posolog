import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

// Loading da translations from the json locale files
import de from './locales/de.json';
import en from './locales/en.json';
export const resources = {
  en: { translation: en },
  de: { translation: de }
} as const;

// All the supported languages of the app (en, de)
export const supportedLangs = Object.keys(resources);

// Language of the app, english as the fallback
const deviceLang = getLocales()[0]?.languageCode ?? "en";

// Setting up end exporting the i18n instance
const i18n = createInstance();
i18n.use(initReactI18next).init({
    resources,
    lng: supportedLangs.includes(deviceLang) ? deviceLang : "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false, },
    returnNull: false
});
export default i18n;
