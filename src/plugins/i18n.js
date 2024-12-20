import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

function loadLocaleMessages() {
  const messages = {
    en: {},
    ar: {}
  }
  // const locales = require.context('@/app', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  // locales.keys().forEach(key => {
  //   const matched = key.match(/([A-Za-z0-9-_]+)\./i)
  //   if (matched && matched.length > 1) {
  //     const locale = matched[1]
  //     if (locale == 'en' || locale == 'ar') {
  //       for (const moduleLangKey in locales(key)) {
  //         messages[locale][moduleLangKey] = locales(key)[[moduleLangKey]]
  //       }
  //     }
  //   }
  // })
  return messages
}

export default new VueI18n({
  locale:
    navigator.language.split('-')[0] || process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages(),
  silentTranslationWarn: true
})
