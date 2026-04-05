import { type NormalizeConstructor } from '@adonisjs/core/types/helpers'
import { type BaseModel, scope } from '@adonisjs/lucid/orm'

import { defaultLanguageCode } from '#constants/i18n'
import { TranslationRepository } from '#utils/translation_repository'

import type { IdPrefix } from '#utils/custom_id'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

type TranslationInput = Record<string, string | null>

type TranslationPreloadQuery = {
  where: (column: string, value: string) => TranslationPreloadQuery
  orWhere: (column: string, value: string) => TranslationPreloadQuery
  orderByRaw: (raw: string, bindings: string[]) => TranslationPreloadQuery
}

/**
 * Configuration interface for translatable entities
 */
export interface TranslatableConfig {
  table: string
  foreignKey: string
  idPrefix: IdPrefix
  translatableColumns: string[]
}

/**
 * Mixin factory for models with translations
 * Usage: class Project extends Translatable(ProjectSchema) { ... }
 * or class Project extends compose(ProjectSchema, Translatable) { ... }
 */
export const Translatable = <T extends NormalizeConstructor<typeof BaseModel>>(Base: T) => {
  return class extends Base {
    // Static config - set these in your model
    public static translatableConfig: TranslatableConfig = {
      table: '',
      foreignKey: '',
      idPrefix: 'projectTranslation',
      translatableColumns: [],
    }

    /**
     * Scope: Preload translations for a specific language with fallback
     */
    public static withTranslations = scope((query: unknown, lang: string) => {
      const preloadQuery = query as {
        preload: (relation: string, callback: (q: unknown) => unknown) => unknown
      }
      return preloadQuery.preload('translations', (translationQuery) => {
        const q = translationQuery as TranslationPreloadQuery
        q.where('language_code', lang).orWhere('language_code', defaultLanguageCode).orderByRaw('CASE WHEN language_code = ? THEN 0 ELSE 1 END', [lang])
      })
    })

    /**
     * Scope: Preload all translations (for admin/editing)
     */
    public static withAllTranslations = scope((query: unknown) => {
      const preloadQuery = query as { preload: (relation: string) => unknown }
      return preloadQuery.preload('translations')
    })

    /**
     * Merge translations into the model instance
     * Call after .preload('translations') to flatten translation attributes
     */
    mergeTranslations(languageCode: string, defaultLang = defaultLanguageCode): this {
      const translations = (this as unknown as { translations?: Array<{ languageCode: string; [key: string]: unknown }> }).translations

      if (!translations || !Array.isArray(translations)) {
        return this
      }

      const cfg = (this.constructor as unknown as { translatableConfig: TranslatableConfig }).translatableConfig

      const requested = translations.find((t) => t.languageCode === languageCode)
      const fallback = translations.find((t) => t.languageCode === defaultLang)
      const translation = requested || fallback

      if (translation) {
        for (const column of cfg.translatableColumns) {
          const value = translation[column]
          if (value !== undefined && value !== null) {
            ;(this as unknown as Record<string, unknown>)[column] = value
          }
        }
      }

      return this
    }

    /**
     * Save translations for this entity
     * Handles both insert and update
     */
    async saveTranslations(translations: Record<string, TranslationInput>, trx?: TransactionClientContract): Promise<void> {
      const cfg = (this.constructor as unknown as { translatableConfig: TranslatableConfig }).translatableConfig
      const ownerId = (this as unknown as { id: string }).id

      await TranslationRepository.upsert({
        table: cfg.table,
        foreignKey: cfg.foreignKey,
        ownerId,
        idPrefix: cfg.idPrefix,
        translations,
        trx,
      })
    }
  }
}
