<template>
  <div class="custom-control custom-checkbox">
    <input type="checkbox" class="custom-control-input" :id="id" :checked="value" @change="handleChange" :value="value">
    <label class="custom-control-label" :for="id">
      <span v-if="label">
        {{ label }}
      </span>
      <slot v-else />
    </label>
  </div>
</template>
<script>

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: 'checkbox-' + parseInt(Math.random() * 1000)
    },
    label: String,
  },
  // computed: {
  //   isChecked() {
  //     return this.modelValue === this.value
  //   }
  // },
  methods: {
    handleChange($event) {
      this.$emit('input', $event.target.checked)
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