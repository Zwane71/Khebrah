<template>
  <div class="meeting-page" :class="{'in-meeting': tab === 'meeting' }" v-if="order">

    <div class="container-fluid header py-3 d-flex justify-content-between align-items-center">
      <div class="logo">
        <img
          src="../../../assets/img/logo.png"
          alt="logo"
        />
      </div>
      <span :class="{'text-danger': remainingTime < 300 }" v-if="tab === 'meeting'">
        {{$t('meeting.timeRemaining')}}: {{ formattedRemainingTime }}
      </span>
      <button class="btn btn-primary btn-pill" @click="goToBooking" v-if="tab !== 'meeting'">
        <i class="fas fa-long-arrow-alt-left mr-2"></i>
        {{$t('meeting.backToBooking')}}
      </button>
    </div>

    <meeting-lounge 
      :meeting-enabled="isMeetingEnabled"
      :meeting-over="isMeetingTimeOver"
      :meeting-completed="isMeetingCompleted"
      :order="order"
      :self="self"
      :guest="guest"
      :local-track="localTrack"
      @goToBooking="goToBooking" 
      @join="joinMeeting"
      @toggleAudio="toggleAudio"
      @toggleVideo="toggleVideo"
      v-if="tab === 'lounge'"
    />

    <div class="loading d-flex align-items-center meeting-main" v-if="tab === 'joining'">
      <span class="spinner-border spinner-border-sm mb-2" role="status" aria-hidden="true"></span>
      <h2>{{$t('meeting.joining')}}</h2>
    </div>


    <meeting
      :self="self"
      :guest="guest"
      :local-track="localTrack"
      :guest-track="guestTrack"
      :screen-track="screenTrack"
      @leave="leaveMeeting"
      @shareScreen="shareScreen"
      @stopScreenShare="stopScreenShare"
      @toggleAudio="toggleAudio"
      @toggleVideo="toggleVideo"
      v-if="tab === 'meeting'"
      />

    <meeting-end
      :meeting-enabled="isMeetingEnabled"
      :meeting-over="isMeetingTimeOver"
      :self="self"
      :guest="guest"
      :order="order"
      :self-is-expert="selfIsExpert"
      @leave="leaveMeeting"
      @rejoin="rejoinMeeting"
      @goToBooking="goToBooking" 
      v-if="tab === 'end'"
      />

  </div>
</template>
<script>
import AgoraRTC from 'agora-rtc-sdk-ng'
AgoraRTC.setLogLevel(2)
import dayjs from '@/plugins/dayjs'
import store from '@/store'

import MeetingLounge from '@/app/meeting-module/components/MeetingLounge.vue'
import Meeting from '@/app/meeting-module/components/Meeting.vue'
import MeetingEnd from '@/app/meeting-module/components/MeetingEnd.vue'

