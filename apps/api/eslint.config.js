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
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'class', format: ['PascalCase'] },
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: { regex: '^I[A-Z]', match: false },
        },
      ],
    },
  },
).prepend(...configApp())
