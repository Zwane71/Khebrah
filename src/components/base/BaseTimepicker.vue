<template>
  <div class="position-relative" :class="{ active: isOpen, disabled, error: hasError }">
    <div class="display border rounded" @click="showDropdown">
      <span class="placeholder" v-if="!value">{{ placeholder }}</span>
      <span class="time" v-else>{{ formatTime(value) }}</span>

      <i class="fas fa-chevron-down"></i>
    </div>
    <div class="dropdown border rounded mt-2" 
      v-if="isOpen"
      ref="dropdown"
      v-click-outside="closeDropdown">
        <div class="list-group">
          <div @click="selectTime(option)" :data-value="option" class="list-group-item list-group-item-action" v-for="(option, index) in options" :key="index">
            {{ formatTime(option) }}
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null
    },
    hasError: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Select Time'
    }
  },
  data: () => ({
    isOpen: false,
  }),
  computed: {
    options() {
      const result = [];
      for (let hour = 0; hour < 24; hour++) {
        (['00', 15, 30, 45]).forEach(minute => {
          result.push(hour.toString().padStart(2, '0') + ':' + minute + ':00')
        })
      }
      // ([12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).forEach(hour => {
      //   (['00', 15, 30, 45]).forEach(minute => {
      //     result.push(hour.toString().padStart(2, '0') + ':' + minute)
      //   })
      // })
      return result
    },
  },
  methods: {
    closeDropdown() {
      this.isOpen = false;
    },
    showDropdown() {
      this.isOpen = true;
      this.$nextTick(() => {
        if (this.value) {
          const option = this.$refs.dropdown.querySelector(`[data-value='${this.value}']`)
          if (option) this.$refs.dropdown.scrollTop = option.offsetTop
        }
      })
    },
    formatTime(time) {
      const [HH, mm] = time.split(':')
      const hh = (+HH % 12) || 12 //replaces 0:xx with 12:xx
      const unit = +HH >= 12 ? this.$t('common.pm') : this.$t('common.am')
      return hh.toString().padStart(2, '0') + ':' + mm + ' ' + unit
    },
    selectTime(option) {
      this.closeDropdown()
      this.$emit('input', option)
    }
  }
}
</script>

<style scoped>
  .disabled {
    background: #f8f8f8;
    pointer-events: none;
  }
  .active .display {
    box-shadow: 0 0 0 1px#044982;
  }
  .error .display {
    border-color: #dc3545 !important;
  }
  .display {
    position: relative;
    padding: 10px;
    cursor: pointer;
  }
  .display i {
    position: absolute;
    right: 15px;
    top: 15px;
  }
  .rtl .display i {
    right: unset;
    left: 15px;
  }
  .dropdown {
    background: #fff;
    position: absolute;
    right: 0;
    width: 100%;
    padding: 0 !important;
    z-index: 999;
    max-height: 200px;
    overflow: auto;
  }
  .rtl .dropdown {
    right: unset;
    left: 0;
  }
  .dropdown::-webkit-scrollbar {
    width: 7px;
  }
  .dropdown::-webkit-scrollbar-track {
    background: #eee;
  }
  .dropdown::-webkit-scrollbar-thumb {
    background: #ddd;
  }
  .list-group-item {
    border-left: 0;
    border-right: 0;
  }
  .list-group-item:first-child {
    border-top: 0;
  }
  .list-group-item-action {
    cursor: pointer;
  }
  .time {
    color: #444;
  }
</style>