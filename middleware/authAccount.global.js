export default defineNuxtRouteMiddleware((to, from) => {
  if (["404NotFound", "index"].includes(to.name)) return;
  if (to.name === "account") return navigateTo("/account/login");
  if (import.meta.client) {
    const token = localStorage.getItem("tk");
    if (to.name.split("-")[0] === "account") return;
    if (!token) return navigateTo("/account/login");
  }
});
