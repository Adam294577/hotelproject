// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  runtimeConfig: {
    imgurClientId: process.env.IMGUR_CLIENT_ID,
    public: {
      backendOptions: {
        baseURL: "https://hotelproject-backend-2.onrender.com/api/v1",
        headers: {
          Authorization: "",
        },
      },
    },
  },
  app: {
    head: {
      title: "享樂酒店",
      meta: [
        { name: "description", content: "nuxt3開發練習網站" },
        { property: "og:title", content: "享樂酒店" },
        {
          property: "og:description",
          content: "nuxt3開發練習網站",
        },
        { property: "og:image", content: "https://i.imgur.com/WlSlm4M.jpeg" },
        { property: "og:type", content: "website" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
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
  plugins: ["~/plugins/bootstrap.client.js", "~/plugins/api.js"],
});
