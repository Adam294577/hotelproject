<script setup>
const route = useRoute();
const config = useRuntimeConfig();
const userStore = useUserStore();
const { data: orderData } = await useAsyncData(
  `${userStore.userData._id}`,
  () =>
    $fetch(`/orders`, {
      ...config.public.backendOptions,
    }),
  {
    transform: (res) => res.result,
  }
);
</script>
<template>
  <NuxtPage v-if="route.path.startsWith('/order')" :orderData="orderData" />
  <NuxtPage v-else />
</template>

<style lang="scss" scoped></style>
