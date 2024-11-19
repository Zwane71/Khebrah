<template>
  <div>
    <validation-provider :mode="mode" :rules="rules" :vid="vid" v-slot="{ errors, pending, classes }">
      <div class="form-group" :class="{ pill: pill, padded: padded }">
        <label v-if="label" class="mb-1">{{ label }}</label>
        <div class="relative">
          <input :type="type" :placeholder="placeholder" :value="value" v-bind="$attrs" v-on="inputListeners" class="form-control" :class="rules ? classes : {}">
          <div v-if="endLabel" class="end-label">{{ endLabel }}</div>
          <span v-if="mode === 'lazy' && pending" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <small class="invalid-feedback" v-if="errors[0]">{{ errors[0] }}</small>
        </div>
      </div>
    </validation-provider>
  </div> 
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    label: String,
    vid: String,
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
    pill: {
      type: Boolean,
      default: false
    },
    padded: {
      type: Boolean,
      default: false
    },
    endLabel: {
      type: String,
      default: null
    },
    mode:{
      type: String,
      default: 'eager'
    }
  },
  computed: {
    inputListeners() {
      const vm = this

      return Object.assign({}, this.$listeners, {
        input: (event) => vm.$emit('input', event.target.value)
      })

    }
  },
  // methods: {
  //   handleInput($event) {
  //     this.$emit('input', $event.target.value)
  //   }
  // }
}
</script>
<style scoped>
.form-control {
  border-radius: 10px;
}
.pill input { 
  border-radius:50px;
}
.padded input {
  padding-left: 40px;
}
.rtl .padded input {
  padding-left: unset;
  padding-right: 40px;
}
.end-label {
  position: absolute;
  right: 30px;
  top: 15px;
}
.rtl .end-label {
  right: unset;
  left: 30px;
}
.form-group {
  position: relative;
}
input:focus + .end-label {
  display: none;
}
.spinner-border {
  position: absolute;
  right: 30px;
  top: 15px;
}
.rtl .spinner-border {
  right: unset;
  left: 30px;
}
.relative {
  position: relative;
}

</style>