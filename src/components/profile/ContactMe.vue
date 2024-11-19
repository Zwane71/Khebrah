<template>
  <div class="contact-section">
    <div class="insights">
      <div class="insights-d">
        <span>{{$t('profilePage.projects')}}</span>
        <span class="num">{{ expert.projects }}</span>
      </div>

      <div class="insights-d">
        <span>{{$t('profilePage.consultations')}}</span>
        <span class="num">{{ expert.consultations }}</span>
      </div>
      <div class="insights-d">
        <!-- <span>Collabs</span>
        <span class="num">368</span> -->
      </div>
    </div>
    <div class="location">
      <span>{{$t('profilePage.location')}}</span>
      <span class="city">{{ enLang ? expert.country.name : expert.country.name_ar }}</span>
    </div>
    <div class="Languages">
      <span>{{$t('profilePage.languages')}}</span>
      <div class="langs">
        <span v-for="(lang, index) in expert.language" :key="lang.id">
          {{ enLang ? lang.name : lang.name_ar }}<span v-if="index < expert.language.length - 1">, </span> 
        </span>
      </div>
    </div>
    <div class="d-flex align-items-center mt-4 pt-2" v-if="expert.social_links">
      <a target="_blank" v-if="expert.social_links.facebook" :href="'https://facebook.com/' + expert.social_links.facebook">
        <img src="../../assets/img/icons/facebook.png" alt="facebook" class="mr-3">
      </a>
      <a target="_blank" v-if="expert.social_links.linkedin" :href="'https://linkedin.com/in/' + expert.social_links.linkedin">
        <img src="../../assets/img/icons/linkedin.png" alt="linkedin" class="mr-3">
      </a>
      <a target="_blank" v-if="expert.social_links.instagram" :href="'https://instagram.com/' + expert.social_links.instagram">
        <img src="../../assets/img/icons/Instagram.png" alt="instagram" class="mr-3">
      </a>
      <a target="_blank" v-if="expert.social_links.twitter" :href="'https://twitter.com/' + expert.social_links.twitter">
        <img src="../../assets/img/icons/twitter.svg" alt="twitter">
      </a>
    </div>
    <!-- <div class="accounts">
      <b-link href="#">
        <img src="../../assets/img/profile/slack.svg" alt="slack"
      /></b-link>
      <b-link href="#">
        <img src="../../assets/img/profile/linkedin.svg" alt="linkedin"
      /></b-link>

      <b-link href="#">
        <img src="../../assets/img/profile/dribbble.svg" alt="dribbble"
      /></b-link>

      <b-link href="#">
        <img src="../../assets/img/profile/github.svg" alt="github"
      /></b-link>

      <b-link href="#">
        <img src="../../assets/img/profile/facebook.svg" alt="facebook"
      /></b-link>
    </div> -->
  </div>
</template>
<script>
export default {
  props: {
    expert: {
      type: Object,
      required: true
    }
  },
  computed: {
    countriesHash() {
      return this.$store.getters['data/countriesHash']
    },
  },
  methods: {
    getCountry(id) {
      if (!this.countriesHash[id]) return ''
      return this.$i18n.locale === 'ar' 
        ? this.countriesHash[id].name_ar
        : this.countriesHash[id].name

    }
  }
}
</script>
<style scoped>
a img {
  width: 30px;
}
</style>
