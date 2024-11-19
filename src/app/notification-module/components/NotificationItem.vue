<template>
  <div class="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
      <!-- <img src="https://github.com/twbs.png" alt="twbs" class="rounded-circle flex-shrink-0 mr-3" width="32" height="32"> -->
      <div class="item d-flex gap-2 w-100 justify-content-between">
        <div>
            <h6 class="mb-0" v-html="title"></h6>
            <p class="mb-0 opacity-75">{{ notification.text }}</p>
            <small class="opacity-50 text-nowrap">{{ timestamp }}</small>
        </div>
        <div class="actions">
          <base-button v-if="hasBooking" :to="{name: 'BookingDetails', params: {id: notification.content.order.order_id}}" type="outline-primary"> {{$t('notifications.viewBooking')}}</base-button>
          <base-button v-else-if="hasOrder" :to="{name: 'OrderDetails', params: {id: notification.content.order.order_id}}" type="outline-primary"> {{$t('notifications.viewOrder')}}</base-button>
        </div>
      </div>
  </div>
</template>
<script>
import dayjs from '@/plugins/dayjs'

export default {
  props: {
    notification: Object
  },

  computed: {
    title() {
      return this.$t(`notifications.${this.notification.action}`)
      // switch (this.notification.action) {
      //   case 'user_book_session':
      //     return ""
      //   case 'user_cancel_session':
      //     return ""
      //   case 'user_marked_completed':
      //     return '' 

      //   case 'payment_credited':
      //     return '' 

      //   case 'expert_cancel_session':
      //     return ""
      //   case 'expert_marked_completed':
      //     return '' 
      //   default:
      //     return ''
      // }
    },
    user() {
      return this.$store.getters['auth/user']
    },
    timestamp () {
      const date =  dayjs(this.notification.timestamp)
      if (date.isYesterday()) return this.$t('common.yesterday')
      else if (date.isToday()) return date.format('hh:mm a')
      else return date.format('DD-MM-YYYY')
    },
    hasBooking() {
      return (['user_book_session', 'user_cancel_session', 'user_marked_completed', 'payment_credited'].includes(this.notification.action) 
      || (this.notification.action === 'before_session_start' && this.notification.content.order.order_on.id === this.user.pk))
      && this.notification.content.order
    },
    hasOrder() {
      return (['expert_cancel_session', 'expert_marked_completed'].includes(this.notification.action) 
      || (this.notification.action === 'before_session_start' && this.notification.content.order.user.id === this.user.pk))
      && this.notification.content.order
    },
  }
}
</script>
<style scoped>
  @media (max-width: 768px) {
    .item {
      flex-direction: column;
    }
    .actions {
      margin-top: 5px;
    }
  }
</style>