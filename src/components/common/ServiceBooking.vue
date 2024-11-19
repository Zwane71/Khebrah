<template>
  <div>
    <base-modal 
      size="large"
      ref="calendarModal"
      :title="$t('bookings.selectSlot')">

      <div class="row">
        <div class="col-12 col-md-6">
          <h4 class="text-primary mb-0">{{ currentService.service_name }}</h4>
          <p>{{ serviceTypeText }}, {{ selectedOnlineTypeText }}, {{$t('service.duration')}}: {{ currentService.duration }} {{durationUnit}}</p>
        </div>
        <div class="col-12 col-md-6 d-flex justify-content-start flex-column align-items-end">
          <p class="small">{{$t('service.onlineOfflineDescription')}}</p>
          <div class="toggle mt-2" @click="toggleType" :class="{toggled: selectedOnlineType === 'Online' }" v-if="currentService.online && currentService.offline && type !== 'reschedule'">
            <div class="toggle-text">
              {{ selectedOnlineTypeText }}
            </div>
            <div class="toggle-switch"></div>
          </div>
          
        </div>
      </div>

      <div class="row mt-2">
        <div class="col-lg-6">
            <datepicker
              class="datepicker"
              :inline="true"
              :language="enLang ? en : ar"
              :bootstrap-styling="true"
              v-model="selectedDate"
              :disabledDates="disabledDates"
              :highlighted="highlighted"
              :format="'yyyy-MM-dd'"
              @changedMonth="onMonthChanged"
            ></datepicker>
        </div>
        <div class="col-lg-6">
            <p class="text-center mb-2" v-if="!loading">
              {{ selectedDateFormatted }}
              <!-- {{
                !!selectedDate
                  ? new Date(selectedDate).toLocaleDateString()
                  : "Please select a date"
              }} -->
              <span>
                {{ selectedDay }}
              </span>
            </p>

            <div v-if="loading" class="text-center py-5">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            </div>


            <div v-else-if="selectedDate && splittedTime.length > 0" class="slot-list">
                <base-button
                  v-for="(slot, index) in splittedTime" :key="index" class="slot-item"
                  @click="bookASlot(slot)"
                  :disabled="!!slot.status ? true : false"
                  :type="
                    !!bookedSlot
                      ? slot == bookedSlot
                        ? 'primary'
                        : 'outline-primary'
                      : 'outline-primary'
                  "
                  size="md"
                  ><p class="mx-6">{{ formatTime(slot.from_time) }}</p>
                </base-button>
            </div>

            <div v-else-if="selectedDate" class="text-center py-5">{{$t('service.noSlots')}}</div>
        </div>
      </div>


      <template v-slot:footer="{ hide }">
        <base-button type="outline-secondary" @click="hide">{{$t('common.close')}}</base-button>
        <base-button v-if="type === 'booking'" type="success" :disabled="!bookedSlot" @click="checkout">{{$t('service.confirmBooking')}}</base-button>
        <base-button v-else-if="type === 'reschedule'" type="success" :success="rescheduleSuccess" :success-message="$t('common.success')" :error="rescheduleError" :error-message="$t('common.failed')" :loading="rescheduleLoading" :disabled="!bookedSlot" @click="checkout">{{$t('bookings.confirmReschedule')}}</base-button>
      </template>
    </base-modal>

    <base-modal 
      ref="mobileModal"
      :title="$t('user.verifyMobileModalTitle')">
      <edit-mobile @success="hideMobileModal" @cancel="closeMobileModal"/>
    </base-modal>
  </div>
</template>

<script>
import { en, ar } from 'vuejs-datepicker/dist/locale'
import Datepicker from "vuejs-datepicker";
import EditMobile from '@/app/user-module/component/editMobile.vue'
import dayjs from '@/plugins/dayjs'

const convertTime12to24 = (time12h) => {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") {
    hours = "00";
  }
  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }
  return `${hours}:${minutes}`;
};

const todaysDate = () => {
  var today = new Date();

  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  return date;
};

