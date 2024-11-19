<template>
  <div>
    <h5 class="mb-0">
      {{ $t("user.chooseYourPlan") }}
    </h5>
    <select-plan ref="selectPlan" :plans="plans" @select="selectPlan"/>

  </div>
</template>

<script>
import SelectPlan from '@/app/expert-module/components/selectPlan.vue';

export default {
  components: {
    SelectPlan
  },
  props: {
    plans: {
      type: Array,
      required: true
    }
  },

  methods: {
    selectPlan(plan) {
      this.$refs.selectPlan.closePlanModal()
      this.$emit("selectPlan", plan);
    },
  },
};
</script>

<style scoped>
.card-header {
  background-color: #f8f8f8;
}
</style>
