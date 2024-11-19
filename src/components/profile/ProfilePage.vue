<template>
  <div>
    <!-- <the-navbar :class="{ 'profile-nav': 'profileNav' }"></the-navbar> -->
    <div id="profilePage" class="profile-page">
      <div class="profile-description">
        <div class="container">
          <div class="row" v-if="expert">
            <div class="col-lg-9">
              <profile-information 
                @goToServices="goToServices" 
                @goToReviews="goToReviews" 
                :expert="expert"
                ></profile-information>

              <!-- <contact-me class="d-block d-lg-none" :expert="expert"></contact-me> -->

              <div class="profile-info" ref="profileInfo">
                <div id="profileTabs" class="profile-tabs">
                  <h4
                    class="about-tab tab-h"
                    :class="{ active: selectedComponent === 'about-tab' }"
                    @click="$router.push({ query: { section: 'about' }})"
                  >
                    {{ $t('profilePage.about') }}
                    
                  </h4>
                  <h4
                    class="services-tab tab-h"
                    :class="{ active: selectedComponent === 'services-tab' }"
                    @click="$router.push({ query: { section: 'services' }})"
                  >
                    {{ $t('profilePage.services') }}
                  </h4>
                  <h4
                    class="reviews-tab tab-h"
                    :class="{ active: selectedComponent === 'reviews-tab' }"
                    @click="$router.push({ query: { section: 'reviews' }})"
                  >
                    {{ $t('profilePage.reviews') }}
                  </h4>
                </div>
                <div ref="tabContent">
                  <component :is="selectedComponent" :expert="expert"></component>
                </div>
              </div>
            </div>
            <div class="col-lg-3">
              <contact-me class="desktop" :expert="expert"></contact-me>
              <similar-profiles :expert="expert"></similar-profiles>
            </div>
          </div>
        </div>
      </div>
      <!--<b-button class="services-mobile-btn">
        <img
          src="../../assets/img/profile/list-text.svg"
          alt="stars"
        />{{ $t('profilePage.services') }}</b-button
      >-->
    </div>
  </div>
</template>

<script>
import profileInformation from "./ProfileInformation.vue";
import ContactMe from "./ContactMe.vue";
import SimilarProfiles from "./SimilarProfiles.vue";
import AboutTab from "./AboutTab.vue";
import ServicesTab from "./ServicesTab.vue";
import ReviewsTab from "./ReviewsTab.vue";

import store from '@/store'

export default {
  components: {
    profileInformation,
    ContactMe,
    SimilarProfiles,
    AboutTab,
    ServicesTab,
    ReviewsTab,
  },
  data() {
    return {
      selectedComponent: "about-tab",
      profileNav: true,
      expert: null
    };
  },
  metaInfo() {
    return this.expert
      ? {
        title: `${this.expert.first_name} ${this.expert.last_name} - ${this.expert.title} | Khebrah`,
        meta: [
          { name: 'description', content: `${this.expert.first_name} ${this.expert.last_name} - ${this.expert.title}` }
        ]
      }
      : { title: 'Expert profile' }
  },

  beforeRouteEnter(to, from, next) {
    const username = to.params.username
    store.dispatch('experts/getProfile', username)
      .then(data => {
        next(vm => {
          vm.expert = data
        })
      })
      .catch(error => {
        next({ path: '/404' })
      })
  },
  beforeRouteUpdate(to, from, next) {
    if (from.params.username === to.params.username) return next()
    const username = to.params.username
    store.dispatch('experts/getProfile', username)
      .then(data => {
        window.scrollTo({
          left: 0, 
          top: 0, 
          behavior: 'smooth' 
        })
        this.expert = data
        next()
      })
      .catch(error => {
        next({ path: '/404' })
      })
  },
  watch: {
    '$route.query': {
      handler(value) {
        const section = value.section

        switch(section) {
          case 'services':
            this.setSelectedComponent('services-tab')
            break
          case 'reviews':
            this.setSelectedComponent('reviews-tab')
            break
          case 'about':
          default:
            this.setSelectedComponent('about-tab')
            break
        }
      },
      immediate: true
    }
  },
  methods: {
    goToServices() {
      this.selectedComponent = 'services-tab'
      window.scrollTo({
        left: 0, 
        top: this.$refs.tabContent.offsetTop - 50,
        behavior: 'smooth'
      })
    },
    goToReviews() {
      this.selectedComponent = 'reviews-tab'
      window.scrollTo({
        left: 0, 
        top: this.$refs.tabContent.offsetTop - 50,
        behavior: 'smooth'
      })
    },
    setSelectedComponent(data) {
      this.selectedComponent = data;
    },
  }
};
</script>

<style scoped>
footer {
  padding-top: 30px;
}
</style>
