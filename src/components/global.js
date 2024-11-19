import Vue from 'vue'

import BaseAvatar from '@/components/base/BaseAvatar'
import BaseButton from '@/components/base/BaseButton'
import BaseInput from '@/components/base/BaseInput'
import BaseModal from '@/components/base/BaseModal'
import BaseMultiselect from '@/components/base/BaseMultiselect'
import BaseRadio from '@/components/base/BaseRadio'
import BaseCheckbox from '@/components/base/BaseCheckbox'
import BaseRating from '@/components/base/BaseRating'
import BaseSelect from '@/components/base/BaseSelect'
import BaseTag from '@/components/base/BaseTag'
import BaseTextarea from '@/components/base/BaseTextarea'
import BaseStepper from '@/components/base/BaseStepper'
import BaseTimepicker from '@/components/base/BaseTimepicker'
import BasePagination from '@/components/base/BasePagination'

import BaseLayout from '@/layouts/BaseLayout'
import DashboardLayout from '@/layouts/DashboardLayout'

const components = {
  BaseAvatar,
  BaseButton,
  BaseInput,
  BaseModal,
  BaseMultiselect,
  BaseRadio,
  BaseCheckbox,
  BaseRating,
  BaseSelect,
  BaseTag,
  BaseTextarea,
  BaseStepper,
  BaseTimepicker,
  BasePagination
}

const layouts = {
  BaseLayout,
  DashboardLayout
}

Object.entries(components).forEach(([key, value]) => Vue.component(key, value))
Object.entries(layouts).forEach(([key, value]) => Vue.component(key, value))