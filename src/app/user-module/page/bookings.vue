<template>
  <div>
    <dashboard-header :title="$t('dashboard.bookings')" />

    <div class="row mt-2">
      <div class="col" v-if="upcoming.length">
        <OrdersList :orders="upcoming" :title="$t('bookings.upcomingBookings')"/>
        <div class="d-flex justify-content-end">
          <base-pagination 
            :count="upcomingCount" 
            :limit="limit" 
            :current-page="upcomingPage" 
            @change="changeUpcomingPage" />
        </div>
      </div>
      <div class="col text-center py-5" v-else>
        {{$t('bookings.emptyUpcomingBookings')}}
      </div>
    </div>
    <div class="row mt-3" v-if="past.length">
      <div class="col">
        <OrdersList :orders="past" :title="$t('bookings.pastBookings')" />
        <div class="d-flex justify-content-end">
          <base-pagination 
            :count="pastCount" 
            :limit="limit" 
            :current-page="pastPage" 
            @change="changePastPage" />
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
      upcoming: [],
      past: [],
      limit: 5,
      upcomingPage: 0,
      upcomingCount: 0,
      pastPage: 0,
      pastCount: 0,
    };
  },
  metaInfo: {
    title: 'Bookings'
  },
  beforeRouteEnter(to, from, next) {
    Promise.all([
      store.dispatch('user/fetchBookings', { offset: 0, limit: 5, status: ['booked'] }),
      store.dispatch('user/fetchBookings', { offset: 0, limit: 5, status: ['cancelled', 'completed'] })
    ])
      .then(([upcoming, past]) => {
        next(vm => {
          vm.upcomingCount = upcoming.count
          vm.pastCount = past.count

          vm.upcoming = upcoming.results
          vm.past = past.results
        })
      })
      .catch(error => {
        next({ path: '/404' })
      })
    // store.dispatch('user/fetchBookings', { } )
    //   .then(data => {
    //     next(vm => {
    //       vm.bookings = data.results
    //     })
    //   })
    //   .catch(error => {
    //     next({ path: '/404' })
    //   })
  },
  // computed: {
    // upcoming() {
    //   return this.bookings.filter(booking => booking.status === 'booked')
    // },
    // past() {
    //   return this.bookings.filter(booking => booking.status !== 'booked')
    // },
    // user() {
    //   return this.$store.getters['auth/user']
    // }
  // },
  methods: {
    changeUpcomingPage(page) {
      this.upcomingPage = page
      this.$Progress.start()
      store.dispatch('user/fetchBookings', { offset: this.upcomingPage * this.limit, limit: this.limit, status: ['booked'] })
        .then(data => {
          this.$Progress.finish()
          this.upcomingCount = data.count
          this.upcoming = data.results
        })
    },
    changePastPage(page) {
      this.pastPage = page
      this.$Progress.start()
      store.dispatch('user/fetchBookings', { offset: this.pastPage * this.limit, limit: this.limit, status: ['cancelled', 'completed'] })
        .then(data => {
          this.$Progress.finish()
          this.pastCount = data.count
          this.past = data.results
        })
    }
  }
};
</script>
