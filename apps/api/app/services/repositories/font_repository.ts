import db from '@adonisjs/lucid/services/db'

import { defaultLanguageCode } from '../../constants/i18n.js'

import type { SimplePaginatorContract } from '@adonisjs/lucid/types/querybuilder'

export default class FontRepository {
  buildListQuery(languageCode: string, options?: { publishedOnly?: boolean }) {
    const query = db
      .from('fonts')
      .leftJoin('font_translations as tr', (join) => {
        join.on('fonts.id', '=', 'tr.font_id').andOnVal('tr.language_code', '=', languageCode)
      })
      .leftJoin('font_translations as tr_fr', (join) => {
        join.on('fonts.id', '=', 'tr_fr.font_id').andOnVal('tr_fr.language_code', '=', defaultLanguageCode)
      })
      .select([
        'fonts.*',
        db.raw('COALESCE(tr.name, tr_fr.name) as name'),
        db.raw('COALESCE(tr.slug, tr_fr.slug) as slug'),
        db.raw('COALESCE(tr.description, tr_fr.description) as description'),
      ])
      .orderBy('fonts.created_at', 'desc')

    if (options?.publishedOnly) {
      query.where('fonts.status_code', 'published')
    }

    return query
  }

  listPaginated(
    languageCode: string,
    options: { publishedOnly?: boolean } | undefined,
    page: number,
    perPage: number,
  ): Promise<SimplePaginatorContract<Record<string, unknown>>> {
    return this.buildListQuery(languageCode, options).paginate(page, perPage)
  }

  async byId(id: string, languageCode: string, options?: { publishedOnly?: boolean }) {
    const query = db
      .from('fonts')
      .leftJoin('font_translations as tr', (join) => {
        join.on('fonts.id', '=', 'tr.font_id').andOnVal('tr.language_code', '=', languageCode)
      })
      .leftJoin('font_translations as tr_fr', (join) => {
        join.on('fonts.id', '=', 'tr_fr.font_id').andOnVal('tr_fr.language_code', '=', defaultLanguageCode)
      })
      .select([
        'fonts.*',
        db.raw('COALESCE(tr.name, tr_fr.name) as name'),
        db.raw('COALESCE(tr.slug, tr_fr.slug) as slug'),
        db.raw('COALESCE(tr.description, tr_fr.description) as description'),
      ])
      .where('fonts.id', id)

    if (options?.publishedOnly) {
      query.where('fonts.status_code', 'published')
    }

    return query.first()
  }
}
