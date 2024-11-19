<template>
  <div class="row">
    <div class="col-12 col-lg-10 offset-lg-1">
      <div class="base-box">
        <h2 class="text-center primary-color pt-3 pb-4">
          {{ $t("user.createProfile") }}
        </h2>

        <div class="form px-4 pt-5">
          <validation-observer ref="form">
            <form class="needs-validation" novalidate 
              @submit.prevent="updateProfile"
            >
              <div class="row">
                <div class="col-sm-12 col-md-6">
                  <base-input 
                    rules="required"
                    vid="firstName"
                    v-model="profile.firstName"
                    @click="resetError"
                    :placeholder="$t('user.firstName')" />
                </div>

                <div class="col-sm-12 col-md-6">
                  <base-input 
                    rules="required"
                    vid="lastName"
                    v-model="profile.lastName"
                    @click="resetError"
                    :placeholder="$t('user.lastName')" />
                </div>

                <div class="col-sm-12 col-md-6">
                  <base-select 
                    vid="gender"
                    rules="required"
                    :options="genderOptions"
                    v-model="profile.gender"
                    :placeholder="$t('user.gender')" />
                </div>

                <div class="col-sm-12 col-md-6">
                  <base-select 
                    :options="countries"
                    rules="required"
                    v-model="profile.location"
                    vid="location"
                    :placeholder="$t('user.location')" />
                </div>

                <div v-if="user" class="col-12 col-lg-6 mobile-number position-relative">
                  <base-input 
                    type="tel"
                    vid="mobile"
                    v-model="profile.phone"
                    disabled
                    del="phone"
                    :placeholder="$t('user.mobileOptional')" />
                  <div class="text-accent account-action" @click="showMobileModal">
                    {{ user.mobile ? $t('user.editNumber') : $t('user.addNumber') }}
                  </div>
                </div>

                <div class="col-sm-12 px-2">
                  <div class="mb-4 px-2">
                    <hr class="solid" />
                  </div>
                </div>

                <div class="col-sm-12">
                  <p class="text-left">{{ $t("user.chooseYourIntrest") }}</p>
                  <div class="row">
                    <div v-for="(item, index) in keywords" :key="index">
                      <b-button
                        class="mx-2"
                        pill
                        :variant="
                          checkKeyword(item.id)
                            ? 'primary'
                            : 'outline-secondary'
                        "
                        @click="selectKeyword(item.id, index)"
                        >{{ enLang ? item.name : item.name_ar }}
                      </b-button>
                  </div>
                  </div>
                </div>

                <div class="col-sm-12 px-2">
                  <div class="mb-4 px-2">
                    <hr class="solid" />
                  </div>
                </div>

                <div class="col-sm-12">
                  <!-- <ValidationProvider v-slot="{}" rules="required"> -->
                  <b-form-checkbox
                    id="checkbox-1"
                    v-model="status"
                    name="checkbox-1"
                    value="accepted"
                    unchecked-value="not_accepted"
                  >
                    {{ $t("user.privacyPolicy1") }} <router-link target="_blank" :to="`/${$i18n.locale}/pages/privacy-policy`"> {{ $t('user.privacyPolicy')}} </router-link> & <router-link target="_blank" :to="`/${$i18n.locale}/pages/terms-and-conditions`"> {{ $t('user.termsAndConditions')}} </router-link>
                  </b-form-checkbox>
                  <!-- </ValidationProvider> -->
                </div>
                <div class="col-12">
                  <base-checkbox v-model="subscribeToNewsletter">
                    {{ $t('user.subscribeToNewsletter') }}
                  </base-checkbox>
                </div>

              </div>

              <div v-if="status == 'accepted'" class="text-center my-6">
                <base-button
                  type="primary lg"
                  class="mt-5"
                  :loading="loading">
                  {{ $t("user.createMyProfile") }}
                </base-button>
              </div>

            </form>
          </validation-observer>

          <!-- <button @click="updateProfile">update</button> -->
        </div>
        <div v-if="errorFromApi" class="warning text-center">
          <p>{{ emailError }}</p>
          <p>{{ errorUpdateProfile }}</p>
          <p>{{ password1Error }}</p>
          <p>{{ password2Error }}</p>
          <p>{{ otherError }}</p>
        </div>

        <base-modal 
          ref="mobileModal"
          :title="$t('user.addNumber')">
          <edit-mobile @success="hideMobileModal" @cancel="hideMobileModal"/>
        </base-modal>
      </div>
    </div>
  </div>
</template>

