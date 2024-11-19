<template>
  <div class="row">
    <div class="col-lg-6 offset-lg-3 col-md-10 offset-md-1 col-sm-12">
      <div class="base-box">
        <h2 class="text-center primary-color pb-3 pt-3" v-if="nextRoute">
          {{ $t("user.loginToContinue") }}
        </h2>
        <h2 class="text-center primary-color pb-3 pt-3" v-else>{{ $t("user.login") }}</h2>

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
                      tabNumber == 0 ? loginAsUser : loginAsUserByMobile
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
                          class="form-control"
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

                  <ValidationProvider
                    v-slot="{ valid, errors }"
                    rules="required"
                  >
                    <b-form-input
                      type="password"
                      name="password"
                      @click="resetError"
                      v-model="password"
                      :state="errors[0] ? false : valid ? true : null"
                      class="form-control"
                      :placeholder="$t('user.password')"
                    />
                    <b-form-invalid-feedback id="inputLiveFeedback">
                      {{ errors[0] }}
                    </b-form-invalid-feedback>
                  </ValidationProvider>

                  <div v-if="errorFromApi">
                    <p class="py-2 text-center warning">
                      {{
                        tabNumber == 0
                          ? $t("user.incorrectEmailOrPass")
                          : $t("user.incorrectMobileNumber")
                      }}
                    </p>
                  </div>
                  <base-button
                    type="primary block"
                    :loading="loading"
                  >
                    {{ $t("user.login") }}
                  </base-button>
                </b-form>
              </ValidationObserver>
              <div class="row py-3">
                <div class="col-12 col-sm-6 text-center text-sm-left">
                  <h6 class="mb-0">
                    {{ $t("user.needAnAccount") }}
                    <span
                      class="primary-color font-weight-bold"
                      role="button"
                      @click="navigateToSignUp"
                    >
                      {{ $t("user.signUp") }}
                    </span>
                  </h6>
                </div>
                <div class="col-12 col-sm-6 text-sm-right text-center forgot-link">
                  <router-link class="primary-color" :to="{ name: 'ResetPassword' }">
                    {{ $t("user.forgotYourPassword") }}
                  </router-link>
                </div>
              </div>

            </div>
            <SocialAuthButtons type="login"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SocialAuthButtons from '@/app/user-module/component/SocialAuthButtons.vue'

export default {
  components: {
    SocialAuthButtons
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
  computed: {
    nextRoute() {
      return this.$store.getters['nextRoute']
    }
  },
  methods: {
    onSelect({ name, iso2, dialCode }) {
      console.log(name, iso2, dialCode);
      this.countryCode = "+" + dialCode;
    },
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
    loginAsUser() {
      this.loading = true;
      let data = {
        username: "",
        email: this.email,
        password: this.password,
      };

      this.$store
        .dispatch("auth/login", data)
        .then((res) => {
          this.loading = false;
          if (this.nextRoute) {
            this.$router.push({ path: this.nextRoute });
            this.$store.commit('clearNextRoute')
          } else {
            this.$router.push({ name: "HomePage" });
          }
          window.scrollTo({
            left: 0, 
            top: 0, 
            behavior: 'smooth' 
          })
        })
        .catch((error) => {
          console.log(error.response.data);
          this.loading = false;

          this.errorFromApi = true;
        });
    },
    loginAsUserByMobile() {
      this.loading = true;
      let data = {
        mobile: this.countryCode + this.number,
        password: this.password,
      };

      this.$store
        .dispatch("auth/loginByMobile", data)
        .then((res) => {
          this.loading = false;
          if (this.nextRoute) {
            this.$router.push({ path: this.nextRoute });
          } else {
            this.$router.push({ name: "HomePage" });
          }
          window.scrollTo({
            left: 0, 
            top: 0, 
            behavior: 'smooth' 
          })
        })
        .catch((error) => {
          this.loading = false;

          this.errorFromApi = true;
        });
    },
  },
  // destroyed() {
  //   this.$store.commit('clearNextRoute')
  // }
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

.form {
  padding: 10px;
  height: 300px;
}

.form input,
select {
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

/* .form button {
  margin-top: 20px;
} */

.full-height {
  height: 1300px;
}
.primary-color {
  color: #044982 !important;
}
.warning {
  color: red;
}
.forgot-link {
  line-height: 1.2;
}
</style>
