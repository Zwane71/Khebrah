<template>
  <div>
    <h3>{{ schedule.title }}</h3>
    <div class="d-flex mt-2">
      <span v-if="isDefaultSchedule">
        {{ $t('availability.defaultAvailability') }}
      </span>
      <span
        class="text-primary underline"
        :class="{ 'disabled-action': defaultLoading }"
        @click="setAsDefault"
        v-else
      >
        {{ $t('availability.setAsDefault') }}
      </span>
      <span
        v-if="defaultLoading"
        class="spinner-border spinner-border-sm ml-2"
        role="status"
        aria-hidden="true"
      ></span>
      <span class="text-primary underline ml-3" @click="editTitle">
        {{ $t('availability.editTitle') }}
      </span>
      <span
        class="text-primary underline ml-3"
        v-if="!isOnlySchedule"
        @click="$refs.deleteModal.show()"
      >
        <i class="fas fa-trash"></i>
      </span>
    </div>

    <div class="d-flex justify-content-between mt-4 align-items-center">
      <div v-if="view === 'list'" class="tabs">
        <base-button
          :type="tabClass('hours')"
          class="mr-2"
          @click="setTab('hours')"
        >
          {{ $t('availability.weeklyHours') }}
        </base-button>
        <base-button :type="tabClass('overrides')" @click="setTab('overrides')">
          {{ $t('availability.dateOverrides') }}
        </base-button>
      </div>
      <div v-else />
      <div class="d-none d-xl-block">
        <base-button
          :type="viewClass('list')"
          class="mr-2"
          @click="setView('list')"
        >
          <i class="fas fa-list mr-1"></i>
          {{ $t('availability.list') }}
        </base-button>
        <base-button :type="viewClass('calendar')" @click="setView('calendar')">
          <i class="fas fa-calendar mr-1"></i>
          {{ $t('availability.calendar') }}
        </base-button>
      </div>
    </div>

    <div class="border border-dashed rounded mt-2" v-if="view === 'calendar'">
      <div>
        <v-calendar
          class="custom-calendar max-w-full"
          :masks="vcalendar.masks"
          title-position="left"
          :min-date="new Date()"
          :key="vcalendar.attributes.length"
          :attributes="vcalendar.attributes"
          :first-day-of-week="1"
          disable-page-swipe
          is-expanded
        >
          <template v-slot:day-content="{ day, attributes }">
            <div class="h-100 day-content" @click="onDayClick(day)">
              <div>{{ day.day }}</div>
              <div class="mt-1 text-muted">
                <span v-for="(attribute, i) in attributes" :key="i">
                  <small
                    class="d-block calendar-entry"
                    v-for="(slot, i) in attribute.customData.slots"
                    :key="i"
                  >
                    <template v-if="slot.from_time && slot.to_time && i < 3">
                      {{ slot.from_time }} &ndash; {{ slot.to_time }}
                    </template>
                    <template
                      v-else-if="slot.from_time && slot.to_time && i === 3"
                    >
                      <span class="font-weight-bold text-primary">
                        + {{ attribute.customData.slots.length - 3 }}
                        {{ $t('common.more') }}
                      </span>
                    </template>
                  </small>
                </span>
              </div>
            </div>
          </template>
        </v-calendar>
      </div>
    </div>

    <div
      class="
        border border-dashed
        rounded
        px-2
        py-2
        mt-2
        bg-white
        list-view-wrapper
      "
      v-else-if="tab === 'hours'"
    >
      <div
        class="row position-relative rounded border-bottom px-2 py-4"
        v-for="(availability, index) in allAvailability"
        :key="index"
        style="margin-top: 6px"
      >
        <div
          class="copy-button pointer"
          @click="showCopyModal(availability)"
          :title="$t('availability.copyToAll')"
        >
          <i class="far fa-copy"></i>
        </div>
        <div class="col-md-3 mb-2" style="">
          <div class="text-primary" style="padding-top: 6px">
            <b-form-checkbox
              :key="index"
              :id="`checkbox-1${index}`"
              v-model="allAvailability[index].status"
              :name="`checkbox-1${index}`"
            >
              {{ $t(`availability.${availability.day.toLowerCase()}`) }}
            </b-form-checkbox>
          </div>
        </div>
        <div class="col-md">
          <div
            class="row"
            style="padding-bottom: 6px"
            v-for="(slot, slotIndex) in availability.slots"
            :key="slotIndex"
          >
            <div class="col-xl-7 col-lg-8 col-md-10 col-sm-10 col-12">
              <div class="row">
                <div class="col-6 mb-2 px-2">
                  <base-timepicker
                    :placeholder="$t('availability.startTime')"
                    @input="validateSlot(slot, availability)"
                    :has-error="slot.error && slot.error.type === 'conflict'"
                    v-model="slot.from_time"
                  />
                </div>
                <div class="col-6 mb-2 px-2">
                  <base-timepicker
                    :placeholder="$t('availability.endTime')"
                    @input="validateSlot(slot, availability)"
                    :has-error="!!slot.error"
                    v-model="slot.to_time"
                  />
                </div>
                <div class="col-12" v-if="slot.error">
                  <small class="text-danger">
                    {{ slot.error.message }}
                  </small>
                </div>
              </div>
            </div>
            <div class="col d-flex align-items-center">
              <a role="button">
                <span class="minus-dark" @click="addTimeSlot(availability)">
                  <i class="fas fa-plus"></i>
                </span>
              </a>
              <a
                role="button"
                class="warning pl-3"
                v-if="slotIndex > 0 || availability.slots.length > 1"
              >
                <span
                  class="minus-dark"
                  @click="removeTimeSlot(slotIndex, availability)"
                >
                  <i class="fas fa-minus"></i>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="
        border border-dashed
        rounded
        px-2
        py-2
        mt-2
        bg-white
        list-view-wrapper
      "
      v-else-if="tab === 'overrides'"
    >
      <div class="row rounded border-bottom px-2 py-4">
        <div class="col">
          <base-button type="outline-primary" @click="onDayClick">
            {{ $t('availability.addOverride') }}
          </base-button>
        </div>
      </div>
      <div
        class="row position-relative rounded border-bottom px-2 py-4"
        v-for="(date, key) in allOverrides"
        :key="key"
        style="margin-top: 6px"
      >
        <div class="col-md-3 mb-2" style="">
          <div class="text-primary">
            {{ formatDate(key) }}
          </div>
        </div>
        <div class="col-md-5">
          <div
            class="row"
            style="padding-bottom: 6px"
            v-for="(item, index) in date"
            :key="index"
          >
            <div class="col">
              {{ formatTime(item.from_time) }} -
              {{ formatTime(item.to_time) }}
            </div>
          </div>
        </div>
        <div class="col">
          <base-button type="outline-secondary" @click="removeOverride(key)">
            <i class="fas fa-trash"></i>
          </base-button>
        </div>
      </div>
    </div>

    <div v-if="view === 'list'" class="text-center mt-3">
      <base-button
        type="primary pill"
        class="mt-4"
        :loading="loading && !isOverriding"
        :success="successStatus && !isOverriding"
        :error="errorStatus && !isOverriding"
        :success-message="$t('availability.updateSuccess')"
        :error-message="$t('availability.updateFail')"
        @click="updateAvailability()"
      >
        {{ $t('common.update') }}
      </base-button>
    </div>

    <base-modal
      v-if="dateToOverride"
      :nested="inModal"
      ref="overrideModal"
      :title="$t('availability.setSpecificHours')"
    >
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5>{{ formatDate(dateToOverride.date) }}</h5>
        <base-button
          type="outline-secondary sm"
          :title="$t('availability.resetToWeekly')"
          @click="resetOverrides()"
        >
          <!-- Reset to Weekly Hours -->
          <i class="fas fa-undo"></i>
        </base-button>
      </div>

      <v-calendar
        @dayclick="onDayClick"
        class="mb-3"
        :attributes="overrideCalendar.attributes"
        :min-date="new Date()"
        :first-day-of-week="1"
        is-expanded
      ></v-calendar>

      <div
        class="row"
        style="padding-bottom: 6px"
        v-for="(slot, slotIndex) in dateToOverride.slots"
        :key="slotIndex"
      >
        <div class="col-lg-8 col-md-10 col-sm-10 col-12">
          <div class="row">
            <div class="col-6 mb-2 px-2">
              <base-timepicker
                :placeholder="$t('availability.startTime')"
                @input="validateSlot(slot, dateToOverride)"
                :has-error="slot.error && slot.error.type === 'conflict'"
                v-model="slot.from_time"
              />
            </div>
            <div class="col-6 mb-2 px-2">
              <base-timepicker
                :placeholder="$t('availability.endTime')"
                @input="validateSlot(slot, dateToOverride)"
                :has-error="!!slot.error"
                v-model="slot.to_time"
              />
            </div>
            <div class="col-12" v-if="slot.error">
              <small class="text-danger">
                {{ slot.error.message }}
              </small>
            </div>
          </div>
        </div>
        <div class="col d-flex align-items-center">
          <a role="button">
            <span class="minus-dark" @click="addTimeSlot(dateToOverride)">
              <i class="fas fa-plus"></i>
            </span>
          </a>
          <a role="button" class="warning pl-3">
            <span
              class="minus-dark"
              @click="removeTimeSlot(slotIndex, dateToOverride)"
            >
              <i class="fas fa-minus"></i>
            </span>
          </a>
        </div>
      </div>

      <template v-slot:footer="{ hide }">
        <base-button type="secondary" @click="hide">
          {{ $t('common.close') }}
        </base-button>
        <base-button
          :loading="loading"
          :success="successStatus"
          :error="errorStatus"
          type="primary"
          @click="saveOverride"
        >
          {{ $t('common.save') }}
        </base-button>
      </template>
    </base-modal>

    <base-modal
      :nested="inModal"
      ref="titleModal"
      title="Edit availability title"
    >
      <validation-observer ref="editTitleForm">
        <form novalidate>
          <base-input
            v-model="newTitle"
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
          :loading="titleLoading"
          :success="titleSuccess"
          :error="titleError"
          type="primary"
          @click="saveTitle"
        >
          {{ $t('common.save') }}
        </base-button>
      </template>
    </base-modal>

    <base-modal
      :nested="inModal"
      ref="deleteModal"
      :title="$t('availability.deletePrompt')"
    >
      <template v-slot:footer="{ hide }">
        <base-button :disabled="deleteLoading" type="secondary" @click="hide">
          {{ $t('common.close') }}
        </base-button>
        <base-button
          :loading="deleteLoading"
          type="danger"
          :success="deleteSuccess"
          :success-message="$t('availability.deleteSuccess')"
          @click="deleteAvailability()"
        >
          {{ $t('availability.deleteConfirmation') }}
        </base-button>
      </template>
    </base-modal>

    <base-modal
      :nested="inModal"
      ref="copyModal"
      :title="$t('availability.copyPrompt')"
    >
      <div v-if="availabilityToCopy">
        <div
          class="row"
          v-for="(slot, index) in availabilityToCopy.slots"
          :key="index"
        >
          <div class="col-6 mb-2">
            <base-timepicker :disabled="true" v-model="slot.from_time" />
          </div>
          <div class="col-6 mb-2">
            <base-timepicker :disabled="true" v-model="slot.to_time" />
          </div>
        </div>
      </div>

      <template v-slot:footer="{ hide }">
        <base-button type="secondary" @click="hide">
          {{ $t('common.close') }}
        </base-button>
        <base-button type="success" @click="copyToAll">
          {{ $t('availability.copyConfirm') }}
        </base-button>
      </template>
    </base-modal>
  </div>