<script>
import EditMobile from '@/app/user-module/component/editMobile.vue'
export default {
  components: {
    EditMobile
  },
  data() {
    return {
      countryCode: null,
      tabNumber: 0,
      errorFromApi: false,
      error: null,
      loading: false,
      number: null,
      last_otp: null,
      isOtpSent: false,
      status: false,
      selectedKeywords: [],
      isMobileVerified: false,
      otherError: null,
      errorUpdateProfile: null,

      profile: {
        firstName: '',
        lastName: '',
        country: null,
        gender: null,
        phone: null
      },
      subscribeToNewsletter: false
    };
  },

  watch: {
    '$store.state.user.profile': {
      handler(value) {
        const { 
          first_name: firstName, 
          last_name: lastName,
          gender,
          country,
        } = value || {}

        if (!this.profile.firstName && firstName) this.profile.firstName = firstName
        if (!this.profile.lastName && lastName) this.profile.lastName = lastName
        if (!this.profile.gender && gender) this.profile.gender = gender
        if (!this.profile.country && country) this.profile.location = country
        if(this.user && this.user.mobile) this.profile.phone = this.user.mobile

        if (value && value.profile_complete) {
          this.$router.push({ name: "HomePage" });
        }
      },
      immediate: true
    },
    '$store.state.auth.user': {
      handler(value) {
        if(value && value.mobile) this.profile.phone = value.mobile
      },
      immediate: true
    }
  },

  computed: {
    keywords() {
      return this.$store.getters['data/keywords']
    },
    countries() {
      return this.$store.getters['data/countries']
        .map(c => ({ value: c.id, text: this.enLang ? c.name : c.name_ar }))
    },
    user() {
      return this.$store.getters['auth/user']
    },
    genderOptions() {
      return [
        { value: "M", text: this.$t('user.male') },
        { value: "F", text: this.$t('user.female') },
      ]
    },
    nextRoute() {
      return this.$store.getters['nextRoute']
    }
  },

  methods: {
    checkKeyword(id) {
      if (this.selectedKeywords.includes(id)) {
        return true;
      } else {
        return false;
      }
    },
    resetError() {
      this.errorFromApi = false;
    },
    showMobileModal() {
      this.$refs.mobileModal.show()
    },
    hideMobileModal() {
      this.$refs.mobileModal.hide()
    },
    onSelect({ name, iso2, dialCode }) {
      this.countryCode = "+" + dialCode;
    },
    selectKeyword(id, index) {
      // console.log(id);
      if (this.selectedKeywords.length > 0) {
        if (this.selectedKeywords.find((element) => element == id)) {
          let indexOfkeyword = this.selectedKeywords.findIndex(
            (element) => element == id
          );

          if (indexOfkeyword > -1) {
            this.selectedKeywords.splice(indexOfkeyword, 1);
          }
        } else {
          this.selectedKeywords.push(id);
        }
      } else {
        this.selectedKeywords.push(id);
      }
    },
    async updateProfile() {
      const isValid = await this.$refs.form.validate();

      if(!isValid) {
        this.scrollToFirstError()
        return
      }

      let data = {
        first_name: this.profile.firstName,
        last_name: this.profile.lastName,
        gender: this.profile.gender,
        country: this.profile.location,
        interests: this.selectedKeywords,
        profile_complete: true
      };

      this.loading = true

      this.$store.dispatch('user/updateProfile', data)
        .then((response) => {
          this.$store.dispatch('user/fetchProfile')
            .then(() => {
              if (this.subscribeToNewsletter) {
                this.$store.dispatch('user/subscribeToNewsletter', this.user.email)
                  .catch(error => {})
              }
              this.loading = false;
              if (this.nextRoute) {
                this.$router.push({ path: this.nextRoute });
                this.$store.commit('clearNextRoute')
              } else {
                this.$router.push({ name: "HomePage" });
              }
            })

        })
        .catch((error) => {
          console.log("error from update profile", error.response);
          this.errorFromApi = true;
          this.errorUpdateProfile = error.response.data;
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.card {
  width: 850px;
  border: transparent;
  padding: 30px;
  border-radius: 20px;
}

.country-code {
  margin-bottom: 12px;
  border-radius: 10px;
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
  /* border-bottom: 1px solid #e5e5e5; */
  border: 1px solid #e5e5e5;
  border-top: 1px solid #999;
}

.nav-item {
  display: table-cell;
  background: #0d6efd2e;
}

.form {
  padding: 10px;
  min-height: 300px;
}

.form input,
select {
  margin-bottom: 12px;
  border-radius: 10px;
}

.form input:focus {
  box-shadow: none;
}

.form button {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .form button {
    margin-top: 10px;
    margin-left: 5px !important;
    margin-right: 5px !important;
    font-size: 14px;
  }
}

.full-height {
  height: 1500px;
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
.account-action {
  position: absolute;
  right: 25px;
  top: 15px;
  font-size: 14px;
  cursor: pointer;
}
.rtl .account-action {
  right: unset;
  left: 25px;
}
</style>
