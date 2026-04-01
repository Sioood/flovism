import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

import eslint from '@flovism/eslint'

const require = createRequire(import.meta.url)
const { configApp } = require('@adonisjs/eslint-config')
const oxlintConfigPath = fileURLToPath(new URL('../../packages/config/oxlint/.oxlintrc.json', import.meta.url))

export default eslint(
  {
    oxlint: oxlintConfigPath,
    typescript: true,
  },
  {
    ignores: ['.adonisjs/**', '.cursor/**'],
  },
  {
    files: ['config/{auth,encryption,hash,logger}.ts', 'tests/bootstrap.ts'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
).prepend(...configApp())
