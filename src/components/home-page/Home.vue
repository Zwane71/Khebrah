<template>
  <div>
    <banner></banner>
    <popular-categories></popular-categories>
    <about-khebrah></about-khebrah>
    <recommended></recommended>
  </div>
</template>

<script>
import Banner from "./Banner.vue";
import PopularCategories from "./PopularCategories.vue";
import AboutKhebrah from "./AboutKhebrah.vue";
import Recommended from "./Recommended.vue";

export default {
  components: {
    Banner,
    PopularCategories,
    AboutKhebrah,
    Recommended,
  },

  metaInfo() {
    return {
      title: 'Khebrah',
      titleTemplate: null
    }
  }
};
</script>
