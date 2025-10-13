import { configs as tseslintConfigs } from 'typescript-eslint'

import { defineConfig, type FlatConfigs } from '../types.ts'

export const typescript = defineConfig([
  ...(tseslintConfigs.recommended as FlatConfigs),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts', '**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
])