export default {
  components: {
    Datepicker,
    EditMobile
  },
  props: {
    type: {
      type: String,
      default: 'booking'
    }
  },
  // created() {
  //   this.getAvailability();
  // },
  data() {
    return {
      ar: ar,
      en: en,
      loading: false,
      currentService: {},
      selectedDate: "",
      selectedDay: "",
      selectedOnlineType: '',
      availabilities: [],
      allAvailability: [],
      splittedTime: [],
      bookedSlot: null,
      highlighted: {
        // days: [],
        // daysOfMonth: [],
        // dates: [new Date(todaysDate())],
        dates: [],
      },

      expert: null,

      selectedService: null,

      orderToReschedule: null,
      rescheduleLoading: false,
      rescheduleSuccess: false,
      rescheduleError: false,
    };
  },
  watch: {
    selectedDate(value) {
      this.bookedSlot = null;
      let date = dayjs(value).format('YYYY-MM-DD')

      const slots = this.availabilities[date]

      if (!slots || !slots.length) {
        this.splittedTime = []
        return
      }

      const intervals = new Set()
      const serviceDuration = +this.currentService.duration
      const unit = {
        'M': 'minute',
        'H': 'hour',
        'D': 'day'
      }[this.currentService.duration_in]

      for (let slot of slots) {
        let [fh, fm] = slot.from_time.split(':').map(sub => +sub)
        const from = dayjs(this.selectedDate).hour(fh).minute(fm)

        let [th, tm] = slot.to_time.split(':').map(sub => +sub)
        const to = dayjs(this.selectedDate).hour(th).minute(tm).subtract(serviceDuration, unit)

        const slotIntervals =  [{ from_time: from, to_time: from.add(serviceDuration, unit), time_slot: slot.id}]

        while (slotIntervals[slotIntervals.length - 1].from_time.add(15, 'minute').isSameOrBefore(to)) {
          const from_time = slotIntervals[slotIntervals.length - 1].from_time.add(15, 'minute')
          const to_time = from_time.add(serviceDuration, unit)
          slotIntervals.push({ 
            from_time, 
            to_time,
            time_slot: slot.id
          })
        }

        slotIntervals.forEach(i => intervals.add(i))
      }

      const leadTime = this.expert && this.expert.lead_time 
        ? this.expert.lead_time
        : 0
      const now = dayjs().add(leadTime, 'minute')
      this.splittedTime = [...intervals]
      .filter(i => {
        return !i.from_time.isBefore(now)
      })
      .map(i => ({ 
        from_time: i.from_time.format(),
        to_time: i.to_time.format(),
        time_slot: i.time_slot
      }))
    },
  },
  computed: {
    selectedOnlineTypeText() {
      return {
        Online: this.$t('bookings.online'),
        Offline: this.$t('bookings.offline')
      }[this.selectedOnlineType] || ''
    },
    user() {
      return this.$store.getters['auth/user']
    },
    durationUnit() {
      if (!this.currentService) return ''
      const unit = {
        'M': 'minute',
        'H': 'hour',
        'D': 'day'
      }[this.currentService.duration_in]
      return this.currentService.duration === 1
        ? this.$t(`common.${unit}`)
        : this.$t(`common.${unit}s`)
    },
    serviceTypeText() {
      if (!this.currentService) return ''
      return this.currentService.service_type === 'delivery based service'
        ? this.$t('service.deliveryBasedService')
        : this.$t('service.timeBasedService')
    },
    selectedDateFormatted() {
      if (!this.selectedDate) return this.$t('service.pleaseSelectDate')
      return dayjs(this.selectedDate).format('DD-MM-YYYY')
    },
    disabledDates() {
      return {
        to: new Date(Date.now() - 8640000),
        customPredictor: (date) => {
          if (this.loading) return true
          const highlighted = this.highlighted.dates.map(d => dayjs(d))
          const currentDate = dayjs(date)
          for (let d of highlighted) {
            if (currentDate.isSame(d, 'day')) {
              return false
            }
          }
          return true
        }
      }
    }
  },
  methods: {
    showMobileModal() {
      this.$refs.mobileModal.show()
    },
    closeMobileModal() {
      this.$refs.mobileModal.hide()
    },
    hideMobileModal() {
      this.$refs.mobileModal.hide()
      this.navigateToCheckout(this.selectedService)
      this.selectedService = null
    },
    bookASlot(slot) {
      this.bookedSlot = slot;
    },
    formatTime(time) {
      const [HH, mm] = dayjs(time).format('HH:mm').split(':')
      const hh = (+HH % 12) || 12 //replaces 0:xx with 12:xx
      const unit = +HH >= 12 ? this.$t('common.pm') : this.$t('common.am')
      return hh.toString().padStart(2, '0') + ':' + mm + ' ' + unit
    },
    checkout() {
      let bookedSlot = this.bookedSlot;
      let date = new Date(this.selectedDate);
      var dd = String(date.getDate()).padStart(2, "0");
      var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = date.getFullYear();
      let selectedDate = yyyy + "-" + mm + "-" + dd;
      bookedSlot.booking_date = selectedDate;
      bookedSlot.online_type = this.selectedOnlineType
      // this.bookServiceSlot(bookedSlot);
      if (this.type === 'reschedule') {
        this.rescheduleLoading = true
        const data = {
          from_time: bookedSlot.from_time,
          time_slot: bookedSlot.time_slot,
          timezone: dayjs.tz.guess(),
          order_id: this.orderToReschedule.order_id
        }
        this.$store.dispatch('orders/reschedule', data)
          .then(() => {
            this.rescheduleLoading = false
            this.rescheduleSuccess = true
            this.$emit('rescheduleSuccess')
            setTimeout(() => {
              this.rescheduleSuccess = false
              this.$refs.calendarModal.hide()
            }, 1500)
          })
          .catch(e => {
            this.rescheduleLoading = false
            this.rescheduleError = true
            setTimeout(() => {
              this.rescheduleError = false
            }, 1500)
          })
        return
      }

      this.$refs.calendarModal.hide()
      this.$store.commit('checkout/setOrder', { slot: bookedSlot, service: this.currentService, expert: this.expert })
      this.$router.push({ name: "Checkout" });
    },
    rescheduleOrder(order) {
      this.orderToReschedule = order
      this.currentService = order.service;

      if (order.online) {
        this.selectedOnlineType = 'Online' 
      } else {
        this.selectedOnlineType = 'Offline' 
      }

      const today = dayjs()
      const monthEnd = dayjs().endOf('month')
      if(!this.selectedDate) this.fetchAvailableSlots(today, monthEnd)

      this.$refs.calendarModal.show()
    },
    navigateToCheckout(service, expert) {
      if (expert) {
        this.expert = expert
      }
      if (!this.user) {
        this.$router.push({ query: { ...this.$route.query, service: service.id }})
        this.$store.commit('setNextRoute', this.$route.fullPath)
        this.$router.push({ name: 'Login' })
        return
      } 
      if (!this.user.mobile) {
        this.showMobileModal()
        this.selectedService = service
        return
      }
      if (service.service_type == 'delivery based service') {
        this.$store.commit('checkout/setOrder', { service, expert: this.expert })
        this.$router.push({ name: "Checkout" });
      } else {
        // this.getAvailability();
        this.currentService = service;
        if (service.online) {
          this.selectedOnlineType = 'Online' 
        } else {
          this.selectedOnlineType = 'Offline' 
        }

        const today = dayjs()
        const monthEnd = dayjs().endOf('month')
        if(!this.selectedDate) this.fetchAvailableSlots(today, monthEnd)

        this.$refs.calendarModal.show()
      }
    },
    onMonthChanged(date) {
      const start = dayjs(date).startOf('month')
      const end = dayjs(date).endOf('month')
      this.fetchAvailableSlots(start, end)
    },
    fetchAvailableSlots(start, end) {
      this.loading = true
      const data = {
        start_date: start.format('YYYY-MM-DD'),
        end_date: end.format('YYYY-MM-DD'),
        timezone: dayjs.tz.guess(),
        service_id: this.currentService.service_id
      }
      // this.disabledDates.days = [0, 1, 2, 3, 4, 5, 6]
      this.$store.dispatch('availability/fetchAvailableSlots', data)
        .then(data => {
          this.loading = false

          this.availabilities = data

          const highlighted = Object.keys(data).filter(d => data[d].length)
          // const disabled = Object.keys(data).filter(d => !data[d].length)
          this.highlighted.dates = highlighted.map(d => new Date(d))
          // this.disabledDates.days = []
          // this.disabledDates.dates = disabled.map(d => new Date(d))

          this.splittedTime = []
        })
        .catch(e => {
          console.log(e)
        })
    },
    showModal(service) {
      this.currentService = service;
      this.$refs["my-modal"].show();
    },
    hideModal() {
      this.$refs["my-modal"].hide();
    },
    toggleType() {
      this.selectedOnlineType = this.selectedOnlineType === 'Online'
        ? 'Offline'
        : 'Online'
    }
  },
}
</script>

