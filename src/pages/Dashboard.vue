<template>
  <dashboard-layout>
    <div class="row">
      <div class="col-lg-3">
        <dashboard-left-panel />
      </div>
      <div class="col-lg-9">
        <div class="base-box dashboard-content">
          <router-view />
        </div>
      </div>
    </div>
  </dashboard-layout>
</template>
<script>
import DashboardLeftPanel from "@/app/expert-module/components/DashboardLeftPanel.vue";

export default {
  components: {
    DashboardLeftPanel,
  },
  metaInfo: {
    titleTemplate: '%s | Khebrah'
  }
}
</script>

<style scoped>
.dashboard-content {
  padding: 30px;
  min-height: 100%;
}
@media (max-width: 768px) {
  .dashboard-content {
    padding: 20px;
  }
  /deep/ .dashboard-header {
    height: 70px !important;
  }
}
</style>