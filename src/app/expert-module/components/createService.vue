<template>
  <div>
    <ValidationObserver ref="observer">
      <b-form @submit.prevent="createService">
        <div class="row">
          <div class="col-12 col-md-6 offset-md-3">
            <!-- <div class="form px-4 pt-3"> -->
            <div
              @click="$refs.filepicker.click()"
              :class="{ error: imageError }"
              class="
                image-preview
                border
                rounded
                d-flex
                justify-content-center
                align-items-center
              "
            >
              <input
                @change="handleFile"
                accept="image/png, image/jpeg"
                type="file"
                ref="filepicker"
                class="hidden"
              />
              <div v-if="!image" class="text-center">
                <img src="@/assets/img/icons/add-media.svg" alt="" />
                <div>{{ $t('service.addImage') }}</div>
              </div>
              <img v-else :src="imagePreview" class="preview-image" alt="" />
            </div>

            <div class="text-center" v-if="imageError">
              <small class="text-danger">
                {{ $t('service.imageRequired') }}
              </small>
            </div>

            <base-input
              class="mt-5"
              rules="required"
              v-model="title"
              :placeholder="$t('expert.title')"
              name="title"
            />

            <base-textarea
              rows="4"
              rules="required"
              v-model="description"
              :placeholder="$t('expert.description')"
              name="description"
            />

            <base-select
              :options="allCategories"
              v-model="category"
              rules="required"
              value-field="id"
              :placeholder="$t('common.category')"
              @input="keywords = []"
              :text-field="$store.state.rtl ? 'name_ar' : 'name'"
            />

            <base-multiselect
              v-if="category"
              :options="selectedCategoryKeywords"
              :text-field="$store.state.rtl ? 'name_ar' : 'name'"
              value-field="id"
              v-model="keywords"
            />

            <hr />

            <h5 class="font-weight-bold">
              {{ $t('expert.serviceType') }}
            </h5>
            <br />
            <b-form-group v-slot="{ ariaDescribedby }">
              <b-form-radio-group
                id="radio-group-1"
                v-model="selected"
                :options="radioButtonOptions"
                :aria-describedby="ariaDescribedby"
                name="radio-options"
              ></b-form-radio-group>
            </b-form-group>

            <div
              class="mb-3"
              v-if="selected != 'delivery based service' && selected != null"
            >
              <b-form-checkbox v-model="online">
                {{ $t('expert.online') }}
              </b-form-checkbox>

              <b-form-checkbox v-model="offline">
                {{ $t('expert.offline') }}
              </b-form-checkbox>
            </div>

            <base-select
              :options="durationOptions"
              v-model="duration"
              rules="required"
              :placeholder="$t('service.duration')"
              name="duration"
              v-if="selected === 'duration based service'"
            />

            <base-select
              :options="deliveryOptions"
              v-model="duration"
              rules="required"
              :placeholder="$t('service.duration')"
              name="days"
              v-else
            />

            <base-input
              type="number"
              min="0.000"
              step="0.01"
              rules="required"
              v-model="price"
              :placeholder="$t('expert.price')"
              name="price"
              :end-label="$t('common.kd')"
            />

            <template
              v-if="selected != 'delivery based service' && selected != null"
            >
              <hr />

              <h5 class="font-weight-bold">{{ $t('service.availabilityTitle') }}</h5>
              <div class="text-muted mb-3">
                {{ $t('service.availabilitySubtitle') }}
              </div>

              <base-select
                class="mr-2"
                marginless
                v-model.number="selectedScheduleId"
                :options="schedules"
                text-field="title"
                value-field="id"
              />

              <span class="mt-2 d-inline-block">
                <span class="underline text-primary mr-1" @click="editSchedule">
                  {{ $t('service.editAvailability') }}
                </span>
                {{ $t('common.or') }}
                <span
                  class="underline text-primary ml-1"
                  @click="$refs.availModal.show()"
                >
                  {{ $t('service.addNewAvailability') }}
                </span>
              </span>
            </template>
          </div>
        </div>

        <div class="row mt-5">
          <div class="col text-center">
            <base-button
              type="pill primary"
              :success="successStatus"
              :success-message="$t('common.updateSuccess')"
              :error="errorStatus"
              :error-message="$t('common.failed')"
              :loading="loading"
              loading-text="Please Wait"
            >
              {{ $t('user.save') }}
            </base-button>
          </div>
        </div>
      </b-form>
    </ValidationObserver>

    <base-modal size="large" ref="editScheduleModal">
      <edit-schedule
        :is-only-schedule="schedules.length === 1"
        in-modal
        :schedule="selectedSchedule"
        v-if="selectedSchedule"
        @fetchSchedules="fetchSchedules"
      />
    </base-modal>

    <base-modal ref="availModal" title="Add new availability">
      <validation-observer ref="newAvailForm">
        <form novalidate>
          <base-input
            v-model="newScheduleTitle"
            vid="title"
            rules="required|min:3"
            placeholder="Enter availability name"
          ></base-input>
        </form>
      </validation-observer>
      <template v-slot:footer="{ hide }">
        <base-button type="secondary" @click="hide">
          {{ $t('common.close') }}
        </base-button>
        <base-button
          :loading="newScheduleLoading"
          :success="newScheduleSuccess"
          :error="newScheduleError"
          type="primary"
          @click="createAvailability"
        >
          {{ $t('common.save') }}
        </base-button>
      </template>
    </base-modal>
  </div>
