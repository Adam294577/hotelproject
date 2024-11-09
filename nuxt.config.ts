// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["@/assets/styles/all.scss"],
  imports: {
    dirs: ["stores"],
  },
  modules: [
    // ...
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxt/icon",
    "@vueuse/nuxt",
    "nuxt-swiper",
  ],
  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },
  plugins: ["~/plugins/bootstrap.client.js"],
});
