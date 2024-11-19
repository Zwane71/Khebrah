<template>
  <div class="sidebar d-none d-lg-block">
    <base-avatar 
      v-if="profile"
      :is-expert="isExpert"
      class="profile-picture"
      :src="profileImage"
      :first-name="profile.first_name"
      :last-name="profile.last_name"
      :badge="profile.badge"
      size="medium"
    />

    <h4 class="mt-3 mb-1 font-weight-bold">{{ name }}</h4>
    <h6 v-if="isExpert">{{ title }}</h6>

    <div class="text-left nav-links mt-4">
      <router-link
        :to="`/${$i18n.locale}/dashboard/orders`"
        :class="{active: isActive('Orders')}"
        ><i class="fas fa-shopping-cart"></i> 
        {{$t('dashboard.orders')}}
        </router-link>
      <router-link
        v-if="isExpert"
        :to="`/${$i18n.locale}/dashboard/bookings`"
        :class="{active: isActive('Bookings')}"
        ><i class="far fa-calendar-check"></i> 
        {{$t('dashboard.bookings')}}
        </router-link>
      <router-link
        v-if="isExpert"
        :to="`/${$i18n.locale}/dashboard/services`"
        :class="{active: isActive('services')}"
        ><i class="fas fa-suitcase"></i> 
        {{$t('dashboard.services')}}
      </router-link>
      <router-link
        v-if="isExpert"
        :to="`/${$i18n.locale}/dashboard/availability`"
        :class="{active: isActive('availability')}"
        ><i class="far fa-clock"></i> 
        {{$t('dashboard.availability')}}
      </router-link>
      <router-link 
        :to="`/${$i18n.locale}/dashboard/profile`"
        :class="{active: isActive('Profile')}"
        ><i class="far fa-user-circle"></i> 
        {{$t('dashboard.profile')}}
      </router-link>
      <router-link
        v-if="isExpert"
        :to="`/${$i18n.locale}/dashboard/payments`"
        :class="{active: isActive('Payments')}"
        ><i class="far fa-money-bill-alt"></i> 
        {{$t('dashboard.payments')}}
        </router-link>
      <router-link 
        v-if="isExpert"
        :to="`/${$i18n.locale}/dashboard/plan`"
        :class="{active: isActive('Plan')}"
        ><i class="fas fa-crown"></i> 
        {{$t('dashboard.plan')}}
      </router-link>
      <router-link 
        :to="`/${$i18n.locale}/dashboard/settings`"
        :class="{active: isActive('Settings')}"
        ><i class="fas fa-cog"></i> 
        {{$t('dashboard.settings')}}
      </router-link>
    </div>
  </div>
</template>
<script>
import BaseAvatar from '@/components/base/BaseAvatar.vue'
export default {
  components: {
    BaseAvatar
  },
  computed: {
    profile() {
      return this.$store.getters['user/profile']
    },
    isExpert() {
      return this.$store.getters['auth/isExpert']
    },
    name() {
      return this.profile 
        ? this.profile.first_name + " " + this.profile.last_name
        : ''
    },
    title() {
      return this.profile 
        ? this.profile.title
        : ''
    },
    initials() {
      if (!this.profile) return ' '
      return this.profile.first_name[0] + this.profile.last_name[0]
    },
    profileImage() {
      return this.profile && this.profile.profile_img
    }
  },
  methods: {
    isActive(name) {
      return this.$route.name === name
    }
  },
};
</script>
<style scoped>

.profile-picture {
  margin: -80px auto 0;
  box-shadow: 0 2px 15px rgba(0,0,0,0.3)
}
.sidebar {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  border: 1px solid rgba(0,0,0,0.125);
  text-align: center;
}
.nav-links a {
  font-size: 18px;
  color: #39425d;
  display: block;
  padding: 5px 30px
}
.nav-links a.router-link-active {
  color: #044982;
  background: aliceblue;
}
.nav-links i {
  margin-right: 10px;
}
.rtl .nav-links i {
  margin-right: unset;
  margin-left: 10px;
}
h6 {
  color: #044982;
}
</style>
