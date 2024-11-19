<template>
  <dashboard-layout>
    <bookingSuccessScreen
      v-if="!loading"
      :payment="payment"
      :order="order"
      :expert="expert"
    ></bookingSuccessScreen>
  </dashboard-layout>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      payment: {},
      order: {},
      expert: {}
    };
  },
  components: {
    bookingSuccessScreen: () =>
      import("@/app/user-module/component/bookingSuccessScreen.vue"),
  },
  created() {
    if (this.$route.query && this.$route.query.order_no)
        this.getOrderDetails(this.$route.query.order_no);
  },
  methods: {
    getOrderDetails(order_id) {
      this.$store.dispatch('orders/fetchPaymentDetails', order_id)
        .then(data => {
          this.loading = false
          this.payment = data.status
          this.order = data.order
          this.expert = data.expert
          if ((this.order.price === 0 && !this.payment) || (this.payment && this.payment.gateway_response.result == 'CAPTURED')) { 
            this.$store.commit('checkout/clearOrder')
          }
        })
        .catch((error) => {
          console.log("error", error.response);
        });
    },
  },
};
</script>
