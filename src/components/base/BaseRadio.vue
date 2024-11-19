<template>
  <div class="custom-control custom-radio">
    <input type="radio" class="custom-control-input" :id="id" :checked="isChecked" @change="handleChange" :value="value">
    <label class="custom-control-label pointer" :for="id">
      <span v-if="label">
        {{ label }}
      </span>
      <slot v-else />
    </label>
  </div>
</template>
<script>

export default {
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    value: {
      type: [Number, String],
      default: undefined
    },
    modelValue: {
      default: null
    },
    id: {
      type: String,
      default: 'radio-' + parseInt(Math.random() * 1000)
    },
    label: String,
  },
  computed: {
    isChecked() {
      return this.modelValue === this.value
    }
  },
  methods: {
    handleChange($event) {
      this.$emit('input', $event.target.value)
    }
  }
}
</script>
<style scoped>
/* label {
  color: #39425d;
  font-size: 21px;
  cursor: pointer;
  display: inline;
} */

</style>