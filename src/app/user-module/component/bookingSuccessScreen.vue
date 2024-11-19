<template>
  <div class="row">
    <div class="col-12">
      <div class="base-box px-5 py-5">
        <div class="py-5">
          <div class="text-center mt-3">
            <img
              v-if="!payment || payment.gateway_response.result == 'CAPTURED'"
              src="@/assets/img/success.svg"
              alt=""
              class="header-logo text-center"
            />
            <img
              v-else
              src="@/assets/img/close.png"
              alt=""
              style="width: 66px; height: 66px"
            />
          </div>

          <p class="text-primary text-center mt-3">
            {{
              !payment || payment.gateway_response.result == "CAPTURED"
                ? $t('bookings.paymentSuccessMsg1')
                : $t('bookings.paymentFailMsg1')
            }}
          </p>

          <p class="text-primary text-center">
            {{
              !payment || payment.gateway_response.result == "CAPTURED"
                ? $t('bookings.paymentSuccessMsg2')
                : $t('bookings.paymentFailMsg2')
            }}
          </p>
        </div>

          <div class="grey-border mt-5 pb-4" v-if="!payment || payment.gateway_response.result == 'CAPTURED'">
            <b-row class="gen-pad">
              <b-col md="12">
                <h4 class="theme-color text-uppercase">{{$t('bookings.bookingDetails')}}</h4>
              </b-col>
            </b-row>
            <!-- {{ order.service }} -->
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
            <b-row class="gen-pad">
              <b-col md="3">
                <small>{{$t('bookings.bookingId')}}:</small>
                <p>#{{ order.order_id }}</p>
              </b-col>
              <b-col md="3">
                <small>{{$t('bookings.serviceProvider')}}:</small>
                <p class="box d-flex">
                  <base-avatar
                    :src="expert.profile_img" 
                    size="tiny"
                    class="mr-2"
                    />
                  {{ expert.first_name + ' ' + expert.last_name }}
                </p>
              </b-col>
              <b-col md="3">
                <!-- <p>Date & Time:</p> -->
                <small v-if="deliveryBased">{{$t('bookings.completionDate')}}:</small>
                <small v-else>{{$t('bookings.dateAndTime')}}:</small>

                <p v-if="timeBased && order.start_time && order.end_time">
                  {{ formatTime(order.start_time) }} - {{ formatTime(order.end_time) }}
                </p>
                <p>{{ getDate(order.completion_date) }}</p>
              </b-col>

              <b-col md="3">
                <small>{{$t('bookings.serviceType')}}:</small>
                <p>
                  <!-- <img src="@/assets/img/online.jpg" /> Online, Time based -->
                  {{ serviceTypeText }}
                </p>
              </b-col>
            </b-row>
            <b-row class="gen-pad" v-if="payment">
              <b-col md="3">
                <small>{{$t('bookings.tranId')}}:</small>
                <p>#{{ payment.gateway_response.tranid }}</p>
              </b-col>
              <b-col md="3">
                <small>{{$t('bookings.tranAmount')}}:</small>
                <p>
                  {{ payment.gateway_response.amt }}
                  {{ payment.currency_code }}
                </p>
              </b-col>
              <b-col md="3">
                <!-- <p>Date & Time:</p> -->

                <small>{{$t('bookings.paymentType')}}:</small>

                <p>{{ payment.gateway_account }}</p>
              </b-col>

              <b-col md="3">
                <small>{{$t('bookings.refNo')}}:</small>
                <p>
                  <!-- <img src="@/assets/img/online.jpg" /> Online, Time based -->
                  {{ payment.reference_number }}
                </p>
              </b-col>
            </b-row>
          </div>

          <div class="row" v-else>
            <div class="col-12 col-md-6 offset-md-3 px-md-5">
              <div class="detail-box border payment-details text-left mt-3 p-3">
                <p>
                  {{ $t('common.amount')  }} : <span>{{ payment.amount + ' ' + $t('common.kd') }}</span>
                </p>
                <p>
                  {{$t("bookings.paymentStatus")}}: <span>{{ payment.state }}</span>
                </p>
                <p>
                  {{$t("bookings.orderNo")}}: <span>{{ payment.order_no }}</span>
                </p>
                <p>
                  {{$t("bookings.gateway")}}: <span>{{ payment.gateway_name }}</span>
                </p>
                <p>
                  {{$t("bookings.paidAmount")}}: <span>{{ payment.total_paid_amount }} {{$t('common.kd')}}</span>
                </p>
                <p v-if="payment.gateway_response">
                  {{$t("bookings.trackId")}}: <span>{{ payment.gateway_response.trackid }}</span>
                </p>
                <p v-if="payment.gateway_response">
                  {{$t("bookings.paymentId")}}: <span>{{ payment.gateway_response.paymentid }}</span>
                </p>

              </div>
            </div>
          </div>



          <div class="d-flex justify-content-end align-items-center py-4 px-2" v-if="!payment || payment.gateway_response.result == 'CAPTURED'">
            <base-button
              @click="printOrder"
              v-if="payment"
              type="outline-secondary pill"
              >{{$t('common.print')}}
            </base-button>
            <base-button
              type="pill primary"
              :to="`/${$i18n.locale}/dashboard/orders`"
              >{{$t('bookings.goToMyOrders')}}
            </base-button>
          </div>

          <div class="text-center py-4" v-else>
            <base-button
              @click="goToCheckout"
              type="pill primary">
              <i class="fas fa-long-arrow-alt-left mr-2 rtl-icon"></i>
              {{ $t('checkout.backToCheckout') }}
            </base-button>
          </div>
        </div>
    </div>

    <print-order ref="printOrder" v-if="order" :order="printableOrder" />

  </div>
