<template>
  <div>
    <div class="base-layout-header"></div>

    <div class="container">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.base-layout-header {
  height: 200px;
  background: url('../assets/img/middle-section-background.png');
  background-position: bottom;
}
.container {
  top: -50px;
  position: relative;
  min-height: 50vh;
}
@media (max-width: 768px) {
  .base-layout-header {
    height: 70px;
  }
}
</style>