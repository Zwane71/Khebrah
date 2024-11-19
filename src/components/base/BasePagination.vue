<template>
  <nav>
    <ul class="pagination" :class="{ hidden: pages < 2 }">
      <li class="page-item" :class="{ active: page === currentPage + 1 }" @click="$emit('change', page - 1)" v-for="page in pages" :key="page">
        <a href="#" @click.prevent class="page-link">
          {{ page }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    count: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 1
    },
    currentPage: {
      type: Number,
      default: 1
    } 
  },
  computed: {
    pages() {
      return Math.ceil(this.count / this.limit) 
    }
  }
}
</script>

<style scoped>
.rtl .page-item:first-child .page-link {
  border-radius: 0 0.25rem 0.25rem 0 !important;
}

.rtl .page-item:last-child .page-link {
  border-radius: 0.25rem 0 0 0.25rem !important;
}
</style>