<template>
  <div class="tag" :class="{ selectable: selectable, selected: selected }" @click="onSelect">
    {{ text }}
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    selectable: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    onSelect() {
      this.$emit('select')
    },
  }
}
</script>

<style scoped>
  .tag {
    font-size: 14px;
    padding: 5px 8px;
    background-color: #dae3ea;
    color: #044982;
    min-width: 60px;
    text-align: center;
    border-radius: 7px;
    display: inline-block;
    margin-bottom: 10px;
    margin-inline-end: 7px;
    font-weight: 500;
    font-family: "Quicksand", sans-serif;
  }
  .selected {
    background-color: #00a0721c;
    color: #00a072;
  }
  .selectable {
    cursor: pointer;
  }
</style>