</template>

<script>
import '@/app/base-module/util/validation_rules';
import EditSchedule from '@/app/expert-module/components/editSchedule.vue';
import dayjs from '@/plugins/dayjs';
export default {
  props: {
    custom: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    EditSchedule,
  },

  data() {
    return {
      errorFromApi: false,

      successStatus: false,
      errorStatus: false,
      errorMessage: '',

      loading: false,
      selected: 'delivery based service',
      options: ['list', 'of', 'options'],
      error: null,
      title: null,
      description: null,
      category: null,
      keywords: [],
      online: false,
      offline: false,
      duration: null,
      price: null,
      image: null,
      imagePreview: null,
      imageError: false,

      schedules: [],
      newScheduleTitle: '',
      selectedScheduleId: null,
      scheduleToSelect: null,
      newScheduleLoading: false,
      newScheduleSuccess: false,
      newScheduleError: false,
    };
  },

  watch: {
    selected() {
      this.duration = null;
    },
    schedules(schedules) {
      if (this.scheduleToSelect) {
        if (schedules.find((s) => s.id === this.scheduleToSelect)) {
          this.selectedScheduleId = this.scheduleToSelect;
          this.$nextTick(() => {
            this.editSchedule();
          });
        }
        this.scheduleToSelect = null;
        return;
      }

      if (this.selectedScheduleId) {
        if (schedules.find(s => s.id === this.selectedScheduleId)) {
          return 
        }       
      }

      const schedule = schedules.find((s) => s.default) || schedules[0];
      this.selectedScheduleId = schedule && schedule.id;
    },
  },

  created() {
    this.fetchSchedules();
  },

  computed: {
    user() {
      return this.$store.getters['auth/user'];
    },
    selectedSchedule() {
      if (!this.selectedScheduleId) return null;

      return this.schedules.find((s) => s.id === this.selectedScheduleId);
    },
    allCategories() {
      return this.$store.getters['data/categories'];
    },
    keywordsHash() {
      return this.$store.getters['data/keywordsHash'];
    },
    selectedCategoryKeywords() {
      if (!this.category) return [];

      const selectedCategory = this.allCategories.find(
        (c) => c.id === +this.category
      );
      return selectedCategory.keyword
        .map((id) => this.keywordsHash[id])
        .map((k) => k);
    },
    radioButtonOptions() {
      return [
        {
          text: this.$t('service.deliveryBasedService'),
          value: 'delivery based service',
        },
        {
          text: this.$t('service.timeBasedService'),
          value: 'duration based service',
        },
      ];
    },
    serviceDurations() {
      return this.$store.getters['data/serviceDurations'];
    },
    durationOptions() {
      const result = [];
      const options =
        this.serviceDurations &&
        this.serviceDurations['duration-based-service'];
      for (let option of options['Minutes']) {
        const unit =
          option === 1 ? this.$t('common.minute') : this.$t('common.minutes');
        result.push({ value: option + 'M', text: `${option} ${unit}` });
      }
      for (let option of options['Hours']) {
        const unit =
          option === 1 ? this.$t('common.hour') : this.$t('common.hours');
        result.push({ value: option + 'H', text: `${option} ${unit}` });
      }
      for (let option of options['Days']) {
        const unit =
          option === 1 ? this.$t('common.day') : this.$t('common.days');
        result.push({ value: option + 'D', text: `${option} ${unit}` });
      }
      return result;
    },
    deliveryOptions() {
      const result = [];
      const options =
        this.serviceDurations &&
        this.serviceDurations['delivery-based-service'];
      for (let option of options['Minutes']) {
        const unit =
          option === 1 ? this.$t('common.minute') : this.$t('common.minutes');
        result.push({ value: option + 'M', text: `${option} ${unit}` });
      }
      for (let option of options['Hours']) {
        const unit =
          option === 1 ? this.$t('common.hour') : this.$t('common.hours');
        result.push({ value: option + 'H', text: `${option} ${unit}` });
      }
      for (let option of options['Days']) {
        const unit =
          option === 1 ? this.$t('common.day') : this.$t('common.days');
        result.push({ value: option + 'D', text: `${option} ${unit}` });
      }
      return result;
    },
  },

  methods: {
    async createAvailability() {
      const isValid = await this.$refs.newAvailForm.validate();
      if (!isValid) return;

      this.newScheduleLoading = true;
      const data = {
        title: this.newScheduleTitle,
        timezone: dayjs.tz.guess().toLowerCase(),
        avails: [],
      };
      this.$store
        .dispatch('availability/create', data)
        .then((data) => {
          this.fetchSchedules();
          // this.$emit('fetchSchedules');
          // this.newScheduleSuccess = true;
          // this.newScheduleSuccess = false;
          this.$refs.availModal.hide();
          if (data.id) this.scheduleToSelect = data.id;
          // setTimeout(() => {
          //   this.newScheduleSuccess = false;
          //   this.$refs.availModal.hide();
          // }, 1500);
        })
        .catch((e) => {
          console.log(e);
          this.newScheduleError = true;
          setTimeout(() => {
            this.newScheduleError = false;
          }, 1500);
        })
        .finally(() => {
          this.newScheduleLoading = false;
        });
    },
    editSchedule() {
      this.$refs.editScheduleModal.show();
    },

    fetchSchedules() {
      this.$store
        .dispatch('availability/fetchAvailability')
        .then((data) => {
          this.schedules = data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    resetError() {
      this.errorFromApi = false;
    },

    handleFile() {
      const picker = this.$refs.filepicker;

      if (picker.files && picker.files[0]) {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.imageError = false;
          this.image = picker.files[0];
          this.imagePreview = e.target.result;
        };

        reader.readAsDataURL(picker.files[0]);
      }
    },

    async createService() {
      const isValid = await this.$refs.observer.validate();

      // if (!this.image) {
      //   this.imageError = true
      //   return
      // }

      if (!isValid) {
        this.scrollToFirstError();
        return;
      }

      this.loading = true;

      let data = {
        category: this.category,
        description: this.description,
        delivery_date: '2021-12-04',
        duration: this.duration.slice(0, -1),
        duration_in: this.duration.slice(-1),
        offline: this.offline,
        online: this.online,
        ordered: false,
        price: parseInt(this.price),
        user: this.user.pk,
        service_name: this.title,
        service_type: this.selected,
        // schedule: this.selectedScheduleId,
        // tags: this.keywords,
      };

      if (this.selected === 'duration based service') {
        data.schedule = this.selectedScheduleId
      }

      if (this.custom) {
        data.custom = true;
      }

      const fd = new FormData();

      for (let [key, value] of Object.entries(data)) {
        fd.append(key, value);

        if (this.image) {
          fd.append('service_img', this.image);
        }
      }

      this.$store
        .dispatch('services/createService', fd)
        .then((data) => {
          this.loading = false;
          this.$store.dispatch('services/updateService', {
            id: data.id,
            data: { tags: this.keywords },
          });
          this.successStatus = true;
          setTimeout(() => {
            this.successStatus = false;
            this.$emit('create', data);
          }, 1500);
        })
        .catch((error) => {
          const data = error.response.data;
          this.loading = false;

          this.errorStatus = true;
          if (data.user && data.user === 'service_limit_exceeded') {
            this.errorMessage = this.$t('service.limitExceeded');
          } else if (data.user && data.user === 'no_active_plan') {
            this.errorMessage = this.$t('service.noActivePlan');
          } else {
            this.errorMessage = this.$t('service.addFail');
          }
          setTimeout(() => (this.errorStatus = false), 1500);

          this.errorFromApi = true;
        });
    },
    updateService(id) {
      this.$store.dispatch('services/updateService', fd);
    },
  },
};
</script>

<style scoped>
.description-control {
  display: block;
  width: 100%;

  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.margin-left-negative {
  margin-left: -5px;
}
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
  /* border-radius: 10px; */
}
.country-code {
  margin-bottom: 12px;
  /* border-radius: 10px; */
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

.primary-color {
  color: #044982 !important;
}
.warning {
  color: red;
}
.image-preview {
  width: 100%;
  height: 175px;
  background: #f8f8f8;
  cursor: pointer;
}
.image-preview.error {
  border-color: #dc3545 !important;
}
.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.hidden {
  display: none;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
