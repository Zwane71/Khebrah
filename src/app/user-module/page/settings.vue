<template>
  <div>
    <dashboard-header :title="$t('dashboard.settings')" />

    <div class="row">
      <div class="col-12 col-md-6 offset-md-3">
        <div class="section border-bottom p-3">
          <validation-observer immediate ref="form" v-slot="{ handleSubmit }">
            <form class="needs-validation" novalidate @submit.prevent="handleSubmit(submit)">
              <h5 class="text-center">{{ $t('settings.updatePwd') }}</h5>
              <div class="row">
                <div class="col">
                  <base-input 
                    type="password"
                    rules="required"
                    vid="old_password"
                    :placeholder="$t('settings.currentPwd')"
                    v-model="currentPassword"
                      />
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <base-input 
                    type="password"
                    vid="new_password1"
                    rules="required"
                    :placeholder="$t('settings.newPwd')"
                    v-model="password"
                      />
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <base-input 
                    type="password"
                    vid="new_password2"
                    rules="required"
                    v-model="confirmPassword"
                    :placeholder="$t('settings.newPwdAgain')"
                      />
                </div>
              </div>
              <div class="row mt-3">
                <div class="col text-center relative">
                  <base-button 
                    :success="successStatus"
                    :success-message="$t('settings.pwdSuccess')"
                    type="pill primary" 
                    :loading="loading">
                    {{ $t('settings.updatePwd') }}
                  </base-button>
                </div>
              </div>
            </form>
          </validation-observer>
        </div>

        <div class="section p-3 border-bottom">
          <h5 class="text-center">{{ $t('settings.connectTitle') }}</h5>
          <social-connect-buttons :providers="socialConnectProviders" />
        </div>

        <div class="section p-3 border-bottom">
          <h5 class="text-center">{{ $t('settings.connectCalendar') }}</h5>
          <social-connect-buttons :providers="calendarConnectProviders" />
        </div>

        <div class="section p-3" v-if="user.email">
          <h5 class="text-center">{{ $t('settings.newsletter') }}</h5>

          <div v-if="subscribeMessageSent" class="text-success text-center">
            {{ $t('settings.subscribeEmailSuccess') }}
          </div>
          <div v-else-if="unsubscribeMessageSent" class="text-success text-center">
            {{ $t('settings.unsubscribeEmailSuccess') }}
          </div>
          <base-button 
            @click="subscribe"
            type="primary block" 
            :loading="newsletterLoading"
            :success="newsletterSuccess"
            :success-message="$t('settings.subscribeEmailSuccess')"
            v-else-if="!user.subscribed_newsletter">
            {{ $t('settings.subscribeToNewsletter') }}
          </base-button>
          <base-button
            @click="unsubscribe"
            :loading="newsletterLoading"
            :success="newsletterSuccess"
            :success-message="$t('settings.unsubscribeSuccess')"
            type="secondary block" v-else-if="!subscribeMessageSent">
            {{ $t('settings.unsubscribeNewsletter') }}
          </base-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import SocialConnectButtons from '@/app/user-module/component/SocialConnectButtons.vue'

export default {
  components: {
    DashboardHeader,
    SocialConnectButtons
  },
  data() {
    return {
      loading: false,
      currentPassword: '',
      password: '',
      confirmPassword: '',
      successStatus: false,
      newsletterLoading: false,
      newsletterSuccess: false,
      subscribeMessageSent: false,
      unsubscribeMessageSent: false,
      socialConnectProviders: [
        { name: 'Google', icon: 'google.png', id: 'google' },
        { name: 'Linkedin', icon: 'linkedin.png', id: 'linkedin' },
        { name: 'Twitter', icon: 'twitter.svg', id: 'twitter' },
        { name: 'Facebook', icon: 'facebook.png', id: 'facebook' },
      ],
      calendarConnectProviders: [
        { name: 'Google Calendar', icon: 'calendar.png', id: 'gcal' },
      ]
    }
  },

  metaInfo: {
    title: 'Settings'
  },


  computed: {
    user() {
      return this.$store.getters['auth/user']
    },
  },

  methods: {
    submit() {
      this.loading = true

      const data = {
        old_password: this.currentPassword,
        new_password1: this.password,
        new_password2: this.confirmPassword
      }

      this.$store.dispatch('user/updatePassword', data)
        .then(response => {
          this.loading = false
          this.currentPassword = ''
          this.password = ''
          this.confirmPassword = ''
          this.successStatus = true

          this.$nextTick(() => {
            this.$refs.form.reset()
          })

          setTimeout(() => {
            this.successStatus = false
          }, 1500);
        })
        .catch(error => {
          this.loading = false
          this.$refs.form.setErrors({
            ...error.response.data
          })
        })
    },
    subscribe() {
      this.newsletterLoading = true
      this.$store.dispatch('user/subscribeToNewsletter', this.user.email)
        .then((data) => {
          this.newsletterLoading = false
          // this.newsletterSuccess = true
          this.subscribeMessageSent = true

          // setTimeout(() => {
          //   this.$store.dispatch('user/fetchProfile')
          //     .then(() => {
          //       this.newsletterSuccess = false
          //     })
          // }, 1000)
        })
        .catch(e => {
          this.newsletterLoading = false
        })


    },
    unsubscribe() {
      this.newsletterLoading = true
      this.$store.dispatch('user/unsubscribeNewsletter', this.user.email)
        .then((data) => {
          this.newsletterLoading = false
          // this.newsletterSuccess = true
          this.unsubscribeMessageSent = true

          // setTimeout(() => {
          //   this.$store.dispatch('user/fetchProfile')
          //   .then(() => {
          //     this.newsletterSuccess = false
          //   })
          // }, 1000)
        })
        .then(e => {
          this.newsletterLoading = false
        })

    }
  }
};
</script>

<style scoped>
form {
  padding: 10px;
}
.submit-btn {
  /* background-color: #1eba24; */
  border-radius: 20px;
  padding: 10px 90px;
  text-transform: uppercase;
}
.section h5 {
  margin-bottom: 20px;
}
.status-container {
  position: absolute;
  left: 0;
  margin-top:-30px;
  width: 100%
}
</style>