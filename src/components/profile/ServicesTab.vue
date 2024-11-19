<template>
  <div>
    <div
      class="mb-4 px-4"
      v-for="(service, index) in expert.services" 
      :key="service.id" >

      <expert-service 
        :service="service" 
        :meta="true">

        <div class="d-flex mt-2 justify-content-center">
          <base-button
            type="primary pill"
            @click="checkout(service)"
            v-if="!user || (service.user !== user.pk)"
          >{{$t('service.book')}}</base-button>
        </div>

      </expert-service>

      <hr v-if="index < expert.services.length - 1">
    </div>

    <service-booking ref="booking" />

  </div>
</template>

<script>
import ExpertService from '@/components/common/ExpertService.vue'
import ServiceBooking from '@/components/common/ServiceBooking.vue'

export default {
  components: {
    ExpertService,
    ServiceBooking,
  },
  props: {
    expert: {
      type: Object,
      required: true
    }
  },
  mounted() {
    if (this.$route.query.service) {
      const service = this.expert.services.find(s => s.id === +this.$route.query.service)
      if (service) {
        this.$router.push({ query: { ...this.$route.query, service: undefined } })
        this.checkout(service)
      }
    }
  },
  computed: {
    user() {
      return this.$store.getters['auth/user']
    },
  },

  methods: {
    checkout(service) {
      this.$refs.booking.navigateToCheckout(service, this.expert)
    }
  }
};
</script>