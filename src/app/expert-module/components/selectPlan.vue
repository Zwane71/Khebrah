<template>
  <div>
    <div class="row no-gutters justify-space-between">
      <div class="col-12 mt-3 plan-item"
        :class="{'col-md-4': columns === 3, 'col-md-6': columns === 2}"
        v-for="plan in plans"
       :key="plan.id">
        <expert-plan :plan="plan" @select="openPlanModal" class="h-100"/>
      </div>
    </div>

    <base-modal 
      ref="planModal"
      :title="$t('plan.planModalTitle')">
      <base-select :options="selectedPlanPrices" v-model="selectedPrice"/>
      <div v-if="selectedPlanDetails">
        <div class="detail-box mt-3 p-3">
          <div class="row">
            <div class="col-6">
              <div>
                {{$t('common.plan').toUpperCase()}}: <span class="font-weight-bold">{{ (enLang ? selectedPlanDetails.new_subscription.plan_name : selectedPlanDetails.new_subscription.plan_name_ar) .toUpperCase() }}</span>
              </div>
              <div v-if="selectedPlanDetails.current_subscription">
                {{$t('plan.daysLeft')}}:
              </div>
              <div v-if="selectedPlanDetails.current_subscription">
                {{$t('plan.deduction')}}:
              </div>
              <div v-if="selectedPlanDetails.current_subscription">
                {{$t('plan.finalAmount')}}:
              </div>
            </div>
            <div class="col-6 text-right">
              <div>
                <span v-if="selectedPlanDetails.current_subscription">
                  {{ +selectedPlanDetails.new_subscription.price.price > 0 ? selectedPlanDetails.new_subscription.price.price + ' ' + $t('common.kd') : $t("user.free") }}
                </span>
                <h5 v-else>
                  {{ +selectedPlanDetails.new_subscription.price.price > 0 ? selectedPlanDetails.new_subscription.price.price + ' ' + $t('common.kd') : $t("user.free") }}
                </h5>
              </div>
              <div v-if="selectedPlanDetails.current_subscription">{{ selectedPlanDetails.current_subscription.days_left }} {{ $t('common.days') }}</div>
              <div v-if="selectedPlanDetails.current_subscription">{{ selectedPlanDetails.current_subscription.current_plan_left_amount }} {{ $t('common.kd') }}</div>
              <h5 v-if="selectedPlanDetails.current_subscription">{{ selectedPlanDetails.amount_to_be_paid }} {{ $t('common.kd') }}</h5>
            </div>
          </div>
        </div>

        <div class="detail-box mt-3 p-3" v-if="mode && selectedPlanDetails.amount_to_be_paid > 0">
          <h5>{{ $t('checkout.paymentMode') }} </h5>
          <div class="d-flex flex-column pl-2 pb-2">
            <base-radio 
              :model-value="mode"
              value="knet"
              id="mode-knet"
              @input="updateMode('knet')"
            >
              <img class="payment-icon" src="@/assets/img/payment/knet.png" alt=""> {{$t('checkout.knet')}}
            </base-radio>
            <base-radio 
              :model-value="mode"
              class="mt-2"
              value="card"
              id="mode-card"
              @input="updateMode('card')"
            >
              <img class="payment-icon" src="@/assets/img/payment/visa-mastercard.png" alt=""> {{$t('checkout.card')}}
            </base-radio>
          </div>
        </div>

      </div>
      <div v-else class="text-center py-5">
        <span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
      </div>
      <template v-slot:footer="{ hide }">
        <base-button :disabled="loading" type="secondary" @click="hide">{{$t('common.close')}}</base-button>
        <base-button :loading="loading" type="success" @click="submit">{{$t('plan.subscribe')}}</base-button>
      </template>
    </base-modal>

  </div>
</template>

<script>
import ExpertPlan from '@/components/common/ExpertPlan.vue'
export default {
  components: {
    ExpertPlan,
  },
  
  props: {
    plans: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Number,
      default: 3
    },
    mode: {
      type: String,
    }
  },

  data: () => ({
    selectedPlan: null,
    selectedPrice: null,
    selectedPlanDetails: null
  }),

  computed: {
    selectedPlanPrices() {
      if (!this.selectedPlan) return []
      return this.selectedPlan.prices.map(p => {
        const monthText = parseInt(p.months) === 1 
          ? this.$t('common.month')
          : this.$t('common.months')
        return { 
          value: p.id, 
          text: p.months + ' ' + monthText
        }
      })
    }
  },

  watch: {
    selectedPrice(value) {
      if (!this.selectedPlan) return
      this.preparePlan(this.selectedPlan.id, value)
    }
  },

  methods: {
    submit() {
      this.$emit('select', this.selectedPlanDetails)
    },
    updateMode(mode) {
      this.$emit("updateMode", mode);
    },
    openPlanModal(plan) {
      if (!plan.prices.length) return
      this.selectedPlan = plan
      // const monthPlan = plan.prices.find(p => +p.months === 1)
      this.selectedPrice = plan.prices[0].id
      this.$refs.planModal.show()
    },
    closePlanModal() {
      this.$refs.planModal.hide()
    },
    preparePlan(planId, priceId) {
      this.selectedPlanDetails = null
      let data = {
        plan: +planId,
        month: +priceId,
      };
      this.$store.dispatch('plan/selectPlan', data)
        .then(data => {
          this.selectedPlanDetails = data
          // this.redirectToPayment(data.subs_id)
        })
        .catch((error) => {
          console.log(error)
        });
    },
  }

}
</script>

<style scoped>
.detail-box {
  background: #f8f8f8;
  border-radius: 10px;
  border: 1px solid #e5e5e5;
}
.plan-item:not(:nth-child(3n)) {
  padding-right: 10px;
}
.rtl .plan-item:not(:nth-child(3n)) {
  padding-right: unset;
  padding-left: 10px;
}
.payment-icon {
  width: 25px;
  position: relative;
  top: -3px;
}
</style>