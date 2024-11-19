<template>
  <base-layout>
    <div class="row">
      <div class="col-10 offset-1">
          <div class="base-box px-5" v-if="page">
            <h1 class="primary-color text-center py-3">
              {{ title }}
            </h1>

            <div class="content mt-3" v-html="content"></div>

            <div class="row mt-5" v-if="isContactPage && !success">
              <div class="col-md-8 offset-md-2">
                <validation-observer ref="form">
                  <form class="needs-validation" novalidate 
                    @submit.prevent="submit"
                  >
                    <base-input 
                      rules="required"
                      vid="name"
                      v-model="message.name"
                      :label="$t('contact.name')"
                      :placeholder="$t('contact.namePlaceholder')" />

                    <div class="row">
                      <div class="col-sm-12 col-md-6">
                        <base-input 
                          rules="required|email"
                          vid="email"
                          v-model="message.email"
                          :label="$t('contact.email')"
                          :placeholder="$t('contact.emailPlaceholder')" />
                      </div>

                      <div class="col-sm-12 col-md-6">
                        <base-input 
                          rules="required"
                          vid="mobile"
                          type="tel"
                          v-model="message.mobile"
                          :label="$t('contact.mobile')"
                          :placeholder="$t('contact.mobilePlaceholder')" />
                      </div>
                    </div>

                    <base-textarea 
                      rules="required"
                      vid="message"
                      v-model="message.message"
                      :label="$t('contact.message')"
                      :placeholder="$t('contact.messagePlaceholder')" />

                    <vue-recaptcha @verify="verify" @expired="verified = false" :language="$i18n.locale" ref="recaptcha" :sitekey="sitekey" />

                    <div class="text-center my-4">
                      <base-button
                        type="primary lg pill"
                        :disabled="!verified"
                        :success="success"
                        :error="error"
                        :loading="loading">
                        {{ $t("contact.submit") }}
                      </base-button>
                    </div>
                  </form>
                </validation-observer>
              </div>
            </div>
            <div v-else-if="isContactPage" ref="successMessage" class="row my-5 py-5">
              <div class="col-md-8 offset-md-2">
                <p class="text-success">{{$t('contact.successMessage')}}</p>
              </div>
            </div>
          </div>
      </div>
    </div>
  </base-layout>
</template>

<script>
import store from '@/store'
import { VueRecaptcha } from 'vue-recaptcha'

export default {
  components: { VueRecaptcha },
  data: () => ({
    page: null,
    loading: false,
    message: {},
    verified: false,
    success: false,
    error: false
  }),

  metaInfo() {
    const meta = {
      meta: [
        { name: 'description', content: this.description }
      ]
    }
    if (this.title) meta.title = `${ this.title } | Khebrah`
    return meta
  },

  computed: {
    title() {
      if (!this.page) return ''
      return this.enLang ? this.page.content.title : this.page.content.title_ar
    },
    content() {
      if (!this.page) return ''
      return this.enLang ? this.page.content.content : this.page.content.content_ar
    },
    description() {
      if (!this.page) return ''
      return this.enLang ? this.page.content.description : this.page.content.description_ar
    },
    isContactPage() {
      if (!this.page) return false
      return this.page.slug === 'contact-us'
    },
    sitekey() {
      return process.env.VUE_APP_RECAPTCHA_KEY
    }

  },

  methods: {
    async submit() {
      const isValid = await this.$refs.form.validate();

      if(!isValid) {
        this.scrollToFirstError()
        return
      }

      if(!this.verified) return

      this.loading = true
      this.$store.dispatch('user/submitContactForm', this.message)
        .then(data => {
          this.loading = false
          this.success = true
          this.message = {}
          this.$nextTick(() => {

            this.$refs.successMessage.scrollIntoView({ block: 'center', behavior: 'smooth'})
          })
        })
        .catch(error => {
          this.error = true
          this.loading = false
          this.$refs.form.setErrors({
            ...error.response.data
          })
        })

    },
    verify(response) {
      this.verified = true
    }
  },

  beforeRouteEnter(to, from, next) {
    if (!to.params.slug) {
      next({ path: '/404' })
      return
    }
    store.dispatch('data/fetchPage', to.params.slug)
      .then(data => {
        next(vm => vm.page = data)
      })
      .catch(error => {
        next({ path: '/404' })
      })
  },

  beforeRouteUpdate(to, from, next) {
    if (from.params.slug === to.params.slug) return next()
    if (!to.params.slug) {
      next({ path: '/404' })
      return
    }
    store.dispatch('data/fetchPage', to.params.slug)
      .then(data => {
        this.page = data
        next()
      })
      .catch(error => {
        next({ path: '/404' })
      })
  },
}
</script>

<style scoped>
 .content /deep/ p {
   margin-bottom: 1rem;
 }

</style>