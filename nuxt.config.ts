// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/icon'
  ],

  // Hybrid SSR/SSG configuration
  routeRules: {
    '/': { prerender: true },
    '/models/**': { prerender: true },
    '/api/**': { cors: true }
  },

  // Performance optimizations
  experimental: {
    payloadExtraction: true
  },

  // Image optimization
  image: {
    quality: 80,
    formats: ['webp', 'jpg']
  },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false  // Disabled in dev for faster builds
  }
});
