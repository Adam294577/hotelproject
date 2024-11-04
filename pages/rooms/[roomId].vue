<script setup>
const route = useRoute();
</script>
<template>
  <div v-if="route.name === 'rooms-roomId'">
    房號: {{ route.params.roomId }}
  </div>
  <NuxtPage />
</template>

<style lang="scss" scoped></style>
