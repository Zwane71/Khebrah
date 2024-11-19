<template>
  <base-layout>
    <login-form ></login-form>
  </base-layout>
</template>

<script>
import BaseLayout from "@/layouts/BaseLayout.vue"
export default {
  components: {
    BaseLayout,
    LoginForm: () => import("@/app/user-module/component/loginForm.vue"),
  },

  metaInfo: {
    title: 'Login | Khebrah'
  },
};
</script>
