<template>
  <validation-provider :rules="rules" v-slot="{ errors, classes }">
    <div class="form-group">
      <label v-if="label" class="mb-1">{{ label }}</label>
      <textarea rows="7" :placeholder="placeholder" v-bind="$attrs" :value="value" @input="handleInput" class="form-control" :class="classes">
      </textarea>
      <small class="invalid-feedback" v-if="errors[0]">{{ errors[0] }}</small>
    </div>
  </validation-provider>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    label: String,
    placeholder: {
      type: String
    },
    rules: {
      type: String,
      default: ''
    },
  },
  methods: {
    handleInput($event) {
      this.$emit('input', $event.target.value)
    }
  }
}
</script>
<style scoped>
.form-control {
  border-radius: 10px;
}
textarea {
  height: auto !important;
}

</style>