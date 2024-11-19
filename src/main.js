import Vue from "vue";
import App from "./App.vue";

import router from "./router";
import store from "./store";
import i18n from "./plugins/i18n";

import './components/global'

import axios from "axios";
import VueAxios from "vue-axios";
import { ValidationProvider, ValidationObserver } from "vee-validate";

import VueProgressBar from 'vue-progressbar'
import VueHtmlToPaper from 'vue-html-to-paper'

import { BootstrapVue } from "bootstrap-vue";

import HoneybadgerVue from '@honeybadger-io/vue'

import "@fortawesome/fontawesome-free/css/all.css";
// import "@fortawesome/fontawesome-free/js/all.js";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import ReadMore from "vue-read-more";
import Slick from "vue-slick";
import "slick-carousel/slick/slick.css";
import "./assets/css/style.css";
import "./assets/css/main.css";

import "./assets/css/base.css";

import ToggleButton from "vue-js-toggle-button";

import "@/app/base-module/util/validation_rules";

import VueAuthenticate from 'vue-authenticate'
import VClickOutside from  'v-click-outside'
import VueYoutube from 'vue-youtube'
import vueVimeoPlayer from 'vue-vimeo-player'
import VueMask from 'v-mask'

Vue.use(VueMask)

Vue.use(vueVimeoPlayer)

if (process.env.VUE_APP_URL === 'https://khebrah.com') {
  Vue.use(HoneybadgerVue, {
    apiKey: 'hbp_LEenDWmO5iwLKQ6KDuEOeneWMVoqvx23kDR8',
    environment: 'production'
  })
}

const auth_url = process.env.VUE_APP_URL + '/auth/callback'
Vue.use(VueAuthenticate, {
  baseUrl: process.env.VUE_APP_API_URL,
  bindRequestInterceptor: function() {
    this.$http.interceptors.request.use(config => {
      if (store.state.auth.token) {
        config.headers['Authorization'] = `Bearer ${store.state.auth.token}`
      } else {
        delete config.headers['Authorization']
      }
      return config
    })
  },
  bindResponseInterceptor: function() {
  },

  providers: {
    linkedin: {
      clientId: '86xhs6v1cnj3r2',
      redirectUri: auth_url,
      requiredUrlParams: ['state', 'scope'],
      url: '/auth/linkedin/',
      scope: ['r_emailaddress', 'r_liteprofile']
    },
    google: {
      clientId: '853040631439-ekrf8q2aiabcqockuc72bb440ffske94.apps.googleusercontent.com',
      redirectUri: auth_url,
      url: '/auth/google/'
    },
    facebook: {
      clientId: '2621133301514102',
      redirectUri: auth_url,
      url: '/auth/facebook/'
    },
    twitter: {
      redirectUri: auth_url,
      url: '/auth/twitter/',
    },
    gcal: {
      clientId: '853040631439-ekrf8q2aiabcqockuc72bb440ffske94.apps.googleusercontent.com',
      redirectUri: auth_url,
      url: '/api/add-calendar/',
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
      requiredUrlParams: ['scope', 'access_type', 'prompt'],
      optionalUrlParams: ['display'],
      scope: ['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/userinfo.profile'],
      scopePrefix: null,
      scopeDelimiter: ' ',
      display: 'popup',
      oauthType: '2.0',
      popupOptions: { width: 452, height: 633 },
      accessType: 'offline',
      prompt: 'consent'
    }
  }
})

Vue.mixin({
  computed: {
    enLang() {
      return this.$i18n.locale === 'en'
    },
    arLang() {
      return this.$i18n.locale === 'ar'
    }
  }
})
Vue.mixin({
  methods: {
    scrollToFirstError(classes) {
      setTimeout(() => {
        const el = this.$el.querySelector(classes || '.is-invalid')
        console.log('error on:', el)
        if (!el) return
        window.scrollTo({
          left: 0,
          top: el.getBoundingClientRect().top + document.documentElement.scrollTop - 100,
          behavior: 'smooth'
        })
      }, 50)
    }
  }
})

Vue.use(VClickOutside)
Vue.use(BootstrapVue);
Vue.use(ToggleButton);

Vue.use(VueYoutube)

Vue.use(VueProgressBar, {
  color: '#00a072',
  // color: '#0274d3',
  thickness: '5px'
})

Vue.use(VueHtmlToPaper, {
  styles: [
    '/print.css'
  ],
  timeout: 1000
})

Vue.component("slick", Slick);
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
Vue.config.productionTip = false;

Vue.use(ReadMore);

Vue.use(VueAxios, axios);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
