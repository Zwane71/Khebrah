<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-6 offset-md-3 pt-4 px-md-5 pb-3">
        <ValidationObserver ref="form">
          <b-form
            @submit.prevent="next"
          >
            <div class="d-flex flex-column align-items-center text-center">
              <input @change="handleFile" accept="image/png, image/jpeg" type="file" ref="filepicker" class="hidden">
              <div class="avatar" @click.prevent="$refs.filepicker.click()" :class="{ error: avatarError }">
                <img :src="profileImageSrc" alt="">
              </div>

              <div class="text-center">
                <small class="text-danger" v-if="avatarError">
                  {{$t('user.profilePicRequired')}}
                </small>
              </div>
            </div>
            <div class="text-center mt-3 mb-5">
              <base-button type="outline-primary pill" @click.prevent="$refs.filepicker.click()">
                {{$t('user.uploadProfilePic')}}
                <!-- PLAN: {{ data.plan.plan_name.toUpperCase() }} -->
              </base-button>
            </div>

            <div class="detail-box mt-3 mb-3 p-3 d-flex justify-content-between align-items-center">
              <div>
                {{$t('common.plan').toUpperCase()}}: {{ data.plan.new_subscription.plan_name.toUpperCase() }}
                <div>
                  <small>{{data.plan.new_subscription.price.months }} {{ monthText }}</small>
                </div>
              </div>
              <h5 class="mb-0">
                {{ data.plan.new_subscription.price.price > 0 ? parseFloat(data.plan.new_subscription.price.price).toFixed(3) + ' ' + $t('common.kd') : $t("user.free") }}
              </h5>
            </div>

              <base-input 
                vid="username"
                rules="required|min:5|username"
                mode="lazy"
                v-model="profile.username"
                :placeholder="$t('user.userName')" />

                <small class="text-muted username-label">
                  {{ $t('user.descriptionUserName') }}
                </small>

              <base-input 
                rules="required|max:30"
                vid="title"
                v-model="profile.title"
                :placeholder="$t('user.title')" />

              <!-- <base-ckeditor 
                vid="description"
                rules="required" 
                v-model="profile.description"
                :placeholder="$t('user.describe')" /> -->

              <!-- <base-textarea 
                vid="description"
                rules="required|max:500"
                v-model="profile.description"
                :placeholder="$t('user.describe')" /> -->
              <base-select 
                vid="exp_since"
                rules="required"
                :options="yearList"
                v-model="profile.exp_since"
                :placeholder="$t('user.experience')" />

              <base-multiselect
                vid="language"
                rules="required"
                :options="languages"
                v-model="profile.language"
                :label="$t('user.languages')" />

              <base-input 
                rules="required|max:150"
                vid="offered_services"
                v-model="profile.offered_services"
                :label="$t('user.offeredServicesLabel')"
                :placeholder="$t('user.offeredServicesPlaceholder')" />
              <!-- <div class="section border-top pt-3 mt-3">
                <h5>Bank Details</h5>

                <div class="row">
                  <div class="col">
                    <base-input 
                      vid="iban"
                      rules="required|iban"
                      v-model="profile.iban"
                      placeholder="Enter your IBAN" />
                  </div>
                </div>
              </div> -->

            <div class="d-flex justify-content-between">
              <base-button
                type="outline-secondary pill"
                @click="back">
                {{ $t("user.back") }}
              </base-button>

              <base-button
                type="primary pill"
                @click="next">
                {{ $t("user.next") }}
              </base-button>
            </div>

          </b-form>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
import "@/app/base-module/util/validation_rules";
// import BaseCkeditor from '@/components/base/BaseCkeditor.vue'

export default {
  // components: {
  //   BaseCkeditor
  // },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      profile: {
        avatar: null,
        avatarPreview: null
      },
      avatarError: false,
    };
  },
  watch: {
    data: {
      handler (value) {
        this.profile = {...this.profile, ...value }
      },
      immediate: true
    }
  },

  computed: {
    languages() {
      return this.$store.getters['data/languages'].map(c => ({ value: c.id, text: this.enLang ? c.name : c.name_ar }))
    },
    profileImageSrc() {
      if (this.profile.avatarPreview) return this.profile.avatarPreview
      return require('@/assets/img/icons/avatar.svg')
    },

    yearList() {
      let currentYear = new Date().getFullYear();

      let toYear = currentYear - 50;

      let years = [];

      for (let index = 0; index < 50; index++) {
        years.push({
          value: (currentYear - index).toString(),
          text: (currentYear - index).toString(),
        });
      }

      return years.reverse();
    },
    monthText() {
      return this.data && this.data.plan && parseInt(this.data.plan.new_subscription.price.months) === 1
        ? this.$t('common.month')
        : this.$t('common.months')
    }
  },

  methods: {
    checkUsername() {
      if (!this.profile.username) rerurn
      this.$store.dispatch('user/checkUsername', this.profile.username)
        .then(response => {
          console.log(response)
        })
        .catch(error => console.log(error))
    },
    handleFile() {
      const picker = this.$refs.filepicker

      if (picker.files && picker.files[0]) {
        const reader = new FileReader()

        reader.onload = (e) => {
          this.avatarError = false
          this.profile.avatar = picker.files[0]
          this.profile.avatarPreview = e.target.result
        }

        reader.readAsDataURL(picker.files[0])
      }
    },

    async next() {
      const isValid = await this.$refs.form.validate();

      if (!this.profile.avatar) {
        this.avatarError = true
        this.scrollToFirstError('.error')
        return
      }

      if(!isValid) {
        this.scrollToFirstError()
        return
      }

      let data = {
        username: this.profile.username,
        title: this.profile.title,
        description: this.profile.description,
        exp_since: this.profile.exp_since,
        language: this.profile.language.map(i => +i),
        offered_services: this.profile.offered_services || '',
        // iban: this.profile.iban,
        avatar: this.profile.avatar,
        avatarPreview: this.profile.avatarPreview
      };

      this.$emit("setData", data);
    },

    back() {
      this.$emit("back");
    },

    resetError() {
      this.errorFromApi = false;
    },
  },
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
  min-height: 300px;
  width: 450px;
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
  height: 1200px;
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
.hidden {
  display: none;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}
.avatar img {
  object-fit: cover;
  object-position: center center;
  width: 100%;
  height: 100%;
}
.avatar.error {
  border: 2px solid #ed5c31;
}
.username-label {
  display: inline-block;
  line-height: 1.25;
  position: relative;
  top: -10px;
  max-width: 70%;
}
.detail-box {
  background: #f8f8f8;
  border-radius: 10px;
  border: 1px solid #e5e5e5;
}
@media (max-width: 768px) {
  .detail-box {
    font-size: 14px;
  }
  .detail-box h5 {
    font-size: 18px;
  }
}
/* .plan-info {
  pointer-events: none;
} */
</style>
