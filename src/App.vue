<template>
  <div>
    <vue-progress-bar />
    <div class="app-loading" v-if="loading">
      <img
        src="@/assets/img/logo.svg"
        alt="logo"
        class="header-logo"
      />
      <span class="spinner-border spinner-border-sm mt-2" role="status" aria-hidden="true"></span>
    </div>
    <div class="app-container" v-else :class="{meeting: isMeeting, rtl: $store.state.rtl}" :dir="$store.state.rtl ? 'rtl' : 'ltf'">
      <the-navbar ref="navbar" v-if="!isMeeting"/>
      <router-view></router-view>
      <the-footer v-if="!isMeeting"/>
    </div>
  </div>
</template>
<script>
import i18n from "@/plugins/i18n";
import TheNavbar from "@/components/header/TheNavbar.vue";
import TheFooter from './components/footer/TheFooter.vue';

window.hideTranslations = () => {
  i18n.setLocaleMessage('en', [])
  i18n.setLocaleMessage('ar', [])
}

export default {
  components: {
    TheNavbar,
    TheFooter
  },

  data: () => ({
    profileLoading: false,
    langLoading: true,
    toCreateExpert: false
  }),

  metaInfo() {
    return {
      title: 'Khebrah',
      // titleTemplate: !this.loading ? '%s | Khebrah' : ''
    }
  },

  watch: {
    '$store.state.auth.token': {
      handler:  function (val, oldVal) {
        if (!!val) {
          this.$store.dispatch('chat/initSocket')
          this.$store.dispatch('notifications/initSocket')
          this.$store.dispatch('user/fetchProfile')
            .then(data => {
              if(!data.profile_complete) {
                this.$router.push({ name: 'CreateProfile' })
              }
            })
        } else {
          this.$store.commit('user/clearProfile')
          this.$store.commit('notifications/reset')
          this.$store.commit('chat/reset')
          this.$store.dispatch('notifications/closeSocket')
          this.$store.dispatch('chat/closeSocket')
        }
      },
      // immediate: true
    },
    loading(value) {
      if (!value && this.toCreateExpert) {
        this.$nextTick(() => {
          this.$router.push({ name: 'Homepage' })
          this.$refs.navbar.applyAsExpert()
        })
      }
    }
  },

  computed: {
    user() {
      return this.$store.getters['auth/user']
    },
    isMeeting() {
      return this.$route.name === 'meeting'
    },
    loading() {
      return this.profileLoading || this.langLoading
    },
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
    profile() {
      return this.$store.getters["user/profile"];
    },
  },

  beforeCreate() {
    this.$store.dispatch('data/fetchKeywords')
    this.$store.dispatch('data/fetchCategories')
    this.$store.dispatch('data/fetchCountries')
    this.$store.dispatch('data/fetchLanguages')
    this.$store.dispatch('data/fetchCarousels')
    this.$store.dispatch('data/fetchKhebrahStats')
    this.$store.dispatch('data/fetchFooter')
    this.$store.dispatch('data/fetchServiceDurations')
    // this.$store.dispatch('data/fetchPages')
    this.$store.dispatch('data/fetchTranslations')
      .then(data => {

        const en = {}, ar = {}
        
        for (let section of data) {
          en[section.section] = {}
          ar[section.section] = {}
          for (let translation of section.translations) {
            en[section.section][translation.key] = translation['en']
            ar[section.section][translation.key] = translation['ar']
          }
        }
        i18n.setLocaleMessage('en', en)
        i18n.setLocaleMessage('ar', ar)
        this.langLoading = false
      })
      .catch(e => e)
    this.$store.dispatch('data/fetchBadges')
  },

  created() {
    this.$Progress.start()

    if(this.$store.state.auth.token) {
      this.profileLoading = true
      this.$store.dispatch('chat/initSocket')
      this.$store.dispatch('notifications/initSocket')
      this.$store.dispatch('user/fetchProfile')
        .then((data) => {
          setTimeout(() => {
            if(!data.profile_complete && !this.$route.fullPath.includes('/pages/')) {
              this.$router.push({ name: 'CreateProfile' })
            } else if (!data.profile.mobile && this.$route.name === 'CreateExpert') {
              this.toCreateExpert = true
            }
            this.profileLoading = false
          }, 300)
        })
    } else {
      this.profileLoading = false
    }

    this.$router.beforeEach((to, from , next) => {
      this.$Progress.start()
      if (to.name !== 'CreateProfile' && !to.fullPath.includes('/pages/') && this.isAuthenticated && this.profile && !this.profile.profile_complete) {
        next({ name: 'CreateProfile'})
      } else if (!this.loading && to.name === 'CreateExpert' && this.user && !this.user.mobile) {
        this.$Progress.finish()
        this.$refs.navbar.applyAsExpert()
      } else {
        next()
      }
    })
    this.$router.afterEach((to, from) => {
      this.$Progress.finish()
    })
  },

  mounted() {
    this.$Progress.finish()
  },

  beforeDestroy() {
    this.$store.dispatch('notifications/closeSocket')
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@600&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,500;1,600;1,800&family=Raleway:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;0,900;1,200;1,500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");
/*Almarai Font Family */
/* @import url("https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&display=swap"); */
/*Nunito Font Family*/
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap");
/*Quicksand Font Family*/
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&display=swap");
/*Poppins Font Family*/
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;900&display=swap");

.form-control {
  height: calc(1.5em + 1.5rem + 2px) !important;
}
.app-loading {
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  padding-top: 30vh;
  background: #f1f1f1;
  z-index: 9999;
}
.app-container {
  padding-top: 80px;
  /* padding-bottom: 480px; */
  min-height: 100vh;
}

.app-container.meeting {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

@media screen and (max-width: 991px) {
  .app-container {
    /* padding-bottom: 500px; */
  }
}
@media screen and (max-width: 768px) {
  .app-container {
    /* padding-bottom: 650px; */
    padding-top: 55px;
  }
  
}
</style>
