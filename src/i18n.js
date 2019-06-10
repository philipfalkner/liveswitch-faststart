import i18n from 'i18next'
import Fluent from 'i18next-fluent'
import Backend from 'i18next-fluent-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

i18n
  .use(Fluent)
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    ns: ['virtualvisit'],
    defaultNS: 'virtualvisit',
    debug: false,
    interpolation: {
      escapeValue: false // Not needed for react because it escapes by default
    }
  })

export default i18n
