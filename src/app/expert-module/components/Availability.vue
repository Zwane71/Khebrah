<template>
  <div>
    <div>
      <div class="row border rounded px-2 py-4">
        <div class="col-12 col-lg-6">
          <h5 class="">{{ $t('settings.leadTime') }}</h5>
          <p class="text-muted mb-2">
            {{ $t('settings.leadTimeDescription') }}
          </p>
        </div>
        <div class="col-12 col-lg-6">
          <div class="row">
            <div class="col">
              <base-input v-model="leadTime" />
            </div>
            <div class="col">
              <base-select v-model="leadUnit" :options="leadUnitOptions" />
            </div>
          </div>
        </div>
        <div class="col-12 text-md-right text-center pt-2">
          <base-button
            @click="updateLeadTime"
            :success="leadSuccess"
            :success-message="$t('common.updateSuccess')"
            type="pill primary"
            :loading="leadLoading"
          >
            {{ $t('settings.updateLeadTime') }}
          </base-button>
        </div>
      </div>

      <h5 class="mt-5">{{$t('availability.availabilitiesTitle')}}</h5>
      <span class="text-muted">
        {{$t('availability.availabilitiesSubtitle')}}
      </span>

      <div class="d-flex justify-content-between mt-3 align-items-center">
        <div class="d-flex align-items-center">
          <base-select
            class="mr-2"
            marginless
            v-model.number="selectedScheduleId"
            :options="schedules"
            text-field="title"
            value-field="id"
          />
        </div>
        <base-button type="outline-secondary" @click="$refs.availModal.show()">
          <i class="fas fa-plus mr-2"></i>
          {{$t('availability.newAvailability')}}
        </base-button>
      </div>

      <edit-schedule :is-only-schedule="schedules.length === 1" class="mt-4" :schedule="selectedSchedule" v-if="selectedSchedule" @fetchSchedules="$emit('fetchSchedules')" />
        
    </div>

    <base-modal ref="availModal" :title="$t('availability.addNew')">
      <validation-observer ref="newAvailForm">
        <form novalidate>
          <base-input
            v-model="newScheduleTitle"
            vid="title"
            rules="required|min:3"
            :placeholder="$t('availability.titlePlaceholder')"
          ></base-input>
        </form>
      </validation-observer>
      <template v-slot:footer="{ hide }">
        <base-button type="secondary" @click="hide">
          {{ $t('common.close') }}
        </base-button>
        <base-button
          :loading="loading"
          :success="successStatus"
          :error="errorStatus"
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
import dayjs from '@/plugins/dayjs';
import EditSchedule from '@/app/expert-module/components/editSchedule.vue'

export default {
  components: {
    EditSchedule
  },
  props: {
    schedules: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      successStatus: false,
      errorStatus: false,

      leadTime: null,
      leadUnit: 'hours',
      leadLoading: false,
      leadSuccess: false,
      leadUnitOptions: [
        { text: this.$t('common.hours'), value: 'hours' },
        { text: this.$t('common.days'), value: 'days' },
      ],

      newScheduleTitle: '',
      scheduleToSelect: null,
      selectedScheduleId: null,
    };
  },
  watch: {
    schedules(schedules) {
      if (this.scheduleToSelect) {
        if (schedules.find((s) => s.id === this.scheduleToSelect))
          this.selectedScheduleId = this.scheduleToSelect;
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

    '$store.state.user.profile': {
      handler(value) {
        if (!value || !value.lead_time) {
          this.leadTime = 0;
          this.leadUnit = 'hours';
          return;
        }
        const minutesInDay = 1440;
        if (value.lead_time % minutesInDay === 0) {
          this.leadUnit = 'days';
          this.leadTime = value.lead_time / minutesInDay;
        } else {
          this.leadUnit = 'hours';
          this.leadTime = value.lead_time / 60;
        }
      },
      immediate: true,
    },
  },
  computed: {
    selectedSchedule() {
      if (!this.selectedScheduleId) return null

      return this.schedules.find(s => s.id === this.selectedScheduleId)
    },
    user() {
      return this.$store.getters['auth/user'];
    },
  },
  methods: {
    updateLeadTime() {
      this.leadLoading = true;
      const leadTime =
        this.leadUnit === 'hours'
          ? this.leadTime * 60
          : this.leadTime * 60 * 24;
      this.$store
        .dispatch('user/updateProfile', { lead_time: leadTime })
        .then(() => {
          this.leadLoading = false;
          this.leadSuccess = true;
          this.$store.dispatch('user/fetchProfile');
          setTimeout(() => {
            this.leadSuccess = false;
          }, 1500);
        })
        .catch((e) => {
          this.leadLoading = false;
        });
    },
    async createAvailability() {
      const isValid = await this.$refs.newAvailForm.validate();
      if (!isValid) return;

      this.loading = true;
      const data = {
        title: this.newScheduleTitle,
        timezone: dayjs.tz.guess().toLowerCase(),
        avails: [],
      };
      this.$store
        .dispatch('availability/create', data)
        .then((data) => {
          this.loading = false;
          console.log(data);
          this.$emit('fetchSchedules');
          if (data.id) this.scheduleToSelect = data.id;
          this.successStatus = true;
          setTimeout(() => {
            this.successStatus = false;
            this.$refs.availModal.hide();
          }, 1500);
        })
        .catch((e) => {
          console.log(e);
          this.errorStatus = true;
          setTimeout(() => {
            this.errorStatus = false;
          }, 1500);
          this.loading = false;
        });
    },
  },
};
</script>
<style scoped>
.blue-btn-small {
  color: #fff !important;
  background-color: #044982;
  border: 0;
  padding: 10px 35px;
  margin-bottom: 5px;
  white-space: nowrap;

  margin-right: 10px;
}
</style>
