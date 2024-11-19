<template>
  <div class="row">
    <div
      class="col-lg-6 offset-lg-3 col-sm-12"
    >
      <div class="base-box py-5 d-flex flex-column justify-content-center align-items-center">
        <div
          class="header-logo d-flex justify-content-center align-items-center"
        >
          <img src="@/assets/img/success.svg" alt="" class="header-logo" />
        </div>

        <p class="primary-color pb-4 text-center py-3">
          {{ $t("user.emailVerifyMessage") }}
        </p>
        <h6 class="text-right">
          {{ $t("user.didntReceiveEmail") }}

          <span
            class="primary-color font-weight-bold py-3"
            role="button"
            @click="navigateToSignUp"
          >
            {{ $t("user.resend") }}</span
          >
        </h6>
      </div>
    </div>
  </div>
</template>

<script>
import "@/app/base-module/util/validation_rules";

export default {
  components: {},
  data() {
    return {
      countryCode: null,
      tabNumber: 0,
      errorFromApi: false,
      options: [
        { value: null, text: "code" },
        { value: "+965", text: "+965" },
        { value: "+971", text: "+971" },
        { value: "+91", text: "+91" },
      ],
      loading: false,
      email: null,
      number: null,
      password: null,
      last_otp: null,
      isOtpSent: true,
      error: null,
    };
  },
  created() {
    if (typeof localStorage !== "undefined") {
      this.countryCode = localStorage.getItem("countryCode");
      this.number = localStorage.getItem("mobile");
    }
  },

  methods: {
    navigateToSignUp() {
      this.$router.push({ name: "Register" });
    },
    resetError() {
      this.errorFromApi = false;
    },
    tabChange(val) {
      this.tabNumber = val;
      (this.email = null), (this.password = null);
    },
  }
};
</script>

<style scoped>
.card {
  width: 500px;
  border: transparent;
  padding: 30px;
  border-radius: 20px;
  height: 400px;
}

.btr {
  border-top-right-radius: 5px !important;
}

.btl {
  border-top-left-radius: 5px !important;
}

.btn-dark {
  color: #fff;
  background-color: #044982;
  border-color: #044982;
}

.btn-dark:hover {
  color: #fff;
  background-color: #044982;
  border-color: #044982;
}

.nav-pills {
  display: table !important;
  width: 100%;
}

.nav-pills .nav-link {
  border-radius: 0px;
  border-bottom: 1px solid #0d6efd40;
}

.nav-item {
  display: table-cell;
  background: #0d6efd2e;
}

.form {
  padding: 10px;
  height: 300px;
}

.form input {
  margin-bottom: 12px;
  border-radius: 10px;
}

.form input:focus {
  box-shadow: none;
}

.form button {
  margin-top: 20px;
}

.full-height {
  height: 1300px;
}
.third-section-height {
  height: 605px;
  margin-top: -300px;
}
.rounded-corner {
  border-radius: 20px;
}
.primary-color {
  color: #044982 !important;
}
.warning {
  color: red;
}
</style>
