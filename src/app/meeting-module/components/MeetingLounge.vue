<template>
  <div class="container-fluid meeting-main">
    <div class="d-flex justify-content-center align-items-center bubble-container">

    <div class="position-relative">
      <meeting-bubble 
        :profile="self" 
        id="lounge-video"
        :track="localTrack" />

      <div class="meeting-controls">
        <div class="control-btn" @click="$emit('toggleAudio')" :class="{ 'text-danger': localTrack.audioMuted }">
          <i class="fas fa-microphone" v-if="!localTrack.audioMuted"></i>
          <i class="fas fa-microphone-slash" v-else></i>
        </div>
        <div class="control-btn" @click="$emit('toggleVideo')" :class="{ 'text-danger': localTrack.videoMuted }">
          <i class="fas fa-video" v-if="!localTrack.videoMuted"></i>
          <i class="fas fa-video-slash" v-else></i>
        </div>
      </div>
    </div>

      <div class="meeting-details p-5">
        <div v-if="order && order.service">
          <h2>{{ order.service.service_name }}</h2>
          <a class="text-muted" href="" @click.prevent="$emit('goToBooking')">#{{order.order_id}}</a>
          <div class="border p-3 mt-3 meeting-meta">
            <p>{{ formattedStartTime }} - {{ formattedEndTime }}</p>
            <p>
              {{$t('service.duration')}}: {{ order.service.duration }} {{durationUnit}}
            </p>

          </div>
          <button v-if="meetingEnabled && !meetingCompleted" class="btn btn-primary btn-pill mt-5" @click="$emit('join')" >{{$t('meeting.join')}}</button>
          <div class="mt-5" v-else-if="meetingOver || meetingCompleted">{{$t('meeting.meetingEnded')}}</div>
          <div class="mt-5" v-else>{{$t('meeting.meetingJoinMsg')}} {{formattedStartTimeWithBuffer}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MeetingBubble from '@/app/meeting-module/components/MeetingBubble.vue'
import dayjs from '@/plugins/dayjs'
export default {
  components: {
    MeetingBubble
  },
  props: {
    order: {
      type: Object,
      required: true
    },
    localTrack: {
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
    meetingCompleted: {
      type: Boolean,
      default: false
    },
    self: {
      type: Object,
      required: true
    }
  },
  computed: {
    formattedStartTime() {
      return dayjs(this.startTime).format('hh:mm a')
    },
    formattedEndTime() {
      return dayjs(this.endTime).format('hh:mm a')
    },
    formattedStartTimeWithBuffer() {
      return dayjs(this.startTime).subtract(5, 'minute').format('hh:mm a')
    },
    startTime() {
      return this.order.start_time
    },
    endTime() {
      return this.order.end_time
    },
    durationUnit() {
      if (!this.order || !this.order.service) return ''
      const unit = {
        'M': 'minute',
        'H': 'hour',
        'D': 'day'
      }[this.order.service.duration_in]
      return this.order.service.duration === 1
        ? this.$t(`common.${unit}`)
        : this.$t(`common.${unit}s`)
    },
  }

}
</script>

<style scoped>
  .meeting-details {
    min-width: 40vw;
  }
.meeting-meta {
  background-color: #eee;
  border-color: #e3e3e3;
  border-radius: 7px;
  width: 250px;
}
.meeting-controls {
  font-size: 16px;
  line-height: 1;
  border-radius: 10px;
  display: flex;
  padding: 7px;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
}
.control-btn {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  text-align: center;
  padding: 10px;
  border: 2px solid;
  color: #fff;
  cursor: pointer;
}
.meeting-controls > * + * {
  margin-left: 15px;
}
@media (max-width: 1200px) {
  /deep/ .preview {
    max-width: 400px;
    max-height: 290px;
    min-width: 0;
    min-height: 0;
  }
}
@media (max-width: 768px) {
  h2 {
    font-size: 24px;
  }
  .meeting-meta {
    margin: 0 auto;
  }
  .btn {
    padding-left: 50px;
    padding-right: 50px;
  }
  /deep/ .preview {
    max-width: 300px;
    max-height: 220px;
    min-width: 0;
    min-height: 0;
  }
  .meeting-details {
    padding: 20px !important;
  }
  .bubble-container {
    flex-direction: column;
    text-align: center;
  }
}
</style>