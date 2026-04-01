// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from '@nuxt/kit'
import tailwindcss from '@tailwindcss/vite'
const { resolve } = createResolver(import.meta.url)
const isKnipRun = process.env.KNIP === '1'

export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: isKnipRun ? ['@flovism/nuxt-essentials'] : [['@flovism/nuxt-essentials', { install: true }]],
  css: [resolve('./assets/css/main.css')],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ['@nuxt/fonts', '@nuxt/icon', '@nuxt/image', 'v-gsap-nuxt'],
  alias: { '~ui': resolve('./') },
  components: [
    {
      path: resolve('./components'),
      prefix: 'UI',
    },
  ],
  icon: {
    customCollections: [
      {
        prefix: 'custom',
        // Absolute path so apps that `extends` this layer still load icons from the package.
        dir: resolve('./assets/icons'),
      },
    ],
  },
  i18n: {
    defaultLocale: 'fr-FR',
    // ISO 639-1 + ISO 3166-1
    locales: [{ code: 'fr-FR', name: 'Français', file: 'fr-FR/index.ts' }],
  },
  site: {
    url: 'https://ui.com',
    name: 'UI',
    description: 'UI component library',
  },
})
