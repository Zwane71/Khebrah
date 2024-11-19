<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-6 content offset-lg-3 text-center">
        <h1>404</h1>
        <h3 class="text-muted">{{ $t('home.pageNotFound') }}</h3>
        <base-button to="/" class="mt-5" type="primary pill lg">
          <i class="fas fa-arrow-left mr-2 rtl-icon"></i> {{ $t('home.backToHome') }}
        </base-button>
      </div>
    </div>
  </div> 
</template>

<script>
export default {
  metaInfo() {
    return {
      title: '404 | Khebrah'
    }
  }
}
</script>

<style scoped>
.content {
  min-height: 75vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
h1 {
  font-weight: 900;
  font-size: 70px;
}
</style>