export default {
  components: {
    MeetingLounge,
    Meeting,
    MeetingEnd
  },

  data() {
    return {
      videoClient: AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }),
      screenClient: AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }),

      localTrack: {
        video: null,
        audio: null,
        videoMuted: false,
        audioMuted: false,
        isLocal: true,
        // updateFlag: false
      },

      guestTrack: {
        video: null,
        audio: null,
        joined: false,
        // updateFlag: false
      },

      screenTrack: {
        video: null,
        sharing: false,
        isScreen: true
        // updateFlag: false
      },

      publishedTracks: [],
      guestJoined: false,

      order: null,

      tab: 'lounge',

      options: {
        // appId: '84c253a900944fd58d8a3f10948ae570',
        // channel: 'khebrah',
        // token: '00684c253a900944fd58d8a3f10948ae570IAD/3uX56SHzKuSxG/8A3siB2bpgjwgLA/zOtIo6P3M7qVGCfVgAAAAAEACXXodm/Z5mYQEAAQD8nmZh',
      },

      token: null,
      appId: null,
      channel: null,

      now: Date.now(),
      timer: null
    }
  },

  metaInfo: {
    title: 'Meeting | Khebrah'
  },

  beforeRouteEnter(to, from, next) {
    const id = to.params.id
    store.dispatch('orders/getOrder', id)
      .then(data => {
        next(vm => {
          vm.order = data
          if (!data.meetings && data.meetings[0]) return
          vm.channel = data.meetings[0].meeting_id
        })
      })
      .catch(error => {
        next({ path: '/404'})
      })
  },

  async mounted() {
    this.timer = setInterval(() => this.now = Date.now(), 1000)
    this.fetchToken(this.channel)

    this.videoClient.on('user-joined', (user) => {
      if(!this.validGuests.includes(user.uid)) return
      console.log('USER JOINED', user)
      this.guestTrack.joined = true
    })
    this.videoClient.on('user-left', (user, reason) => {
      console.log('USER LEFT', user, reason)
      this.guestTrack.joined = false
    })

    this.videoClient.on('user-published', async (user, mediaType) => {
      if(!this.validGuests.includes(user.uid)) return

      await this.videoClient.subscribe(user, mediaType)
      console.log('------------ SUBSCRIBED ----------------------', user, mediaType)

      if(mediaType === 'video') {
        if (user.uid.toString().startsWith('user-')) {
          this.guestTrack.video = user.videoTrack
          // this.$nextTick(() => {
          //   this.guestTrack.updateFlag = !this.guestTrack.updateFlag
          // })
        } else {
          if(this.screenTrack.sharing) this.stopScreenShare()
          this.screenTrack.video = user.videoTrack
          // this.$nextTick(() => {
          //   this.screenTrack.updateFlag = !this.screenTrack.updateFlag
          // })
        }
      }

      if(mediaType === 'audio') {
        if (user.uid.toString().startsWith('user-')) {
          this.guestTrack.audio = user.audioTrack
          // this.$nextTick(() => {
          //   this.guestTrack.updateFlag = !this.guestTrack.updateFlag
          // })
        }
      }

    })

    this.videoClient.on('user-unpublished', (user, mediaType) => {
      console.log('------------ UNSUBSCRIBED ----------------------', user, mediaType)
      if(mediaType === 'video') {
        if (user.uid.toString().startsWith('user-')) {
          this.guestTrack.video = null
        } else {
          this.stopScreenShare()
        }
      }
      if(mediaType === 'audio') {
        if (user.uid.toString().startsWith('user-')) {
          this.guestTrack.audio = null
        }
      }
    })

    this.createLocalVideoTrack()
      .catch(() => {})
      .finally(() => {
        this.createLocalAudioTrack()
          .catch(() => {})
      })
  },

  watch: {
    isMeetingTimeOver(value) {
      if (value && this.tab === 'meeting') {
        this.leaveMeeting()
      }
    }
  },

  computed: {
    user() {
      return this.$store.getters['auth/user']
    },
    selfIsExpert() {
      if (!this.order) return false
      return this.order.expert.id === this.user.pk
    },
    self() {
      return this.selfIsExpert ? this.order.expert : this.order.user
    },
    guest() {
      return this.selfIsExpert ? this.order.user : this.order.expert
    },
    validGuests() {
      return ['user-'+ this.guest.id, 'screen-'+ this.guest.id]
    },
    isMeetingEnabled() {
      if (!this.startTime || !this.endTime) return false

      return dayjs(this.now).isBetween(this.startWithBuffer, this.endWithBuffer) 
    },
    isMeetingCompleted() {
      if (!this.order) return false
      return this.order.status === 'cancelled' || this.order.status === 'completed'
    },
    isMeetingTimeOver() {
      if (!this.startTime || !this.endTime) return false

      return dayjs(this.now).isAfter(this.endWithBuffer)
    },
    startTime() {
      return this.order && this.order.start_time
    },
    endTime() {
      return this.order && this.order.end_time
    },
    startWithBuffer() {
      if (!this.startTime) return false
      return dayjs(this.startTime).subtract(5, 'minute')
    },
    endWithBuffer() {
      if (!this.endTime) return false
      return dayjs(this.endTime).add(5, 'minute')
    },
    remainingTime() {
      if (this.isMeetingTimeOver || !this.endWithBuffer) return null
      return this.endWithBuffer.diff(dayjs(this.now), 'second')
    },
    formattedRemainingTime() {
      const mins = parseInt(this.remainingTime / 60)
      const secs = (this.remainingTime % 60).toString().padStart(2, '0')
      return `${mins}:${secs}`
    }
  },

  methods: {
    createLocalVideoTrack() {
      if (this.localTrack.video) return
      return AgoraRTC.createCameraVideoTrack()
        .then(track => {
          this.localTrack.video = track
          track.on('track-ended', () => {
            this.localTrack.videoMuted = true
            this.videoClient.unpublish(this.localTrack.video)
            this.localTrack.video = null
          })
          return Promise.resolve()
        })
        .catch(e => {
          if (e.code === 'PERMISSION_DENIED') {
            this.localTrack.videoMuted = true
          }
          return Promise.reject()
        })
    },

    createLocalAudioTrack() {
      if (this.localTrack.audio) return
      return AgoraRTC.createMicrophoneAudioTrack()
        .then(track => {
          this.localTrack.audio = track
          track.on('track-ended', () => {
            this.localTrack.audioMuted = true
            this.videoClient.unpublish(this.localTrack.audio)
            this.localTrack.audio = null
          })
          return Promise.resolve()
        })
        .catch(e => {
          if (e.code === 'PERMISSION_DENIED') {
            this.localTrack.audioMuted = true
          }
          return Promise.reject()
        })
    },

    fetchToken(meetingId) {
      this.$store.dispatch('orders/fetchMeetingToken', meetingId)
        .then(response => {
          this.token = response.token
          this.appId = response.appID
        })
    },

    async shareScreen() {
      if (this.screenTrack.sharing) return

      AgoraRTC.createScreenVideoTrack()
        .then(async (track) => {
          track.on('track-ended', () => {
            this.stopScreenShare()
          })
          this.screenTrack.video = track
          this.screenTrack.sharing = true
          await this.screenClient.unpublish()
          await this.screenClient.publish(this.screenTrack.video)
        })
        .catch(e => {
        })
      // this.$nextTick(() => {
      //   this.screenTrack.updateFlag = !this.screenTrack.updateFlag
      // })
    },

    async stopScreenShare() {
      if(this.screenTrack.video) {
        await this.screenClient.unpublish()
        if (this.screenTrack.video) {
          this.screenTrack.video.stop()
          this.screenTrack.video.close()
        }
      }
      this.screenTrack.video = null
      this.screenTrack.sharing = false
    },

    async joinMeeting() {
      this.tab = 'joining'
      const { appId, channel, token } = this
      const uid = 'user-' + this.user.pk
      await this.videoClient.join(appId, channel, token, uid)
      await this.screenClient.join(appId, channel, token, 'screen-'+this.user.pk)
      const publishables = [this.localTrack.audio, this.localTrack.video].filter(t => t && t.enabled)
      this.publishedTracks = publishables
      if (publishables.length) this.videoClient.publish(publishables)

      this.tab = 'meeting'
      // this.$nextTick(() => {
      //   this.localTrack.updateFlag = !this.localTrack.updateFlag
      // })
    },
    
    leaveMeeting() {
      // this.localVideoTrack.close()
      // this.localAudioTrack.close()

      if (this.videoClient) this.videoClient.leave()
      if (this.screenClient) this.screenClient.leave()

      this.tab = 'end'
    },

    rejoinMeeting() {
      this.tab = 'lounge'
      // this.$nextTick(() => {
      //   this.localTrack.updateFlag = !this.localTrack.updateFlag
      // })
    },

    goToBooking() {
      if (this.videoClient) this.videoClient.leave()
      if (this.screenClient) this.screenClient.leave()
      if(this.selfIsExpert) this.$router.push({ name: 'BookingDetails', params: { id: this.order.order_id }})
      else this.$router.push({ name: 'OrderDetails', params: { id: this.order.order_id }})

    },

    async toggleVideo() {
      if (this.localTrack.videoMuted && !this.localTrack.video) {
        try {
          await this.createLocalVideoTrack()
        } catch(e) {
          return
        }
      }

      this.localTrack.videoMuted = !this.localTrack.videoMuted
      if (this.localTrack.video) {
        await this.localTrack.video.setEnabled(!this.localTrack.videoMuted)
      }
      if (this.tab === 'meeting' && this.localTrack.video && this.localTrack.video.enabled && !this.publishedTracks.includes(this.localTrack.video)) {
        this.videoClient.publish(this.localTrack.video)
      }
    },

    async toggleAudio() {
      if (this.localTrack.audioMuted && !this.localTrack.audio) {
        try {
          await this.createLocalAudioTrack()
        } catch(e) {
          return
        }
      }

      this.localTrack.audioMuted = !this.localTrack.audioMuted
      if (this.localTrack.audio) { 
        await this.localTrack.audio.setEnabled(!this.localTrack.audioMuted)
      }
      if (this.tab === 'meeting' && this.localTrack.audio && this.localTrack.audio.enabled && !this.publishedTracks.includes(this.localTrack.audio)) {
        this.videoClient.publish(this.localTrack.audio)
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },

  destroyed() {
    this.leaveMeeting()
    if (this.localTrack.video) {
      this.localTrack.video.close()
    }
    if (this.localTrack.audio) {
      this.localTrack.audio.close()
    }
  },

}
</script>

<style scoped>
.meeting-page {
  height: 100vh;
  widows: 100vw;
  overflow: hidden;
  transition: all 0.3s;
}
.in-meeting {
  background: #111;
}
.header {
  padding: 10px 30px !important;
  position: fixed;
}
.meeting-main {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 20px;
}
.logo img {
  height: 50px;
}
/* .waiting-text, .novideo {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-weight: 600;
  flex-direction: column;
  z-index: 0;
} */
</style>