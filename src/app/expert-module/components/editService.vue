<template>
  <div>
    <ValidationObserver ref="observer">
      <b-form
        slot-scope="{ validate }"
        @submit.prevent="validate().then(updateService)"
      >
        <div class="row">
          <div class="col-12 col-md-6 offset-md-3">
            <div
              @click="$refs.filepicker.click()"
              class="
                image-preview
                border
                rounded
                mb-5
                d-flex
                justify-content-center
                align-items-center
              "
            >
              <input
                @change="handleFile"
                accept="image/*"
                type="file"
                ref="filepicker"
                class="hidden"
              />
              <div v-if="!serviceImage && !image" class="text-center">
                <img src="@/assets/img/icons/add-media.svg" alt="" />
                <div>{{ $t('service.addImage') }}</div>
              </div>
              <img
                v-else-if="imagePreview"
                :src="imagePreview"
                class="preview-image"
                alt=""
              />
              <img
                v-else-if="serviceImage"
                :src="serviceImage"
                class="preview-image"
                alt=""
              />
            </div>

            <base-input
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
              step="0.001"
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
                  class="ml-1 underline text-primary"
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
import { mapGetters, mapActions } from 'vuex';
import EditSchedule from '@/app/expert-module/components/editSchedule.vue';
import dayjs from '@/plugins/dayjs';

export default {
  components: {
    EditSchedule,
  },

  data() {
    return {
      errorFromApi: false,

      successStatus: false,
      errorStatus: false,

      loading: false,
      selected: null,
      options: ['list', 'of', 'options'],
      error: null,
      title: '',
      description: '',
      category: null,
      keywords: [],
      online: false,
      offline: false,
      duration: null,
      serviceImage: null,
      price: 0,
      id: 0,

      image: null,
      imagePreview: null,

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
    selected(to, from) {
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
    const id = this.$route.params.id;
    this.fetchSchedules();
    this.$store.dispatch('services/getService', id).then((service) => {
      this.title = service.service_name;
      this.id = service.id;
      this.description = service.description;
      this.selected = service.service_type;
      this.online = service.online;
      this.offline = service.offline;
      this.price = service.price;
      this.category = service.category;
      this.keywords = service.tags;
      if (service.schedule) this.selectedScheduleId = service.schedule
      this.$nextTick(() => {
        this.duration = service.duration + service.duration_in;
      });
      this.serviceImage = service.service_img;
    });
  },

  computed: {
    ...mapGetters({
      currentService: 'currentServiceDetails',
    }),
    selectedSchedule() {
      if (!this.selectedScheduleId) return null;

      return this.schedules.find((s) => s.id === this.selectedScheduleId);
    },
    user() {
      return this.$store.getters['auth/user'];
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
          this.$refs.availModal.hide();
          if (data.id) this.scheduleToSelect = data.id;
          // this.newScheduleSuccess = true;
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
    resetError() {
      this.errorFromApi = false;
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

    handleFile() {
      const picker = this.$refs.filepicker;

      if (picker.files && picker.files[0]) {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.image = picker.files[0];
          this.imagePreview = e.target.result;
        };

        reader.readAsDataURL(picker.files[0]);
      }
    },

    async updateService() {
      const isValid = await this.$refs.observer.validate();

      if (!isValid) {
        this.scrollToFirstError();
        return;
      }

      this.loading = true;

      let data = {
        service_type: this.selected,
        online: this.online,
        offline: this.offline,
        both_on_off: this.online == true && this.offline == true ? true : false,
        service_name: this.title,
        description: this.description,
        duration: this.duration.slice(0, -1),
        duration_in: this.duration.slice(-1),
        price: this.price,
        user: this.user.pk,
        // tags: this.keywords,
        category: this.category,
        ordered: false,
      };

      if (this.selected === 'duration based service') {
        data.schedule = this.selectedScheduleId
      }

      const fd = new FormData();

      for (let [key, value] of Object.entries(data)) {
        fd.append(key, value);

        if (this.image) {
          fd.append('service_img', this.image);
        }
      }

      this.$store
        .dispatch('services/updateService', { id: this.id, data: fd })
        .then((response) => {
          this.$store
            .dispatch('services/updateService', {
              id: this.id,
              data: { tags: this.keywords },
            })
            .then(() => {
              this.loading = false;
              this.successStatus = true;
              setTimeout(() => {
                this.successStatus = false;
                this.$router.push({ name: 'services' });
              }, 1500);
            })
            .catch((error) => {
              this.loading = false;
              this.errorStatus = true;
              setTimeout(() => (this.errorStatus = false), 1500);

              this.errorFromApi = true;
            });
        })
        .catch((error) => {
          this.loading = false;
          this.errorStatus = true;
          setTimeout(() => (this.errorStatus = false), 1500);

          this.errorFromApi = true;
        });
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
