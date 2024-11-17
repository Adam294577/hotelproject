// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  runtimeConfig: {
    imgurClientId: process.env.IMGUR_CLIENT_ID,
  },
  app: {
    head: {
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@200..900&display=swap",
        },
      ],
    },
  },
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
