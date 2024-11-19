import axios from "../plugins/axios";

export default {
  namespaced: true,

  state: () => ({
    keywords: [],
    categories: [],
    countries: [],
    carousels: [],
    translations: [],
    badges: [],
    khebrahStats: {},
    languages: [],
    serviceDurations: {},
    footer: []
  }),

  getters: {
    keywords: (state) => state.keywords,
    categories: (state) => state.categories.sort((a, b) => (a.popularity_num||100) - (b.popularity_num|| 100)),
    countries: (state) => state.countries,
    carousels: (state) => state.carousels,
    translations: (state) => state.translations,
    languages: (state) => state.languages,
    badges: (state) => state.badges,
    footer: (state) => state.footer,
    khebrahStats: (state) => state.khebrahStats,
    serviceDurations: (state) => state.serviceDurations,
    keywordsHash: (state) => state.keywords.reduce((acc, keyword) => {
            acc[keyword.id] = keyword
            return acc
          }, {}),
    categoriesHash: (state) => state.categories.reduce((acc, category) => {
            acc[category.id] = category
            return acc
          }, {}),
    countriesHash: (state) => state.countries.reduce((acc, country) => {
            acc[country.id] = country
            return acc
          }, {}),
  },

  actions: {
    fetchKeywords({ commit }) {
      axios.get('/api/keywords/')
        .then(response => {
          commit('setKeywords', response.data)
        })
        .catch(e => e)
    },
    fetchCategories({ commit }) {
      axios.get('/api/categories/')
        .then(response => {
          commit('setCategories', response.data)
        })
        .catch(e => e)
    },
    fetchCountries({ commit }) {
      axios.get('/user/country-list/')
        .then(response => {
          commit('setCountries', response.data.data)
        })
        .catch(e => e)
    },
    fetchTranslations({ commit }) {
      return new Promise((resolve, reject) => {
        axios.get('/api/translations/')
          .then(response => {
            commit('setTranslations', response.data)
            resolve(response.data)
          })
          .catch(e => reject(e))
      })
    },
    fetchCarousels({ commit }) {
      axios.get('/api/homepage-carousels/')
        .then(response => {
          commit('setCarousels', response.data)
        })
        .catch(e => e)
    },
    fetchKhebrahStats({ commit }) {
      axios.get('/api/project-and-consultations/')
        .then(response => {
          commit('setKhebrahStats', response.data)
        })
        .catch(e => e)
    },
    fetchBadges({ commit }) {
      axios.get('/api/badges/')
        .then(response => {
          commit('setBadges', response.data)
        })
        .catch(e => e)
    },
    fetchLanguages({ commit }) {
      axios.get('/user/language-list/')
        .then(response => {
          commit('setLanguages', response.data)
        })
        .catch(e => e)
    },
    fetchServiceDurations({ commit }) {
      axios.get('/api/service-durations/')
        .then(response => {
          commit('setServiceDurations', response.data)
        })
        .catch(e => e)
    },
    fetchFooter({ commit }) {
      axios.get('/api/footer/')
        .then(response => {
          commit('setFooter', response.data)
        })
        .catch(e => e)
    },
    fetchPage({ }, slug) {
      return new Promise((resolve, reject) => {
        axios.get(`/api/pages/${slug}/`)
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    fetchPages({ }) {
      return new Promise((resolve, reject) => {
        axios.get('/api/pages/')
          .then(response => {
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  },

  mutations: {
    setKeywords(state, keywords) {
      state.keywords = keywords
    },
    setCategories(state, categories) {
      state.categories = categories
    },
    setCountries(state, countries) {
      state.countries = countries
    },
    setCarousels(state, data) {
      state.carousels = data
    },
    setTranslations(state, data) {
      state.translations = data
    },
    setKhebrahStats(state, data) {
      state.khebrahStats = data
    },
    setBadges(state, data) {
      state.badges = data
    },
    setServiceDurations(state, data) {
      state.serviceDurations = data
    },
    setLanguages(state, data) {
      state.languages = data
    },
    setFooter(state, data) {
      state.footer = data
    },
  }
}