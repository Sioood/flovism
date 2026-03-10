import eslint from '@flovism/eslint'

import { withNuxt } from './.playground/.nuxt/eslint.config.mjs'

export default withNuxt(
  eslint({
    oxlint: 'node_modules/@flovism/oxlint/.oxlintrc.json',
    prettier: true,
    typescript: true,
    tailwindcss: './assets/css/main.css',
    vue: true,
  }),
)
