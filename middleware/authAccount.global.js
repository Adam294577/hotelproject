export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig();
  const userStore = useUserStore();
  if (["404NotFound", "index", "rooms"].includes(to.name)) return;
  if (to.name === "account") return navigateTo("/account/login");
  if (to.name === "rooms-roomId") {
    userStore.successLoginPath = to.params.roomId;
  }
  const token = config.public.backendOptions.headers.Authorization;
  if (to.name.split("-")[0] === "account") return;
  if (!token) return navigateTo("/account/login");
});
