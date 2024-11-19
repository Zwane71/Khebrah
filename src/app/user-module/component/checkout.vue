<template>
  <dashboard-layout>
    <template v-slot:title>
      <h1 class="text-white">{{ $t('checkout.checkout') }}</h1>
      <!-- <breadcrumbs /> -->
    </template>
    <div class="row">
      <div class="col-lg-9">
        <div class="base-box">
          <div class="py-3">
            <base-button 
              @click="$router.back()">
              <i class="fas fa-chevron-left back-button mr-2"></i> 
              {{ $t('user.back') }}
            </base-button>
          </div>

          <div class="grey-border" v-if="order">
            <b-row class="gen-pad">
              <b-col md="12">
                <h4 class="theme-color text-uppercase">{{$t('bookings.bookingDetails')}}</h4>
              </b-col>
            </b-row>
            <!-- {{ currentService }} -->
            <hr
              style="
                height: 1px;
                border-width: 0;
                background-color: #e5e5e5;
                margin: 0;
              "
            />
            <expert-service class="p-3" :service="order.service" />
            <hr
              style="
                height: 1px;
                border-width: 0;
                background-color: #e5e5e5;
                margin: 0;
              "
            />
            <b-row class="gen-pad pb-4" >
              <!-- <b-col md="3">
              </b-col> -->
              <b-col md="3" class="py-2">
                <small>{{$t('bookings.serviceProvider')}}:</small>
                <p class="box d-flex">
                  <base-avatar
                    :src="order.expert.profile_img" 
                    size="tiny"
                    class="mr-1"
                    />
                  {{ order.expert.first_name + ' ' + order.expert.last_name }}
                </p>
              </b-col>
              <b-col md="3" class="py-2">
                <!-- <p>Date & Time:</p> -->

                <!-- {{ currentService }} -->
                <small>
                  {{
                    order.slot
                      ? $t('bookings.dateAndTime')
                      : $t('bookings.completionDate')
                  }}
                </small>
                <p v-if="order.slot">
                  {{ formatTime(order.slot.from_time) }} -
                  {{ formatTime(order.slot.to_time) }}
                </p>
                <p>
                  {{
                    order.slot
                      ? getDate(order.slot.booking_date)
                      : getDeliveryDate(order.service.duration)
                  }}
                </p>
              </b-col>

              <b-col md="3" class="py-2">
                <small>{{ $t("expert.serviceType") }}:</small>
                <p>
                  <!-- <img src="@/assets/img/online.jpg" /> Online, Time based -->
                  {{ serviceTypeText }}
                </p>
              </b-col>
            </b-row>
            <!-- <hr style="height: 0px" /> -->
          </div>
        </div>
      </div>
      <div class="col-lg-3" v-if="order">
        <div class="base-box">
          <h4>{{ $t('checkout.summary') }}</h4>
          <table class="table">
            <tbody>
              <!-- <tr>
                <td>Sub-total</td>
                <td class="text-right">
                  {{ !!currentService.price ? currentService.price : 0 }} KD
                </td>
              </tr>
              <tr>
                <td>Taxes</td>
                <td class="text-right">0</td>
              </tr> -->
              <!-- <hr
                style="
                  height: 1px;
                  border-width: 0;
                  background-color: #e5e5e5;
                  margin: 0;
                "
              /> -->
              <tr>
                <td>{{$t('common.amount')}}</td>
                <td class="text-right">
                  <h5>
                    {{ !!order.service.price ? order.service.price : 0 }} {{ $t('common.kd')}}
                  </h5>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="row" v-if="!isFree">
            <div class="col-12">
              <h5>{{ $t('checkout.paymentMode') }} </h5>
              <div class="d-flex flex-column pl-2 pb-2">
                <base-radio 
                  :model-value="mode"
                  value="knet"
                  id="mode-knet"
                  @input="updateMode('knet')"
                >
                  <img class="payment-icon" src="@/assets/img/payment/knet.png" alt=""> {{$t('checkout.knet')}}
                </base-radio>
                <base-radio 
                  :model-value="mode"
                  class="mt-2"
                  value="card"
                  id="mode-card"
                  @input="updateMode('card')"
                >
                  <img class="payment-icon" src="@/assets/img/payment/visa-mastercard.png" alt=""> {{$t('checkout.card')}}
                </base-radio>
              </div>
            </div>
          </div>

          <!-- {{ currentSlot }} -->
          <div class="text-danger mb-2 text-center" v-if="slotError">{{ slotError }}</div>
          <div class="text-danger mb-2 text-center" v-else-if="errorFromApi">{{ $t('inputRules.serverError') }}</div>
          <b-button
            pill
            v-if="!loading"
            class="blue-btn-big"
            @click="bookAservice()"
            >
              <template v-if="isFree">
                {{ $t('service.confirmBooking') }}
              </template>
              <template v-else>
                {{ $t('checkout.confirmAndPay') }}
              </template>
            </b-button
          >
          <b-button disabled pill class="blue-btn-big" v-else>
            <b-spinner small type="grow"></b-spinner>
            {{ $t("user.loading") }}
          </b-button>
          <hr />
          <h5 class="text-center mb-0">{{ $t('checkout.weAccept') }}</h5>
          <div class="text-center">
            <a href="#"><img src="@/assets/img/payment/knet.png" /></a>
            <a href="#"><img src="@/assets/img/payment/Visa.png" /></a>
            <a href="#"><img src="@/assets/img/payment/mastercard.png" /></a>
            <!-- <a href="#"><img src="@/assets/img/payment/paypal.png" /></a>
            <a href="#"><img src="@/assets/img/payment/amex.png" /></a> -->
          </div>
        </div>
      </div>
    </div>
  </dashboard-layout>
