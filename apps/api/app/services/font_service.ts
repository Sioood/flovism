import db from '@adonisjs/lucid/services/db'

import Font from '#models/font'
import FontFamily from '#models/font_family'
import FontMetric from '#models/font_metric'
import FontStyle from '#models/font_style'
import PublicationService from '#services/publication_service'
import FontRepository from '#services/repositories/font_repository'
import UploadService from '#services/upload_service'
import { newId } from '#utils/custom_id'

import { ContentStatuses, type ContentStatusCode } from '../enums/content_status.js'

export default class FontService {
  constructor(
    private readonly repository = new FontRepository(),
    private readonly publicationService = new PublicationService(),
    private readonly uploadService = new UploadService(),
  ) {}

  async listPaginated(languageCode: string, options: { publishedOnly?: boolean } | undefined, page: number, perPage: number) {
    const paginated = (await this.repository.listPaginated(languageCode, options, page, perPage)) as {
      all(): Font[]
      getMeta(): unknown
    }
    const hydrated = await Promise.all(paginated.all().map((font) => this.withFileUrls(font, languageCode)))
    return { rows: hydrated, paginator: paginated }
  }

  async show(id: string, languageCode: string, options?: { publishedOnly?: boolean }) {
    const font = await this.repository.byId(id, languageCode, options)
    if (!font) return null
    return this.withFileUrls(font, languageCode)
  }

  private async withFileUrls(font: Font, languageCode: string): Promise<Font> {
    font.mergeTranslations(languageCode)
    const files = await db
      .from('font_style_format_files')
      .innerJoin('uploads', 'font_style_format_files.upload_id', 'uploads.id')
      .whereIn('font_style_format_files.style_id', db.from('font_styles').where('font_id', font.id).select('id'))
      .select([
        'font_style_format_files.id',
        'font_style_format_files.style_id',
        'font_style_format_files.format_id',
        'font_style_format_files.upload_id',
        'uploads.disk',
        'uploads.key',
        'uploads.visibility',
      ])

    const styleFormatFiles = await Promise.all(
      files.map(async (file) => ({
        id: file.id,
        styleId: file.style_id,
        formatId: file.format_id,
        uploadId: file.upload_id,
        url: await this.uploadService.getUrl({
          disk: file.disk,
          key: file.key,
          visibility: file.visibility,
        }),
      })),
    )

    font.apiStyleFormatFiles = styleFormatFiles
    return font
  }

  private familyTranslationsForSave(translations: Record<string, { displayName: string }>) {
    return Object.fromEntries(
      Object.entries(translations).map(([languageCode, row]) => [languageCode, { display_name: row.displayName } as Record<string, string | null>]),
    )
  }

