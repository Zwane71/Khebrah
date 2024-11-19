<template>
  <div class="col-lg-9">
    <div class="categories-side">
      <div class="categories-details cat-1">
        <div class="cats-result">
          <div class="row no-gutters" v-if="experts.length > 0">
            <div
              class="col-xl-4 col-md-6 category-filter"
              v-for="(expert, index) in experts"
              :key="index"
            >
              <!-- <router-link :to="`/${$i18n.locale}/profile`"> -->
              <div class="cat-box" @click="navigateToProfile(expert)">
                <div>
                  <base-avatar 
                    bordered
                    class="profile-picture"
                    :src="expert.profile_img"
                    :badge="expert.badge"
                    size="medium"
                  />
                  <h6 class="head">
                    {{ getFullname(expert) }}
                  </h6>
                  <span class="specialize">
                    {{ getTitle(expert) }}
                  </span>
                  <div class="available-s" v-if="nextAvailability(expert)">
                    {{$t('availability.nextAvailability')}}: <span class="available-v">{{ nextAvailability(expert) }}</span> 
                  </div>
                  <!-- <span class="available-s">Next Availabilty: </span>
                    <span class="available-v">Today</span> -->
                  <!-- <p class="hidden" v-html="enLang ? expert.description : expert.description_ar" :ref="`htmlDesc-${expert.profile.pk}`">
                  </p>
                  <p
                    :ref="`textDesc-${expert.profile.pk}`"
                    class="card-content__p"
                  >
                  </p> -->
                  <p class="card-content__p" v-text="getSkimmedDesc(expert)">
                  </p>
                  <div>
                    <div class="experties">
                      <span
                        v-for="(keyword, index) in expert.keywords"
                        :key="index"
                        >
                        {{ enLang ? keyword.name : keyword.name_ar }}
                        </span
                      >

                      <!-- <img src="../../assets/img/experts/menu.svg" alt="menu" /> -->
                    </div>
                  </div>
                  <ul class="list-unstyled ranking1" v-if="expert.ratings.length">
                    <li
                      v-for="n in Math.floor(expert.avg_rating || 0)"
                      :key="n"
                    >
                                <i class="fas fa-star"></i>
                            </li>
                          </ul>
                          <span class="ranking" v-if="expert.ratings.length"
                            >{{ expert.avg_rating || 0 }}/{{ "5" }}
                          </span>
                      </div>
                    </div>
                    <!-- </router-link> -->
                </div>
              </div>
          </div>
        </div>
        <div class="view-more" v-if="hasMore">
          <base-button type="primary" :loading="loading" class="view-btn" loading-text=" " @click="$emit('loadMore')">
            <div class="d-flex align-items-center">
              <img src="../../assets/img/experts/icon.svg" class="mr-2" alt="view" /> {{ $t('expertListing.viewMore') }}
            </div>
          </base-button>
          <base-button class="mobile-more" :loading="loading" loading-text=" " @click="$emit('loadMore')">
          <img
            src="../../assets/img/profile/download.svg"
            alt="view"
          />
          </base-button>
          </div>
        <div v-if="!loading && !experts.length" class="text-center text-secondary py-5">
          {{ $t('expertListing.notFound') }}
        </div>
    </div>
  </div>
</template>

<script>
import dayjs from '@/plugins/dayjs'

export default {
  props: {
    experts: {
      type: Array,
      default: () =>[]
    },
    loading: {
      type: Boolean,
      default: false
    },
    hasMore: {
      type: Boolean,
      default: false
    }
  },
  // watch: {
  //   experts: {
  //     handler(value) {
  //       value.forEach(expert => {
  //         const desc = this.enLang ? expert.description : expert.description_ar
  //         this.$nextTick(() => {
  //           const source = this.$refs[`htmlDesc-${expert.profile.pk}`]
  //           const dest = this.$refs[`textDesc-${expert.profile.pk}`]
  //           if (source && dest) {
  //             if (Array.isArray(dest) && Array.isArray(source)) {
  //               source[0].classList.remove('hidden')
  //               dest[0].innerText = source[0].innerText
  //               source[0].classList.add('hidden')
  //             }
  //             else dest.innerText = source.textContent
  //           } 
  //         })
  //       })
  //     },
  //     immediate: true
  //   } 
  // },
  computed: {
    keywordsHash() {
      return this.$store.getters['data/keywordsHash']
    },
  },
  methods: {
    getFullname(expert) {
      const firstname = (this.arLang && expert.first_name_ar) || expert.first_name
      const lastname = (this.arLang && expert.last_name_ar) || expert.last_name
      return `${firstname} ${lastname}`
    },
    getTitle(expert) {
      return (this.arLang && expert.title_ar) || expert.title
    },
    getSkimmedDesc(expert) {
      const description =  (this.arLang && expert.description_ar) || expert.description || ' '
      const doc = new DOMParser().parseFromString(description, 'text/html')
      return doc.body.innerText
    },
    nextAvailability(expert) {
      if (!expert.next_avail) return null

      const { from_time, to_time } = expert.next_avail

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
    },
    navigateToProfile(expert) {
      this.$router.push({ name: "expertProfile", params: { username: expert.profile.username } });
    },
    getKeyword(id) {
      if (!this.keywordsHash[id]) return ''
      return this.$i18n.locale === 'ar' 
        ? this.keywordsHash[id].name_ar
        : this.keywordsHash[id].name
    }
  },
};
</script>
<style scoped>
.profile-picture {
  position: absolute;
  left: 50%;
  top: -65px;
  transform: translateX(-50%);
}
.experties {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  overflow: hidden;
  height: 30px;
}

.cat-box:hover .experties {
  overflow:visible;
  height: auto;
}
.cat-desc {
  height: 150px;
  }
.cat-box:hover .cat-desc {
  height:auto;
  }

.mobile-more {
  width: auto !important;
}
.mobile-more img {
  width: 27px;
}
</style>
