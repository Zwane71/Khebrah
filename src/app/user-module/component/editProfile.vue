<template>
  <div class="mt-3">
    <validation-observer immediate ref="form">
      <form class="needs-validation" novalidate @submit.prevent="submit">
        <div class="section pb-3">
          <h5>{{$t('user.basicProfile')}}</h5>
          <div class="row">
            <div class="col-12 col-sm-6">
              <base-input 
                rules="required"
                v-model="profile.firstName"
                :label="$t('user.firstName')" />
            </div>
            <div class="col-12 col-sm-6">
              <base-input 
                rules="required"
                v-model="profile.lastName"
                :label="$t('user.lastName')" />
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-sm-6">
              <base-input 
                vid="email"
                rules="required|email"
                v-model="profile.email"
                disabled
                :label="$t('user.email')" />
              <div class="text-accent account-action" @click="showEmailModal">
                {{ $t('user.editEmail') }}
              </div>
            </div>
            <div class="col-12 col-sm-6 mobile-number">
              <base-input 
                type="tel"
                vid="mobile"
                disabled
                v-model="profile.phone"
                :label="$t('user.mobile')" />
              <div class="text-accent account-action" @click="showMobileModal">
                {{ user && user.mobile ? $t('user.editNumber') : $t('user.addNumber') }}
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-sm-6">
              <base-select 
                :options="genderOptions"
                v-model="profile.gender"
                :label="$t('user.gender')" />
            </div>
            <div class="col-12 col-sm-6">
              <base-select 
                :options="countries"
                v-model.number="profile.country"
                :label="$t('user.location')" />
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-sm-6">
              <base-multiselect
                :options="keywords"
                v-model="profile.interests"
                :label="$t('user.interests')" />
            </div>
          </div>
        </div>
        <div class="section border-top pt-4 pb-3" v-if="isExpert">
          <h5>{{$t('user.expertProfile')}}</h5>
          <div class="row mb-4">
            <div class="col-12">
              <div class="d-flex">
                <input @change="handleFile" accept="image/png, image/jpeg" type="file" ref="filepicker" class="hidden">
                <div class="avatar">
                  <img :src="profileImageSrc" alt="">
                </div>
                <button 
                  class="btn btn-outline-primary btn-pill ml-3" 
                  @click.prevent="$refs.filepicker.click()">
                  {{$t('user.uploadProfilePic')}}
                </button>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-sm-6">
              <base-input 
                vid="username"
                rules="required|min:5|username"
                mode="lazy"
                v-model="profile.username"
                :label="$t('user.userName')" />
            </div>
            <div class="col-12 col-sm-6">
              <base-input 
                rules="required|max:30"
                vid="title"
                mode="aggressive"
                v-model="profile.title"
                :label="$t('user.titleLabel')" />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <base-ckeditor 
                rules="required" 
                v-model="profile.description"
                :label="$t('user.description')" />

              <!-- <base-textarea 
                rules="required"
                v-model="profile.description"
                :label="$t('user.description')" /> -->
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-sm-6">
              <base-select 
                rules="required"
                :options="yearList"
                v-model="profile.experience"
                :label="$t('user.experience')" />
            </div>
            <div class="col-12 col-sm-6">
              <base-multiselect
                vid="language"
                rules="required"
                :options="languages"
                v-model="profile.language"
                :label="$t('user.languages')" />
            </div>
            <!-- <div class="col-12 col-sm-6">
              <base-select 
                :options="categories"
                v-model="profile.categories[0]"
                :label="$t('user.industry')" />
            </div> -->
          </div>
        </div>

        <div class="section border-top pt-4 pb-3" v-if="isExpert">
          <h5>{{$t('user.bannerImage')}}</h5>
          <div class="banner-image" :style="{ backgroundImage: 'url(' + profile.bannerImg + ')' }">
            <input @change="handleBannerFile" accept="image/png, image/jpeg" type="file" ref="bannerpicker" class="hidden">
            <base-button type="secondary lg" @click="$refs.bannerpicker.click()">
              {{$t('user.uploadNewBanner')}}
            </base-button>
          </div>
        </div>
        <div class="section border-top py-4" v-if="isExpert && profile.gallery">
          <h5>{{$t('user.gallery')}}</h5>

          <div class="row">
            <div class="col-6 col-sm-4 col-md-3 mb-3 position-relative" v-for="item in profile.gallery.slice(0, 5)" :key="item.id">
              <div 
                @click="editGalleryItem(item)"
                class="gallery-preview border rounded">
                  <img v-if="item.image" class="preview-image" :src="item.image" alt="">
                  <div class="video-preview" v-else-if="item.youtube_link">
                    <youtube :resize="true" :width="200" :video-id="getVideoId(item.youtube_link)" />
                  </div>
              </div>
              <div class="gallery-remove" @click="removeGalleryItem(item)">
                <i class="fas fa-times"></i>
              </div>
            </div>
            <div class="col-6 col-sm-4 col-md-3" v-if="profile.gallery.length < 5">
              <div @click="addGalleryItem" class="gallery-preview border rounded">
                <div class="text-center" >
                  <img width=50 src="@/assets/img/icons/add-media.svg" alt="">
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="section border-top pt-4" v-if="isExpert && profile">
          <h5>{{$t('user.socialProfiles')}}</h5>
          <div class="row" dir="ltr">
            <div class="col-12 col-md-6">
              <div class="d-flex align-items-center">
                <span class="mb-2">facebook.com/</span>
                <base-input 
                  class="grow"
                  v-model="profile.socialLinks.facebook" />
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="d-flex align-items-center">
                <span class="mb-2">linkedin.com/in/</span>
                <base-input 
                  class="grow"
                  v-model="profile.socialLinks.linkedin" />
              </div>
            </div>
          </div>
          <div class="row" dir="ltr">
            <div class="col-12 col-md-6">
              <div class="d-flex align-items-center">
                <span class="mb-2">instagram.com/</span>
                <base-input 
                  class="grow"
                  v-model="profile.socialLinks.instagram" />
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="d-flex align-items-center">
                <span class="mb-2">twitter.com/</span>
                <base-input 
                  class="grow"
                  v-model="profile.socialLinks.twitter" />
              </div>
            </div>
          </div>
        </div>

        <div class="section border-top pt-4" v-if="isExpert">
          <h5>{{$t('user.bankDetails')}}</h5>

          <div class="row">
            <div class="col-12">
              <base-input 
                rules="iban"
                v-model="profile.iban"
                :label="$t('user.iban')" />
            </div>
          </div>
        </div>

        <div class="row mt-5">
          <div class="col text-center relative">
            <base-button 
              type="pill success"
              :success="successStatus"
              :success-message="$t('user.profileSuccess')"
              :error="errorStatus"
              :error-message="$t('user.profileFail')"
              :loading="loading" 
              :loading-text="$t('common.pleaseWait')"> 
                {{ $t('user.save') }}
            </base-button>
          </div>
        </div>
      </form>
    </validation-observer>

    <base-modal 
      ref="emailModal"
      :title="$t('user.editEmail')">
      <edit-email @success="hideEmailModal" @cancel="hideEmailModal" />
    </base-modal>

    <base-modal 
      ref="mobileModal"
      :title="user && user.mobile ? $t('user.editNumber') : $t('user.addNumber')">
      <edit-mobile @success="hideMobileModal" @cancel="hideMobileModal"/>
    </base-modal>

    <base-modal 
      ref="arabicModal"
      :title="$t('user.editInArabic')">
      <validation-observer immediate ref="formAr">
        <form class="needs-validation" novalidate @submit.prevent>
          <div class="row">
            <div class="col-12 col-sm-6">
              <base-input 
                v-model="profile.firstNameAr"
                :label="$t('user.firstName')" />
            </div>
            <div class="col-12 col-sm-6">
              <base-input 
                v-model="profile.lastNameAr"
                :label="$t('user.lastName')" />
            </div>
          </div>
          <div class="row" v-if="isExpert">
            <div class="col-12">
              <base-input 
                rules="max:30"
                vid="title"
                v-model="profile.titleAr"
                :label="$t('user.titleLabel')" />
            </div>
            <div class="col-12">
              <base-ckeditor 
                v-model="profile.descriptionAr"
                :label="$t('user.description')" />
            </div>
          </div>
        </form>
      </validation-observer>
      <template v-slot:footer="{ hide }">
        <base-button :disabled="loading" type="secondary" @click="hide">{{$t('common.close')}}</base-button>
        <base-button 
          @click="submitAr"
          type="success"
          :success="successStatus"
          :success-message="$t('user.profileSuccess')"
          :error="errorStatus"
          :error-message="$t('user.profileFail')"
          :loading="loading" 
          :loading-text="$t('common.pleaseWait')"> 
            {{ $t('user.save') }}
        </base-button>
      </template>
    </base-modal>

    <base-modal
      ref="galleryModal"
      :title="$t('user.editGallery')">

      <div class="mb-2 d-flex justify-content-center">
        <span class="mr-3 tab-label" @click="setGalleryTab('image')" :class="{ active: galleryTab=== 'image'}">{{$t('common.image')}}</span>
        <span class="tab-label" @click="setGalleryTab('video')" :class="{ active: galleryTab=== 'video'}">{{$t('common.youtube')}}</span>
      </div>

      <div class="gallery-preview" v-if="galleryTab === 'image'">
        <input @change="handleGalleryFile" accept="image/png, image/jpeg" type="file" ref="gallerypicker" class="hidden">

        <div v-if="!galleryImage && !galleryItem.image" class="text-center" @click="$refs.gallerypicker.click()">
          <img width=50 src="@/assets/img/icons/add-media.svg" alt="">
        </div>
        <img v-else-if="galleryImagePreview" :src="galleryImagePreview" class="preview-image"  @click="$refs.gallerypicker.click()">
        <img v-else-if="galleryItem.image" :src="galleryItem.image" class="preview-image"  @click="$refs.gallerypicker.click()">
      </div>
    
      <div v-else>
        <base-input @input="galleryError = null" placeholder="Enter youtube link" v-model="galleryItem.youtube_link"/>
      </div>

      <div class="text-center mt-2" v-if="galleryError">
        <small class="text-danger">
          {{ galleryError }}
        </small>
      </div>

      <div class="row mt-3">
        <div class="col text-center">
          <base-button 
            @click.prevent="saveGalleryItem"
            :loading="galleryLoading"
            :success="gallerySuccess"
            :success-message="$t('user.updateSuccess')"
            type="pill primary" >
            {{$t('user.save')}}
          </base-button>
        </div>
      </div>
    </base-modal>

    <base-modal
      size="large"
      ref="bannerModal"
      :title="$t('user.updateBannerImage')"
      >
      <cropper 
        :stencil-props="{aspectRatio: 4/1 }"
        :src="newBanner"
        ref="cropper" />

      <p class=" my-2 text-muted">
        {{ $t('user.recommendedBanner') }}
      </p>

      <template v-slot:footer>
        <base-button type="secondary" @click="hideBannerModal">{{$t('common.close')}}</base-button>
        <base-button type="success" :loading="bannerLoading" :error="bannerError" :success="bannerSuccess" @click="updateBanner">{{$t('common.update')}}</base-button>
      </template>

    </base-modal>

  </div>
