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
    transform: (res) => res.result.filter((i) => i.status !== -1),
  }
);
</script>
<template>
  <NuxtPage
    v-if="route.name.split('-').at(-1) === 'order'"
    :orderData="orderData"
  />
  <NuxtPage v-else />
</template>

<style lang="scss" scoped></style>
