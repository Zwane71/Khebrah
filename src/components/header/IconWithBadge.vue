<template>
  <div class="p-2 mr-1 position-relative pointer" @click="handleClick">
    <i :class="icon"></i>
    <div class="badge" v-if="count">{{ count }}</div>
  </div>
</template>
<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0
    },
    target: String
  },
  methods: {
    handleClick() {
      if (!this.target) return
      this.$router.push(`/${this.$i18n.locale}/${this.target}`)
    }
  }
}
</script>
<style scoped>
  i {
    font-size: 18px;
    color: #044982;
  }
  .badge {
    position: absolute;
    background: #fe290c;
    top: 0px;
    color: #fff;
    right: 3px;
    border-radius: 3px;
    font-size: 10px;
  }
  .rtl .badge {
    right: unset;
    left: 3px;
  }
  .pointer {
    cursor: pointer;
  }

</style>