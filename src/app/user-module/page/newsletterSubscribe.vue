<template>
  <base-layout>
    <div class="row">
        <div
        class="col-lg-6 offset-lg-3 col-sm-12"
        >
        <div class="base-box py-5 d-flex flex-column justify-content-center align-items-center">
            <div
            class="header-logo d-flex justify-content-center align-items-center"
            v-if="success"
            >
            <img src="@/assets/img/success.svg" alt="" class="header-logo" />
            </div>

            <p class="text-primary pb-4 text-center py-3" v-if="success">
              {{ $t(`settings.${type}Success`) }}
            </p>
            <p class="text-primary pb-4 text-center py-3" v-else>
              {{ $t(`settings.${type}Fail`) }}
            </p>

            <base-button to="/" class="mt-5" type="primary pill lg">
              <i class="fas fa-arrow-left mr-2 rtl-icon"></i> {{ $t('home.backToHome') }}
            </base-button>
            <!-- <h6>
            {{ $t("user.verifyAgain") }}
            <span
                class="primary-color font-weight-bold py-3"
                role="button"
                @click="navigateToSignUp"
            >
                {{ $t("user.resend") }}</span
            >
            </h6> -->
        </div>
        </div>
    </div>
  </base-layout>
</template>
<script>
import store from '@/store'
export default {

  data: () => ({
    success: false,
    email: '',
    type: 'subscribe'
  }),

  beforeRouteEnter(to, from, next) {
    const { otp, email } = to.params
    if (!otp || !email) next({ path: '/404' })

    const data = {
      auth_id: email,
      otp
    }
    let type = 'subscribe'
    if (to.matched.some(record => record.meta.type === 'unsubscribe')) {
      console.log('matched')
      type = 'unsubscribe'
    }

    console.log(type)

    store.dispatch('user/confirmNewsletterSubscription', data)
      .then(data => {
          store.dispatch('user/fetchProfile')
          const { verified } = data
          if (verified === true) {
            next(vm => {
              vm.success = true;
              vm.email = email;
              vm.type= type
            })
            return
          } else {
            next(vm => {
              vm.success = false
              vm.type= type
            })
          }
      })
      .catch((err) => {
        console.log(err)
        console.log('in catch')
        next(vm => {
          vm.success = false
          vm.type= type
        })
      })

  },
}
</script>


