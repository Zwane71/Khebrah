<template>
  <div>
    <dashboard-header :title="isBooking ? 'Bookings' : 'Orders'" />

    <div class="grey-border mb-2" v-if="order">
      <div class="row p-3">
        <div class="col-md-6">
          <h5 class="theme-color mb-0 text-uppercase">{{ isBooking ? $t('bookings.bookingDetails') : $t('bookings.orderDetails') }}</h5>
        </div>
        <div class="col-md-6">
          <p  class="dsk-float-rt">
            {{$t('bookings.bookingStatus')}}:
            <span style="font-size: 130%;" 
            :class="{ 
              'text-danger': order.status === 'cancelled',
              'text-success': order.status !== 'cancelled'
              }">{{
              order.status.toUpperCase()
            }}</span>
          </p>
        </div>
      </div>
      <hr />
      <expert-service class="p-3" :service="order.service" />
      <hr />
      <div class="row p-3 meta">
        <div class="col-md-3  col-sm-6 py-2">
          <template v-if="isBooking">
            <p class="label">{{$t('bookings.bookedBy')}}:</p>
            <div class="d-flex align-items-center">
              <base-avatar 
                :first-name="order.user.first_name" 
                :last-name="order.user.last_name" 
                :src="order.user.profile_img"
                :size="25"
                />
              {{ order.user.first_name + ' ' + order.user.last_name}}
            </div>
          </template>
          <template v-else>
            <p class="label">{{$t('bookings.serviceProvider')}}:</p>
            <div class="d-flex align-items-center">
              <base-avatar 
                :first-name="order.expert.first_name" 
                :last-name="order.expert.last_name" 
                :src="order.expert.profile_img"
                :size="25"
                />
              {{ order.expert.first_name + ' ' + order.expert.last_name}}
            </div>
          </template>
        </div>
        <div class="col-md-3 col-sm-6 py-2">
          <p class="label" v-if="deliveryBased">{{$t('bookings.completionDate')}}:</p>
          <p class="label" v-else>{{$t('bookings.dateAndTime')}}:</p>
          <!-- <p>{{ getDate(order.service.duration) }}</p> -->
          <p v-if="timeBased && order.start_time && order.end_time">
            {{ formatTime(order.start_time) }} - {{ formatTime(order.end_time) }}
          </p>
          <p>{{ getDate(order.completion_date) }}</p>
        </div>
        <div class="col-md-3 col-sm-6 py-2">
          <p class="label">{{$t('bookings.serviceType')}}:</p>
          <!-- <p><img src="@/assets/img/online.jpg" /> Online</p> -->
          <p>{{ serviceTypeText }}</p>
          <p v-if="online">{{$t('bookings.online')}}</p>
          <p v-else-if="offline">{{$t('bookings.offline')}}</p>
        </div>
        <div class="col-md-3 col-sm-6 py-2">
          <p class="label">{{$t('bookings.bookingId')}}:</p>
          <p>#{{ order.order_id }}</p>
        </div>
      </div>

      <div class="d-flex p-3 py-4 justify-content-center" v-if="canBeMarkedComplete">
        <!-- <button class="btn btn-pill btn-outline-secondary" v-if="isBooking">
          Request for Completion Approval
        </button> -->
        <button class="btn btn-pill btn-outline-secondary" @click="showCompleteModal" >
          {{$t('bookings.markCompleted')}}
        </button>
      </div>

      <div class="d-flex p-3 py-4 justify-content-center" v-else-if="timeBased && !isMeetingTimeOver && order.status !== 'cancelled' && order.status !== 'completed'">
        <div class="position-relative">
          <button class="btn add-to-calendar d-flex align-items-center" @click="showCalendarDropdown">
            {{$t('bookings.addToCalendar')}}

            <!-- <i class="fas fa-chevron-down ml-2"></i> -->

            <div
              class="calendar-dropdown p-3 list-group"
              v-if="isCalendarOpen"
              v-click-outside="closeCalendarDropdown"
            >
              <div class="list-group-item list-group-item-action" @click="addToCalendar('google')">
                {{$t('bookings.googleCal')}}
                <i class="fas fa-external-link-alt"></i>
              </div>
              <div class="list-group-item list-group-item-action" @click="addToCalendar('outlook')">
                {{$t('bookings.outlookCal')}}
                <i class="fas fa-external-link-alt"></i>
              </div>
              <div class="list-group-item list-group-item-action" @click="addToCalendar('office365')">
                {{$t('bookings.officeCal')}}
                <i class="fas fa-external-link-alt"></i>
              </div>
              <div class="list-group-item list-group-item-action" @click="addToCalendar('ics')">
                {{$t('bookings.icsCal')}}
                <i class="fas fa-external-link-alt"></i>
              </div>
              <div class="list-group-item list-group-item-action" @click="addToCalendar('yahoo')">
                {{$t('bookings.yahooCal')}}
                <i class="fas fa-external-link-alt"></i>
              </div>
            </div>

          </button>
        </div>
        <button class="btn btn-pill btn-primary" :disabled="!isMeetingEnabled" v-if="meeting" @click="goToMeeting">
          {{$t('bookings.goToMeeting')}}
        </button>
      </div>


      <div class="d-flex p-3 py-4 justify-content-center" v-else-if="timeBased && isBooking && isMeetingTimeOver && order.status !== 'cancelled' && order.status !== 'completed'">
        {{$t('bookings.awaitingClientApproval')}}
      </div>

      <div class="d-flex p-3 py-4 justify-content-center" v-else-if="deliveryBased && isBooking && isPastCompletionDate && order.status !== 'cancelled' && order.status !== 'completed'">
        {{$t('bookings.awaitingClientApproval')}}
      </div>

    </div>


    <div class="mb-2 p-3 py-5 grey-border bg-light" v-if="order">
      <div class="justify-content-center text-center action-btns">
        <button class="my-1 btn btn-pill btn-outline-primary" @click="goToChat">
          {{$t('bookings.message')}}
        </button>
        <button class="my-1 btn btn-pill btn-outline-primary" @click="reschedule" v-if="!isBooking && timeBased && order.status === 'booked'">
          {{$t('bookings.reschedule')}}
        </button>
        <button class="my-1 btn btn-pill btn-outline-primary" @click="showReportModal">
          {{$t('bookings.report')}}
        </button>
        <button 
          @click="showCancelModal"
          v-if="order.status !== 'cancelled' && order.status !== 'completed'"
          class="my-1 btn btn-pill btn-outline-danger">
          {{$t('bookings.cancel')}}
        </button>
      </div>
    </div>

    <div class="mb-2 p-3 py-5 grey-border bg-light" v-if="order && order.status === 'completed' && !isBooking && !order.ratings.length">
      <div class="d-flex justify-content-center text-center">
        <base-button type="pill primary" @click="showReviewModal" >
          {{$t('bookings.writeReview')}}
        </base-button>
      </div>
    </div>

    <div class="grey-border mb-2" v-if="order && order.ratings.length">
      <div class="row p-3">
        <div class="col-md-6">
          <h5 class="theme-color mb-0 text-uppercase">{{$t('bookings.review')}}</h5>
        </div>
        <div class="col-md-6 text-right" v-if="!isBooking">
          <base-button type="pill primary" @click="showReviewModal" >
            {{$t('bookings.editReview')}}
          </base-button>
        </div>
      </div>
      <hr />
      <div class="row p-3 py-5 meta">
        <div class="col-md-4 col-12 d-flex flex-column align-items-center text-center">
          <h1 class="font-weight-bold">{{ review.avg_rating.toFixed(2) }}</h1>
          <base-rating :value="review.avg_rating" />
        </div>
        <div class="col-md-8 col-12 text-center text-md-left">
          <div class="row">
            <div class="col">
              <p class="text-muted">{{ review.review }}</p>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-12 col-sm-6 mt-3">
              <h5>{{$t('bookings.quality')}}</h5>
              <base-rating class="justify-content-center justify-content-md-start" :value="review.quality_rating"/>
            </div>
            <div class="col-12 col-sm-6 mt-3">
              <h5>{{$t('bookings.onTime')}}</h5>
              <base-rating class="justify-content-center justify-content-md-start" :value="review.time_rating"/>
            </div>
          <!-- </div> -->
          <!-- <div class="row mt-3"> -->
            <div class="col-12 col-sm-6 mt-3">
              <h5>{{$t('bookings.communication')}}</h5>
              <base-rating class="justify-content-center justify-content-md-start" :value="review.communication_rating"/>
            </div>
            <div class="col-12 col-sm-6 mt-3">
              <h5>{{$t('bookings.pricing')}}</h5>
              <base-rating class="justify-content-center justify-content-md-start" :value="review.pricing_rating"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grey-border" v-if="order && order.payment && !isBooking">
      <div class="row p-3">
        <div class="col-md-6">
          <h5 class="theme-color mb-0 text-uppercase">{{$t('bookings.paymentForOrder')}}</h5>
        </div>
        <div class="col-md-6">
          <p class="dsk-float-rt">
            <span style="font-size: 130%;" 
            :class="{ 
              'text-danger': order.payment.state === 'failed',
              'text-success': order.payment.state !== 'failed'
              }">{{
              order.payment.state.toUpperCase()
            }}</span>
          </p>
        </div>
      </div>
      <hr />
      <div class="row p-3 meta">
        <div class="col-md-3  col-sm-6 py-2">
          <p class="label">{{$t('bookings.orderNo')}}:</p>
          <p>#{{ order.payment.order_no }}</p>
        </div>
        <div class="col-md-3 col-sm-6 py-2">
          <p class="label">{{$t('common.status')}}:</p>
          <p>{{ order.payment.state }}</p>
        </div>
        <div class="col-md-3  col-sm-6 py-2">
          <p class="label">{{$t('common.amount')}}:</p>
          <p>{{ (+order.payment.amount).toFixed(3) }}</p>
        </div>
        <div class="col-md-3  col-sm-6 py-2">
          <p class="label">{{$t('common.currency')}}:</p>
          <p>{{ order.payment.currency_code }}</p>
        </div>
      </div>
      <div class="row p-3 meta">
        <div class="col-md-3  col-sm-6 py-2">
          <p class="label">{{$t('bookings.tranId')}}:</p>
          <p>{{ order.payment.gateway_response.tranid }}</p>
        </div>
        <div class="col-md-3  col-sm-6 py-2">
          <p class="label">{{$t('bookings.trackId')}}:</p>
          <p>{{ order.payment.gateway_response.trackid }}</p>
        </div>
        <div class="col-md-3  col-sm-6 py-2">
          <p class="label">{{$t('bookings.paymentId')}}:</p>
          <p>{{ order.payment.gateway_response.paymentid }}</p>
        </div>
      </div>
      <div class="p-3 text-right">
        <button class="btn btn-pill btn-outline-secondary" @click="printOrder">
          {{ $t('common.print') }}
        </button>
      </div>
    </div>

    <div class="grey-border" v-if="order && isBooking">
      <div class="row p-3">
        <div class="col-md-6">
          <h5 class="theme-color mb-0 text-uppercase">{{$t('bookings.paymentFromKhebrah')}}</h5>
        </div>
        <div class="col-md-6">
          <p  class="dsk-float-rt">
            <span style="font-size: 130%;" 
            :class="{ 
              'text-danger': order.expert_payment_status === 'pending',
              'text-success': order.expert_payment_status !== 'pending'
              }">{{
              order.expert_payment_status.toUpperCase()
            }}</span>
          </p>
        </div>
      </div>
      <hr />
      <div class="row p-3 meta">
        <div class="col-md-3 col-sm-6 py-2" v-if="order.paid_date">
          <p class="label">{{$t('bookings.paidDate')}}:</p>
          <p>{{ getDate(order.paid_date) }}</p>
        </div>
        <div class="col-md-3 col-sm-6 py-2">
          <p class="label">{{$t('common.status')}}:</p>
          <p>{{ order.expert_payment_status }}</p>
        </div>
        <div class="col-md-3 col-sm-6 py-2">
          <p class="label">{{$t('common.amount')}}:</p>
          <p v-if="order.paid_amount">{{ (+order.paid_amount).toFixed(3) }}</p>
          <p v-else-if="order.payment">{{ (+order.payment.amount).toFixed(3) }}</p>
          <p v-else>{{ (+order.price).toFixed(3) }}</p>
        </div>
        <div class="col-md-3  col-sm-6 py-2">
          <p class="label">{{$t('common.currency')}}:</p>
          <p>{{ $t('common.kd') }}</p>
        </div>
      </div>
      <div class="row p-2 meta" v-if="order.transaction_id">
        <div class="col-md-3 col-sm-6 py-2">
          <p class="label">{{$t('bookings.tranId')}}:</p>
          <p>{{ order.transaction_id }}</p>
        </div>
      </div>
      <div class="p-3 text-right" v-if="order.expert_payment_status === 'paid'">
        <button class="btn btn-pill btn-outline-secondary" @click="printOrder">
          {{$t('common.print')}}
        </button>
      </div>
    </div>

    <base-modal 
      v-if="order && order.status !== 'completed'"
      ref="cancelModal"
      :title="$t('bookings.cancelPrompt')">
      <base-checkbox v-model="agreeToCancel">
        {{ $t('bookings.agreeWith') }} <router-link target="_blank" :to="`/${$i18n.locale}/pages/cancellation-policy`"> {{ $t('bookings.cancellationPolicy')}} </router-link>
      </base-checkbox>
      <template v-slot:footer="{ hide }">
        <base-button :disabled="loading" type="secondary" @click="hide">{{$t('common.close')}}</base-button>
        <base-button :loading="loading" :disabled="!agreeToCancel" type="danger" :success="cancelSuccess" :success-message="$t('bookings.cancelSuccess')" @click="cancelOrder">{{$t('bookings.cancelConfirm')}}</base-button>
      </template>
    </base-modal>

    <base-modal 
      v-if="order && order.status !== 'cancelled'"
      ref="completeModal"
      :title="$t('bookings.completePrompt')">
      <template v-slot:footer="{ hide }">
        <base-button :disabled="loading" type="secondary" @click="hide">{{$t('common.close')}}</base-button>
        <base-button :loading="loading" type="success" :success="completeSuccess" :success-message="$t('bookings.completeSuccess')" @click="markCompleted">{{$t('bookings.completeConfirm')}}</base-button>
      </template>
    </base-modal>

    <base-modal 
      size="large"
      v-if="order && order.status === 'completed' && !isBooking"
      ref="reviewModal"
      :title="$t('bookings.reviewTitle')">
      <expert-service :meta="false" :service="order.service"></expert-service>
      <div class="row mt-4">
        <div class="col">
          <h5>{{$t('bookings.quality')}}</h5>
          <base-rating editable v-model="review.quality_rating"/>
        </div>
        <div class="col">
          <h5>{{$t('bookings.onTime')}}</h5>
          <base-rating editable v-model="review.time_rating"/>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col">
          <h5>{{$t('bookings.communication')}}</h5>
          <base-rating editable v-model="review.communication_rating"/>
        </div>
        <div class="col">
          <h5>{{$t('bookings.pricing')}}</h5>
          <base-rating editable v-model="review.pricing_rating"/>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col">
          <base-textarea :placeholder="$t('bookings.reviewPrompt')" v-model="review.review"/>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col text-center">
          <base-button 
            :success="reviewSuccess"
            :loading="loading"
            :success-message="$t('bookings.reviewSuccess')"
            type="pill primary" 
            @click.prevent="submitReview">
            {{ order.ratings.length ? $t('bookings.updateReview') : $t('bookings.submitReview') }}
          </base-button>
        </div>
      </div>
    </base-modal>

    <base-modal 
      ref="reportModal"
      :title="$t('bookings.reportTitle')">
          <validation-observer ref="reportForm" v-slot="{ handleSubmit }">
            <form class="needs-validation" novalidate 
              @submit.prevent="handleSubmit(submitReport)"
            >
              <div class="row mt-3">
                <div class="col">
                  <base-textarea rules="required" :placeholder="$t('bookings.reportMessage')" v-model="reportMessage"/>
                </div>
              </div>
              <div class="row mt-3">
                <div class="col text-center">
                  <base-button 
                    :success="reportSuccess"
                    :loading="loading"
                    :success-message="$t('bookings.reportSuccess')"
                    type="pill primary">
                    {{ $t('bookings.submitReport') }}
                  </base-button>
                </div>
              </div>
            </form>
          </validation-observer>
    </base-modal>

    <print-order ref="printOrder" :is-booking="isBooking" v-if="order" :order="order" />
    <service-booking type="reschedule" ref="booking" @rescheduleSuccess="fetchOrder" />

  </div>
