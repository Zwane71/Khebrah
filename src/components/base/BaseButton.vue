<template>
  <button class="btn" :class="classes" :disabled="btnDisabled" v-on="$listeners" @click="onClick">
    <span v-if="loading" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
    <span v-if="success && successMessage">
      <i class="fas fa-check mr-2"></i>
      {{ successMessage }}
    </span>
    <span v-else-if="error && errorMessage">
      <i class="fas fa-times mr-2"></i>
      {{ errorMessage }}
    </span>
    <span v-else-if="loading && loadingText">
      {{ loadingText }}
    </span>
    <span v-else>
      <slot></slot>
    </span>
  </button>
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    success: {
      type: Boolean,
      default: false
    },
    successMessage: {
      type: String,
      default: ''
    },
    error: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    },
    to: {
      type: [String, Object],
      default: null
    }
  },

  computed: {
    btnDisabled() {
      return this.loading || this.disabled || this.success || this.error
    },
    classes() {
      const types = this.type.split(' ')
        .map(item => item.trim())

      return {
        'btn-loading': this.loading,
        'btn-pill': types.includes('pill'),
        'btn-lg': types.includes('large'),
        'btn-sm': types.includes('small'),
        'btn-block': types.includes('block'),
        'btn-primary': types.includes('primary')  && !this.success && !this.error,
        'btn-secondary': types.includes('secondary') && !this.success && !this.error,
        'btn-success': types.includes('success') || this.success,
        'btn-danger': types.includes('danger') || this.error,
        'btn-outline-primary': types.includes('outline-primary'),
        'btn-outline-secondary': types.includes('outline-secondary'),
        'btn-outline-danger': types.includes('outline-danger'),
        'btn-muted-primary': types.includes('muted-primary'),
        'btn-muted-danger': types.includes('muted-danger'),
      }
    }
  },
  methods: {
    onClick(e) {
      if (this.to) {
        this.$router.push(this.to)
      }
    }
  }
}
</script>
<style scoped>
.btn-outline-primary {
  color: #044982; 
  border-color: #044982;
}
.btn-outline-primary:hover {
  color: #fff; 
  background-color: #044982;
}
.btn-primary, .btn-muted-primary:hover, .btn-primary:focus {
  background-color: #044982;
  border-color: #044982;
  color: #fff;
}
.btn-muted-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  color: #fff;
}

.btn-muted-primary {
  color: #044982; 
}
.btn-muted-danger {
  color: #dc3545; 
}
.btn-outline-secondary:not(:hover),
.btn-muted-primary,
.btn-muted-danger
 {
  background-color: #f8f8f8;
  border-color: #e5e5e5;
}
.spinner-border {
  position: relative;
  top: -1px;
}
.btn-pill {
  border-radius: 20px;
  margin: 0 3px;
  padding: 5px 35px;
}
.btn-pill.btn-sm {
  padding: 5px 20px;
}
</style>