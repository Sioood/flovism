import path from 'node:path'

import { pluginOxlint } from '../plugins.ts'
import { defineConfig } from '../types.ts'

import type { OxlintConfig } from 'eslint-plugin-oxlint/dist/build-from-oxlint-config/types.d.ts'

export function oxlint(options: boolean | string | OxlintConfig) {
  if (options === false) return []

  if (typeof options === 'string') return defineConfig(pluginOxlint.buildFromOxlintConfigFile(path.resolve(options)))

  if (typeof options === 'object') return defineConfig(pluginOxlint.buildFromOxlintConfig(options))

  // if options is true, use default config file
  return defineConfig(pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'))
}
