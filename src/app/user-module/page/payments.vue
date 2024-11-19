<template>
  <div>
    <dashboard-header :title="$t('dashboard.payments')">
      <div class="amount-card rounded border py-3 px-3 mr-2">
        <div class="text-danger label">{{$t('payments.outstanding')}}</div>
        <div class="d-flex mt-1 align-items-end">
          <h3 class="mb-0 mr-2 amount">{{ outstandingAmount }}</h3>
          <div class="text-muted">{{$t('common.kd')}}</div>
        </div>
      </div>
      <div class="amount-card rounded border py-3 px-3">
        <div class="text-success label">{{$t('payments.received')}}</div>
        <div class="d-flex mt-1 align-items-end">
          <h3 class="mb-0 mr-2 amount">{{ paidAmount }}</h3>
          <div class="text-muted">{{$t('common.kd')}}</div>
        </div>
      </div>
    </dashboard-header>

    <div class="row mt-2">
      <div class="col" v-if="outstanding.length">
        <OrdersList :orders="outstanding" :title="$t('payments.outstanding')" type="payments"/>
        <div class="d-flex justify-content-end">
          <base-pagination 
            :count="outstandingCount" 
            :limit="limit" 
            :current-page="outstandingPage" 
            @change="changeOutstandingPage" />
        </div>
      </div>
      <div class="col text-center py-5" v-else>
        {{$t('payments.noOutstanding')}}
      </div>
    </div>

    <div class="row mt-3" v-if="paid.length">
      <div class="col">
        <OrdersList :orders="paid" :title="$t('payments.received')" type="payments"/>
        <div class="d-flex justify-content-end">
          <base-pagination 
            :count="paidCount" 
            :limit="limit" 
            :current-page="paidPage" 
            @change="changePaidPage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrdersList from "@/app/user-module/component/ordersList.vue";
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import store from '@/store'

export default {
  components: {
    OrdersList,
    DashboardHeader
  },
  data() {
    return {
      outstanding: [],
      paid: [],
      outstandingAmount: null,
      paidAmount: null,
      limit: 5,
      paidPage: 0,
      paidCount: 0,
      outstandingPage: 0,
      outstandingCount: 0,
    };
  },

  metaInfo: {
    title: 'Payments'
  },

  beforeRouteEnter(to, from, next) {
    Promise.all([
      store.dispatch('user/fetchExpertPayments', { offset: 0, limit: 5, payment_status: 'outstanding' }),
      store.dispatch('user/fetchExpertPayments', { offset: 0, limit: 5, payment_status: 'paid' })
    ])
      .then(([outstanding, paid]) => {
        next(vm => {
        // vm.loading = false
          vm.outstandingCount = outstanding.count
          vm.paidCount = paid.count

          vm.outstanding = outstanding.orders
          vm.paid = paid.orders

          vm.outstandingAmount = outstanding.outstanding.toFixed(3)
          vm.paidAmount = outstanding.paid.toFixed(3)
        })
      })
      .catch(error => {
        console.log(error)
      })
  },
  computed: {
    // outstanding() {
    //   return this.bookings.filter(booking => booking.expert_payment_status === 'pending')
    // },
    // received() {
    //   return this.bookings.filter(booking => booking.expert_payment_status === 'paid')
    // },
    // user() {
    //   return this.$store.getters['auth/user']
    // }
  },
  methods: {
    changeOutstandingPage(page) {
      this.outstandingPage = page
      this.$Progress.start()
      store.dispatch('user/fetchExpertPayments', { offset: this.outstandingPage * this.limit, limit: this.limit, payment_status: 'outstanding' })
        .then(data => {
          this.$Progress.finish()
          this.outstandingCount = data.count
          this.outstanding = data.orders
          this.outstandingAmount = data.outstanding.toFixed(3)
          this.paidAmount = data.paid.toFixed(3)
        })
    },
    changePaidPage(page) {
      this.paidPage = page
      this.$Progress.start()
      store.dispatch('user/fetchExpertPayments', { offset: this.paidPage * this.limit, limit: this.limit, payment_status: 'paid' })
        .then(data => {
          this.$Progress.finish()
          this.paidCount = data.count
          this.paid = data.orders
          this.outstandingAmount = data.outstanding.toFixed(3)
          this.paidAmount = data.paid.toFixed(3)
        })
    }
  }
};
</script>

<style scoped>
.label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}
.amount {
  line-height: 1;
}
@media (max-width: 576px) {
  .amount-card {
    padding: 7px !important;
  }
  .amount-card h3 {
    font-size: 18px;
  }
  .amount-card .text-muted {
    font-size: 12px;
  }
}
</style>
