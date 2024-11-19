<template>
  <div>
    <dashboard-header :title="$t('dashboard.myPlan')" />

    <div class="row mt-2">
      <div class="col-md-6">
        <expert-plan :active="true" @select="renew" :expiry="profile.subscription.end_date" :plan="currentPlan" v-if="currentPlan"/>
      </div>
    </div>

    <h5 class="mt-4 px-2 mb-0">{{$t('plan.changePlan')}}</h5>
    <select-plan 
      :columns="2" 
      :mode="mode" 
      :loading="loading" 
      ref="selectPlan" 
      :plans="otherPlans" 
      @updateMode="updateMode" 
      @select="redirectToPayment"/>
  </div>
</template>
<script>
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import ExpertPlan from '@/components/common/ExpertPlan.vue'
import store from '@/store'
import SelectPlan from '@/app/expert-module/components/selectPlan.vue';

export default {
  components: {
    DashboardHeader,
    ExpertPlan,
    SelectPlan
  },

  data: () => ({
    plans: [],
    mode: 'knet',
    loading: false,
  }),

  metaInfo: {
    title: 'Plan'
  },

  computed: {
    otherPlans() {
      if (!this.profile.subscription) return this.plans
      return this.plans.filter(p => p.id !== this.profile.subscription.plan.id)
    },
    currentPlan() {
      if (!this.profile.subscription) return null
      return this.plans.find(p => p.id === this.profile.subscription.plan.id)
    },
    profile() {
      return this.$store.getters['user/profile']
    },
  },

  beforeRouteEnter(to, from, next) {
    store.dispatch('plan/fetchPlans')
      .then((plans) => {
        next(vm => {
          vm.plans = plans
        })
    })
    .catch(error => console.log(error))
  },

  methods: {
    renew() {
      this.$refs.selectPlan.openPlanModal(this.currentPlan)
    },
    updateMode(value) {
      this.mode = value
    },
    redirectToPayment(planDetails) {
      this.loading = true;

      let data = {
        type: "plan",
        mode: this.mode,
        plan: +planDetails.new_subscription.id,
        month: +planDetails.new_subscription.price.id
      };

      this.$store.dispatch('checkout/makePayment', data )
        .then(data => {
          if (data.url) {
            window.open(data.url, "_self");
          } else {
            this.$store.dispatch('user/fetchProfile')
              .then(() => {
                this.loading = false
                this.$refs.selectPlan.closePlanModal()
              })
            // this.subscription = {
            //   payment: data.status,
            //   expert: data.expert,
            //   plan: data.plan
            // }
          }
        })
        .catch((error) => {
          this.loading = false
        });
    },
  }
};
</script>