  async create(
    input: {
      year: number
      version?: string
      previewColor?: string
      isVariableGlobal?: boolean
      filterIds?: string[]
      styleFormatFiles?: Array<{ styleId: string; formatId: string; uploadId: string }>
      translations: Record<string, { slug: string; name: string; description: string; credit?: string | null }>
      statusCode?: ContentStatusCode
    },
    languageCode: string,
  ) {
    const trx = await db.transaction()
    try {
      const font = await Font.create(
        {
          year: input.year,
          version: input.version || '1.000',
          previewColor: input.previewColor || '#000000',
          isVariableGlobal: input.isVariableGlobal || false,
          statusCode: input.statusCode || ContentStatuses.draft,
        },
        { client: trx },
      )

      await font.saveTranslations(input.translations, trx)

      if (input.filterIds?.length) {
        await trx.table('font_filter_font').insert(input.filterIds.map((fontFilterId) => ({ font_id: font.id, font_filter_id: fontFilterId })))
      }

      if (input.styleFormatFiles?.length) {
        await trx.table('font_style_format_files').insert(
          input.styleFormatFiles.map((file) => ({
            id: newId('fontStyleFormatFile'),
            style_id: file.styleId,
            format_id: file.formatId,
            upload_id: file.uploadId,
          })),
        )
      }

      await trx.commit()
      const hydrated = await this.show(font.id, languageCode, { publishedOnly: false })
      if (!hydrated) throw new Error('Font not found after create')
      return hydrated
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async update(
    id: string,
    input: {
      year?: number
      version?: string
      previewColor?: string
      styleFormatFiles?: Array<{ styleId: string; formatId: string; uploadId: string }>
      translations?: Record<string, { slug: string; name: string; description: string; credit?: string | null }>
    },
    languageCode: string,
  ) {
    const trx = await db.transaction()
    try {
      const font = await Font.findOrFail(id, { client: trx })
      await font
        .merge({
          year: input.year ?? font.year,
          version: input.version ?? font.version,
          previewColor: input.previewColor ?? font.previewColor,
        })
        .save()

      if (input.translations) {
        await font.saveTranslations(input.translations, trx)
      }

      if (input.styleFormatFiles) {
        const styleIds = await trx.from('font_styles').where('font_id', font.id).select('id')
        if (styleIds.length) {
          const fontStyleIds = styleIds.map((row: { id: string }) => row.id)
          await trx.from('font_style_format_files').whereIn('style_id', fontStyleIds).delete()
        }
        if (input.styleFormatFiles.length) {
          await trx.table('font_style_format_files').insert(
            input.styleFormatFiles.map((file) => ({
              id: newId('fontStyleFormatFile'),
              style_id: file.styleId,
              format_id: file.formatId,
              upload_id: file.uploadId,
            })),
          )
        }
      }

      await trx.commit()
      const hydrated = await this.show(id, languageCode, { publishedOnly: false })
      if (!hydrated) throw new Error('Font not found after update')
      return hydrated
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async destroy(id: string) {
    const font = await Font.findOrFail(id)
    await font.delete()
  }

  async transitionStatus(id: string, to: ContentStatusCode, scheduledAt: string | null | undefined, languageCode: string) {
    const font = await Font.findOrFail(id)
    this.publicationService.validateTransition(font.statusCode as ContentStatusCode, to)
    const payload = this.publicationService.buildStatusPayload(to, scheduledAt)
    await font
      .merge({
        statusCode: payload.status_code,
        scheduledAt: payload.scheduled_at || null,
        publishedAt: payload.published_at || null,
      })
      .save()
    const hydrated = await this.show(id, languageCode, { publishedOnly: false })
    if (!hydrated) throw new Error('Font not found after status transition')
    return hydrated
  }

  listStylesPaginated(fontId: string, languageCode: string, page: number, perPage: number) {
    return FontStyle.query()
      .where('fontId', fontId)
      .withScopes((scopes: unknown) => (scopes as { withTranslations: (lang: string) => unknown }).withTranslations(languageCode))
      .orderBy('sortOrder', 'asc')
      .paginate(page, perPage)
  }

  async createStyle(
    fontId: string,
    input: {
      internalName: string
      familyId?: string
      sortOrder?: number
      canTrial?: boolean
      isVariable?: boolean
      price?: number | null
    },
    languageCode: string,
  ) {
    await Font.findOrFail(fontId)
    const created = await FontStyle.create({
      fontId,
      internalName: input.internalName,
      familyId: input.familyId ?? null,
      sortOrder: input.sortOrder ?? 0,
      canTrial: input.canTrial ?? false,
      isVariable: input.isVariable ?? false,
      price: input.price === null ? null : String(input.price),
    })
    const reloaded = await this.findStyle(fontId, created.id, languageCode)
    if (!reloaded) throw new Error('Font style not found after create')
    return reloaded
  }

  async updateStyle(
    fontId: string,
    styleId: string,
    input: {
      internalName?: string
      familyId?: string | null
      sortOrder?: number
      canTrial?: boolean
      isVariable?: boolean
      price?: number | null
    },
    languageCode: string,
  ) {
    const style = await FontStyle.query().where('fontId', fontId).where('id', styleId).firstOrFail()
    if (input.internalName !== undefined) style.internalName = input.internalName
    if (input.familyId !== undefined) style.familyId = input.familyId
    if (input.sortOrder !== undefined) style.sortOrder = input.sortOrder
    if (input.canTrial !== undefined) style.canTrial = input.canTrial
    if (input.isVariable !== undefined) style.isVariable = input.isVariable
    if (input.price !== undefined) style.price = input.price === null ? null : String(input.price)
    await style.save()
    const reloaded = await this.findStyle(fontId, styleId, languageCode)
    if (!reloaded) throw new Error('Font style not found after update')
    return reloaded
  }

  async destroyStyle(fontId: string, styleId: string) {
    const style = await FontStyle.query().where('fontId', fontId).where('id', styleId).firstOrFail()
    await style.delete()
  }

  findStyle(fontId: string, styleId: string, languageCode: string) {
    return FontStyle.query()
      .where('fontId', fontId)
      .where('id', styleId)
      .withScopes((scopes: unknown) => (scopes as { withTranslations: (lang: string) => unknown }).withTranslations(languageCode))
      .first()
  }

  listFamiliesPaginated(fontId: string, languageCode: string, page: number, perPage: number) {
    return FontFamily.query()
      .where('fontId', fontId)
      .withScopes((scopes: unknown) => (scopes as { withTranslations: (lang: string) => unknown }).withTranslations(languageCode))
      .orderBy('sortOrder', 'asc')
      .paginate(page, perPage)
  }

  async createFamily(
    fontId: string,
    input: {
      internalName: string
      sortOrder?: number
      canTrial?: boolean
      price?: number | null
      translations?: Record<string, { displayName: string }>
    },
    languageCode: string,
  ) {
    await Font.findOrFail(fontId)
    const family = await FontFamily.create({
      fontId,
      internalName: input.internalName,
      sortOrder: input.sortOrder ?? 0,
      canTrial: input.canTrial ?? false,
      price: input.price === null ? null : String(input.price),
    })
    if (input.translations && Object.keys(input.translations).length) {
      await family.saveTranslations(this.familyTranslationsForSave(input.translations))
    }
    const reloaded = await this.findFamily(fontId, family.id, languageCode)
    if (!reloaded) throw new Error('Font family not found after create')
    reloaded.mergeTranslations(languageCode)
    return reloaded
  }

  async updateFamily(
    fontId: string,
    familyId: string,
    input: {
      internalName?: string
      sortOrder?: number
      canTrial?: boolean
      price?: number | null
      translations?: Record<string, { displayName: string }>
    },
    languageCode: string,
  ) {
    const family = await FontFamily.query().where('fontId', fontId).where('id', familyId).firstOrFail()
    if (input.internalName !== undefined) family.internalName = input.internalName
    if (input.sortOrder !== undefined) family.sortOrder = input.sortOrder
    if (input.canTrial !== undefined) family.canTrial = input.canTrial
    if (input.price !== undefined) family.price = input.price === null ? null : String(input.price)
    await family.save()
    if (input.translations && Object.keys(input.translations).length) {
      await family.saveTranslations(this.familyTranslationsForSave(input.translations))
    }
    const reloaded = await this.findFamily(fontId, familyId, languageCode)
    if (!reloaded) throw new Error('Font family not found after update')
    reloaded.mergeTranslations(languageCode)
    return reloaded
  }

  async destroyFamily(fontId: string, familyId: string) {
    const family = await FontFamily.query().where('fontId', fontId).where('id', familyId).firstOrFail()
    await family.delete()
  }

  findFamily(fontId: string, familyId: string, languageCode: string) {
    return FontFamily.query()
      .where('fontId', fontId)
      .where('id', familyId)
      .withScopes((scopes: unknown) => (scopes as { withTranslations: (lang: string) => unknown }).withTranslations(languageCode))
      .first()
  }

  findMetrics(fontId: string) {
    return FontMetric.find(fontId)
  }

  async upsertMetrics(
    fontId: string,
    input: Partial<{
      serifSans: number
      boringFun: number
      scriptGeometric: number
      readableIllegible: number
      displayText: number
      styleCountScore: number
    }>,
  ) {
    await Font.findOrFail(fontId)
    const existing = await FontMetric.find(fontId)
    const merged = {
      fontId,
      serifSans: input.serifSans ?? existing?.serifSans ?? 0,
      boringFun: input.boringFun ?? existing?.boringFun ?? 0,
      scriptGeometric: input.scriptGeometric ?? existing?.scriptGeometric ?? 0,
      readableIllegible: input.readableIllegible ?? existing?.readableIllegible ?? 0,
      displayText: input.displayText ?? existing?.displayText ?? 0,
      styleCountScore: input.styleCountScore ?? existing?.styleCountScore ?? 0,
    }
    if (existing) {
      existing.merge(merged)
      await existing.save()
      return existing
    }
    return FontMetric.create(merged)
  }

  async destroyMetrics(fontId: string) {
    const row = await FontMetric.findOrFail(fontId)
    await row.delete()
  }
}
