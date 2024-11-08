export default defineNuxtRouteMiddleware((to, from) => {
  // console.log("server:", import.meta.server);
  // console.log("client:", import.meta.client);
  if (import.meta.client) {
    const token = localStorage.getItem("tk");
    if (to.name === "account-login") return;
    if (!token) return navigateTo("/account/login");
  }
});