<style scoped deep>
.datepicker >>> .vdp-datepicker__calendar {
  border: none;
}
.datepicker /deep/ .cell {
  position: relative;
  display: inline-block;
  z-index: 1;
}
.datepicker >>> .vdp-datepicker__calendar .cell.highlighted {
  background: none;
}
.datepicker >>> .vdp-datepicker__calendar .cell.highlighted:before {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  content: '';
  background: #eee;
  z-index: -1;
}
.datepicker >>> .vdp-datepicker__calendar .cell.selected.highlighted:before {
  background: #39425d;
}
.datepicker >>> .vdp-datepicker__calendar .cell.selected.highlighted {
  color: #fff;
}
</style>

<style scoped>
.slot-list {
  display: flex;
  flex-flow: row wrap;
}
.slot-item {
  margin: 1.5%;
  width: 30%;
}
.toggle {
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  border: 1px solid rgba(0,0,0,0.125);
  border-radius: 40px;
  width: 100px;
  position: relative;
  padding: 5px 10px;
  cursor: pointer;
  padding-left: 35px;
  user-select: none;
}
.toggle.toggled {
  padding-left: 10px;
}
.toggle-switch {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  position: absolute;
  top: 5px;
  left: 5px;
  right: unset;
  background: #ccc;
}
.toggled .toggle-switch {
  right: 5px;
  background:#28a745;
  left: unset;
}
.rtl .toggle {
  padding-left: unset;
  padding-right: 35px;
}
.rtl .toggle.toggled {
  padding-left: unset;
  padding-right: 10px;
}
.rtl .toggle-switch {
  left: unset;
  right: 5px;
}
.rtl .toggled .toggle-switch {
  right: unset;
  left: 5px;
}
@media only screen and (max-width: 992px) {.slot-list p {
  font-size: 0.8rem !important;
}
}
</style>