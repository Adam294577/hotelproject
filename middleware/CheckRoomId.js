export default defineNuxtRouteMiddleware(async (to, from) => {
  // 確認後端有此 roomId內容 沒有則回到 /room
  const id = to.params.roomId;

  const config = useRuntimeConfig();
  const { $api } = useNuxtApp();
  const res = await $api(`/rooms/${id}`, {
    ...config.public.backendOptions,
  });
  if (res.error) {
    return navigateTo("/rooms");
  }
});
