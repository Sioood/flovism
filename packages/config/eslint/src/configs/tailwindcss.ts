import path from 'node:path'

import { pluginTailwind } from '../plugins.ts'
import { defineConfig, type FlatConfig } from '../types.ts'

export function tailwindcss(options: boolean | string) {
  if (options === false) return []

  const recommended = pluginTailwind.configs['flat/recommended']

  if (typeof options === 'string') {
    return defineConfig([
      ...(recommended as FlatConfig[]),
      {
        settings: {
          tailwindcss: {
            config: path.resolve(options),
          },
        },
        rules: {
          'tailwindcss/no-custom-classname': 'off',
          'tailwindcss/classnames-order': 'warn',
        },
      },
    ])
  }

  return defineConfig(recommended as FlatConfig)
}
