<template>
  <div id="print-content" class="hidden">
    <div class="print-header">
      <img class="logo" src="@/assets/img/logo.svg" />
    </div>

    <h1>
      {{$t('bookings.orderInvoice')}}
    </h1>

    <h3>{{$t('common.service')}}</h3>

    <div class="base-box" style="margin-bottom: 20px;">
      <div class="row table-heading">
        <div class="col">
          {{$t('common.service')}}
        </div>
        <div class="col">
          {{$t('common.type')}}
        </div>
        <div class="col">
          {{$t('service.duration')}}
        </div>
        <div class="col">
          {{$t('common.amount')}}
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col">
          {{ order.service.service_name }}
        </div>
        <div class="col">
          {{ serviceType }}
        </div>
        <div class="col">
          {{ duration }}
        </div>
        <div class="col">
          {{ order.service.price }}
        </div>
      </div>
    </div>

    <h3>{{$t('bookings.orderDetails')}}</h3>
    <div class="base-box">
      <div class="row">
        <div class="col">
          <p class="label">{{$t('bookings.bookingId')}}:</p>
          <p>#{{ order.order_id }}</p>
        </div>
        <div class="col" v-if="!isBooking">
          <p class="label">{{$t('bookings.serviceProvider')}}:</p>
          <p>{{ order.expert.first_name + ' ' + order.expert.last_name}}</p>
        </div>
        <div class="col" v-else>
          <p class="label">{{$t('bookings.bookedBy')}}:</p>
          <p>{{ order.user.first_name + ' ' + order.user.last_name}}</p>
        </div>
        <div class="col">
          <p class="label" v-if="deliveryBased">{{$t('bookings.completionDate')}}:</p>
          <p class="label" v-else>{{$t('bookings.dateAndTime')}}:</p>
          <p v-if="!deliveryBased && order.start_time && order.end_time">
            {{ formatTime(order.start_time) }} - {{ formatTime(order.end_time) }}
          </p>
          <p>{{ getDate(order.completion_date) }}</p>
        </div>
      </div>
    </div>

    <h3 v-if="!isBooking && order.payment">{{$t('bookings.paymentForOrder')}}</h3>
    <h3 v-else>{{$t('bookings.paymentFromKhebrah')}}</h3>

    <div class="base-box" v-if="!isBooking && order.payment">
      <div class="row">
        <div class="col">
          <p class="label">{{$t('bookings.orderNo')}}:</p>
          <p>#{{ order.payment.order_no }}</p>
        </div>
        <div class="col">
          <p class="label">{{$t('common.status')}}:</p>
          <p>{{ order.payment.state }}</p>
        </div>
        <div class="col">
          <p class="label">{{$t('common.amount')}}:</p>
          <p>{{ (+order.payment.amount).toFixed(3) }}</p>
        </div>
        <div class="col">
          <p class="label">{{$t('common.currency')}}:</p>
          <p>{{ order.payment.currency_code }}</p>
        </div>
      </div>
      <div class="row" style="margin-top: 30px">
        <div class="col">
          <p class="label">{{$t('bookings.tranId')}}:</p>
          <p>{{ order.payment.gateway_response.tranid }}</p>
        </div>
        <div class="col">
          <p class="label">{{$t('bookings.trackId')}}:</p>
          <p>{{ order.payment.gateway_response.trackid }}</p>
        </div>
        <div class="col">
          <p class="label">{{$t('bookings.paymentId')}}:</p>
          <p>{{ order.payment.gateway_response.paymentid }}</p>
        </div>
        <div class="col"></div>
      </div>
    </div>

    <div class="base-box" v-else>
      <div class="row">
        <div class="col" v-if="order.paid_date">
          <p class="label">{{$t('bookings.paidDate')}}:</p>
          <p>{{ getDate(order.paid_date) }}</p>
        </div>
        <div class="col">
          <p class="label">{{$t('common.status')}}:</p>
          <p>{{ order.expert_payment_status }}</p>
        </div>
        <div class="col">
          <p class="label">{{$t('common.amount')}}:</p>
          <p v-if="order.paid_amount">{{ (+order.paid_amount).toFixed(3) }}</p>
          <p v-else-if="order.payment">{{ (+order.payment.amount).toFixed(3) }}</p>
          <p v-else>{{ (+order.price).toFixed(3) }}</p>
        </div>
        <div class="col">
          <p class="label">{{$t('common.currency')}}:</p>
          <p>{{ $t('common.kd') }}</p>
        </div>
      </div>
      <div class="row" style="margin-top: 30px">
        <div class="col">
          <p class="label">{{$t('bookings.tranId')}}:</p>
          <p>{{ order.transaction_id }}</p>
        </div>
      </div>
    </div>


  </div>

</template>

<script>
import dayjs from '@/plugins/dayjs'
export default {
  props: {
    order: {
      type: Object,
      required: true
    },
    isBooking: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    serviceType() {
      if(this.order.service.service_type === 'delivery based service') {
          return this.$t('bookings.deliveryBased')
      } else if(this.order.online) {
          return this.$t('bookings.timeBased') + ', ' + this.$t('bookings.online')
      } else {
          return this.$t('bookings.timeBased') + ', ' + this.$t('bookings.offline')
      }
    },
    duration() {
      let unit = {
        'M': 'minutes',
        'H': 'hours', 
        'D': 'days'
      }[this.order.service.duration_in]
      if (+this.order.service.duration === 1) unit = unit.slice(0, -1)
      return this.order.service.duration + ' ' + this.$t(`common.${unit}`)
    },
    deliveryBased() {
      if (!this.order) return false
      return this.order.service.service_type === 'delivery based service'
    },
  },
  methods: {
    formatTime(t) {
      let time = dayjs(t).format('hh:mm a')
      const unit = time.slice(-2)
      time = time.slice(0, -2) + this.$t(`common.${unit}`)
      return time
    },
    getDate(date) {
      if (!date) return '-'
      return dayjs(date).format('DD-MM-YYYY')
    },
    async print() {
      await this.$htmlToPaper('print-content')
    }
  }
}
</script>