<template>
  <div class="p-2 d-flex align-items-start">
    <base-avatar :is-expert="isExpert" :first-name="firstName" :last-name="lastName" :src="sender.profile_img" :size="30" />
    <div class="px-2 pl-3">
      <div class="d-flex align-items-center">
        <div class="name text-primary font-weight-bold">
          {{ sender.first_name + ' ' + sender.last_name }}
        </div>
        <time class="text-black-50 ml-2"> {{ formatTime(message.timestamp) }} </time>
      </div>
      <p>
        {{ message.message }}
      </p>
      <div class="service p-3 border rounded" v-if="message.service">
        <expert-service :service="message.service">
          <div class="d-flex mt-2 justify-content-center">
            <base-button
              type="primary pill"
              @click="$emit('checkout', message.service)"
              v-if="message.service.user !== user.pk"
            >{{$t('service.book')}}</base-button>
          </div>
        </expert-service>
      </div>
    </div>
  </div>
</template>
<script>
import dayjs from '@/plugins/dayjs'
import ExpertService from '@/components/common/ExpertService.vue'

export default {
  props: {
    message: {
      type: Object,
      default: () => {}
    },
    sender: {
      type: Object,
      default: () => {}
    }
  },

  components: {
    ExpertService
  },

  computed: {
    user() {
      return this.$store.getters['auth/user']
    },
    isExpert() {
      return this.sender.profile.is_expert 
    },
    firstName() {
      return this.sender.first_name 
    },
    lastName() {
      return this.sender.last_name 
    },
  },

  methods: {
    formatTime() {
      let time = dayjs(this.message.timestamp).format('hh:mm a')
      const unit = time.slice(-2)
      time = time.slice(0, -2) + this.$t(`common.${unit}`)
      return time
    },
  }
}
</script>
<style scoped>
  time {
    font-size: 10px;
    line-height: 1;
  }
  .service {
    background: #fafafa;
  }
</style>