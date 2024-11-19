<template>
  <div class="profile-information">
    <div class="banner-image">
      <img
        :src="expert.banner_img"
        alt="cover pic"
      />
    </div>
    <div class="profile-detailes">
      <div class="profile-container">
        <base-avatar 
          bordered
          class="profile-picture"
          :src="expert.profile_img"
          :badge="expert.badge"
        />
        <!-- <div class="profile-image"> -->
          <!-- <img
            :src="expert.profile_img"
            alt="profile image"
            class="avatar1"
          /> -->
          <!-- <img
            src="../../assets/img/expert1.png"
            alt="profile image"
            class="avatar1"
          /> -->
          <!-- <span class="edit-s"
            >Elite
            <img src="../../assets/img/star.svg" />
          </span> -->
        <!-- </div> -->
        <div class="profile-desc ml-2">

          <div>
            <h4 class="heading mb-0">
              {{ fullname }}
            </h4>
          </div>

          <div class="text-muted">
            {{ title }}
          </div>

          <div class="d-flex align-items-center rating" v-if="expert.ratings.length">
            <base-rating :value="expert.avg_rating" />
            <div class="rating-text ml-2" @click="$emit('goToReviews')">
              <!-- ( {{expert.avg_rating.toFixed(2) }} / 5 ) -->
              {{expert.avg_rating.toFixed(2) }} / 5
            </div>
          </div>

          <!-- <div class="availability-d">
            <span class="available-s">Next Availabilty: </span>
            <span class="available-v">Today</span>
          </div> -->

          <div class="mt-2">
            <b-list-group horizontal class="tags-list">
              <b-list-group-item
                v-for="(keyword, index) in expert.keywords"
                :key="index"
                class="keyword"
                @click="goToKeywordSearch(keyword)"
                >
                  {{ enLang ? keyword.name : keyword.name_ar }}
                </b-list-group-item
              >
            </b-list-group>
          </div>
        </div>
        <div class="profile-actions">
          <div class="profile-buttons">
            <b-button class="chat-btn" @click="goToChat">
              <img
                src="../../assets/img/profile/chat.svg"
                alt="stars"
              />{{$t('profilePage.chat')}}</b-button
            >
            <b-button class="services-btn" @click="goToServices">
              <img
                src="../../assets/img/profile/list-text.svg"
                alt="stars"
              />{{$t('profilePage.services')}}</b-button
            >
            <img src="../../assets/img/icons/share.png" @click="shareProfile" class="share-icon ml-2 d-md-none" alt="">
          </div>
          <div class="available-s mt-2" v-if="nextAvailability">
            {{$t('availability.nextAvailability')}}: <span class="available-v">{{ nextAvailability }}</span> 
          </div>
        </div>
      </div>
      <transition>
        <contact-me :expert="expert" v-if="contactIsVisible" class="mobile d-lg-none"></contact-me>
        <!-- <component :is="contactIsVisible" class="mobile"></component> -->
      </transition>
      <div class="icons-d">
        <div
          class="show-info"
          :style="{ display: contactIsVisible ? 'none' : 'block' }"
        >
          <img
            src="../../assets/img/profile/download.svg"
            alt="download"
            @click="contactVisibilty('contact-me')"
            class="show-img"
          />
        </div>
        <div
          class="show-info"
          :style="{ display: contactIsVisible ? 'block' : 'none' }"
        >
          <img
            src="../../assets/img/profile/download1.svg"
            alt="download"
            @click="contactVisibilty('')"
            class="show-img"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContactMe from "./ContactMe.vue";
import dayjs from '@/plugins/dayjs'

