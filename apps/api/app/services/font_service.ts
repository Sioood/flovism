import db from '@adonisjs/lucid/services/db'

import Font from '#models/font'
import FontStyle from '#models/font_style'
import PublicationService from '#services/publication_service'
import FontRepository from '#services/repositories/font_repository'
import TranslationService from '#services/translation_service'
import UploadService from '#services/upload_service'
import { newId } from '#utils/custom_id'

import { ContentStatuses, type ContentStatusCode } from '../enums/content_status.js'

export default class FontService {
  constructor(
    private readonly repository = new FontRepository(),
    private readonly translationService = new TranslationService(),
    private readonly publicationService = new PublicationService(),
    private readonly uploadService = new UploadService(),
  ) {}

  async list(languageCode: string) {
    const fonts = await this.repository.list(languageCode)
    return Promise.all(fonts.map((font) => this.withFileUrls(font)))
  }

  async show(id: string, languageCode: string) {
    const font = await this.repository.byId(id, languageCode)
    if (!font) return null
    return this.withFileUrls(font)
  }

  private async withFileUrls(font: { id: string } & Record<string, unknown>) {
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

    return {
      ...font,
      styleFormatFiles,
    }
  }

  async create(input: {
    year: number
    version?: string
    previewColor?: string
    isVariableGlobal?: boolean
    filterIds?: string[]
    styleFormatFiles?: Array<{ styleId: string; formatId: string; uploadId: string }>
    translations: Record<string, { slug: string; name: string; description: string; credit?: string | null }>
    statusCode?: ContentStatusCode
  }) {
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

      await this.translationService.upsertEntityTranslations({
        table: 'font_translations',
        ownerColumn: 'font_id',
        ownerId: font.id,
        translations: input.translations,
        trx,
      })

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
      return font
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
        await this.translationService.upsertEntityTranslations({
          table: 'font_translations',
          ownerColumn: 'font_id',
          ownerId: font.id,
          translations: input.translations,
          trx,
        })
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
      return font
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async destroy(id: string) {
    const font = await Font.findOrFail(id)
    await font.delete()
  }

  async transitionStatus(id: string, to: ContentStatusCode, scheduledAt?: string | null) {
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
    return font
  }

  async listStyles(fontId: string) {
    return FontStyle.query().where('fontId', fontId).orderBy('sortOrder')
  }
}
