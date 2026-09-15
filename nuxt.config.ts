// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/i18n"],
  css: ["~/assets/css/main.css"],
  i18n: {
    defaultLocale: "km",
    strategy: "no_prefix",
    locales: [
      {
        code: "en",
        language: "en-US",
        name: "English",
        file: "en.ts",
      },
      {
        code: "km",
        language: "km-KH",
        name: "ខ្មែរ",
        file: "km.ts",
      },
    ],
    detectBrowserLanguage: false,
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api",
    },
  },
});
