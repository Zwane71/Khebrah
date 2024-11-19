<template>
  <div class="similar-profiles">
    <h4 class="heading">{{$t('profilePage.similarProfiles')}}</h4>
    <router-link :to="{ name: 'expertProfile', params: { username: profile.profile.username }}" class="d-flex mt-4 profile" v-for="(profile, index) in profiles" :key="index">
      <div class="avatar mr-3">
        <img :src="profile.profile_img" alt="profile image" />
      </div>
      <div class="d-flex flex-column justify-content-center">
        <h6 class="mb-0">{{ getFullname(profile) }}</h6>
        <div class="text-muted">{{ getTitle(profile) }}</div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    expert: {
      type: Object
    }
  },
  data: () => ({
    profiles: []
  }),
  watch: {
    expert: {
      handler(value) {
        if ((!value)) return
        this.$store.dispatch('experts/getSimilarProfiles', value.profile.pk)
          .then(data => {
            this.profiles = data
          })
      },
      immediate: true
    }
  },
  methods: {
    getFullname(profile) {
      const firstname = (this.arLang && profile.first_name_ar) || profile.first_name
      const lastname = (this.arLang && profile.last_name_ar) || profile.last_name
      return `${firstname} ${lastname}`
    },
    getTitle(profile) {
      return (this.arLang && profile.title_ar) || profile.title
    },

  }
}
</script>
<style scoped>
.avatar {
  width: 65px;
  height: 65px;
  border-radius: 10px;
  overflow: hidden;
  min-width: 65px;
}
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.profile {
  cursor: pointer;
  font-size: 14px;
}
h6 {
  color: #39425d;
  font-size: 18px;
}
</style>