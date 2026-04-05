import db from '@adonisjs/lucid/services/db'

import { defaultLanguageCode } from '#constants/i18n'
import { newId, type IdPrefix } from '#utils/custom_id'

import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

type TranslationInput = Record<string, string | null>

/** Translation tables that define an `updated_at` column (see migrations). */
const TABLES_WITH_UPDATED_AT = new Set(['project_translations'])

interface UpsertParams {
  table: string
  foreignKey: string
  ownerId: string
  idPrefix: IdPrefix
  translations: Record<string, TranslationInput>
  trx?: TransactionClientContract
}

/**
 * Repository for handling translation upserts across different entities
 */
export class TranslationRepository {
  /**
   * Upsert translations for an entity
   */
  static async upsert(params: UpsertParams): Promise<void> {
    const { table, foreignKey, ownerId, idPrefix, translations, trx } = params
    const queryClient = trx || db

    // Ensure default language exists
    if (!translations[defaultLanguageCode]) {
      throw new Error(`Missing required translation for ${defaultLanguageCode}`)
    }

    // Validate languages exist
    const languageCodes = Object.keys(translations)
    const languages = await queryClient.from('languages').whereIn('code', languageCodes).select('code')
    const validLanguageCodes = new Set(languages.map((l: { code: string }) => l.code))

    for (const code of languageCodes) {
      if (!validLanguageCodes.has(code)) {
        throw new Error(`Unknown language: ${code}`)
      }
    }

    // Upsert each translation
    for (const [languageCode, payload] of Object.entries(translations)) {
      const existing = await queryClient.from(table).where(foreignKey, ownerId).where('language_code', languageCode).first()

      if (existing) {
        const updateBody: Record<string, unknown> = { ...payload }
        if (TABLES_WITH_UPDATED_AT.has(table)) {
          updateBody.updated_at = queryClient.rawQuery('CURRENT_TIMESTAMP')
        }
        await queryClient.from(table).where('id', existing.id).update(updateBody)
      } else {
        const id = newId(idPrefix)
        await queryClient.table(table).insert({
          id,
          ...payload,
          [foreignKey]: ownerId,
          language_code: languageCode,
        })
      }
    }
  }
}
