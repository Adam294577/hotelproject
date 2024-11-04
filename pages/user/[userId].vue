<script setup>
const route = useRoute();
</script>
<template>
  <div>使用者ID:{{ route.params.userId }}</div>
  <NuxtPage />
</template>

<style lang="scss" scoped></style>
