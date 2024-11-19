<template>
  <base-layout>
    <createProfile />
  </base-layout>
</template>

<script>
export default {
  components: {
    createProfile: () =>
      import("@/app/user-module/component/createProfile.vue"),
  },

  metaInfo: {
    title: 'Create profile | Khebrah'
  },
};
</script>
