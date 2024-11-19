<template>
  <dashboard-layout>
    <template v-slot:title>
      <h1 class="text-white">{{ $t('chat.messages') }}</h1>
    </template>
    <div class="base-box">
      <!-- <div class="border-bottom mb-2">
        <h2>Messages</h2>
      </div> -->
      <div class="row no-gutters chat-layout" :class="{ 'chat-open': activeRoomId && activeRoom }" v-if="rooms.length">
        <div class="col-6 col-lg-3 chat-sidebar">
          <ChatSidebar :active-room="activeRoomId" :rooms="rooms" />
        </div>
        <div class="col-6 col-lg-9 chat-detail">
          <ChatDetail :room-id="activeRoomId" :room="activeRoom" v-if="activeRoomId && activeRoom"/>
          <div v-else class="unselected-message d-flex align-items-center justify-content-center">
            {{ $t('chat.noChatSelected') }}
          </div>
        </div>
      </div>
      <div class="row" v-else>
        <div class="col-12 empty text-center">
          {{ $t('chat.empty') }}
        </div>
      </div>
    </div>
  </dashboard-layout>
</template>
<script>
import ChatSidebar from "@/app/chat-module/components/ChatSidebar.vue";
import ChatDetail from "@/app/chat-module/components/ChatDetail.vue";

import store from '@/store'

export default {
  components: {
    ChatSidebar,
    ChatDetail
  },

  metaInfo: {
    title: 'Messages | Khebrah'
  },

  beforeRouteEnter(to, from, next) {
    store.dispatch('chat/fetchRooms')
      .then(data => {
        next(vm => {
          // if (!to.query.room && data.length) vm.$store.commit('chat/setActiveRoomId', data[0].room_name) 
        })
      })
      .catch(error => console.log(error))
  },

  watch: {
    '$route.query': {
      handler() {
        if(this.$route.query && this.$route.query.room) {
          this.$store.commit('chat/setActiveRoomId', this.$route.query.room)
        } else {
          this.$store.commit('chat/setActiveRoomId', null)
        }
      },
      immediate: true
    }
  },

  computed: {
    activeRoomId() {
      return this.$store.getters['chat/activeRoomId']
    },
    activeRoom() {
      return this.activeRoomId
        ? this.rooms.find(room => this.activeRoomId === room.room_name)
        : this.rooms[0]
    },
    rooms() {
      return this.$store.getters['chat/rooms']
    }
  },

  beforeDestroy() {
    this.$store.commit('chat/clearExpertRoom')
  }
};
</script>

<style scoped>
h2 {
  color: #39425d;
}
.empty {
  padding: 150px 20px;
}
.unselected-message {
  padding: 150px 20px;
}
.chat-detail {
  /* border-left: 1px solid; */
  padding-left: 20px;
}
.rtl .chat-detail {
  padding-left: 0;
  padding-right: 20px;
}
@media (min-width: 992px) {
}
@media (max-width: 991px) {
  .base-box {
    overflow: hidden;
  }
  .chat-layout {
    width: 200%;
    transition: left 0.15s;
    transform: none;
    position: relative;
    left: 0;
  }
  .chat-layout.chat-open {
    /* transform: translateX(calc(-50% - 15px)); */
    left: calc(-100% - 15px);
  }
  .rtl .chat-layout.chat-open {
    /* transform: translateX(calc(50% + 15px)); */
    left: calc(100% + 15px);
  }
}
</style>
