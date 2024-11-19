<template>
  <base-layout>
    <div class="row" v-if="emailVerified">
      <div class="col-lg-6 offset-lg-3 col-md-10 offset-md-1 col-sm-12">
        <div class="base-box" v-if="!success">
          <h2 class="text-center primary-color pb-3 pt-3">{{$t('user.register')}}</h2>

          <validation-observer immediate ref="form" v-slot="{ handleSubmit }">
            <form class="needs-validation px-4 pt-5" novalidate @submit.prevent="handleSubmit(submit)">
              <base-input autocomplete="username" type="email" :value="email" rules="required|email" vid="email" disabled :placeholder="$t('user.enterYourEmail')"/>

              <base-input autocomplete="new-password" type="password" v-model="password1" rules="required|min:8" vid="password1"  :placeholder="$t('user.password')"/>
              <base-input autocomplete="new-password" type="password" v-model="password2" rules="required|min:8|confirmed:password1" vid="password2" :placeholder="$t('user.confirmPassword')"/>

              <div class="text-center mb-2" v-if="error">
                <small class="text-danger">{{ error }}</small>
              </div>
              <base-button type="primary block text-uppercase" :loading="loading">{{$t('user.register')}}</base-button>
            </form>
          </validation-observer>
        </div>
      </div>
    </div>
    <emailNotVerified v-else></emailNotVerified>
  </base-layout>
</template>
<script>
import store from '@/store'
import EmailNotVerified from "@/app/user-module/component/emailNotVerified.vue"

export default {

  components: {
    EmailNotVerified
  },

  data: () => ({
    loading: false,
    email: '',
    password1: '',
    password2: '',
    error: null,
    success: false,
    emailVerified: false
  }),

  beforeRouteEnter(to, from, next) {
    const { number, email } = to.params
    if (!number || !email) return

    const data = {
      auth_id: email,
      otp: number
    }
    store.dispatch('auth/verifyEmail', data)
      .then(data => {
          const { verified, status } = data
          if (status === true) {
            next(vm => {
              vm.emailVerified = true;
              vm.email = email;
            })
            return
          } else if(status === false && verified === true) {
            next({ name: 'Login' })
          } else {
            next(vm => {
              vm.emailVerified = false
            })
          }
      })
      .catch((err) => {
        next(vm => {
          vm.emailVerified = false
        })
      });
  },

  methods: {
    submit() {
      this.loading = true
      this.error = ''

      let data = {
        email: this.email,
        password1: this.password1,
        password2: this.password2,
      };

      this.$store.dispatch('auth/register', data)
        .then(response => {
          this.loading = false
          this.$router.push({ name: 'CreateProfile' })
        })
        .catch(error => {
          this.loading = false
          // this.error = error
          this.$refs.form.setErrors({
            ...error.response.data
          })
        })

    },
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
