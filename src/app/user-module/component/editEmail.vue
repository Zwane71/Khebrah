<template>
  <validation-observer ref="form">
    <form novalidate>
      <base-input
        v-model="email"
        vid="email"
        rules="required|email"
        :disabled="otpSent"
        :placeholder="$t('user.enterNewEmail')"
      ></base-input>

      <base-input type="text" 
        v-if="otpSent" 
        autocomplete="off" 
        vid="otp"
        v-model="otp" 
        rules="required|max:10|min:4" 
        :placeholder="$t('user.enterSentOtpEmail')"/>

      <div class="text-right">
        <base-button 
          class="mr-2"
          :disabled="successStatus"
          type="outline-secondary" 
          @click.prevent="cancel">{{$t('common.cancel')}}</base-button>

        <base-button 
          :loading="loading" 
          v-if="!otpSent"
          type="primary"
          @click.prevent="sendOtp">
          {{ $t('user.sendOtp') }}
        </base-button>
        <base-button 
          :loading="loading" 
          v-else
          type="primary"
          :success="successStatus"
          :success-message="$t('user.updateEmailSuccess')"
          @click.prevent="submit">
          {{ $t('user.updateEmail') }}
        </base-button>
      </div>
    </form>
  </validation-observer>
</template>

<script>
export default {
  data: () => ({
    email: '',
    otp: '',
    otpSent: false,
    loading: false,
    successStatus: false
  }),

  methods: {
    cancel() {
      this.email = ''
      this.otp = ''
      this.otpSent = false
      this.loading = false
      this.$emit('cancel')
      this.$refs.form.reset()
    },
    async sendOtp() {
      const isValid = await this.$refs.form.validate();

      if(!isValid) {
        return
      }
      this.loading = true
      this.$store.dispatch('user/updateEmail', { email: this.email })
        .then(data => {
          this.loading = false
          this.otpSent = true
        })
        .catch(error => {
          this.loading = false
          this.$refs.form.setErrors({
            ...error.response.data
          })
        })
    },
    async submit() {
      const isValid = await this.$refs.form.validate();

      if(!isValid) {
        return
      }
      this.loading = true
      this.$store.dispatch('user/updateEmail', { email: this.email, otp: this.otp })
        .then(data => {
          this.$store.dispatch('user/fetchProfile')
          this.loading = false
          this.successStatus = true
          setTimeout(() => {
            this.successStatus = false
            this.$emit('success')
          }, 1500)
        })
        .catch(error => {
          this.loading = false
          this.$refs.form.setErrors({
            ...error.response.data
          })
        })
    }
  }
}
</script>