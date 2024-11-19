<template>
  <div class="third-section">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 pattern-bg">
          <div class="img-section__container">
            <img
              src="../../assets/img/img.png"
              alt=""
              class="img-section__container__img"
              :class="{ fade2: 'showElement' }"
            />
            <div class="vid" :class="{ fade2: 'showElement' }">
              <!-- <img src="../../assets/img/vid.png" alt=""> -->
              <img src="../../assets/img/vid1.png" alt="" />
              <a href="#0" class="play">
                <i class="fas fa-caret-right"></i>
              </a>
            </div>
            <div class="decoration" :class="{ fade1: 'showElement' }">
              <img src="../../assets/img/decoration.png" alt="" />
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="third-section-content">
            <div class="abs-in-mob">
              <p
                class="third-section-content__p"
                :class="{ fade1: 'showElement' }"
              >
                {{ $t('home.aboutTitle' )}}
              </p>
              <h2 :class="{ fade1: 'showElement' }">
                {{ $t('home.aboutSubtitle' )}}
              </h2>
            </div>
            <div class="third-section-content__div">
              <h6
                class="third-section-content__div__h6 margin-top-50"
                :class="{ fade1: 'showElement' }"
              >
                {{ $t('home.aboutItemTitle1' )}}
              </h6>
              <p
                class="third-section-content__div__p"
                :class="{ fade1: 'showElement' }"
              >
                {{ $t('home.aboutItemText1' )}}
              </p>

              <h6
                class="third-section-content__div__h6 margin-top-30"
                :class="{ fade1: 'showElement' }"
              >
                {{ $t('home.aboutItemTitle2' )}}
              </h6>
              <p
                class="third-section-content__div__p"
                :class="{ fade1: 'showElement' }"
              >
                {{ $t('home.aboutItemText2' )}}
              </p>

              <h6
                class="third-section-content__div__h6 margin-top-30"
                :class="{ fade1: 'showElement' }"
              >
                {{ $t('home.aboutItemTitle3' )}}
              </h6>
              <p
                class="third-section-content__div__p"
                :class="{ fade1: 'showElement' }"
              >
                {{ $t('home.aboutItemText3' )}}
              </p>

              <h6
                class="third-section-content__div__h6 margin-top-30"
                :class="{ fade1: 'showElement' }"
              >
                {{ $t('home.aboutItemTitle4' )}}
              </h6>
              <p
                class="third-section-content__div__p"
                :class="{ fade1: 'showElement' }"
              >
                {{ $t('home.aboutItemText4' )}}
              </p>
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
};
</script>

<style scoped>
.fade1 {
  animation: slide-scale 0.8s ease-in-out;
}
.fade2 {
  animation: slide-scale2 0.8s ease-in-out;
  animation-delay: 1s;
}
@keyframes slide-scale {
  0% {
    opacity: 0;
    transform: translate3d(100px, 0, 0);
  }
  100% {
    opacity: 1;
    transform: translateZ(0);
  }
}
@keyframes slide-scale2 {
  0% {
    opacity: 0;
    transform: translate3d(0, 100px, 0) scale(0.6);
  }
  100% {
    opacity: 1;
    transform: translateZ(0) scale(1);
  }
}
</style>
