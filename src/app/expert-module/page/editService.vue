<template>
  <div>
    <dashboard-header :title="$t('dashboard.editService')" />
    <EditService></EditService>
  </div>
</template>

<script>
import EditService from "@/app/expert-module/components/editService.vue";
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'

export default {
  components: {
    EditService,
    DashboardHeader
  },
};
</script>
