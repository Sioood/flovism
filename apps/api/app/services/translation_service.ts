import db from '@adonisjs/lucid/services/db'

import { newId } from '#utils/custom_id'

import { defaultLanguageCode } from '../constants/i18n.js'

import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

type TranslationInput = Record<string, string | null>

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
    const queryClient = params.trx || db
    this.ensureDefaultLanguagePayload(params.translations)

    for (const [languageCode, payload] of Object.entries(params.translations)) {
      await this.ensureLanguageExists(languageCode)

      const existing = await queryClient.from(params.table).where(params.ownerColumn, params.ownerId).where('language_code', languageCode).first()

      if (existing) {
        await queryClient
          .from(params.table)
          .where('id', existing.id)
          .update({ ...payload, updated_at: queryClient.rawQuery('CURRENT_TIMESTAMP') })
      } else {
        const id = params.table === 'project_translations' ? newId('projectTranslation') : newId('fontTranslation')
        await queryClient.table(params.table).insert({
          id,
          ...payload,
          [params.ownerColumn]: params.ownerId,
          language_code: languageCode,
        })
      }
    }
  }

  async upsertFontFamilyTranslations(params: { familyId: string; translations: Record<string, { displayName: string }>; trx?: TransactionClientContract }) {
    const queryClient = params.trx || db
    if (!params.translations[defaultLanguageCode]) {
      throw new Error(`Missing required translation for ${defaultLanguageCode}`)
    }

    for (const [languageCode, payload] of Object.entries(params.translations)) {
      await this.ensureLanguageExists(languageCode)
      const existing = await queryClient.from('font_family_translations').where('family_id', params.familyId).where('language_code', languageCode).first()

      if (existing) {
        await queryClient.from('font_family_translations').where('id', existing.id).update({ display_name: payload.displayName })
      } else {
        await queryClient.table('font_family_translations').insert({
          id: newId('fontFamilyTranslation'),
          family_id: params.familyId,
          language_code: languageCode,
          display_name: payload.displayName,
        })
      }
    }
  }
}
