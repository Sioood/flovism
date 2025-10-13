import { pluginMarkdown } from '../plugins.ts'
import { defineConfig } from '../types.ts'

export const markdown = defineConfig([...pluginMarkdown.configs.recommended])
