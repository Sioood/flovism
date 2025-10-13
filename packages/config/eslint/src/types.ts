import type { Linter } from 'eslint'
import type { OxlintConfig } from 'eslint-plugin-oxlint/dist/build-from-oxlint-config/types.d.ts'

export type Awaitable<T> = T | Promise<T>

// oxlint-disable-next-line no-explicit-any
export type Rules = Record<string, Linter.RuleEntry<any> | undefined>

/**
 * An updated version of ESLint's `Linter.Config`, which provides autocompletion
 * for `rules` and relaxes type limitations for `plugins` and `rules`, because
 * many plugins still lack proper type definitions.
 */
export type TypedFlatConfigItem = Omit<Linter.Config, 'plugins' | 'rules'> & {
  /**
   * An object containing a name-value mapping of plugin names to plugin objects.
   * When `files` is specified, these plugins are only available to the matching files.
   *
   * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
   */

  // oxlint-disable-next-line no-explicit-any
  plugins?: Record<string, any>

  /**
   * An object containing the configured rules. When `files` or `ignores` are
   * specified, these rule configurations are only available to the matching files.
   */
  rules?: Rules
}

export interface OptionsHasTypeScript {
  hasTypescript?: boolean
}

export interface OptionsConfig {
  /**
   * Enable oxlint support.
   * Can be a boolean, a path to a config file, or a config object.
   *
   * @default true
   */
  oxlint?: boolean | string | OxlintConfig

  /**
   * Enable prettier support.
   *
   * @default true
   */
  prettier?: boolean

  /**
   * Enable typescript support.
   *
   * @default true
   */
  typescript?: boolean

  /**
   * Enable vue support.
   *
   * @default true
   */
  vue?: boolean

  /**
   * Enable tailwindcss support.
   * Can be a boolean or a path to the config file.
   *
   * @default true
   */
  tailwindcss?: boolean | string

  /**
   * Enable imports support.
   *
   * @default true
   */
  imports?: boolean

  /**
   * Enable jsonc support.
   *
   * @default true
   */
  jsonc?: boolean

  /**
   * Enable yml support.
   *
   * @default true
   */
  yml?: boolean

  /**
   * Enable markdown support.
   *
   * @default true
   */
  markdown?: boolean
}

export type FlatConfig = TypedFlatConfigItem
export type FlatConfigs = FlatConfig[]

export function defineConfig(config: FlatConfig | FlatConfigs): FlatConfigs {
  return Array.isArray(config) ? config : [config]
}