</template>
<script>
import EditEmail from '@/app/user-module/component/editEmail.vue'
import EditMobile from '@/app/user-module/component/editMobile.vue'
import BaseCkeditor from '@/components/base/BaseCkeditor.vue'
import loadImage from 'blueimp-load-image'

import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

export default {
  components: {
    Cropper,
    EditEmail,
    EditMobile,
    BaseCkeditor
  },

  data() {
    return {
      profile: {},
      newAvatar: null,
      newAvatarPreview: null,
      loading: false,
      successStatus: false,
      errorStatus: false,
      galleryTab: 'image',
      galleryImage: null,
      galleryImagePreview: null,
      galleryItem: {},
      galleryError: null,
      galleryLoading: false,
      gallerySuccess: false,

      bannerLoading: false,
      bannerSuccess: false,
      bannerError: false,
      newBanner: null,
    }
  },

  watch: {
    '$store.state.user.profile': {
      handler(value) {
        if (!value) {
          this.profile = {}
          return
        }
        const { 
          first_name: firstName, 
          last_name: lastName,
          first_name_ar: firstNameAr, 
          last_name_ar: lastNameAr,
          profile_img: profileImg,
          gender,
          title,
          title_ar: titleAr,
          country,
          description,
          description_ar: descriptionAr,
          iban,
          gallery,
          banner_img: bannerImg,
          // categories = [],
          // keywords,
          interests,
          language,
          exp_since: experience,
          social_links: socialLinks
        } = value || {}
        this.profile = {
          firstName,
          lastName,
          firstNameAr,
          lastNameAr,
          profileImg,
          bannerImg,
          gender,
          country,
          title,
          titleAr,
          gallery,
          // categories,
          description,
          descriptionAr,
          experience,
          // keywords,
          interests,
          language,
          iban,
          socialLinks: socialLinks || {},
          phone: this.user.mobile,
          username: this.user.username,
          email: this.user.email
        }

      },
      immediate: true
    },
    '$store.state.auth.user': {
      handler(value) {
        if (!value) {
          this.profile = {}
          return
        }
        this.profile.phone = value.mobile
        this.profile.username = value.username
        this.profile.email = value.email
      },
    }
  },

  computed: {
    keywords() {
      return this.$store.getters['data/keywords'].map(c => ({ value: c.id, text: this.enLang ? c.name : c.name_ar }))
    },
    languages() {
      return this.$store.getters['data/languages'].map(c => ({ value: c.id, text: this.enLang ? c.name : c.name_ar }))
    },
    // categories() {
    //   return this.$store.getters['data/categories'].map(c => ({ value: c.id, text: c.name }))
    // },
    countries() {
      return this.$store.getters['data/countries']
        .map(c => ({ value: c.id, text: this.enLang ? c.name : c.name_ar }))
    },
    user() {
      return this.$store.getters['auth/user']
    },
    isExpert() {
      return this.$store.getters['auth/isExpert']
    },
    yearList() {
      let currentYear = new Date().getFullYear();

      let toYear = currentYear - 100;

      let years = [];

      for (let index = 0; index < 100; index++) {
        years.push({
          value: (currentYear - index).toString(),
          text: (currentYear - index).toString(),
        });
      }

      return years.reverse();
    },
    profileImageSrc() {
      if (this.newAvatarPreview) return this.newAvatarPreview
      else if(this.profile && this.profile.profileImg) return this.profile.profileImg
      return require('@/assets/img/icons/avatar.svg')
    },
    genderOptions() {
      return [
        { value: "M", text: this.$t('user.male') },
        { value: "F", text: this.$t('user.female') },
      ]
    }
  },

  methods: {
    setGalleryTab(tab) {
      this.galleryError = null
      this.galleryTab = tab
    },
    showArabicModal() {
      this.$refs.arabicModal.show()
    },
    hideArabicModal() {
      this.$refs.arabicModal.hide()
    },
    showEmailModal() {
      this.$refs.emailModal.show()
    },
    showMobileModal() {
      this.$refs.mobileModal.show()
    },
    showBannerModal() {
      this.$refs.bannerModal.show()
    },
    hideBannerModal() {
      this.$refs.bannerModal.hide()
    },
    hideEmailModal() {
      this.$refs.emailModal.hide()
    },
    hideMobileModal() {
      this.$refs.mobileModal.hide()
    },
    removeGalleryItem(item) {
      this.$store.dispatch('experts/deleteGalleryItem', item.id)
        .then(data => {
          this.$store.dispatch('user/fetchProfile')
        })
    },
    editGalleryItem(item) {
      this.galleryItem = item
      if (item.youtube_link) {
        this.galleryTab = 'video'
      } else {
        this.galleryTab = 'image'
      }
      this.$refs.galleryModal.show()
    },
    addGalleryItem() {
      this.galleryItem = {}
      this.galleryImage = null
      this.galleryImagePreview = null
      this.galleryTab = 'image'
      this.$refs.galleryModal.show()
    },
    saveGalleryItem() {

      let fd = new FormData()

      if (this.galleryTab === 'image') {
        if (!this.galleryImage) {
          this.galleryError = this.$t('inputRules.imageRequired')
          return
        }
        fd.append('image', this.galleryImage)
      } else if(this.galleryTab === 'video') {
        if(!this.getVideoId(this.galleryItem.youtube_link)) {
          this.galleryError = this.$t('inputRules.invalidYoutube')
          return
        }
        fd = { youtube_link: this.galleryItem.youtube_link }
      }

      this.galleryLoading = true

      if (this.galleryItem.id) {
        this.$store.dispatch('experts/updateGalleryItem',{ id: this.galleryItem.id, data: fd })
          .then(data => {
            this.$store.dispatch('user/fetchProfile')
            this.galleryLoading = false

            this.gallerySuccess = true
            setTimeout(() => {
              this.gallerySuccess = false
              this.$refs.galleryModal.hide()
            }, 1500)
          })
          .catch(e => {
            this.galleryLoading = false
          })
      } else if(this.profile.gallery.length < 5) {
        this.$store.dispatch('experts/addGalleryItem', fd)
          .then(data => {
            this.$store.dispatch('user/fetchProfile')
            this.galleryLoading = false

            this.gallerySuccess = true
            setTimeout(() => {
              this.gallerySuccess = false
              this.$refs.galleryModal.hide()
            }, 1500)
          })
          .catch(e => {
            this.galleryLoading = false
          })
      }
    },
    handleFile() {
      const picker = this.$refs.filepicker

      if (picker.files && picker.files[0]) {

        loadImage(picker.files[0], img => {
          img.toBlob(blob => {
            this.newAvatar = new File([blob], picker.files[0].name, { type: picker.files[0].type })
          }, picker.files[0].type)
        }, { orientation: true, canvas: true })

        const reader = new FileReader()

        reader.onload = (e) => {
          //this.newAvatar = picker.files[0]
          this.newAvatarPreview = e.target.result
        }

        reader.readAsDataURL(picker.files[0])
      }
    },
    handleBannerFile() {
      const picker = this.$refs.bannerpicker

      if (picker.files && picker.files[0]) {
        const reader = new FileReader()

        reader.onload = (e) => {
          this.newBanner = e.target.result
          setTimeout(() => {
            this.showBannerModal()
          }, 300)
        }

        reader.readAsDataURL(picker.files[0])
      }
    },
    handleGalleryFile() {
      const picker = this.$refs.gallerypicker

      if (picker.files && picker.files[0]) {
        const reader = new FileReader()

        reader.onload = (e) => {
          this.galleryImage = picker.files[0]
          this.galleryImagePreview = e.target.result
          this.galleryError = null
        }

        reader.readAsDataURL(picker.files[0])
      }
    },
    async submitAr() {
      const isValid = await this.$refs.formAr.validate();

      if(!isValid) {
        this.scrollToFirstError()
        return
      }

      this.loading = true

      const {
        firstNameAr, 
        lastNameAr,
        titleAr,
        descriptionAr,
      } = this.profile

      const profiledata = {
        first_name_ar: firstNameAr,
        last_name_ar: lastNameAr,
      }

      if (this.isExpert) {
        profiledata.title_ar = titleAr
        profiledata.description_ar = descriptionAr
      }

      this.updateProfile(profiledata)
    }, 
    async submit() {
      const isValid = await this.$refs.form.validate();

      if(!isValid) {
        this.scrollToFirstError()
        return
      }

      const { 
        username, 
        email, 
        phone: mobile, 
        firstName, 
        lastName,
        title,
        description,
        gender,
        language,
        // categories,
        country,
        // keywords,
        interests,
        iban,
        experience 
      } = this.profile

      const userdata = {
        username,
        // email,
        // mobile,
      }

      const profiledata = {
        first_name: firstName,
        last_name: lastName,
        country,
        // keywords: keywords.map(k => +k),
        interests: interests.map(i => +i),
        gender,
      }

      const socialData = {
        ...this.profile.socialLinks,
      }

      delete socialData.id
      delete socialData.user

      if (this.isExpert) {
        Object.assign(profiledata, {
          title,
          description,
          // categories: categories.map(c => +c),
          iban,
          language: language.map(i => +i),
          exp_since: experience
        })
      }


      this.loading = true

      this.$store.dispatch('user/updateUser', userdata)
        .then(response => {
          if (this.isExpert && this.newAvatar) {
            const fd = new FormData()
            fd.append('profile_img', this.newAvatar)

            this.$store.dispatch('user/updateProfile', fd)
              .then(response => {
                this.$store.dispatch('user/updateSocialLinks', socialData)
                  .then(() => {
                    this.updateProfile(profiledata)
                  }).catch(error => {
                    this.loading = false
                    this.errorStatus = true
                    setTimeout(() => this.errorStatus = false, 1500)
                  })
              }).catch(error => {
                this.loading = false
                this.errorStatus = true
                setTimeout(() => this.errorStatus = false, 1500)
              })

          } else {
            this.$store.dispatch('user/updateSocialLinks', socialData)
              .then(() => {
                this.updateProfile(profiledata)
              }).catch(error => {
                this.loading = false
                this.errorStatus = true
                setTimeout(() => this.errorStatus = false, 1500)
              })
          }
        })
        .catch(error => {
          this.loading = false
          this.errorStatus = true
          setTimeout(() => this.errorStatus = false, 1500)
          // const { username, email, title, mobile, non_field_errors } = error.response.data
          this.$refs.form.setErrors({
            ...error.response.data
          })
        })
    },
    updateBanner() {
      const { canvas } = this.$refs.cropper.getResult()
      if (canvas) {
        this.bannerLoading = true
        const fd = new FormData()
        canvas.toBlob(blob => {
          fd.append('banner_img', blob)
          this.$store.dispatch('user/updateProfile', fd)
            .then(response => {
              this.bannerLoading = false
              this.bannerSuccess = true
              this.$store.dispatch('user/fetchProfile')
              setTimeout(() => {
                this.bannerSuccess = false
                this.hideBannerModal()
              }, 1500)
            }).catch(e => {
              this.bannerLoading = false
              this.bannerError = true
              setTimeout(() => this.bannerError = false, 1500)
              console.log(e)
            })
        }, 'image/jpeg')
      }

    },
    updateProfile(data) {
      this.$store.dispatch('user/updateProfile', data)
        .then(response => {
          this.loading = false
          this.newAvatarPreview = null
          this.newAvatar = null
          this.$store.dispatch('user/fetchProfile')
          this.successStatus = true
          setTimeout(() => this.successStatus = false, 1500)
        })
        .catch(error => {
          console.log(error.response.data)
          this.newAvatarPreview = null
          this.newAvatar = null
          this.loading = false
          this.errorStatus = true
          setTimeout(() => this.errorStatus = false, 1500)
        })
    },
    getVideoId(url) {
      return this.$youtube.getIdFromUrl(url)
    }
  }
}
</script>
<style scoped>
.submit-btn {
  /* background-color: #1eba24; */
  border-radius: 20px;
  padding: 10px 90px;
  text-transform: uppercase;
}
.section h5 {
  margin-bottom: 20px;
}
.btn-pill {
  border-radius: 20px;
  margin: 0 3px;
  padding: 5px 35px;
}
.btn-outline-primary {
  color: #044982; 
  border-color: #044982;
}
.btn-outline-primary:hover {
  color: #fff; 
  background-color: #044982;
}
.hidden {
  display: none;
}
.avatar {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  overflow: hidden;
}
.avatar img {
  object-fit: cover;
  object-position: center center;
  width: 100%;
  height: 100%;
}
.account-action {
  position: absolute;
  right: 15px;
  top: 5px;
  font-size: 14px;
  cursor: pointer;
}
.rtl .account-action {
  right: unset;
  left: 15px;
} 
.gallery-preview {
  width: 100%;
  height: 175px;
  background: #eee;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}
.gallery-remove {
  position: absolute;
  top: -10px;
  right: 0px;
  border-radius: 50%;
  padding: 10px;
  background: #dc3545;
  color: #fff;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1001;
}
.gallery-remove {
  right: unset;
  left: 15px;
}
.gallery-preview img {
  object-fit: cover;
  object-position: center center;
  width: 100%;
  height: 100%;
}
.tab-label {
  font-size: 18px;
  cursor: pointer;
}
.tab-label.active {
  color: #044982;
}
.video-preview {
  position: relative;
}
.video-preview::after {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 999;
  content: '';
  background: rgba(0,0,0,0.3)

}
.banner-image {
  width: 100%;
  height: 0px;
  padding-top: 25%;
  border-radius: 10px;
  overflow: hidden;
  background-size: cover;
  position: relative;
}
.banner-image .btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%)
}

@media (max-width: 768px) {
  .banner-image {
    padding-top: 33%;
  }
}

</style>