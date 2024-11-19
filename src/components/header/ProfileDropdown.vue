<template>
  <div class="position-relative" :class="{ active: isOpen }">
    <div class="wrapper d-flex p-1 align-items-center" @click="showDropdown">
      <base-avatar 
        :size="40"
        :is-expert="isExpert"
        class="profile-picture"
        :src="profileImage"
      /> 
      <span class="name mr-2 text-primary">{{ name }}</span>
      <i class="fas fa-chevron-down mr-2"></i>
    </div>
    <div
      class="dropdown p-3 list-group"
      v-if="isOpen"
      v-click-outside="closeDropdown"
    >
      <div class="list-group-item list-group-item-action" @click="goToBookings" v-if="isExpert && profileComplete">
        {{$t('dashboard.myBookings')}}
      </div>
      <div v-if="profileComplete" class="list-group-item list-group-item-action" @click="goToOrders">
        {{$t('dashboard.myOrders')}}
      </div>
      <div v-if="profileComplete" class="list-group-item list-group-item-action" @click="goToProfile">
        {{$t('dashboard.profile')}}
      </div>
      <div class="list-group-item list-group-item-action" @click="signout">
        {{$t('dashboard.signOut')}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    isOpen: false,
  }),
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    profile() {
      return this.$store.getters["user/profile"];
    },
    isExpert() {
      return this.$store.getters['auth/isExpert']
    },
    name() {
      return this.profile && this.profile.first_name
        ? (this.profile.first_name || "") + " " + (this.profile.last_name || "")
        : this.user.email;
    },
    initials() {
      if (!this.profile || !this.profile.first_name) return '@'
      const { first_name, last_name } = this.profile
      return (first_name || ' ')[0] + (last_name || ' ')[0]
    },
    profileImage() {
      return this.profile && this.profile.profile_img
    },
    profileComplete() {
      return this.profile && this.profile.profile_complete
    }
  },

  methods: {
    signout() {
      this.$store.commit('clearNextRoute')
      this.$store.dispatch("auth/logout");
      this.$router.push(`/${this.$i18n.locale}/`)
      //location.reload();
    },
    closeDropdown() {
      this.isOpen = false;
    },
    showDropdown() {
      this.isOpen = true;
    },
    goToProfile() {
      this.$router.push(`/${this.$i18n.locale}/dashboard/profile`);
      this.closeDropdown()
    },
    goToOrders() {
      this.$router.push(`/${this.$i18n.locale}/dashboard/orders`);
      this.closeDropdown()
    },
    goToBookings() {
      this.$router.push(`/${this.$i18n.locale}/dashboard/bookings`);
      this.closeDropdown()
    },
  },
};
</script>

<style scoped>
.avatar {
  margin-right: 10px;
}
.rtl .avatar {
  margin-right: unset;
  margin-left: 10px;
}
.wrapper {
  background: #f0f0f0;
  border-radius: 30px;
  cursor: pointer;
}
.active .wrapper {
  box-shadow: 0 0 0 1px#044982;
}
.name {
  text-overflow: ellipsis;
  max-width: 10ch;
  overflow: hidden;
  white-space: nowrap;
}
.dropdown {
  /* background: #f0f0f0; */
  position: absolute;
  right: 0;
  margin-top: 5px;
  width: 100%;
  padding: 0 !important;
}
.rtl .dropdown {
  right: unset;
  left: 0;
}
.list-group-item {
  cursor: pointer;
  color: #044982;
}
</style>
