import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import it from './locales/it.json'
import en from './locales/en.json'

const CHIAVE_STORAGE_LINGUA = 'classchronicles_lingua'
const linguaIniziale = localStorage.getItem(CHIAVE_STORAGE_LINGUA) || 'it'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      it: { translation: it },
      en: { translation: en },
    },
    lng: linguaIniziale,
    fallbackLng: 'it',
    interpolation: {
      escapeValue: false, // React fa già l'escaping XSS
    },
  })

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(CHIAVE_STORAGE_LINGUA, lng)
  document.documentElement.lang = lng
})

// Imposta l'attributo lang iniziale
if (typeof document !== 'undefined') {
  document.documentElement.lang = linguaIniziale
}

export default i18n
