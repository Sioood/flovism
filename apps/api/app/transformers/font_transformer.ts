import { BaseTransformer } from '@adonisjs/core/transformers'

import Font from '#models/font'
import FontStyleFormatFileTransformer, { type FontStyleFormatFilePublic } from '#transformers/font_style_format_file_transformer'

export type FontPublicRow = Record<string, unknown> & {
  id: string
  styleFormatFiles: FontStyleFormatFilePublic[]
}

function isFontModel(resource: Font | FontPublicRow): resource is Font {
  return resource instanceof Font
}

export default class FontTransformer extends BaseTransformer<Font | FontPublicRow> {
  toObject() {
    if (isFontModel(this.resource)) {
      return this.pickModel(this.resource)
    }
    return this.resolvedLocalePayload()
  }

  /**
   * Lighter shape for index views (omits long description body).
   */
  forList() {
    if (isFontModel(this.resource)) {
      return this.pickModel(this.resource)
    }
    const { description: _omit, ...rest } = this.publicLocalePayload()
    return rest
  }

  private pickModel(model: Font) {
    return this.pick(model, [
      'id',
      'year',
      'statusCode',
      'version',
      'previewColor',
      'isVariableGlobal',
      'scheduledAt',
      'publishedAt',
      'createdBy',
      'updatedBy',
      'createdAt',
      'updatedAt',
    ])
  }

  private resolvedLocalePayload() {
    if (isFontModel(this.resource)) {
      return this.pickModel(this.resource)
    }
    return this.publicLocalePayload()
  }

  private publicLocalePayload() {
    const row = this.resource as Record<string, unknown>
    return {
      id: String(row.id ?? ''),
      year: Number(row.year ?? 0),
      statusCode: String(row.status_code ?? row.statusCode ?? ''),
      version: String(row.version ?? ''),
      previewColor: String(row.preview_color ?? row.previewColor ?? ''),
      isVariableGlobal: Boolean(row.is_variable_global ?? row.isVariableGlobal ?? false),
      scheduledAt: row.scheduled_at ?? row.scheduledAt ?? null,
      publishedAt: row.published_at ?? row.publishedAt ?? null,
      createdBy: row.created_by ?? row.createdBy ?? null,
      updatedBy: row.updated_by ?? row.updatedBy ?? null,
      createdAt: row.created_at ?? row.createdAt ?? null,
      updatedAt: row.updated_at ?? row.updatedAt ?? null,
      name: String(row.name ?? ''),
      slug: String(row.slug ?? ''),
      description: String(row.description ?? ''),
      styleFormatFiles: FontStyleFormatFileTransformer.transform((this.resource as FontPublicRow).styleFormatFiles),
    }
  }
}
