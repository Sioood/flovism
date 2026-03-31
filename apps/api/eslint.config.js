import { createRequire } from 'node:module'

import eslint from '@flovism/eslint'

const require = createRequire(import.meta.url)
const { configApp } = require('@adonisjs/eslint-config')

export default eslint(
  {
    oxlint: '../../packages/config/oxlint/.oxlintrc.json',
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
