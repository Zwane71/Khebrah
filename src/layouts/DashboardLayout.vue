<template>
  <div>
    <div class="dashboard-header pt-5">
      <div class="container">
        <slot name="title"></slot>
      </div>
    </div>
    <div class="container content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.dashboard-header {
  height: 200px;
  background: url('../assets/img/header02.jpg');
}
.content {
  top: -50px;
  position: relative;
}
@media (max-width: 768px) {
  .dashboard-header {
    height: 165px;
  }
}
</style>