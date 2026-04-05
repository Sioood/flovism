import db from '@adonisjs/lucid/services/db'

import { defaultLanguageCode } from '#constants/i18n'
import { TranslationRepository } from '#utils/translation_repository'

import type { IdPrefix } from '#utils/custom_id'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

type TranslationInput = Record<string, string | null>

const tableIdPrefix: Record<'project_translations' | 'font_translations', IdPrefix> = {
  project_translations: 'projectTranslation',
  font_translations: 'fontTranslation',
}

export default class TranslationService {
  async ensureLanguageExists(languageCode: string) {
    const language = await db.from('languages').where('code', languageCode).first()
    if (!language) {
      throw new Error(`Unknown language: ${languageCode}`)
    }
  }

  ensureDefaultLanguagePayload(translations: Record<string, TranslationInput>) {
    if (!translations[defaultLanguageCode]) {
      throw new Error(`Missing required translation for ${defaultLanguageCode}`)
    }
  }

  async upsertEntityTranslations(params: {
    table: 'project_translations' | 'font_translations'
    ownerColumn: 'project_id' | 'font_id'
    ownerId: string
    translations: Record<string, TranslationInput>
    trx?: TransactionClientContract
  }) {
    await TranslationRepository.upsert({
      table: params.table,
      foreignKey: params.ownerColumn,
      ownerId: params.ownerId,
      idPrefix: tableIdPrefix[params.table],
      translations: params.translations,
      trx: params.trx,
    })
  }

  async upsertFontFamilyTranslations(params: { familyId: string; translations: Record<string, { displayName: string }>; trx?: TransactionClientContract }) {
    const translations = Object.fromEntries(
      Object.entries(params.translations).map(([languageCode, row]) => [languageCode, { display_name: row.displayName } as TranslationInput]),
    )
    await TranslationRepository.upsert({
      table: 'font_family_translations',
      foreignKey: 'family_id',
      ownerId: params.familyId,
      idPrefix: 'fontFamilyTranslation',
      translations,
      trx: params.trx,
    })
  }
}
