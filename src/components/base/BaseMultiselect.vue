<template>
  <validation-provider mode="aggressive" :rules="rules" v-slot="{ errors, classes }">
    <div class="form-group" :class="classes">
      <label v-if="label" class="mb-1">{{ label }}</label>
      <multiselect
        :class="classes" 
        :options="options"
        v-model="valueObject" 
        @input="handleInput"
        :multiple="true"
        :label="textField || 'text'"
        :track-by="valueField || 'value'"
        :value="valueField || 'value'" />
      <small class="invalid-feedback" v-if="errors[0]">{{ errors[0] }}</small>
    </div>
  </validation-provider>
</template>
<script>
import Multiselect from "vue-multiselect";

export default {
  components: {
    Multiselect
  },
  data() {
    return {
      valueObject: []
    }
  },
  watch: {
    value: {
      handler(val) {
        this.valueObject = this.options.filter(option => {
          return this.value.includes(this.valueField ? option[this.valueField] : option.value)
        })
      },
      immediate: true
    },
    opions: {
      handler(val) {
        this.valueObject = this.options.filter(option => {
          return this.value.includes(this.valueField ? option[this.valueField] : option.value)
        })
      }
    }
  },
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      type: Array,
      default: () => []
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
  },
  methods: {
    handleInput(input) {
      this.$emit('input', this.valueObject.map(opt => this.valueField ? opt[this.valueField] : opt.value))
    }
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
.form-control {
  border-radius: 10px;
}
/deep/ .multiselect__tags {
  border-radius: 10px;
  border-color: #ced4da;
  min-height: 50px;
  padding: 13px 40px 0 13px;
  font-size: 15px;
}
/deep/ .multiselect__select {
  height: 48px;
}
.is-invalid /deep/ .multiselect__tags {
  border-color: #dc3545 !important;
}
</style>
<style>
  .rtl .multiselect__tags {
    padding: 13px 13px 0 40px !important;
  }
</style>