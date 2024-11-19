<template>
  <div class="preview-container" :class="{ minimized, floating, small, mirrored: mirrored && track.video && !track.videoMuted }">
    <div class="name px-3 pr-5 py-2" v-if="minimized">
      {{ profile.first_name + ' ' + profile.last_name }}
    </div>
    <div class="preview d-flex align-items-center flex-column justify-content-center  text-center" v-else-if="!track.video || track.videoMuted">
      <base-avatar :src="profile.profile_img" :first-name="profile.first_name" :last-name="profile.last_name" :size="49"/>
      <div class="name">
        {{ profile.first_name + ' ' + profile.last_name }}
      </div>
    </div>
    <div class="preview" :class="{hidden: !track.video || track.videoMuted}" ref="preview" :id="id">
    </div>
    <div class="bubble-controls">
      <i class="fas fa-minus pointer mr-2 minimize-icon" v-if="minimizable && !minimized" @click="minimize"></i>
      <i class="fas fa-plus pointer mr-2 minimize-icon" v-else-if="minimizable" @click="unminimize"></i>
      <i class="fas fa-microphone-slash pointer" v-if="!track.isScreen && (track.audioMuted || !track.audio)"></i>
      <div class="mute-icon">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // muted: {
    //   type: Boolean,
    //   default: false
    // },
    track: {
      default: {}
    },
    mirrored: {
      type: Boolean,
      default: false
    },
    profile: {
      default: null,
      required: true
    },
    // minimized: {
    //   type: Boolean,
    //   default: false
    // },
    floating: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    minimizable: {
      type: Boolean,
      default: false
    },
    id: {
      type: String
    }
  },
  data: () => ({
    minimized: false
  }),
  watch: {
    track: {
      handler(newVal, oldVal) {
          // console.log(this.id, ' : has-video', newVal.video)
          // console.log(this.id, ' : is-playing', newVal.video && newVal.video.isPlaying)
          if(newVal.video) {
            this.$nextTick(() => {
              this.playVideo()
            })
          }
          if(newVal.audio && !newVal.isLocal) newVal.audio.play()
      },
      deep: true,
      immediate: true
    },
  },

  methods: {
    playVideo() {
      if(this.track.video && !this.track.video.isPlaying) this.track.video.play(this.$refs.preview)
    },
    minimize() {
      this.minimized = true
    },
    unminimize() {
      this.minimized = false
    },
  },

  beforeDestroy() {
    if(this.track.video) this.track.video.stop()
    // if(this.audioTrack) this.audioTrack.stop()
  }
}
</script>

<style scoped>
  .preview-container {
    position:relative;
    background: #333;
    overflow: hidden;
    border-radius: 7px;
    margin: 10px;
    /* width: 100%; */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .preview {
    width: 700px;
    height: 394px;
    /* margin-top: 100px; */
    /* height: 0;
    padding-bottom: 56.25%; */
  }
  .bubble-controls {
    position: absolute;
    top: 12px;
    right: 10px;
    color: #fff;
    z-index: 999;
    display: flex;
  }
  .floating {
    position: absolute;
    right: 20px;
    bottom: 20px;
    z-index: 10;
  }

  .floating .preview {
    max-width: 250px;
    max-height: 170px;
    min-width: 0;
    min-height: 0;
  }

  .small .preview {
    max-width: 200px;
    max-height: 150px;
    min-width: 0;
    min-height: 0;
  }
  .minimized .preview {
    display: none;
  }
  @media screen and (max-width: 768px) {
    .floating .preview {
      max-width: 100px;
      max-height: 70px;
    }
    .floating {
      right: 10px;
      bottom: 70px;
    }
  }
  .mirrored .preview{
    transform: rotateY(180deg)
  }
  .minimized + .minimized {
    bottom: 70px;
  }
  .minimize-icon {
    visibility: hidden;
  }
  .preview-container:hover .minimize-icon {
    visibility: visible;
  }
  /* .mirrored .bubble-controls {
    right: unset;
    left: 10px;
  } */
</style>