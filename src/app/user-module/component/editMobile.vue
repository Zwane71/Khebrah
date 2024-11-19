<template>
  <validation-observer ref="form">
    <form novalidate>

      <div class="row no-gutters mobile" dir="ltr">
        <div class="col-3 country-select-container">
          <vue-tel-input
            default-country="KW"
            :dropdown-options="dropdownOptions"
            :input-options="inputOptions"
            style-classes="country-select form-control"
            :preferredCountries="['KW', 'SA']" 
            @country-changed="onCountrySelect"
          />
          </div>
        <div class="col-9">
          <base-input
            v-model="mobile"
            v-mask="'###############'"
            vid="mobile"
            rules="required|min:8|max:15"
            type="tel"
            :disabled="otpSent"
            :placeholder="$t('user.enterNewMobile')"
          ></base-input>
        </div>

      </div>

      <base-input type="text" 
        v-if="otpSent" 
        autocomplete="off" 
        vid="otp"
        v-model="otp" 
        rules="required|max:10|min:4" 
        :placeholder="$t('user.enterSentOtpMobile')"/>

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
          :success-message="$t('user.updateMobile')"
          @click.prevent="submit">
          {{ $t('user.updateMobile') }}
        </base-button>
      </div>
    </form>
  </validation-observer>
</template>

<script>
import { VueTelInput } from 'vue-tel-input'
export default {
  components: {
    VueTelInput
  },
  data: () => ({
    mobile: '',
    otp: '',
    countryCode: '',
    otpSent: false,
    loading: false,
    successStatus: false,
    windowWidth: window.innerWidth,
    inputOptions: {
      styleClasses: 'hidden'
    }
  }),

  mounted() {
    window.addEventListener('resize', this.onResize)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },

  computed: {
    dropdownOptions() {
      return {
        showFlags: true,
        showSearchBox: true,
        showDialCodeInList: this.windowWidth > 420 ? true : false,
        showDialCodeInSelection: this.windowWidth > 420 ? true : false,
        width: this.windowWidth > 420 ? '390px' : '290px',
      }
    }
  },

  methods: {
    onResize() {
      this.windowWidth = window.innerWidth
    },
    cancel() {
      this.mobile = ''
      this.otp = ''
      this.otpSent = false
      this.loading = false
      this.$emit('cancel')
      this.$refs.form.reset()
    },
    onCountrySelect({ dialCode }) {
      this.countryCode = "+" + dialCode;
    },
    async sendOtp() {
      const isValid = await this.$refs.form.validate();

      if(!isValid) {
        return
      }
      this.loading = true
      this.$store.dispatch('user/updateMobile', { mobile: this.countryCode + this.mobile })
        .then(data => {
          this.loading = false
          this.otpSent = true
        })
        .catch(error => {
          this.loading = false
          if (!error.response || !error.response.data) return
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
      this.$store.dispatch('user/updateMobile', { mobile: this.countryCode + this.mobile, otp: this.otp })
        .then(data => {
          this.$store.dispatch('user/fetchProfile')
            .then(() => {
              this.loading = false
              this.successStatus = true
              setTimeout(() => {
                this.successStatus = false
                this.$emit('success')
              }, 1500)
            })
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

<style src="vue-tel-input/dist/vue-tel-input.css"></style>

<style scoped>
.country-select {
  border-radius: 10px !important;
  display: flex;
  justify-content: center;
}
.country-select /deep/ .vti__selection {
  font-size: 16px;
}
.country-select /deep/ .vti__selection .vti__country-code {
  color: #495057 !important;
}
.country-select-container {
  padding-right: 10px !important;
}
/* form {
  direction: ltr !important;
  text-align: left !important;
} */
/* .rtl .country-code /deep/ .dropdown-list {
  direction: ltr;
  left: unset;
  right: -1px;
} */
.mobile /deep/ .was-validated .form-control:invalid, 
.mobile /deep/ .was-validated .form-control:valid, 
.mobile /deep/ .form-control.is-invalid, 
.mobile /deep/ .form-control.is-valid {
  background-position: right calc(0.375em + 0.1875rem) center;
}

.mobile /deep/ .was-validated .form-control:invalid, 
.mobile /deep/ .was-validated .form-control:valid, 
.mobile /deep/ .form-control.is-valid,
.mobile /deep/ .form-control.is-invalid {
  padding-left: 0.75em;
  padding-right: calc(1.5em + 0.75em);
}
</style>