</template>

<script>
import dayjs from '@/plugins/dayjs'

import ExpertService from '@/components/common/ExpertService'
export default {
  components: {
    ExpertService
    // Breadcrumbs
  },
  data() {
    return {
      loading: false,
      errorFromApi: false,
      slotError: '',
      mode: 'knet'
    };
  },
  created() {
    this.$store.commit('checkout/fetchOrderFromStorage')
    if(!this.order) this.$router.push(`/${this.$i18n.locale}/`) 
  },
  computed: {
    // ...mapGetters({
    //   currentService: "currentServiceCheckoutDetail",
    //   currentExpert: "currentExpertDetails",
    //   currentSlot: "currentSlotCheckoutDetail",
    // }),
    order() {
      return this.$store.getters['checkout/order']
    },
    isFree() {
      if (!this.order) return false
      return parseInt(this.order.service.price) === 0
    },
    serviceTypeText() {
      if (!this.order) return ''
      let text = this.order.service.service_type === 'delivery based service'
        ? this.$t('bookings.deliveryBased')
        : this.$t('bookings.timeBased')
      if (this.order.slot) text += ', ' + this.selectedOnlineTypeText
      return text
    },
    selectedOnlineTypeText() {
      if (!this.order) return ''
      return {
        Online: this.$t('bookings.online'),
        Offline: this.$t('bookings.offline')
      }[this.order.slot.online_type] || ''
    },
  },

  methods: {
    formatTime(time) {
      const [HH, mm] = dayjs(time).format('HH:mm').split(':')
      const hh = (+HH % 12) || 12 //replaces 0:xx with 12:xx
      const unit = +HH >= 12 ? this.$t('common.pm') : this.$t('common.am')
      return hh.toString().padStart(2, '0') + ':' + mm + ' ' + unit
    },
    updateMode(value) {
      this.mode = value
    },
    getDeliveryDate(value) {
      const date = new Date()
      date.setDate(date.getDate() + parseInt(value))
      return this.getDate(date)
    },
    getDate(date) {
      return dayjs(date).format('DD-MM-YYYY')
    },
    navigateToCheckout() {
      this.$router.push({ name: "Checkout" });
    },
    bookAservice() {
      this.loading = true;
      this.errorFromApi = false
      this.slotError = false
      
      let data = {}

      if(this.order.slot && this.order.service.service_type === 'duration based service' ) {
        data = {
          from_time: this.order.slot.from_time,
          time_slot: parseInt(this.order.slot.time_slot),
          // booking_date: this.order.slot.booking_date,
          online: this.order.slot.online_type === 'Online',
          offline: this.order.slot.online_type === 'Offline',
          timezone: dayjs.tz.guess()
        }
      }

      this.$store.dispatch('checkout/bookService', { id: this.order.service.service_id, data })
        .then(data => {
          if (data.order_id) {
            this.initiatePayment(data.order_id);
          }
        })
        .catch((error) => {
          this.loading = false;
          if (error.response.data && error.response.data.slot) {
            this.slotError = error.response.data.slot[0]
          }
          // this.errorFromApi = true;
        });
    },
    initiatePayment(order_id) {
      let data = {
        type: "booking",
        mode: this.mode,
        order_id
      };

      this.$store.dispatch('checkout/makePayment', data)
        .then(data => {
          // this.loading = false;
          if (data.url) {
            window.open(data.url, "_self");
          } else if (data.order) {
            this.$router.push({ name: 'BookingSuccess', query: { order_no: data.order.order_id }})
          } else {
            console.log(data)
            this.loading = false;
            this.errorFromApi = true;
          }
        })
        .catch((error) => {
          this.loading = false;
          this.errorFromApi = true;
        });
    },
  },
};
</script>

<style>
.multi-line-truncate {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
}
.table td {
  padding: 0;
  vertical-align: top;
  border-top: 0;
}
a img {
  width: 20%;
  height: auto;
  margin: 5px;
  padding-top: 10px;
  display: inline-flex;
  justify-content: center;
}

.rtl .back-button {
  transform: rotate(180deg)
}
.payment-icon {
  width: 25px;
  position: relative;
  top: -3px;
}
</style>