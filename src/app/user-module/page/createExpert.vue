<template>
  <base-layout>
    <StepperForm></StepperForm>
  </base-layout>
</template>

<script>
export default {
  components: {
    StepperForm: () => import("@/app/user-module/component/StepperForm.vue"),
  },

  created() {
    if (!this.user.mobile) {
      this.$router.push({ name: 'Homepage' })
    } if(this.user.is_expert && !this.$route.query.order_no){
      this.$router.push({ name: 'EditProfile'})
    }
  },

  metaInfo: {
    title: 'Apply as Expert | Khebrah'
  },

  computed: {
    user() {
      return this.$store.getters['auth/user']
    }
  }
};
</script>
