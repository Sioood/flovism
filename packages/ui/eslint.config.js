import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import eslint from '@flovism/eslint'

import { withNuxt } from './.playground/.nuxt/eslint.config.mjs'

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url))
const tsProject = join(tsconfigRootDir, '.playground/.nuxt/tsconfig.app.json')

export default withNuxt(
  eslint({
    oxlint: 'node_modules/@flovism/oxlint/.oxlintrc.json',
    prettier: true,
    typescript: true,
    tailwindcss: './assets/css/main.css',
    vue: true,
  }),
  {
    // Match `.playground/.nuxt/tsconfig.app.json` `include` (layer `../../**/*`, etc.).
    // Root files like `eslint.config.js` / `.playground/nuxt.config.ts` must not use this project.
    files: [
      '.playground/app/**/*.{ts,tsx,js,jsx,mts,cts,mjs,cjs,vue}',
      'components/**/*.{ts,tsx,js,jsx,mts,cts,mjs,cjs,vue}',
      'composables/**/*.{ts,tsx,js,jsx,mts,cts,mjs,cjs}',
      'i18n/**/*.{ts,tsx,js,jsx,mts,cts,mjs,cjs}',
    ],
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
  // `tsconfigRootDir` is set for files outside typed app sources.
  {
    files: ['eslint.config.js', '.playground/nuxt.config.ts', '.playground/app.config.ts'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir,
      },
    },
  },
)
