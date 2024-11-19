<template>
  <div>
    <dashboard-header :title="$t('dashboard.availability')">
      <div class="toggle" @click="toggleAvailability" :class="{toggled: available === true }" >
        <div class="toggle-text" v-if="!loading">
          {{ availabilityStatus }}
        </div>
        <div class="toggle-text" v-else>
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        </div>
        <div class="toggle-switch"></div>
      </div>
    </dashboard-header>
    <Availability :class="{'availability-disabled': !this.available}" :schedules="schedules" @fetchSchedules="fetchSchedules"/>
  </div>
</template>
<script>
import Availability from "@/app/expert-module/components/Availability.vue";
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import store from '@/store'

export default {
  components: {
    Availability,
    DashboardHeader
  },
  data: () => ({
    schedules: [],
    loading: false
  }),
  metaInfo: {
    title: 'Availability'
  },

  beforeRouteEnter(to, from, next) {
    store.dispatch('availability/fetchAvailability')
      .then(data => {
        next(vm => {
          vm.schedules = data
        })
      })
      .catch(error => {
        console.log(error)
      })
  },
  computed: {
    profile() {
      return this.$store.getters['user/profile']
    },
    available() {
      return this.profile.available
    },
    availabilityStatus() {
      return this.available
        ? this.$t('availability.on')
        : this.$t('availability.off')
    }
  },
  methods: {
    toggleAvailability() {
      this.loading = true
      this.$store.dispatch('user/updateProfile', { available: !this.available })
        .then(() => {
          this.$store.dispatch('user/fetchProfile')
            .then(() => {
              this.loading = false
            })
        })
    },
    fetchSchedules() {
      store.dispatch('availability/fetchAvailability')
        .then(data => {
          this.schedules = data
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
};
</script>
<style scoped>
  .toggle {
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    border: 1px solid rgba(0,0,0,0.125);
    border-radius: 40px;
    width: 85px;
    position: relative;
    padding: 5px 10px;
    cursor: pointer;
    padding-left: 35px;
    user-select: none;
  }
  .toggle.toggled {
    padding-left: 10px;
  }
  .toggle-switch {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    position: absolute;
    top: 5px;
    left: 5px;
    right: unset;
    background: #ccc;
  }
  .toggled .toggle-switch {
    right: 5px;
    background:#28a745;
    left: unset;
  }
  .rtl .toggle {
    padding-left: unset;
    padding-right: 35px;
  }
  .rtl .toggle.toggled {
    padding-left: unset;
    padding-right: 10px;
  }
  .rtl .toggle-switch {
    left: unset;
    right: 5px;
  }
  .rtl .toggled .toggle-switch {
    right: unset;
    left: 5px;
  }

  .availability-disabled {
    opacity: 0.7;
    pointer-events: none;
    user-select: none;
  }
</style>
