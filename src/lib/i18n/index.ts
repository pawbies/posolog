import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './locales/de.json';
import en from './locales/en.json';

export const resources = { en: { translation: en }, de: { translation: de } } as const;
export const supportedLangs = Object.keys(resources);

const deviceLang = getLocales()[0].languageCode ?? "en";

i18n.use(initReactI18next).init({
    resources,
    lng: supportedLangs.includes(deviceLang) ? deviceLang : "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false, },
    returnNull: false
});

export default i18n;