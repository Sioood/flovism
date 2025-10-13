import eslint from '@flovism/eslint'

import { withNuxt } from './.nuxt/eslint.config.mjs'

export default withNuxt(
  eslint({
    oxlint: 'node_modules/@flovism/oxlint/.oxlintrc.json',
    prettier: true,
    typescript: true,
    vue: true,
    tailwindcss: 'node_modules/@flovism/ui/assets/css/main.css',
  }),
)
