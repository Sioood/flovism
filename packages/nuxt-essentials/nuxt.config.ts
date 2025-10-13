import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    /**
     * See thoses links for more information
     * https://nuxt-security.vercel.app/getting-started/configuration#overriding-a-layers-configuration
     *
     * https://nuxt-security.vercel.app/advanced/good-practices
     * https://nuxt-security.vercel.app/advanced/improve-security
     */
    'nuxt-security',
    '@vueuse/nuxt',
    '@nuxtjs/seo',
    /**
     * This module is intended to be used with a self-hosted Bugsink instance.
     * https://www.bugsink.com/
     *
     * Edit the 'sentry' config in each project extending this layer.
     */
    '@sentry/nuxt/module',
  ],
  alias: { '~nuxt-essentials': resolve('./') },
  components: [
    {
      path: resolve('./components'),
      prefix: 'NEss',
    },
  ],
  runtimeConfig: {
    public: {
      sentry: {
        dsn: '',
      },
    },
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  i18n: {
    defaultLocale: 'fr-FR',
    // ISO 639-1 + ISO 3166-1
    locales: [{ code: 'fr-FR', name: 'Français', file: 'fr-FR/index.ts' }],
  },
  site: {
    url: 'https://example.com',
    name: 'Nuxt Essentials',
    description: 'Welcome to my awesome site!',
  },
  sentry: {
    enabled: true, // Set to `true` to enable the module for a project
  },
})
