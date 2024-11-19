<template>
  <div id="about" class="about-section tab-d">
    <div class="expert-gallery" v-if="expert.gallery.length">
      <div class="expert-gallery-item" v-for="item in expert.gallery" :key="item.id">
        <img v-if="item.image" class="preview-image" :src="item.image" alt="">
        <div class="video-preview" v-else-if="item.youtube_link">
          <youtube :resize="true" :fit-parent="true" :width="500" :video-id="getId(item.youtube_link)" />
        </div>
      </div>
      <!-- <div class="video-d">
        <vue-player
          src="https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4"
          poster="https://i.ibb.co/XkCw7vB/poster.png"
          playsinline
        ></vue-player>
      </div>
      <div class="about-images">
        <img src="../../assets/img/profile/pic1.png" alt="about" />
        <img src="../../assets/img/profile/pic2.png" alt="about" />
      </div> -->
    </div>
    <div class="about-desc">
      <!-- <h5>{{$t('profilePage.aboutMe')}}</h5>
      <h6 class="heading">{{ expert.title }}</h6> -->
      <read-more
        more-str="More"
        :text="description"
        link="#"
        less-str="Less"
        :max-chars="550"
      ></read-more>
    </div>
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
  data: () => ({
    slickOptions: {
      rtl: navigator.language === "ar",
      loop: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
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
            slidesToShow: 1,
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
        {
          breakpoint: 575.98,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerPadding: "70px",
          },
        },
      ],
    },
  }),
  computed: {
    description() {
      return (this.arLang && this.expert.description_ar) || this.expert.description || ' '
    }
  },
  methods: {
    getId(url) {
      return this.$youtube.getIdFromUrl(url)
    }
  }
};
</script>

<style scoped>
.expert-gallery {
  overflow-x: auto;
  display: flex;
}
.expert-gallery-item {
  margin-right: 10px;
  height: 350px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}
.expert-gallery-item img {
  object-fit: cover;
  object-position: center center;
  width: 100%;
  height: 100%;
}
@media (max-width: 991px) {
  .expert-gallery-item {
    height: 250px;
  }
}
</style>
