<script setup>
const route = useRoute();
const config = useRuntimeConfig();
const userStore = useUserStore();
const { data: orderData, refresh: refreshOrder } = await useAsyncData(
  `order-${userStore.userData._id}`,
  () =>
    $fetch(`/orders`, {
      ...config.public.backendOptions,
    }),
  {
    transform: (res) => res.result.filter((i) => i.status !== -1),
  }
);
const { data: profileData, refresh: refreshProfile } = await useAsyncData(
  `profile-${userStore.userData._id}`,
  () =>
    $fetch(`/user`, {
      ...config.public.backendOptions,
    }),
  {
    transform: (res) => res.result,
  }
);
const updateUserData = async () => {
  await refreshProfile();
  userStore.userData = structuredClone(toRaw(profileData.value));
};
</script>
<template>
  <NuxtPage
    v-if="route.name.split('-').at(-1) === 'order'"
    :orderData="orderData"
    @refreshData="refreshOrder"
  />
  <NuxtPage v-else :profileData="profileData" @refreshData="updateUserData" />
</template>

<style lang="scss" scoped></style>
