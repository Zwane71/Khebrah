<template>
  <div class="recommended decoration-bg">
    <div class="container padding-bottom">
      <p class="recommended__p" :class="{ fade1: 'showElement' }">
        {{ $t('home.featuredTitle') }}
        <!-- Recommended -->
      </p>
      <h2 class="recommended__h2" :class="{ fade1: 'showElement' }">
        {{ $t('home.featuredSubtitle') }}
        <!-- Connect to Experts With Proven
        <br />
        Bussiness Experience. -->
      </h2>

      <slick
        dir="ltr"
        ref="slick"
        :options="slickOptions"
        class="experts__slider"
        v-if="allExperts.length > 0"
      >
        <div
          class="c-height"
          :class="{ fade1: 'showElement' }"
          v-for="(expert, index) in allExperts"
          :key="index"
        >
          <div
            @click="navigateToProfile(expert)"
          >
            <div class="exp">
              <div class="card-content">
                <div class="recommended__img">
                  <base-avatar 
                    bordered
                    :src="expert.profile_img"
                    :badge="expert.badge"
                    size="medium"
                  />
                </div>
                <h4 class="card-content__h4">
                  {{ getFullname(expert) }}
                </h4>
                <span class="card-content__span">
                    {{ getTitle(expert) }}
                </span>
                <div class="available-s" v-if="nextAvailability(expert)">
                  {{$t('availability.nextAvailability')}}: <span class="available-v">{{ nextAvailability(expert) }}</span> 
                </div>
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
                  <ul
                    class="list-unstyled experts"
                  >
                    <li
                      v-for="(keyword, index) in expert.keywords"
                      :key="index"
                    >
                      {{ enLang ? keyword.name : keyword.name_ar }}
                      <!-- {{ $store.state.rtl ? keyword.name_ar : keyword.name_en }} -->
                    </li>
                    <!-- <li></li>
                <li>SEO</li> -->
                    <!-- <li class="more">SMM</li>
                <li class="more">PPC</li> -->
                  </ul>
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
                  >{{ expert.avg_rating || 0 }} / 5
                </span>
              </div>
            </div>
          </div>
        </div>
      </slick>

      <ul class="list-unstyled slider-arrows d-none">
        <li id="prev-btn">
          <span><i class="fa fa-angle-left"></i></span>
        </li>
        <li id="next-btn">
          <span> <i class="fa fa-angle-right"></i></span>
        </li>
      </ul>
      <div class="statistics-c">
        <div class="statistics" :class="{ fade1: 'showElement' }">
          <div class="statistics__div border-right">
            <p class="statistics__p">{{ khebrahStats.projects }}</p>
            <span> {{ $t('home.projectsDone' )}} </span>
          </div>
          <div class="statistics__div border-right">
            <p class="statistics__p">{{ khebrahStats.experts }}</p>
            <span> {{ $t('home.expertsCountTitle' )}} </span>
          </div>
          <div class="statistics__div">
            <p class="statistics__p">{{ khebrahStats.consultations }}</p>
            <span> {{ $t('home.consultations' )}} </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from '@/plugins/dayjs'

export default {
  data() {
    return {
      allExperts: [],
      slickOptions: {
        rtl: this.$i18n.locale === 'rtl',
        infinite: true,
        loop: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        rows: 2,
        arrows: false,
        responsive: [
          {
            breakpoint: 991.98,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 767.98,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 577,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              rows: 1,
              centerPadding: "50px",
              centerMode: true,
              // centerPadding: "20px",
              arrows: true,
              prevArrow: "#prev-btn",
              nextArrow: "#next-btn",
            },
          },
        ],
      },
      activeButton: 'name',
      showElement: false,
    };
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
    fetchExperts() {
      this.$store.dispatch('experts/getExperts', { limit: 6, featured: true })
        .then(data => {
          // if (this.user && this.user.pk) this.allExperts = data.filter(expert => expert.profile.pk !== this.user.pk) 
          // else this.allExperts = data
          this.allExperts = data.results
        })
        .catch((error) => {
          console.log(error.response);
        });
    },
    getKeyword(id) {
      if (!this.keywordsHash[id]) return ''
      return this.$i18n.locale === 'ar' 
        ? this.keywordsHash[id].name_ar
        : this.keywordsHash[id].name
    }
  },
  computed: {
    keywordsHash() {
      return this.$store.getters['data/keywordsHash']
    },
    user() {
      return this.$store.getters['auth/user']
    },
    khebrahStats() {
      return this.$store.getters['data/khebrahStats']
    }
  },
  created() {
    this.fetchExperts();
  },
  // watch: {
  //   allExperts: {
  //     handler(value) {
  //       value.forEach(expert => {
  //         const desc = this.enLang ? expert.description : expert.description_ar
  //         this.$nextTick(() => {
  //           const source = this.$refs[`htmlDesc-${expert.profile.pk}`]
  //           const dest = this.$refs[`textDesc-${expert.profile.pk}`]
  //           console.log(source, dest)
  //           if (source && dest) {
  //             if (Array.isArray(dest) && Array.isArray(source)) {
  //               source[0].classList.remove('hidden')
  //               dest[0].innerText = source[0].innerText
  //               console.log(source[0].innerText)
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
  mounted() {
    setTimeout(() => {
      this.showElement = true;
    }, 4000);
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
.fade1 {
  animation: slide-scale 0.8s ease-in-out;
}
.fade2 {
  animation: slide-scale 0.8s ease-in-out;
  animation-delay: 1s;
}
@keyframes slide-scale {
  0% {
    opacity: 0;
    /* transform: translate3d(100px, 0, 0); */
  }
  100% {
    opacity: 1;
    transform: translateZ(0);
  }
}
.card-content {
  min-height: 370px;
}
.experts {
  height: 30px;
  overflow: hidden;
}
.exp:hover .experts {
  height: unset;
  overflow: visible;
}
</style>
