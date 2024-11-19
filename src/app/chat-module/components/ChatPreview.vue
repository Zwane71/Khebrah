<template>
  <div 
  :class="{ active: active }"
  class="hoverable d-flex align-items-center px-2 py-1 border-bottom cursor-pointer rounded mt-1 mb-1" >
    <base-avatar :is-expert="isExpert" :first-name="firstName" :last-name="lastName" :src="image" :size="40" />
    <div class="p-2 o-hidden fill">
      <div class="d-flex justify-content-between align-items-center pt-1">
        <div class="name">
          {{ name }}
        </div>
        <time class="text-black-50" v-if="room.last_message"> {{ lastTimestamp }} </time>
      </div>
      <div v-if="room.order" class="clipped">{{ room.order.service_title }}</div>
      <div class="d-flex justify-content-between align-items-center pt-1">
        <small class="ellipsis font-weight-light text-black-50" v-if="room.last_message">{{ lastMessage }}</small>
        <div class="unread-count" v-if="room.unread_messages">{{ room.unread_messages }}</div>
      </div>
    </div>

  </div>
</template>

<script>
import dayjs from '@/plugins/dayjs'

export default {
  props: {
    room: Object,
    active: Boolean
  },

  computed: {
    name() {
      if (!this.room || !this.room.recipients[0]) return ''
      return this.room.recipients[0].first_name + ' ' + this.room.recipients[0].last_name
    },
    image() {
      return this.room && this.room.recipients[0] && this.room.recipients[0].profile_img 
    },
    isExpert() {
      return this.room && this.room.recipients[0] && this.room.recipients[0].profile.is_expert 
    },
    firstName() {
      if (!this.room || !this.room.recipients[0]) return ''
      return this.room.recipients[0].first_name 
    },
    lastName() {
      if (!this.room || !this.room.recipients[0]) return ''
      return this.room.recipients[0].last_name 
    },
    lastMessage() {
      return this.room.last_message
        ? this.room.last_message.message
        : ''
    },
    lastTimestamp () {
      if (!this.room.last_message) return ''
      const date =  dayjs(this.room.last_message.timestamp)
      if (date.isYesterday()) return 'Yesterday'
      else if (date.isToday()) return date.format('HH:mm')
      else return date.format('DD-MM-YYYY')
    },
  }
}
</script>

<style scoped>
  .hoverable:hover {
    background: hsla(207, 100%, 95%, 1)
  }
  .active {
    background: hsla(207, 100%, 90%, 1) !important
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }
  .name {
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 10px;
    color: #39425d;
  }
  .rtl .name {
    padding-right: unset;
    padding-left: 10px;
  }
  .unread-count {
    background: #39425d;
    color: #fff;
    border-radius: 50%; 
    height: 20px;
    width: 20px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    top: -3px;
  }
  .o-hidden {
    overflow: hidden;
  }
  small {
    font-size: 14px;
  }
  time {
    font-size: 10px;
    line-height: 1;
    white-space: nowrap;
  }
  .fill {
    flex: 1;
  }
</style>

