<template>
  <div class="modal fade" :class="classes" tabindex="-1" role="dialog" @click.self="hide">
    <div class="modal-dialog modal-dialog-centered" :class="{'modal-lg': this.size === 'large'}">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-primary">{{ title }}</h5>

          <button class="close" @click="hide">
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer" >
          <slot name="footer" v-bind:hide="hide"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'default'
    },
    nested: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isOpen: false
  }),
  computed: {
    classes() {
      return { 
        show: this.isOpen 
      }
    }
  },
  methods: {
    show() {
      if (!this.nested) {
        const body = document.body
        body.classList.add('modal-open')
        body.style.paddingRight = '15px'
      }
      this.isOpen = true
    },

    hide() {
      if (!this.nested) {
        const body = document.body
        body.classList.remove('modal-open')
        body.style.paddingRight = ''
      }
      this.isOpen = false
    }
  }
}
</script>

<style scoped>
.modal-title {
  color: #044982;
}
.modal.show {
  display: block;
  /* padding-right: 15px; */
  background: rgba(0,0,0,0.5);
  animation: fadeIn 0.3s;
}
.show .modal-dialog {
  animation: scrollIn 0.3s ease-in-out;
}
.modal-body:empty, .modal-footer:empty {
  padding: 0;
  border: none;
}
.close:focus {
  outline: none;
}
.modal-lg .modal-body{
  padding: 20px 50px;
}
.rtl .modal-header .close {
  margin: -1rem auto -1rem -1rem;
}
@keyframes scrollIn {
  from {
    transform: translate3d(0, -7%, 0)
  }
  to {
    transform: none;
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>