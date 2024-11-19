<template>
  <base-layout>
    <EmailVerification></EmailVerification>
  </base-layout>
</template>

<script>
import BaseLayout from '@/layouts/BaseLayout.vue'
export default {
  components: {
    BaseLayout,
    EmailVerification: () =>
      import("@/app/user-module/component/emailVerification.vue"),
  },
};
</script>
