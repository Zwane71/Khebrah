<template>
  <div class="row mb-4">
    <div class="col-md-5">
      <h2>{{ title }}</h2>
      <breadcrumbs />
    </div>
    <div class="col-md-7 slot">
      <slot />
    </div>
  </div>
</template>
<script>
import Breadcrumbs from '@/components/common/Breadcrumbs.vue'
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  components: {
    Breadcrumbs
  }
}
</script>
<style scoped>
.slot {
  display: flex;
  align-items: center;
  margin: 10px 0;
}
@media only screen and (min-width: 769px) {
  .slot {justify-content: flex-end;
  margin: 0px; }
}
</style>