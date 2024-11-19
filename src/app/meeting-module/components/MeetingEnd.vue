<template>
  <div class="container-fluid meeting-main">
    <div class="row">
      <div class="col-12 text-center">
        <h2 class="mb-3" v-if="!meetingOver">{{$t('meeting.leftMeeting')}}</h2>
        <h2 class="mb-3" v-else>{{$t('meeting.meetingEnded')}}</h2>
        <div class="d-flex justify-content-center flex-column flex-sm-row">
          <base-button class="mr-2" type="outline-secondary pill" :disabled="!meetingEnabled || isMarkedComplete" @click="$emit('rejoin')" >
            {{ $t('meeting.rejoin') }}
          </base-button>
          <base-button class="mt-2 mt-sm-0" type="primary pill" @click="showCompleteModal" v-if="!selfIsExpert && !isMarkedComplete" >
            {{$t('bookings.markCompleted')}}
          </base-button>
          <base-button class="mt-2 mt-sm-0" type="primary pill" @click="showReviewModal" v-if="!selfIsExpert && isMarkedComplete" >
            {{$t('bookings.writeReview')}}
          </base-button>
        </div>
        
      </div>
    </div>

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
      ref="reviewModal"
      title="How was your experience?">
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
            {{ $t('bookings.submitReview') }}
          </base-button>
        </div>
      </div>
    </base-modal>

  </div>
</template>

<script>
import ExpertService from '@/components/common/ExpertService.vue';
export default {
  components: {
    ExpertService
  },
  props: {
    order: {
      type: Object,
      required: true
    },
    meetingEnabled: {
      type: Boolean,
      default: false
    },
    meetingOver: {
      type: Boolean,
      default: false
    },
    selfIsExpert: {
      type: Boolean,
      default: false
    },
  },
  data: () => ({
    loading: false,
    completeSuccess: false,
    isMarkedComplete: false,
    reviewSuccess: false,
    review: {},
  }),
  watch: {
    order: {
      handler(order) {
        if (order) this.isMarkedComplete = order.status === 'completed'
      },
      immediate: true
    }
  },
  computed: {
  },
  methods: {
    markCompleted() {
      this.loading = true
      this.$store.dispatch('orders/updateStatus', { id: this.order.order_id, status: 'completed' })
        .then(response => {
          this.loading = false
          this.isMarkedComplete = true
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
          // this.fetchOrder()
          setTimeout(() => {
            this.reviewSuccess = false 
            this.hideReviewModal()
            this.$emit('goToBooking')
          }, 1000)
        })
        .catch(error => {
          this.loading = false
        })
    },
    showReviewModal() {
      if (this.$refs.reviewModal) this.$refs.reviewModal.show()
    },
    hideReviewModal() {
      if (this.$refs.reviewModal) this.$refs.reviewModal.hide()
    },
    showCompleteModal() {
      if (this.$refs.completeModal) this.$refs.completeModal.show()
    },
    hideCompleteModal() {
      if (this.$refs.completeModal) this.$refs.completeModal.hide()
    },
  }

}
</script>

<style>

</style>