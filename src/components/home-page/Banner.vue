<template>
  <div class="banner">
    <div class="container" >
      <div class="row">
        <div class="col-lg-5 order">
          <div class="banner-text">
            <p class="banner-text__quick">{{$t('home.getStarted')}}</p>
            <h1 :class="{ fade1: 'showElement' }">
              {{$t('home.findThePerfect')}} <span class="h1__span">{{$t('home.experts')}}</span> 
              <!-- {{$t('home.forYourBussiness')}} -->
            </h1>

            <div class="banner-search position-relative mt-5">
              <i class="fas fa-search search__ico" ></i>
              <multiselect
                :options="searchOptions"
                group-values="items"
                group-label="type"
                open-direction="bottom"
                label="name"
                :placeholder="$t('home.searchPlaceholder')"
                @input="handleSearchInput"
              >
            </multiselect>
              <button class="btn search-btn">
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>

            <div class="banner-buttons" >
              <span 
              > {{$t('home.keywordLabel')}} </span>
              <div>
                <router-link 
                  class="clipped px-2"
                  :to="{ name: 'Experts', query: { categories: -1, keywords: keyword.id }}"
                  v-for="keyword in popularKeywords" 
                  :key="keyword.id" >
                  {{ $i18n.locale === 'en' ? keyword.name : keyword.name_ar }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-7 padding-in-r" style="position: relative">
          <div class="pt-4 pt-lg-5 mt-lg-5">
            <vimeo-player :options="{responsive: true}" video-id="677267578" />
          </div>
          <!-- <div class="banner-r" v-if="false">
            <slick
              ref="slick"
              :options="slickOptions"
              class="banner-slider"
              :class="{ fade2: 'showElement' }"
              :dir="enLang ? 'ltr' : 'rtl'"
            >
              <div v-for="carousel in carousels" :key="carousel.id">
                <div class="banner-slider__div" @click="goToProfile(carousel.user.profile.username)" :style="getCarouselStyle(carousel)">
                  <div class="overlay">
                    <div class="msg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="23.623"
                        height="23.624"
                        viewBox="0 0 23.623 23.624"
                      >
                        <path
                          d="M23.541,1.287,13.547,23.093a.909.909,0,0,1-1.732-.3L10.97,12.653.833,11.808a.909.909,0,0,1-.3-1.732L22.336.083a.909.909,0,0,1,1.2,1.2Z"
                          transform="translate(0)"
                          fill="#fff"
                        />
                      </svg>
                    </div>
                    <div class="details">
                      <img
                        src="../../assets/img/steam.png"
                        alt=""
                        class="steam"
                      />
                      <div class="details__info">
                        <div class="margin-end-10">
                          <base-avatar :src="carousel.user.profile_img" :size="49"/>
                        </div>
                        <div>
                          <small class="text-white railway">{{$t('home.topRated')}}</small>
                          <p class="poppins clipped">{{ carousel.user.first_name + ' ' + carousel.user.last_name }}</p>
                          <span class="railway-14 clipped">{{ carousel.user.title }}</span>
                          <base-rating  class="star-rating" :value="carousel.user.avg_rating" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </slick>
            <div class="decoration__div" :class="{ fade1: 'showElement' }">
              <img
                src="../../assets/img/decoration.png"
                alt=""
                class="decoration__img0"
              />
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
export default {
  components: {
    Multiselect
  },
  data() {
    return {
      activeButton: "name",
      showElement: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.showElement = true;
      // console.log(this.showElement);
    }, 4000);
  },
  computed: {
    keywords() {
      return this.$store.getters['data/keywords']
    },
    popularKeywords() {
      return this.keywords
        .filter(k => k.popularity != null)
        .sort((a, b) => a.popularity - b.popularity)
    },
    categories() {
      return this.$store.getters['data/categories']
    },
    carousels() {
      return this.$store.getters['data/carousels']
    },
    searchOptions() {
      return [
        { type: 'Categories', items: this.categories.map(c => ({ type: 'category', ...c })) },
        { type: 'Keywords', items: this.keywords.map(k => ({ type: 'keyword', ...k })) },
      ]
    },
    slickOptions() {
      return {
        rtl: !this.enLang,
        loop: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: this.enLang ? 1 : -1,
        arrows: false,
        rows: 1,
        centerMode: true,
        centerPadding: 0,
        autoplay: true,
        responsive: [
          {
            breakpoint: 1919.98,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
              rows: 1,
            },
          },
          {
            breakpoint: 1199.98,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 991.98,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 767.98,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          // {
          //   breakpoint: 575.98,
          //   settings: {
          //     slidesToShow: 1,
          //     slidesToScroll: 1,
          //     centerPadding: "70px",
          //   },
          // },
        ],
      }
    } 
  },
  methods: {
    addActiveClass(cmp) {
      this.activeButton = cmp;
    },
    goToProfile(username) {
      this.$router.push({ name: 'expertProfile', params: { username }})
    },
    getCarouselStyle(carousel) {
      return {backgroundImage: `url(${carousel.image})`}
    },
    handleSearchInput(value) {
      const query = value.type === 'keyword'
        ? { categories: -1, keywords: value.id } 
        : { categories: value.id }
      this.$router.push({ name: 'Experts', query })
    }
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.fade1 {
  animation: slide-scale 0.6s ease-out;
}
.fade2 {
  animation: slide-scale 0.6s ease-out;
  animation-delay: 0.3s;
}
@keyframes slide-scale {
  0% {
    opacity: 0;
    transform: translate3d(0, 100px, 0);
  }
  100% {
    opacity: 1;
    transform: translateZ(0);
  }
}
.banner-buttons > div {
  flex-flow: row wrap;
}
.banner-buttons a {
  margin-bottom: 10px;
  width: auto;
}

/deep/ .multiselect__select {
  display: none;
}
/deep/ .multiselect__tags {
  min-height: 50px;
  padding: 10px 40px 0 40px !important;
  border-radius: 30px;
  font-size: 16px;
  cursor: text;
}
@media (min-width: 991px) {
  .order {
    padding-right: 1.5rem;
  }
  .rtl .order {
    padding-right: unset;
    padding-left: 1.5rem;
  }
}
.search-btn {
  color: #fff;
  top: 5px;
  z-index: 999;
  right: 7px;
}
.rtl .search-btn {
  right: unset;
  left: 7px;
  transform: rotate(180deg);
}
.search__ico {
  top: 15px;
  z-index: 999;
  left: 15px;
}
.rtl .search__ico {
  left: unset;
  right: 15px;
}

/deep/ .multiselect__content-wrapper {
  transition: none;
}
.banner-slider__div {
  background-position: center;
  background-size: cover;
  cursor: pointer;
}
.clipped {
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 95%;
  overflow: hidden;
}
.star-rating {
  position: relative;
  top: -10px;
}
.rtl .banner-buttons span {
  text-align: right;
}

/deep/ .multiselect__input {
  min-height: 29px;
}
/deep/ .multiselect__placeholder {
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}
@media (max-width: 575px) {
  .banner-slider__div {
    height: 300px;
  }
  .banner {
    /* margin-top: -80px; */
  }
}
</style>
