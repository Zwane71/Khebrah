<template>
  <div class="container-fluid meeting-main" :class="{'screen-active': screenTrack.video }">
    <div class="d-flex justify-content-center">
      <meeting-bubble 
        v-if="screenTrack.video"
        :track="screenTrack"
        :profile="{ id: 'screen' }"/>

      <div class="video-tracks">
        <meeting-bubble 
          v-if="guestTrack.joined"
          mirrored
          :small="!!screenTrack.video"
          :minimizable="!!screenTrack.video"
          :floating="screenTrack.video && windowWidth < 768"
          id="guest-video"
          :profile="guest" 
          :track="guestTrack" />

        <meeting-bubble 
          :profile="self" 
          :small="!!screenTrack.video"
          :minimizable="!!screenTrack.video || guestTrack.joined"
          :floating="guestTrack.joined && !screenTrack.video"
          v-if="!screenTrack.video || windowWidth >= 768"
          id="user-video"
          :track="localTrack" />
      </div>

    </div>

    <div class="meeting-controls">
      <div class="control-btn" @click="$emit('toggleAudio')" :class="{ 'text-danger': localTrack.audioMuted }">
        <i class="fas fa-microphone" v-if="!localTrack.audioMuted"></i>
        <i class="fas fa-microphone-slash" v-else></i>
      </div>
      <div class="control-btn" @click="$emit('toggleVideo')" :class="{ 'text-danger': localTrack.videoMuted }">
        <i class="fas fa-video" v-if="!localTrack.videoMuted"></i>
        <i class="fas fa-video-slash" v-else></i>
      </div>
      <div class="control-btn" @click="$emit('shareScreen')" v-if="!screenTrack.sharing">
        <i class="fas fa-desktop"></i>
      </div>
      <div class="control-btn text-danger" @click="$emit('stopScreenShare')" v-else>
        <i class="fas fa-ban"></i>
      </div>
      <div class="control-btn text-danger" @click="$emit('leave')">
        <i class="fas fa-phone-slash"></i>
      </div>
    </div>

  </div>
</template>

<script>
import MeetingBubble from '@/app/meeting-module/components/MeetingBubble.vue'
export default {
  components: {
    MeetingBubble
  },
  props: {
    localTrack: {
      type: Object,
      required: true
    },
    screenTrack: {
      type: Object,
      required: true
    },
    guestTrack: {
      type: Object,
      required: true
    },
    self: {
      type: Object,
      required: true
    },
    guest: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      windowWidth: window.innerWidth
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  }
}
</script>

<style scoped>
.meeting-controls {
  font-size: 16px;
  line-height: 1;
  border-radius: 10px;
  display: flex;
  padding: 7px;
  /* position: absolute;
  bottom: 10px; */
  left: 50%;
  transform: translateX(-50%);
  position: fixed;
  bottom: 20px;
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
.meeting-main {
  justify-content: flex-start;
}
/deep/ .preview-container.active {
  width: 250px;
  min-width: 0;
  order: 1;
}
/deep/ .preview {
  min-width: 70vw;
  min-height: calc(100vh - 110px);
}
/deep/ .minimized {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 10;
}
/deep/ .minimized .preview {
  max-width: 250px;
  max-height: 170px;
  min-width: 0;
  min-height: 0;
}
.in-meeting .header {
  position: fixed;
  bottom: 0;
}

.video-tracks {
  display: flex;
  justify-content: center;
}
.screen-active .video-tracks {
  flex-direction: column;
  max-width: 300px;
}

@media (max-width: 768px) {
  /deep/ .preview {
    min-width: 70vw;
    min-height: calc(100vh - 240px);
  }
}
</style>