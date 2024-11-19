<template>
  <dashboard-layout>
    <template v-slot:title>
      <h1 class="text-white">{{$t('notifications.notifications')}}</h1>
    </template>
    <div class="row" v-if="notifications.length">
      <div class="col-12">
        <div class="base-box py-3 px-3">
          <!-- <div class="border-bottom mb-2">
            <h2>Notifications</h2>
          </div> -->
          <NotificationList :notifications="notifications"/>
        </div>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col-12">
        <div class="base-box empty text-center">
          {{$t('notifications.empty')}}
        </div>
      </div>
    </div>
  </dashboard-layout>
</template>
<script>
import NotificationList from "@/app/notification-module/components/NotificationList.vue";
import store from '@/store'

export default {
  components: {
    NotificationList,
  },

  metaInfo: {
    title: 'Notifications | Khebrah'
  },

  beforeRouteEnter(to, from, next) {
    store.dispatch('notifications/fetchNotifications')
      .then(data => {
        next()
      })
      .catch(error => console.log(error))
  },

  watch: {
    notifications: {
      handler() {
        this.$store.dispatch('notifications/markAllAsRead')
      },
      immediate: true
    }
  },

  computed: {
    notifications() {
      return this.$store.getters['notifications/notifications']
    }
  }
};
</script>

<style scoped>
h2 {
  color: #39425d;
}
.base-box {
  min-height: 40vh;
}
.empty {
  padding: 150px 20px;
}
</style>