</template>
<script>
import dayjs from '@/plugins/dayjs';
import VCalendar from 'v-calendar/lib/components/calendar.umd';
export default {
  components: {
    VCalendar,
  },

  props: {
    schedule: {
      type: Object,
      required: true,
    },
    inModal: {
      type: Boolean,
      default: false,
    },
    isOnlySchedule: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    loading: false,
    isOverriding: false,
    successStatus: false,
    errorStatus: false,
    availabilityToCopy: null,
    allAvailability: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ].map((day) => ({
      day,
      slots: [{ from_time: '', to_time: '' }],
      status: false,
      error: null,
    })),
    view: 'list',
    tab: 'hours',
    scheduleToSelect: null,

    dateToOverride: null,

    allOverrides: {},
    newTitle: '',

    titleLoading: false,
    titleSuccess: false,
    titleError: false,

    deleteLoading: false,
    deleteSuccess: false,
    deleteError: false,

    defaultLoading: false,
  }),

  mounted() {
    window.addEventListener('resize', this.onResize);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },

  watch: {
    schedule: {
      handler(schedule) {
        this.allAvailability = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ].map((day) => ({
          day,
          slots: [{ from_time: '', to_time: '' }],
          status: false,
          error: null,
        }));

        this.allOverrides = {};

        for (let element of schedule.schedule) {
          if (element.type === 'date') {
            if (!this.allOverrides[element.date])
              this.$set(this.allOverrides, element.date, []);
            this.allOverrides[element.date].push(element);
            continue;
          }

          let currentIndex = this.allAvailability.findIndex(
            (item) => item.day == element.day
          );

          if (currentIndex != -1) {
            this.allAvailability[currentIndex].status = element.status;

            if (this.allAvailability[currentIndex].slots[0].from_time == '') {
              this.allAvailability[currentIndex].slots = [];
            }

            this.allAvailability[currentIndex].slots.push({
              from_time: element.from_time,
              to_time: element.to_time,
            });
          }
        }
      },
      immediate: true,
    },
  },

  computed: {
    isDefaultSchedule() {
      return this.schedule.default;
    },
    vcalendar() {
      const attributes = this.allAvailability
        .filter((day) => day.status)
        .map((day, i) => {
          return {
            customData: {
              slots: day.slots.map((slot) => ({
                from_time: this.formatTime(slot.from_time),
                to_time: this.formatTime(slot.to_time),
              })),
            },
            dates: {
              weekdays: {
                Sunday: 1,
                Monday: 2,
                Tuesday: 3,
                Wednesday: 4,
                Thursday: 5,
                Friday: 6,
                Saturday: 7,
              }[day.day],
            },
            excludeDates: Object.keys(this.allOverrides),
          };
        });

      for (let [key, value] of Object.entries(this.allOverrides)) {
        attributes.push({
          customData: {
            slots: value.map((slot) => ({
              from_time: this.formatTime(slot.from_time),
              to_time: this.formatTime(slot.to_time),
            })),
            isOverride: true,
          },
          dot: true,
          dates: [key],
        });
      }

      return {
        masks: {
          weekdays: 'WWW',
        },
        attributes,
      };
    },
    overrideCalendar() {
      return {
        attributes: [
          {
            highlight: {
              color: 'blue',
              fillMode: 'solid',
            },
            dates: this.dateToOverride ? this.dateToOverride.date : [],
          },
        ],
      };
    },
  },

  methods: {
    deleteAvailability() {
      this.deleteLoading = true;
      this.$store
        .dispatch('availability/deleteAvailability', this.schedule.id)
        .then((data) => {
          this.deleteSuccess = true;
          this.$emit('fetchSchedules');
          setTimeout(() => {
            this.deleteSuccess = false;
            this.$refs.deleteModal.hide();
          }, 1500);
        })
        .catch((error) => {
          console.log(error);
          // this.deleteError = true;
          // setTimeout(() => {
          //   this.deleteError = false;
          // }, 1500);
        })
        .finally(() => {
          this.deleteLoading = false;
        });
    },
    onResize() {
      if (window.innerWidth < 1200) {
        this.view = 'list';
      }
    },
    editTitle() {
      this.newTitle = this.schedule.title;
      this.$refs.titleModal.show();
    },
    async saveTitle() {
      const isValid = await this.$refs.editTitleForm.validate();
      if (!isValid) return;

      const data = {
        id: this.schedule.id,
        title: this.newTitle,
      };

      this.titleLoading = true;
      this.$store
        .dispatch('availability/updateAvailability', data)
        .then((data) => {
          this.titleSuccess = true;
          this.$emit('fetchSchedules');
          setTimeout(() => {
            this.titleSuccess = false;
            this.$refs.titleModal.hide();
          }, 1500);
        })
        .catch((error) => {
          this.titleError = true;
          setTimeout(() => {
            this.titleError = false;
          }, 1500);
        })
        .finally(() => {
          this.titleLoading = false;
        });
    },
    setAsDefault() {
      const data = {
        id: this.schedule.id,
        default: true,
      };

      this.defaultLoading = true;
      this.$store
        .dispatch('availability/updateAvailability', data)
        .then((data) => {
          this.$emit('fetchSchedules');
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.defaultLoading = false;
        });
    },
    resetOverrides() {
      const date = this.dateToOverride.date;
      this.removeOverride(date);
      const weekday = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ][dayjs(date).day()];
      const slots = this.allAvailability
        .find((day) => day.day === weekday)
        .slots.map((slot) => ({
          from_time: slot.from_time,
          to_time: slot.to_time,
        }));

      this.dateToOverride = {
        date,
        slots,
      };
    },
    removeOverride(date) {
      this.$delete(this.allOverrides, date);
    },
    onDayClick(day) {
      const date = day.date || new Date();
      let slots;

      const datekey = dayjs(date).format('YYYY-MM-DD');
      if (this.allOverrides[datekey]) {
        slots = this.allOverrides[datekey].map((slot) => ({
          from_time: slot.from_time,
          to_time: slot.to_time,
        }));
      } else {
        slots = this.getWeekdaySlots(datekey);
      }

      this.dateToOverride = {
        date: datekey,
        slots,
      };
      this.$nextTick(() => {
        this.$refs.overrideModal.show();
      });
    },
    getWeekdaySlots(date) {
      const weekday = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ][dayjs(date).day()];
      const day = this.allAvailability.find((day) => day.day === weekday);

      if (!day.status) return [{ from_time: '', to_time: '' }];
      return day.slots.map((slot) => ({
        from_time: slot.from_time,
        to_time: slot.to_time,
      }));
    },
    formatDate(date) {
      return dayjs(date).format('DD MMM YY, ddd');
    },
    formatTime(time) {
      if (!time) return '';
      const [HH, mm] = time.split(':');
      const hh = +HH % 12 || 12; //replaces 0:xx with 12:xx
      const unit = +HH >= 12 ? this.$t('common.pm') : this.$t('common.am');
      return hh.toString().padStart(2, '0') + ':' + mm + ' ' + unit;
    },
    setView(view) {
      this.view = view;
    },
    setTab(tab) {
      this.tab = tab;
    },
    viewClass(view) {
      return this.view === view ? 'outline-primary' : 'outline-secondary';
    },
    tabClass(tab) {
      return this.tab === tab ? 'primary' : 'outline-secondary';
    },
    copyToAll() {
      const source = this.availabilityToCopy;
      if (!source) return;
      this.allAvailability.forEach((av) => {
        if (av === source) return;
        av.status = source.status;
        av.slots = [];
        source.slots.forEach((slot) => {
          av.slots.push({ ...slot });
        });
      });
      this.hideCopyModal();
    },
    showCopyModal(availability) {
      this.availabilityToCopy = availability;
      this.$refs.copyModal.show();
    },
    hideCopyModal() {
      this.$refs.copyModal.hide();
    },
    validateSlot(changedSlot, availability) {
      const { from_time, to_time } = changedSlot;
      if (!from_time || !to_time) return;

      const changedFromMins = this.getMinutes(from_time);
      const changedToMins = this.getMinutes(to_time);

      if (changedToMins < changedFromMins) {
        changedSlot.error = {
          type: 'end_before_start',
          message: this.$t('inputRules.endBeforeStart'),
        };
        return;
      }

      changedSlot.error = null;

      if (availability.slots.length <= 1) {
        return;
      }

      for (let slot of availability.slots) {
        if (slot === changedSlot) continue;

        const { from_time, to_time } = slot;
        if (!from_time || !to_time) continue;
        const fromMins = this.getMinutes(from_time);
        const toMins = this.getMinutes(to_time);

        if (
          (fromMins > changedFromMins && fromMins < changedToMins) ||
          (changedFromMins > fromMins && changedFromMins < toMins) ||
          (toMins > changedFromMins && toMins < changedToMins) ||
          (changedToMins > fromMins && changedToMins < toMins)
        ) {
          changedSlot.error = {
            type: 'conflict',
            message: this.$t('inputRules.timerangeConflict'),
          };
          // TODO
          slot.error = {
            type: 'conflict',
            message: this.$t('inputRules.timerangeConflict'),
          };
        } else {
          slot.error = null;
        }
      }
    },
    getMinutes(timestring) {
      return timestring
        .split(':')
        .map((sub) => +sub)
        .slice(0, 2)
        .reduce(
          (acc, item, index) => acc + (index === 1 ? item : item * 60),
          0
        );
    },
    saveOverride() {
      if (!this.dateToOverride) return;

      for (let slot of this.dateToOverride.slots) {
        if (slot.error) {
          this.scrollToFirstError('.error');
          return;
        }
      }

      this.isOverriding = true;

      // const datekey = dayjs(this.dateToOverride.date).format('YYYY-MM-DD')

      let slots;

      const weekdaySlots = this.getWeekdaySlots(this.dateToOverride.date);
      if (
        JSON.stringify(this.dateToOverride.slots) ===
        JSON.stringify(weekdaySlots)
      ) {
        slots = [];
      } else {
        slots = this.dateToOverride.slots;
      }

      this.allOverrides[this.dateToOverride.date] = slots
        .filter((slot) => slot.from_time && slot.to_time)
        .map((slot) => ({
          from_time: slot.from_time,
          to_time: slot.to_time,
          status: true,
        }));

      this.updateAvailability();
    },
    updateAvailability() {
      for (let item of this.allAvailability) {
        for (let slot of item.slots) {
          if (slot.error) {
            this.scrollToFirstError('.error');
            return;
          }
        }
      }

      this.loading = true;

      let _availabilityArr = [];

      this.allAvailability.forEach((item) => {
        // if (item.status == true) {
        let _slots = [];

        item.slots.forEach((element) => {
          if (element.from_time && element.to_time) {
            _slots.push({
              from_time: element.from_time,
              to_time: element.to_time,
              status: item.status,
            });
          }
        });

        if (_slots.length) {
          _availabilityArr.push({
            day: item.day,
            slots: _slots,
            type: 'weekday',
          });
        }
        // }
      });

      for (let [key, value] of Object.entries(this.allOverrides)) {
        let slots = [];

        value.forEach((slot) => {
          if (slot.from_time && slot.to_time) {
            slots.push({
              from_time: slot.from_time,
              to_time: slot.to_time,
              status: slot.status,
            });
          }
        });

        _availabilityArr.push({
          type: 'date',
          date: key,
          slots,
        });
      }

      let data = {
        timezone: dayjs.tz.guess().toLowerCase(),
        avails: _availabilityArr,
        id: this.schedule.id,
      };

      this.$store
        .dispatch('availability/updateAvailability', data)
        .then((data) => {
          this.successStatus = true;
          this.$emit('fetchSchedules');
          setTimeout(() => {
            this.successStatus = false;
            if (this.dateToOverride) {
              this.$refs.overrideModal.hide();
              this.dateToOverride = null;
              this.isOverriding = false;
            }
          }, 1500);
        })
        .catch((error) => {
          this.errorStatus = true;
          setTimeout(() => {
            this.errorStatus = false;
            this.isOverriding = false;
          }, 1500);
          console.log(error.response);

          this.errorFromApi = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    addTimeSlot(availability) {
      let newSlot = {
        from_time: '',
        to_time: '',
      };

      availability.slots.push(newSlot);
    },
    removeTimeSlot(slotIndex, availability) {
      if (slotIndex === 0 && availability.slots.length === 1) {
        this.$set(availability.slots[0], 'from_time', '');
        this.$set(availability.slots[0], 'to_time', '');
        return;
      }
      availability.slots.splice(slotIndex, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.copy-button {
  position: absolute;
  top: 10px;
  right: 20px;
}
.rtl .copy-button {
  right: unset;
  left: 20px;
}

.tabs {
  position: relative;
  top: 12px;
}
.list-view-wrapper {
  border-top-left-radius: 0 !important;
  position: relative;
  z-index: 2;
}

.disabled-action {
  opacity: 0.5;
  pointer-events: none;
}

.spinner-border {
  position: relative;
  top: 3px;
}

::v-deep(.custom-calendar.vc-container) {
  border-radius: 0;
  border: 0;

  & .vc-header {
    padding: 15px;
    background: #f8f8f8;
  }

  & .vc-title {
    color: #39425d;
  }

  & .vc-weeks {
    padding: 0;
  }

  & .vc-weekday {
    background: #eee;
    padding: 15px 0;
    border-bottom: 1px solid #e5e5e5;
  }

  & .day-content {
    padding: 3px 5px;
  }

  & .vc-day {
    width: 108px;
    height: 90px;
    background: #fafafa;

    &:not(.on-bottom) {
      border-bottom: 1px solid #e5e5e5;
    }
    &:not(.on-right) {
      border-right: 1px solid #e5e5e5;

      .rtl & {
        border-right: unset;
        border-left: 1px solid #e5e5e5;
      }
    }

    &:hover {
      cursor: pointer;
      outline: 2px solid royalblue;
      z-index: 99;
    }

    &.on-bottom.is-not-in-month {
      display: none;
    }

    & .vc-dots {
      position: absolute;
      bottom: 5px;
    }
  }
  .calendar-entry {
    font-size: 10px;
  }
}
</style>

<style lang="scss">
.rtl .custom-calendar.vc-container {
  & .vc-day:not(.on-right) {
    border-right: unset;
    border-left: 1px solid #e5e5e5;
  }

  & .vc-arrow.is-left {
    order: 1;
  }
}
</style>
