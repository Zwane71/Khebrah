<template>
  <div class="row">
    <div class="col-lg-6 offset-lg-3 col-md-10 offset-md-1 col-sm-12">
      <div class="base-box">
        <h2 class="text-center primary-color pb-3 pt-3">
          {{ $t("user.register") }}
        </h2>

        <div class="tab-content" id="pills-tabContent">
          <div
            class="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
          >
            <div class="form px-4 pt-5">
              <ValidationObserver ref="observer">
                <b-form
                  slot-scope="{ validate }"
                  @submit.prevent="
                    validate().then(
                      tabNumber == 0 ? registerByEmail : registerByMobile
                    )
                  "
                >
                  <ValidationProvider
                    v-slot="{ valid, errors }"
                    rules="required|email"
                  >
                    <b-form-input
                      v-if="tabNumber == 0"
                      type="email"
                      name="email"
                      @click="resetError"
                      v-model="email"
                      :state="errors[0] ? false : valid ? true : null"
                      class="form-control"
                      :placeholder="$t('user.enterYourEmail')"
                    />
                    <b-form-invalid-feedback id="inputLiveFeedback">
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
                  </ValidationProvider>

                  <b-row v-if="tabNumber == 1">
                    <b-col xs="12" sm="12" md="3">
                      <ValidationProvider v-slot="{}" rules="required">
                        <!-- <b-form-select
                          name="countryCode"
                          v-model="countryCode"
                          :options="options"
                          :disabled="isOtpSent"
                          :state="errors[0] ? false : valid ? true : null"
                        ></b-form-select> -->
                        <!-- <b-form-invalid-feedback id="inputLiveFeedback">
                          {{ errors[0] }}
                        </b-form-invalid-feedback> -->
                      </ValidationProvider></b-col
                    >
                    <b-col xs="12" sm="12" md="9">
                      <ValidationProvider
                        v-slot="{ valid, errors }"
                        rules="required|mobile:8"
                      >
                        <b-form-input
                          type="tel"
                          name="number"
                          :disabled="isOtpSent"
                          @click="resetError"
                          v-model="number"
                          :state="errors[0] ? false : valid ? true : null"
                          class="form-control"
                          :placeholder="$t('user.enterYourMobile')"
                        />
                        <b-form-invalid-feedback id="inputLiveFeedback">
                          {{ errors[0] }}
                        </b-form-invalid-feedback>
                      </ValidationProvider></b-col
                    >
                  </b-row>

                  <div v-if="errorFromApi">
                    <p class="py-3 text-center warning">
                      {{
                        tabNumber == 0
                          ? $t("user.emailExists")
                          : $t("user.mobileExists")
                      }}
                    </p>
                  </div>

                  <base-button
                    type="primary block"
                    :loading="loading"
                  >
                    {{ $t("user.verifyMyemail") }}
                  </base-button>
                </b-form>
              </ValidationObserver>
              <b-row class="py-3">
                <b-col>
                  <h6>
                    {{ $t("user.haveAnAccount") }}

                    <span
                      class="primary-color font-weight-bold"
                      role="button"
                      @click="navigateToLogin"
                    >
                      {{ $t("user.login") }}</span
                    >
                  </h6>
                </b-col>
                <b-col>
                  <h6 class="primary-color text-right"></h6>
                </b-col>
              </b-row>

            </div>
            <SocialAuthButtons type="register" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SocialAuthButtons from "@/app/user-module/component/SocialAuthButtons.vue";

export default {
  components: {
    SocialAuthButtons,
  },
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
      isOtpSent: false,
    };
  },
  metaInfo: {
    title: 'Register | Khebrah'
  },
  methods: {
    onSelect({ name, iso2, dialCode }) {
      // console.log(name, iso2, dialCode);
      this.countryCode = "+" + dialCode;
    },
    navigateToLogin() {
      this.$router.push({ name: "Login" });
    },
    resetError() {
      this.errorFromApi = false;
    },
    tabChange(val) {
      this.tabNumber = val;
      (this.email = null), (this.password = null);
    },
    registerByEmail() {
      this.loading = true;
      let data = {
        email: this.email,
      };
      // console.log(data);

      this.$store.dispatch('auth/registerByEmail', data)
        .then(data => {
          this.loading = false;

          if (data && data.status === true) {
            localStorage.setItem("email", this.email);
            localStorage.setItem("tabNumber", 0);
            this.$router.push({ name: "EmailVerification" });
          } else {
            this.errorFromApi = true;
          }
        })
        .catch((error) => {
          this.loading = false;
          this.errorFromApi = true;
        });
    },
    registerByMobile() {
      this.loading = true;
      let data = {
        auth_id: this.countryCode + this.number,
      };

      this.$store.dispatch('auth/registerByMobile', data)
        .then(data => {
          this.loading = false;

          if (data && data.status === true) {
            this.isOtpSent = true;
            localStorage.setItem("tabNumber", 1);
            localStorage.setItem("mobile", this.number);
            localStorage.setItem("countryCode", this.countryCode);
            this.$router.push({ name: "Otp" });
          } else {
            this.errorFromApi = true;
          }
        })
        .catch((error) => {
          this.loading = false;
          this.errorFromApi = true;
        });
    },
  },
};
</script>

<style scoped>
.card {
  width: 550px;
  border: transparent;
  padding: 30px;
  border-radius: 20px;
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

.form input {
  margin-bottom: 12px;
  border-radius: 10px;
}

.country-code {
  margin-bottom: 12px;
  border-radius: 10px;
}

.form input:focus {
  box-shadow: none;
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
