<template>
  <div>
    <the-navbar></the-navbar>

    <div v-if="!isLoading">
      <createProfile
        v-if="isMobileVerified"
        :isMobileVerified="isMobileVerified"
      ></createProfile>
      <emailNotVerified v-else></emailNotVerified>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isEmailVerified: false,
      isMobileVerified: null,
      isLoading: false,
    };
  },
  methods: {
    verifyMobile() {},
  },
  created() {
    if (typeof localStorage !== "undefined") {
      this.isMobileVerified = localStorage.getItem("isMobileVerified");

      if (this.isMobileVerified) {
        this.number =
          localStorage.getItem("verifiedCountryCode") +
          localStorage.getItem("verifiedMobile");
      }
    }
  },
  components: {
    TheNavbar: () => import("@/components/header/TheNavbar.vue"),
    createProfile: () =>
      import("@/app/user-module/component/createProfile.vue"),
    emailNotVerified: () =>
      import("@/app/user-module/component/emailNotVerified.vue"),
  },
};
</script>
