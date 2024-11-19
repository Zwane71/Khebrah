<template>
  <div class="breadcrumbs">
    <div v-for="(breadcrumb, index) in breadcrumbs" :key="index">
      <router-link
        :class="{disabled: breadcrumb.text === 'dashboard'}"
        :to="breadcrumb.link"
        >{{ breadcrumb.text }} </router-link>
        <i class="fas fa-chevron-right mx-2" v-if="index < breadcrumbs.length - 1"></i>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    breadcrumbs() {
      return this.$route.path
        .split('/')
        .filter(chunk => chunk && !['en', 'ar'].includes(chunk))
        .map((item, index, breadcrumbs) => {
          const link = breadcrumbs.slice(0, index + 1).join('/')
          return {
            text: this.$te(`dashboard.${item}`) ? this.$t(`dashboard.${item}`) : item,
            link: `/${this.$i18n.locale}/${link}` 
          }

        })
    }
  }
}
</script>

<style scoped>
.breadcrumbs {
  display: flex;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
}
.breadcrumbs a {
  color: #77787b;
  text-transform: capitalize;
  user-select: none;
}
.breadcrumbs a:hover {
  text-decoration: underline !important;
}
i {
  font-size: 10px;
  color: #77787b;
  position: relative;
  top: -1px;
}
.rtl i {
  transform: rotate(180deg);
}
.breadcrumbs a.disabled {
  text-decoration: none !important;
  pointer-events: none;
}
</style>
