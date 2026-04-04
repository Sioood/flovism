import db from '@adonisjs/lucid/services/db'

import { defaultLanguageCode } from '../../constants/i18n.js'

import type { SimplePaginatorContract } from '@adonisjs/lucid/types/querybuilder'

export default class ProjectRepository {
  buildListQuery(languageCode: string, options?: { publishedOnly?: boolean }) {
    const query = db
      .from('projects')
      .leftJoin('project_translations as tr', (join) => {
        join.on('projects.id', '=', 'tr.project_id').andOnVal('tr.language_code', '=', languageCode)
      })
      .leftJoin('project_translations as tr_fr', (join) => {
        join.on('projects.id', '=', 'tr_fr.project_id').andOnVal('tr_fr.language_code', '=', defaultLanguageCode)
      })
      .select([
        'projects.*',
        db.raw('COALESCE(tr.name, tr_fr.name) as name'),
        db.raw('COALESCE(tr.slug, tr_fr.slug) as slug'),
        db.raw('COALESCE(tr.description, tr_fr.description) as description'),
      ])
      .orderBy('projects.created_at', 'desc')

    if (options?.publishedOnly) {
      query.where('projects.status_code', 'published')
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
      .from('projects')
      .leftJoin('project_translations as tr', (join) => {
        join.on('projects.id', '=', 'tr.project_id').andOnVal('tr.language_code', '=', languageCode)
      })
      .leftJoin('project_translations as tr_fr', (join) => {
        join.on('projects.id', '=', 'tr_fr.project_id').andOnVal('tr_fr.language_code', '=', defaultLanguageCode)
      })
      .select([
        'projects.*',
        db.raw('COALESCE(tr.name, tr_fr.name) as name'),
        db.raw('COALESCE(tr.slug, tr_fr.slug) as slug'),
        db.raw('COALESCE(tr.description, tr_fr.description) as description'),
      ])
      .where('projects.id', id)

    if (options?.publishedOnly) {
      query.where('projects.status_code', 'published')
    }

    return query.first()
  }
}