</template>

<script>
import ExpertService from '@/components/common/ExpertService'
import PrintOrder from '@/app/user-module/component/printOrder.vue'
import dayjs from '@/plugins/dayjs'

export default {
  components: {
    ExpertService,
    PrintOrder
  },
  data() {
    return {
      loading: false,
    };
  },
  props: {
    payment: {
      default: () => {},
    },
    order: {
      default: () => {},
    },
    expert: {
      default: () => {},
    },
  },
  computed: {
    printableOrder() {
      return  { ...this.order, payment: this.payment, expert: this.expert }
    },
    serviceTypeText() {
      if (!this.order) return ''
      let text = this.order.service.service_type === 'delivery based service'
        ? this.$t('bookings.deliveryBased')
        : this.$t('bookings.timeBased')

      if (this.order.online) text += ', ' + this.$t('bookings.online')
      if (this.order.offline) text += ', ' + this.$t('bookings.offline')

      return text
    },
    deliveryBased() {
      if (!this.order) return false
      return this.order.service.service_type === 'delivery based service'
    },
    timeBased() {
      if (!this.order) return false
      return this.order.service.service_type === 'duration based service'
    },
  },
  methods: {
    printOrder() {
      this.$refs.printOrder.print()
    },
    getDate(date) {
      if (!date) return '-'
      return dayjs(date).utc().format('DD-MM-YYYY')
    },
    goToCheckout() {
      this.$router.push({ name: 'Checkout' })
    },
    formatTime(t) {
      let time = dayjs(t).format('hh:mm a')
      const unit = time.slice(-2)
      time = time.slice(0, -2) + this.$t(`common.${unit}`)
      return time
    },
    // formatTime(time) {
    //   return dayjs(time).format('hh : mm a')
    //   // const [HH, mm] = time.split(':')
    //   // const hh = (+HH % 12) || 12 //replaces 0:xx with 12:xx
    //   // const unit = +HH >= 12 ? this.$t('common.pm') : this.$t('common.am')
    //   // return hh.toString().padStart(2, '0') + ':' + mm + ' ' + unit
    // },
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
}
a img {
  width: 20%;
  height: auto;
  margin: 5px;
  padding-top: 10px;
  display: inline-flex;
  justify-content: center;
}
.blue-btn-small {
  color: #fff !important;
  background-color: #044982;
  border: 0;
  padding: 10px 35px;
  margin-bottom: 5px;
  white-space: nowrap;

  margin-right: 10px;
}
.detail-box {
  background: #f8f8f8;
  border-radius: 10px;
  border: 1px solid #e5e5e5;
}
.payment-details {
  text-transform: uppercase;
  font-size: 14px;
}
.payment-details p:not(:first-of-type) {
  margin-top: 10px;
}
.payment-details span {
  font-weight: 600;
}
</style>