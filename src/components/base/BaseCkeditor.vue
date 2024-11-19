<template>
  <validation-provider :rules="rules" v-slot="{ errors, classes }">
    <div class="form-group" :class="classes">
      <label v-if="label" class="mb-1">{{ label }}</label>
      <ckeditor class="ckeditor" :class="classes" :editor="editor" :config="editorConfig" :value="value" @input="handleInput" />
      <small class="invalid-feedback" v-if="errors[0]">{{ errors[0] }}</small>
    </div>
  </validation-provider>
</template>
<script>
import CKEditor from '@ckeditor/ckeditor5-vue2'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor'
import '@ckeditor/ckeditor5-build-classic/build/translations/ar';

export default {
  components: {
    Ckeditor: CKEditor.component
  },
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
  data: () => ({
    editor: ClassicEditor,
  }),
  computed: {
    editorConfig() {
      return {
        language: this.$i18n.locale,
        placeholder: this.placeholder || '',
        toolbar: {
          items: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'outdent', 'indent']
        }
      }
    },
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value)
    }
  }
}
</script>
<style scoped>
  /deep/ .ck-toolbar {
    border-radius: 10px 10px 0 0 !important;
  }
  .is-invalid /deep/ .ck-toolbar {
    border-color: #dc3545 !important;
  }
  /deep/ .ck-editor__editable {
    border-radius: 0 0 10px 10px !important;
  }
  .is-invalid /deep/ .ck-editor__editable {
    border-color: #dc3545 !important;
  }
</style>