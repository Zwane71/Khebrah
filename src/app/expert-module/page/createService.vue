<template>
  <div>
    <dashboard-header :title="$t('dashboard.addService')" />

    <create-service @create="handleCreate" />
  </div>
</template>

<script>
import CreateService from "@/app/expert-module/components/createService.vue";
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'

export default {
  components: {
    CreateService,
    DashboardHeader
  },

  methods: {
    handleCreate() {
      this.$router.push({ name: "services" });
    }
  }

};
</script>
