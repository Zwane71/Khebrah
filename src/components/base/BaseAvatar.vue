<template>
  <div class="avatar" :class="classes" :style="styles">
    <img v-if="src && isExpert" :src="src" alt="">
    <img src="@/assets/img/icons/avatar.svg" alt="avatar" v-else>
    <div class="expert-badge" v-if="badge" :style="{background: badge.badge_color}">
      {{ enLang ? badge.badge_name : badge.badge_name_ar }}
      <i class="fas fa-star ml-2"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    bordered: {
      type: Boolean,
      default: false
    },
    size: {
      type: [String, Number],
      default: 'large'
    },
    badge: {
      type: Object
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    isExpert: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    classes() {
      return {
        bordered: this.bordered,
        [this.size]: typeof this.size === 'string',
        'has-image': this.src && this.isExpert
      }
    },
    initials() {
      if (!this.firstName || !this.lastName) return ' '
      return this.firstName[0] + this.lastName[0]
    },
    styles() {
      return typeof this.size === 'number'
        ? { width: this.size + 'px', minWidth: this.size + 'px', height: this.size + 'px' }
        : {}
    }
  }
  
}
</script>

<style scoped>
.avatar {
  border-radius: 50%;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #fff;
}
.avatar.has-image {
  background: #fff;
}
.large {
  width: 160px;
  height: 160px;
  font-size: 32px;
}
.medium {
  width: 125px;
  height: 125px;
  font-size: 32px;
}
.small {
  width: 75px;
  height: 75px;
  font-size: 27px;
}
.tiny {
  width: 25px;
  height: 25px;
  font-size: 12px;
}
.avatar img {
  object-fit: cover;
  object-position: center center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.bordered {
  border: 3px solid #eee;
}
.expert-badge {
  position: absolute;
  bottom: 5px;
  left: 50%;
  color: #fff;
  background: linear-gradient(
    135deg,
    rgba(105, 99, 255, 1) 36%,
    rgba(133, 128, 255, 1) 100%
  );
  font-size: 14px;
  padding: 3px 15px;
  display: flex;
  align-items: center;
  border-radius: 5px;
}
.rtl .expert-badge {
  right: 50%;
  left: unset;
}
.expert-badge i {
  font-size: 11px;
}
</style>