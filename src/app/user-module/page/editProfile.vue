<template>
  <div>
    <dashboard-header :title="$t('dashboard.editProfile')" >
      <base-button
        v-if="isExpert"
        type="primary"
        @click="editArabic"
        ><i
          class="fas fa-edit mr-2"
        ></i>
        {{ $t('user.editInArabic') }}
        </base-button>
    </dashboard-header>
    <EditProfile ref="editProfile" />
  </div>
</template>
<script>
import EditProfile from "@/app/user-module/component/editProfile.vue";
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'

export default {
  components: {
    EditProfile,
    DashboardHeader
  },

  metaInfo: {
    title: 'Edit profile'
  },

  computed: {
    isExpert() {
      return this.$store.getters['auth/isExpert']
    },
  },

  methods: {
    editArabic() {
      this.$refs.editProfile.showArabicModal()
    }
  }

};
</script>
