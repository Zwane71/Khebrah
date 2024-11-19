<template>
  <div class="stepper">
    <div class="step" 
      :class="{ complete: step.complete, active: index + 1 === activeStep, disabled: !step.complete || step.disabled }"
      @click="updateStep(step, index)"
      v-for="(step, index) in steps" 
      :key="index">

      <div class="index mr-2">{{ index + 1 }}</div>
      <div class="label">{{ step.title }}</div>
      <div class="rule" v-if="index < steps.length - 1"></div>
    </div>
  </div>
</template>
 <script>
 export default {
   props: {
     steps: {
       type: Array,
       default: () => []
     },
     activeStep: {
       type: Number,
       default: 1
     },
   },
   methods: {
     updateStep(step, index) {
       if (!step.complete) return
       this.$emit('updateStep', index + 1)
     }
   }
 }
 </script>

 <style scoped>
 .rule {
   background: #e5e5e5;
   height: 1px;
   width: 100%;
   margin: 0 15px;
 }
 .stepper {
   display: flex;
   width: 100%;
  justify-content: center;
 }

@media (max-width: 768px) {
  .stepper {
    flex-flow: row wrap;
    justify-content: flex-start;
  }
  .step {
    margin-bottom: 5px;
  }
  .rule {
    display: none;
  }
}

  .step {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .step:not(:last-child) {
    width: 100%;
  }
  .index {
    border-radius: 50%;
    width: 25px;
    min-width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #e5e5e5;
    background: #f8f8f8;
  }
  .label {
    white-space: nowrap;
  }
  .active {
    color: #ed5c31;
  }
  .complete {
    color: #1eba24;
  }
  .active .index {
    background: #ed5c31;
    border-color: #ed5c31;
    color: #fff;
  }
  .complete .index {
    background: #1eba24;
    border-color: #1eba24;
    color: #fff;
  }
  .disabled {
    pointer-events: none;
  }
 </style>