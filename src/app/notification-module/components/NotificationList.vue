<template>
  <div class="list-group">
    <notification-item v-for="(item, index) in notifications" :key="index" :notification="item" />
  </div>
</template>
<script>
import NotificationItem from '@/app/notification-module/components/NotificationItem.vue'
export default {
   props: {
      notifications: {
         type: Array,
         default: () => []
      }
   },
   components: {
      NotificationItem
   },
}
</script>
