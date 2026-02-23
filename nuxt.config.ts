// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/leaflet',
  ],
  css: ['~/assets/css/main.css'],
  ui: {
    colorMode: false,
  },
  fonts: {},
  devServer: {
    port: 3002,
  },
  // piniaPluginPersistedstate: {
  //   storage: 'localStorage'
  // },
  routeRules: {
    '/admin/auth/**': { appLayout: 'auth', ssr: false },
    '/admin': { appLayout: 'admin' },
    '/admin/**': { appLayout: 'admin' },
  },
})