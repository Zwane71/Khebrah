<template>
  <div class="second-section">
    <div class="container">
      <div class="row">
        <div class="col-lg-4">
          <div class="populiar-categores">
            <!-- <p class="popular-categories__p" :class="{ fade1: 'showElement' }">
              Popular Categories
            </p> -->
            <h2 :class="{ fade1: 'showElement' }">
              {{ $t('home.categoriesTitle') }}
              <!-- Find The Talent Needed To Get Your Bussiness Growing. -->
            </h2>
            <p class="hide-in-ds">
              {{ $t('home.categoriesSubtitle') }}
              <!-- When, while lovely valley teems with vapour around meand meridian
              sun strikes the upper impenetrable . -->
            </p>
            <!-- <div class="popular-categories__div">
              <p
                class="popular-categories__div__p"
                :class="{ fade1: 'showElement' }"
              >
                The best for every budget Find high-quality services at every
                price point. No hourly rates, just project-based pricing.<br /><br />
              </p>
              <p
                class="popular-categories__div__p"
                :class="{ fade1: 'showElement' }"
              >
                Quality work done quickly Find the right freelancer to begin
                working on your project within minutes.<br /><br />
              </p>
              <p
                class="popular-categories__div__p"
                :class="{ fade2: 'showElement' }"
              >
                Protected payments, every time Always know what you'll pay
                upfront. Your payment isn't released until you approve the work.
              </p>
            </div> -->
            <button
              href="#"
              class="get-started"
              :class="{ fade2: 'showElement' }"
              @click="goToExperts"
              >{{$t('home.getStarted')}}</button
            >
          </div>
        </div>
        <div class="col-lg-8 popular-categories__right">
          <div class="container kh-bg">
            <div class="row">
              <div class="col-6 col-md-4" @click="goToCategory(category.id)" v-for="category in categories" :key="category.id">
                <div class="talent" :class="{ fade1: 'showElement' }">
                  <div class="talent__div">
                    <div class="img-container">
                      <img class="popular-categories__right__img" :src="category.category_img" :alt="category.name">
                    </div>
                    <h6 class="popular-categories__right__h6 pos-r">
                      {{ enLang ? category.name : category.name_ar }}
                    </h6>
                    <p class="popular-categories__right__p">
                      {{ enLang ? category.description : category.description_ar }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
    categories() {
      return this.$store.getters['data/categories']
    }
  },
  methods: {
    goToExperts() {
      this.$router.push({ name: 'Experts' })
    },
    goToCategory(id){
      this.$router.push({ name: 'Experts', query: { categories: id }})
    }
  }
};
</script>

<style scoped>
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
    /* transform: translate3d(0, 100px, 0); */
    /* transition-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715); */
  }
  100% {
    opacity: 1;
    transform: translateZ(0);
  }
}
.talent {
  cursor: pointer;
}
</style>