</template>
<script>
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import PrintOrder from '@/app/user-module/component/printOrder.vue'

import dayjs from '@/plugins/dayjs'
// import qs from 'qs'
import { google, outlook, office365, yahoo, ics } from 'calendar-link'

import store from '@/store'

import ExpertService from '@/components/common/ExpertService.vue';
import ServiceBooking from '@/components/common/ServiceBooking.vue';

export default {
  components: {
    DashboardHeader,
    ExpertService,
    ServiceBooking,
    PrintOrder
  },
  data: () => ({
    order: null,
    loading: false,
    cancelSuccess: false,
    completeSuccess: false,
    reviewSuccess: false,
    isCalendarOpen: false,
    agreeToCancel: false,
    now: Date.now(),
    timer: null,
    review: {
    },
    reportMessage: '',
    reportSuccess: false
  }),
  metaInfo() {
    const title = this.isBooking
      ? 'Booking details'
      : 'Order details'
    return {
      title
    }
  },
  created() {
    this.timer = setInterval(() => this.now = Date.now(), 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  beforeRouteEnter(to, from, next) {
    const id = to.params.id
    store.dispatch('orders/getOrder', id)
      .then(data => {
        next(vm => {
          vm.order = data
          if (data.ratings.length) {
            vm.review = data.ratings[0]
          }

          window.order = data
          window.dayjs = dayjs
        })
      })
      .catch(error => {
        console.log(error)
      })
  },
  computed: {
    user() {
      return this.$store.getters['auth/user']
    },
    deliveryBased() {
      if (!this.order) return false
      return this.order.service.service_type === 'delivery based service'
    },
    timeBased() {
      if (!this.order) return false
      return this.order.service.service_type === 'duration based service'
    },
    serviceTypeText() {
      if (!this.order) return ''
      return this.order.service.service_type === 'delivery based service'
        ? this.$t('bookings.deliveryBased')
        : this.$t('bookings.timeBased')
    },
    isBooking() {
      return this.$route.path.includes('/bookings/')
    },
    online() {
      if (!this.order) return false
      return this.order.online
    },
    offline() {
      if(!this.order) return false
      return this.order.offline
    },
    meeting() {
      if (!this.online) return false

      return this.order.meetings && this.order.meetings[0]
    },
    isMeetingEnabled() {
      if (!this.timeBased || !this.online || !this.startTime || !this.endTime) return false

      const startWithBuffer = dayjs(this.startTime).subtract(5, 'minute')
      const endWithBuffer = dayjs(this.endTime).add(5, 'minute')

      return dayjs(this.now).isBetween(startWithBuffer, endWithBuffer)
    },
    isMeetingTimeOver() {
      if (!this.timeBased || !this.online || !this.startTime || !this.endTime) return false
      const endWithBuffer = dayjs(this.endTime).add(5, 'minute')

      return dayjs(this.now).isAfter(endWithBuffer)
    },
    isPastCompletionDate() {
      if (!this.order || !this.order.completion_date) return false

      return dayjs(this.now).isAfter(this.order.completion_date)
    },
    canBeMarkedComplete() {
      if(!order || order.status === 'cancelled' || order.status === 'completed' || this.isBooking) return false

      if (this.deliveryBased || (this.timeBased && this.isMeetingTimeOver)) return true
      else return false
    },
    startTime() {
      return this.order.start_time
      // if (!this.order.start_time) return null

      // return this.order.completion_date.slice(0, 11) + this.order.start_time + this.order.completion_date.slice(19, 25)
    },
    endTime() {
      return this.order.end_time
      // if (!this.order.end_time) return null

      // return this.order.completion_date.slice(0, 11) + this.order.end_time + this.order.completion_date.slice(19, 25)
    },
    // gcalLink() {
    //   if(!this.order || !this.startTime || !this.endTime) return ''

    //   let url = 'https://www.google.com/calendar/render?'

    //   url += qs.stringify({
    //     action: 'TEMPLATE',
    //     trp: false,
    //     text: this.order.service.service_name,
    //     details: this.order.service.description,
    //     dates: `${this.formatDate(this.startTime)}/${this.formatDate(this.endTime)}`, 
    //   })

    //   return url
    // },
    // mscalLink() {
    //   if(!this.order || !this.startTime || !this.endTime) return ''

    //   let url = 'https://outlook.live.com/calendar/0/deeplink/compose?'

    //   url += qs.stringify({
    //     path: '/calendar/action/compose',
    //     rru: 'addevent',
    //     subject: this.order.service.service_name,
    //     body: this.order.service.description,
    //     startdt: this.formatDateWithOffset(this.startTime), 
    //     enddt: this.formatDateWithOffset(this.endTime)
    //   })

    //   return url
    // },
    // officecalLink() {
    //   if(!this.order || !this.startTime || !this.endTime) return ''

    //   let url = 'https://outlook.office.com/calendar/0/deeplink/compose?'

    //   url += qs.stringify({
    //     path: '/calendar/action/compose',
    //     rru: 'addevent',
    //     subject: this.order.service.service_name,
    //     body: this.order.service.description,
    //     startdt: this.formatDateWithOffset(this.startTime), 
    //     enddt: this.formatDateWithOffset(this.endTime)
    //   })

    //   return url
    // },
  },
  methods: {
    reschedule() {
      if (!this.order || this.isBooking) return
      this.$refs.booking.rescheduleOrder(this.order)
    },
    printOrder() {
      this.$refs.printOrder.print()
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
    closeCalendarDropdown() {
      this.isCalendarOpen = false;
    },
    showCalendarDropdown() {
      this.isCalendarOpen = true;
    },
    addToCalendar(provider) {
      if (!this.startTime || !this.endTime) return

      const fns = {
        google,
        outlook,
        office365,
        yahoo,
        ics
      }

      const event = {
        title: this.order.service.service_name,
        description: this.order.service.description,
        start: this.startTime,
        end: this.endTime
      }

      const url = fns[provider](event)

      window.open(url, '_blank')
    },
    fetchOrder() {
      const id = this.$route.params.id
      this.$store.dispatch('orders/getOrder', id)
        .then(data => {
          this.loading = false
          this.order = data
          if (data.ratings.length) {
            this.review = data.ratings[0]
          }
        })
        .catch(error => {
          this.loading = false
          console.log(error)
        })
    },
    getDate(date) {
      if (!date) return '-'
      return dayjs(date).format('DD-MM-YYYY')
    },
    getInitials(user) {
      return (user.first_name || ' ')[0].toUpperCase() + (user.last_name || ' ')[0].toUpperCase()
    },
    goToChat() {
      // this.$router.push({ name: 'messages', query: { withUser: this.expert.profile.pk }})
      this.$Progress.start()
      this.$store.dispatch('chat/fetchOrCreateRoom', { order_id: this.order.order_id })
        .then((data) => {
          data.recipients = data.recipients.filter(r => r.profile.pk !== this.user.pk)
          if (!data.last_message) data.last_message = null
          this.$store.commit('chat/setExpertRoom', data)
          this.$router.push({ name: 'messages', query: { room: data.room_name }})
        })
        .catch(error => {
          console.log(error)
          this.$Progress.fail()
        })
    },
    goToMeeting() {
      if (!this.isMeetingEnabled) return
      this.$router.push({ name: 'meeting', params: { id: this.order.order_id } })
    },
    cancelOrder() {
      this.loading = true
      this.$store.dispatch('orders/updateStatus', { id: this.order.order_id, status: 'cancelled' })
        .then(response => {
          this.loading = false
          this.fetchOrder()
          this.cancelSuccess = true
          setTimeout(() => {
            this.cancelSuccess = false
            this.hideCancelModal()
          }, 1000)
        })
        .catch(error => {
          this.loading = false
        })
    },
    markCompleted() {
      this.loading = true
      this.$store.dispatch('orders/updateStatus', { id: this.order.order_id, status: 'completed' })
        .then(response => {
          this.loading = false
          this.fetchOrder()
          this.completeSuccess = true
          setTimeout(() => {
            this.completeSuccess = false 
            this.hideCompleteModal()
          }, 1000)
        })
        .catch(error => {
          this.loading = false
        })
    },
    submitReview() {
      this.loading = true
      const { 
        quality_rating,
        time_rating,
        communication_rating,
        pricing_rating,
        review,
      } = this.review
      const action = this.order.ratings.length 
        ? 'orders/updateReview'
        : 'orders/addReview'
      const data = {
        order: this.order.id, 
        quality_rating,
        time_rating,
        communication_rating,
        pricing_rating,
        review
      }

      if (this.order.ratings.length) {
        data.id = this.order.ratings[0].id
      }
      this.$store.dispatch(action, data)
        .then(response => {
          this.loading = false
          this.reviewSuccess = true
          this.fetchOrder()
          setTimeout(() => {
            this.reviewSuccess = false 
            this.hideReviewModal()
          }, 1000)
        })
        .catch(error => {
          this.loading = false
        })
    },
    submitReport() {
      this.loading = true
      const data = {
        order_id: this.order.order_id, 
        message: this.reportMessage
      }

      this.$store.dispatch('orders/reportOrder', data)
        .then(response => {
          this.loading = false
          this.reportSuccess = true
          setTimeout(() => {
            this.reportSuccess = false 
            this.reportMessage = ''
            this.$refs.reportForm.reset()
            this.hideReportModal()
          }, 1500)
        })
        .catch(error => {
          this.loading = false
        })
    },
    formatString(string) {
      return encodeURIComponent(string).replace(/%20/g, '+') 
    },
    // formatDate(date) {
    //   return dayjs(date).utc().format('YYYYMMDD[T]HHmmss[Z]')
    // },
    // formatDateWithOffset(date) {
    //   return dayjs(date).utc().format('YYYY-MM-DD[T]HH:mm:ssZ')
    // },
    showCancelModal() {
      if (this.$refs.cancelModal) this.$refs.cancelModal.show()
    },
    showCompleteModal() {
      if (this.$refs.completeModal) this.$refs.completeModal.show()
    },
    showReviewModal() {
      if (this.$refs.reviewModal) this.$refs.reviewModal.show()
    },
    showReportModal() {
      if (this.$refs.reportModal) this.$refs.reportModal.show()
    },
    hideCancelModal() {
      if (this.$refs.cancelModal) this.$refs.cancelModal.hide()
    },
    hideCompleteModal() {
      if (this.$refs.completeModal) this.$refs.completeModal.hide()
    },
    hideReviewModal() {
      if (this.$refs.reviewModal) this.$refs.reviewModal.hide()
    },
    hideReportModal() {
      if (this.$refs.reportModal) this.$refs.reportModal.hide()
    },
  },
};
</script>
<style scoped>
.meta {
  font-size: 15px;
}
.label {
  font-size: 12px;
}
.gen-pad {
  padding: 20px;
}
.avatar {
  margin-right: 5px;
}
.rtl .avatar {
  margin-right: unset;
  margin-left: 5px;
}
hr {
  height: 1px;
  border-width: 0;
  background-color: #e5e5e5;
  margin: 0;
}
.add-to-calendar {
  color: #044982; 
}
.btn-pill, .add-to-calendar {
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
.btn-primary {
  background-color: #044982;
  border-color: #044982;
}
.btn-outline-secondary:not(:hover), .add-to-calendar {
  background-color: #f8f8f8;
  border-color: #e5e5e5;
}
.calendar-dropdown {
  /* background: #f0f0f0; */
  position: absolute;
  right: 0;
  margin-top: 10px;
  width: 100%;
  padding: 0 !important;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}
.rtl .calendar-dropdown {
  right: unset;
  left: 0;
}
.calendar-dropdown .list-group-item {
  cursor: pointer;
  color: #044982;
  display: flex;
  justify-content: space-between;
}
h5 {
  color: #044982;
}
@media only screen and (min-width: 769px) {
  .dsk-float-rt {float:right;}
  .rtl .dsk-float-rt {
    float: left;
  }
}
@media only screen and (max-width: 768px) {
  .action-btns .btn {
    width: 100%;
  }
}

</style>
