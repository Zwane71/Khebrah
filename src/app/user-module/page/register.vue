<template>
  <base-layout>
    <register-form></register-form>
  </base-layout>
</template>

<script>
import BaseLayout from "@/layouts/BaseLayout.vue"
export default {
  components: {
    BaseLayout,
    RegisterForm: () => import("@/app/user-module/component/registerForm.vue"),
  },
};
</script>
