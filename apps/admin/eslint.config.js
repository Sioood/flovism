import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import eslint from '@flovism/eslint'

import { withNuxt } from './.nuxt/eslint.config.mjs'

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url))
const tsProject = join(tsconfigRootDir, '.nuxt/tsconfig.app.json')

export default withNuxt(
  eslint({
    oxlint: 'node_modules/@flovism/oxlint/.oxlintrc.json',
    prettier: true,
    typescript: true,
    vue: true,
    tailwindcss: 'node_modules/@flovism/ui/assets/css/main.css',
  }),
  {
    // Match `.nuxt/tsconfig.app.json` `include` (e.g. `../app/**/*`). Root files
    // like `nuxt.config.ts` / `eslint.config.js` must not use this project.
    files: ['app/**/*.{ts,tsx,js,jsx,mts,cts,mjs,cjs,vue}', 'i18n/**/*.{ts,tsx,js,jsx,mts,cts,mjs,cjs}'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir,
        project: tsProject,
        extraFileExtensions: ['.vue'],
      },
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          project: tsProject,
        },
      },
    },
  },
  // typescript-eslint projectService picks up multiple workspace tsconfigs unless
  // `tsconfigRootDir` is set for files outside `app/` / `i18n/`.
  {
    files: ['eslint.config.js', 'nuxt.config.ts'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir,
      },
    },
  },
)
