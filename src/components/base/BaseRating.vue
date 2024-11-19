<template>
  <div class="d-flex">
    <div class="d-flex" :class="{ editable: editable }">
      <i 
        class="fas fa-star" 
        :class="{ selected: isSelected(i) }" 
        @click="onSelect(i)"
        @mouseenter="setHovered(i)"
        @mouseleave="hovered = null"
        v-for="i in 5" 
        :key="i"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    editable: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    hovered: null
  }),

  methods: {
    isSelected(index) {
      return this.editable
        ? this.hovered !== null ? index <= this.hovered : index <= this.value
        : index <= this.value
    },
    setHovered(index) {
      if (!this.editable) return
      this.hovered = index
    },
    onSelect(index) {
      this.$emit('input', index)
    }
  }
}
</script>
<style scoped>
.editable {
  cursor: pointer;
}
i {
  color: #e5e5e5;
  padding: 5px 10px 5px 0;
}
i.selected {
  color: #ffc400;
}
</style>