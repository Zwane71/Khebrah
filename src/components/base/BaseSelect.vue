<template>
  <validation-provider :rules="rules" v-slot="{ errors, classes }">
    <div class="form-group" :class="{ 'marginless': marginless }">
      <label v-if="label" class="mb-1">{{ label }}</label>
      <select class="form-control custom-select" :class="rules ? classes : {}" :value="value" @input="handleInput">
        <option :value="null" v-if="placeholder">{{ placeholder }}</option>
        <option 
          :value="getValue(option)" 
          v-for="option in options" 
          :key="getValue(option)">
          {{ textField ? option[textField] : option.text }}
        </option>
      </select>
      <small class="invalid-feedback" v-if="errors[0]">{{ errors[0] }}</small>
    </div>
  </validation-provider>
</template>
<script>

export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      type: [String, Number],
      default: null
    },
    label: String,
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String
    },
    rules: {
      type: String,
      default: ''
    },
    valueField: {
      type: String,
      default: null
    },
    textField: {
      type: String,
      default: null
    },
    marginless: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleInput($event) {
      this.$emit('input', $event.target.value)
    },
    getValue(option) {
      return this.valueField ? option[this.valueField] : option.value
    }
  }
}
</script>
<style scoped>
.form-control {
  border-radius: 10px;
}
select {
  margin: 0
}

.form-group.marginless {
  margin-bottom: 0 !important;
}

</style>