export default {
  components: {
    ContactMe,
  },
  props: {
    expert: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      contactIsVisible: "",
    };
  },
  created() {
    if (this.$route.query.next === 'chat') {
      this.goToChat()
    }
  },

  computed: {
    keywordsHash() {
      return this.$store.getters['data/keywordsHash']
    },
    user() {
      return this.$store.getters['auth/user']
    },
    fullname() {
      const firstname = (this.arLang && this.expert.first_name_ar) || this.expert.first_name
      const lastname = (this.arLang && this.expert.last_name_ar) || this.expert.last_name
      return `${firstname} ${lastname}`
    },
    title() {
      return (this.arLang && this.expert.title_ar) || this.expert.title
    },
    nextAvailability() {
      if (!this.expert || !this.expert.next_avail) return null

      const { from_time, to_time } = this.expert.next_avail

      const from = dayjs(from_time)
      const to = dayjs(to_time)
      const now = dayjs()

      if(now.isBetween(from, to)) {
        return this.$t('common.now')
      } else if(now.isBefore(from)) {
        if (now.isSame(from, 'day')) return this.$t('common.today')
        if (now.diff(from, 'day') < 7) {
          const day = from.format('dddd').toLowerCase()
          return this.$t(`availability.${day}`) 
        } else {
          return from.format('DD MMM')
        }
      } 

      return null
    }
  },
  methods: {
    shareProfile() {
      const data = {
        url: process.env.VUE_APP_URL + this.$route.path,
        title: document.title
      }
      navigator.share(data)
        .catch(e => console.log(e))
    },
    contactVisibilty(data) {
      this.contactIsVisible = data;
    },
    goToChat() {
      // this.$router.push({ name: 'messages', query: { withUser: this.expert.profile.pk }})
      this.$Progress.start()

      if (!this.user) {
        this.$router.push({ query: { ...this.$route.query, next: 'chat' } })
        this.$store.commit('setNextRoute', this.$route.fullPath)
        this.$router.push({ name: 'Login' })
        return
      }

      if (this.user && this.user.pk === this.expert.profile.pk) return

      this.$store.dispatch('chat/fetchOrCreateRoom', { user: this.expert.profile.pk})
        .then((data) => {
          data.recipients = data.recipients.filter(r => r.profile.pk !== this.user.pk)
          if (!data.last_message) data.last_message = null
          this.$store.commit('chat/setExpertRoom', data)
          this.$router.push({ name: 'messages', query: { room: data.room_name }})
        })
        .catch(error => {
          console.log(error)
          this.$Progress.fail()
        })
    },
    goToServices() {
      this.$emit('goToServices')
    },
    getKeyword(id) {
      if (!this.keywordsHash[id]) return ''
      return this.$i18n.locale === 'ar' 
        ? this.keywordsHash[id].name_ar
        : this.keywordsHash[id].name
    },
    goToKeywordSearch(keyword) {
      this.$router.push({ name: 'Experts', query: { categories: -1, keywords: keyword.id }})
    }
  },
};
</script>
<style scoped>
.profile-picture {
  position: relative;
  top: -80px;
}
.profile-buttons {
  justify-content: flex-end;
}
.profile-container {
  padding: 0 30px;
  position: relative;
}
.profile-desc {
  flex: 1;
}
.rating-text {
  color: #044982;
  cursor: pointer;
}
.rating-text:hover {
  text-decoration: underline;
}
.keyword {
  cursor: pointer;
}
.chat-btn img, .services-btn img {
  width: 20px;
  margin-right: 10px;   
}
.rtl .chat-btn img, .rtl .services-btn img {
  margin-right: unset;
  margin-left: 10px;
}
.share-icon {
  width: 23px;
}
@media (max-width: 991px) {
  .rating {
    /* justify-content: center; */
  }
  .profile-desc {
    margin-top: -65px;
    width: 100%;
    text-align: left !important;
  }
  .rtl .profile-desc {
    text-align: right !important;
  }
  .avatar.large {
    width: 120px;
    height: 120px;
  }
  /* .tags-list {
    flex-wrap: nowrap !important;
  } */
  .profile-container {
    padding: 0 10px;
    align-items: unset !important;
  }
  .profile-actions {
    position: absolute;
    top: 0 !important;
    right: 30px;
  }
  .rtl .profile-actions {
    right: unset;
    left: 30px;
  }
  /* .list-group-item:first-of-type {
    margin-left: auto;
  }
  .rtl .list-group-item:first-of-type {
    margin-left: unset;
    margin-right: auto;
  }
  .list-group-item:last-of-type {
    margin-right: auto !important;
  }
  .rtl .list-group-item:last-of-type {
    margin-right: unset !important;
    margin-left: auto !important;
  } */
}
@media (max-width: 576px) {
  .chat-btn, .services-btn {
    /* width: 70px; */
    font-size: 13px;
    padding: 5px;
  }
  .chat-btn img, .services-btn img {
    width: 15px;
  }
  .avatar.large {
    width: 100px;
    height: 100px;
    top: -60px;
  }
  .profile-desc {
    margin-top: -45px;
  }
}
@media (max-width: 420px) {
  .chat-btn, .services-btn {
    /* width: 55px; */
    font-size: 12px;
    padding: 3px;
    border-radius: 5px;
  }
  .chat-btn img, .services-btn img {
    width: 13px;
  }
  .profile-actions {
    right: 10px;
  }
  .rtl .profile-actions {
    right: unset;
    left: 10px;
  }
  .share-icon {
    width: 25px;
  }
}

.banner-image {
  padding-top: 25%;
  overflow: hidden;
  position: relative;
}
.banner-image img {
  object-fit: cover;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
}
.profile-information {
  overflow: hidden;
}
/* .profile-bg img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.profile-bg {
  height: 206px;
} */
</style>
