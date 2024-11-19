<template>
<div>
  <div class="d-flex align-items-center justify-content-between chat-header">
    <div class="d-flex align-items-center">
      <base-button 
        class="d-lg-none"
        @click="goBack">
        <i class="fas fa-arrow-left rtl-icon mr-2"></i> 
      </base-button>
      <base-avatar :is-expert="recipientIsExpert" :first-name="firstName" :last-name="lastName" :src="image" :size="49" />
      <div class="p-2">
        <div class="name text-primary font-weight-bold">
          {{ name }}
        </div>
        <div v-if="room.order">
          [#{{room.order.order_id}}] {{ room.order.service_title }}
        </div>
      </div>
    </div>

    <div class="d-flex action-btns">
      <base-button @click="openServiceModal" class="mr-2" type="primary" v-if="isExpert && !room.order">
        {{ $t('chat.sendCustomService') }}
      </base-button>
      <base-button :to="{name: 'OrderDetails', params: {id: room.order.order_id}}" class="mr-2" type="primary" v-if="room.order && room.order.user === this.user.pk">
        {{ $t('chat.visitOrder') }}
      </base-button>
      <base-button :to="{name: 'BookingDetails', params: {id: room.order.order_id}}" class="mr-2" type="primary" v-else-if="room.order">
        {{ $t('chat.visitBooking') }}
      </base-button>
      <base-button type="primary" v-if="expertUsername" :to="{ name: 'expertProfile', params: { username: expertUsername }}">
        {{ $t('chat.visitProfile') }}
      </base-button>
    </div>
    <!-- <div class="options ml-auto">
      <i class="fas fa-ellipsis-v"></i>
    </div> -->
  </div>
  <div ref="messages" class="border-top mt-2 border-bottom chat-messages" :class="{ loading: loading }">
    <infinite-loading v-if="!loading && count > messages.length" direction="top" @infinite="loadMore" />

    <span v-if="loading" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
    <div v-for="date in sortedMessages" :key="date.date" v-else>
      <div class="date-divider">
        <span>{{ date.date }}</span>
      </div>
      <ChatBubble @checkout="checkout" :message="message" :sender="getSender(message)" v-for="message in date.messages" :key="message.id"/>
    </div>
  </div>
  <div class="d-flex mt-3">
    <input type="text" class="form-control mr-2" :placeholder="$t('chat.messagePlaceholder')" v-model="currentMessage" @keypress.enter="sendMessage">
    <base-button type="primary" class="px-3 px-md-5 send-btn" @click="sendMessage" :loading="sendingMessage">
      <div class="d-none d-md-block">
        {{$t('chat.send')}}
      </div>
      <div class="d-md-none plane-icon">
        <i class="fas fa-paper-plane"></i>
      </div>
    </base-button>
  </div>

  <base-modal
    size="large"
    ref="serviceModal"
    :title="$t('chat.sendCustomService')"
    >
    <create-service :custom="true" @create="onServiceCreate" />
  </base-modal>

  <service-booking ref="booking" />

</div>
    
</template>
<script>
import dayjs from '@/plugins/dayjs'
import InfiniteLoading from 'vue-infinite-loading'

import ChatBubble from '@/app/chat-module/components/ChatBubble.vue'
import CreateService from "@/app/expert-module/components/createService.vue";
import ServiceBooking from '@/components/common/ServiceBooking.vue'

export default {
  components: {
    ChatBubble,
    CreateService,
    ServiceBooking,
    InfiniteLoading
  },

  props: {
    roomId: {
      type: String
    },
    room: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    currentMessage: '',
    count: 0,
    page: 0,
    limit: 10,
    loading: false,
    sendingMessage: false
  }),

  watch: {
    roomId: {
      handler(value) {
        this.currentMessage = ''
        if (!value) return
        // this.messages = []
        this.loading = true
        this.page = 0
        this.$store.commit('chat/clearMessages')
        const filters = { offset: this.page*this.limit, limit: this.limit }
        this.$store.dispatch('chat/fetchMessages', { room: value, filters })
          .then(data => {
            this.loading = false
            this.count = data.count
            this.$store.dispatch('chat/markAllAsRead', value)
            // this.messages = data
          })
          .catch(error => {
            this.loading = false
          })
      },
      immediate: true
    },
    '$store.state.chat.pendingScroll' (value) {
      if (value === true) {
        setTimeout(() => {
          this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
        }, 50)
        this.$store.commit('chat/setPendingScroll', false)
      }
    }
    // sortedMessages: {
    //   handler(value) {
    //     // setTimeout(() => {
    //     //   this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
    //     // }, 50)
    //   }
    // }
  },

  computed: {
    user() {
      return this.$store.getters['auth/user']
    },
    isExpert() {
      return this.$store.getters['auth/isExpert']
    },
    profile() {
      return this.$store.getters['user/profile']
    },
    name() {
      return this.firstName + ' ' + this.lastName
    },
    recipientIsExpert() {
      if (!this.room || !this.room.recipients[0]) return false
      return this.room.recipients[0].profile.is_expert 
    },
    firstName() {
      if (!this.room || !this.room.recipients[0]) return ''
      return this.room.recipients[0].first_name 
    },
    lastName() {
      if (!this.room || !this.room.recipients[0]) return ''
      return this.room.recipients[0].last_name 
    },
    image() {
      if (!this.room || !this.room.recipients[0]) return ''
      return this.room.recipients[0].profile_img 
    },
    expertUsername() {
      const user = this.room.recipients[0] 
      if (!user.profile.is_expert) return null

      return user.profile.username
    },
    messages() {
      return this.$store.getters['chat/activeRoomMessages']
    },
    sortedMessages() {
      return this.messages.reduce((acc, message) => {
        const chatsOnDate = acc.find(chat => chat.date === dayjs(message.timestamp).format('DD-MM-YYYY'))
        if (chatsOnDate) chatsOnDate.messages.unshift(message)
        else acc.unshift({ date: dayjs(message.timestamp).format('DD-MM-YYYY'), messages: [message] })
        return acc
      }, [])
    },
  },

  methods: {
    loadMore($state) {
      this.page += 1
      // this.loading = true
      const filters = { offset: this.page*this.limit, limit: this.limit }
      this.$store.dispatch('chat/loadMoreMessages', filters)
        .then(data => {
          // this.loading = false
          this.count = data.count
          if (this.count > this.messages.length) {
            $state.loaded()
          } else {
            $state.complete()
          }
        })
        .catch(error => {
          this.loading = false
        })
    },
    goBack() {
      this.$router.push({ name: 'messages' })
    },
    sendMessage() {
      if (!this.currentMessage.length) return
      const data = {
        message: this.currentMessage
      }
      this.sendingMessage = true
      this.$store.dispatch('chat/postMessage', { room: this.roomId, data })
        .then(() => {
          this.sendingMessage = false
          this.currentMessage = ''
        })
        .catch(error => {
          this.sendingMessage = false
          console.log(error)
        })
    },
    getSender(message) {
      if (message.sender.pk === this.user.pk) return this.profile
      return this.room.recipients.find(user => user.profile.pk === message.sender.pk)
    },
    openServiceModal() {
      this.$refs.serviceModal.show()
    },
    hideServiceModal() {
      this.$refs.serviceModal.hide()
    },
    onServiceCreate(service) {
      const data = {
        service_id: service.service_id,
        message: ''
      }
      this.sendingMessage = true
      this.hideServiceModal()
      this.$store.dispatch('chat/postMessage', { room: this.roomId, data })
        .then(() => {
          this.sendingMessage = false
        })
        .catch(error => {
          this.sendingMessage = false
        })
    },
    checkout(service) {
      if (!this.expertUsername) {
        console.error('Not an expert')
        return
      }
      this.$refs.booking.navigateToCheckout(service, this.room.recipients[0])
    }
  }
}
</script>

<style scoped>
  .chat-messages {
    height: 400px;
    /* display: flex;
    justify-content: flex-end;
    flex-direction: column; */
    overflow-y: auto;
  }
  .chat-messages > div {
    width: 100%;
  }
  .chat-messages.loading {
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .date-divider {
    width: 100%;
    border-bottom: 1px solid;
    text-align: center;
    font-size: 12px;
    color: #aaa;
    position: relative;
    top: -10px
  }
  .date-divider span {
    background: #fff;
    position:relative;
    top: 10px;
    padding: 0 5px;
  }
  .form-control {
    width: auto;
    flex: 1;
  }
  .rtl .plane-icon {
    transform: rotate(-90deg)
  }
  @media (max-width: 991px) {
    .chat-header {
      flex-direction: column;
      align-items: flex-start !important;
    }
    .action-btns {
      margin-left: 50px;
      margin-top: 10px;
    }
    .rtl .action-btns {
      margin-left: unset;
      margin-right: 50px;
    }
  }
</style>
