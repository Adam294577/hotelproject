export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig();
  const userStore = useUserStore();
  const { $api } = useNuxtApp();
  const userToken = useCookie("userToken");

  // 如果 token 未過期 Init userData
  if (userToken.value && !userStore.userData) {
    setAuthorization(userToken.value);
    const { data } = await $api("/user", {
      ...config.public.backendOptions,
    });
    if (data) {
      userStore.userData = data.result;
    }
  }
  // navigate
  if (["404NotFound", "index", "rooms"].includes(to.name)) return;
  if (to.name === "account") return navigateTo("/account/login");
  if (to.name.split("-")[0] === "account") return;
  if (!userToken.value) return navigateTo("/account/login");
});
