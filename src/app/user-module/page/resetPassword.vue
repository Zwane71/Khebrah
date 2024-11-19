<template>
  <base-layout>
    <div class="row">
      <div class="col-lg-6 offset-lg-3 col-sm-12">
      <div class="base-box" v-if="!success">
        <h2 class="text-center primary-color pb-3 pt-3">{{$t('user.resetPassword')}}</h2>

        <validation-observer immediate ref="form" v-slot="{ handleSubmit }">
          <form class="needs-validation px-4 pt-5" novalidate @submit.prevent="handleSubmit(submit)">
            <base-input type="email" autocomplete="username" v-if="selectedTab === 'email'" v-model="email" rules="required|email" :disabled="emailSent" :placeholder="$t('user.enterYourEmail')"/>
            <base-input type="text" v-else v-model="mobile" rules="required" :disabled="emailSent" :placeholder="$t('user.enterYourMobile')"/>

            <base-input type="text" v-if="emailSent" v-model="otp" rules="required" :placeholder="$t('user.enterSentOtpEmail')"/>

            <base-input type="password" autocomplete="new-password" v-if="emailSent" v-model="password1" rules="required" vid="password1"  :placeholder="$t('settings.newPwd')"/>
            <base-input type="password" autocomplete="new-password" v-if="emailSent" v-model="password2" rules="required|confirmed:password1" :placeholder="$t('settings.newPwdAgain')"/>

            <div class="text-center mb-2" v-if="error">
              <small class="text-danger">{{ error }}</small>
            </div>
            <base-button type="primary block text-uppercase" :loading="loading">{{$t('user.resetPassword')}}</base-button>
          </form>
        </validation-observer>
      </div>

      <div v-else class="base-box py-5 d-flex flex-column justify-content-center align-items-center">
        <div
          class="header-logo d-flex justify-content-center align-items-center"
        >
          <img src="@/assets/img/success.svg" alt="" class="header-logo" />
        </div>

        <p class="primary-color pb-4 text-center py-3">
          {{$t('user.pwdChanged')}}
        </p>

          <base-button
            type="primary"
            @click="goToLogin"
          >
          {{$t('user.login')}}
          </base-button>
      </div>
      </div>
    </div>
  </base-layout>
</template>
<script>
export default {
  data: () => ({
    loading: false,
    email: '',
    mobile: '',
    otp: '',
    password1: '',
    password2: '',
    emailSent: false,
    error: '',
    success: false,
    selectedTab: 'email'
  }),

  metaInfo: {
    title: 'Reset password | Khebrah'
  },

  methods: {
    submit() {
      this.loading = true
      this.error = ''

      if (this.emailSent) {
        this.updatePassword()
        return
      }

      const method = this.selectedTab === 'email'
        ? 'auth/resetEmailPassword'
        : 'auth/resetMobilePassword'
      
      const payload = this.selectedTab === 'email'
        ? this.email
        : this.mobile

      this.$store.dispatch(method, payload)
        .then(response => {
          console.log(response)
          this.loading = false
          if (response.status) {
            this.emailSent = true
          } else {
            this.error = response.response
          }
        })
        .catch(error => {
          this.loading = false
          this.error = error
          console.log(error)
        })

    },

    updatePassword() {
      this.loading = true
      const { email: uid, password1, password2, otp } = this
      this.$store.dispatch('auth/resetPasswordUpdate', { uid, otp, password1, password2})
        .then(response => {
          console.log(response)
          this.loading = false
          if (response.status) {
            this.success = true
          } else {
            this.error = response.response
          }
        })
        .catch(error => {
          this.loading = false
          this.error = error
          console.log(error)
        })
    },

    goToLogin() {
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>

<style scoped>
.card {
  width: 550px;
  border: transparent;
  padding: 30px;
  border-radius: 20px;
  margin-top: -100px;
  min-height: 350px;
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
.forgot-link {
  line-height: 1.2;
}
</style>
