import { BaseTransformer } from '@adonisjs/core/transformers'

import FontStyleFormatFileTransformer from '#transformers/font_style_format_file_transformer'

import type Font from '#models/font'

export default class FontTransformer extends BaseTransformer<Font> {
  constructor(
    resource: Font,
    protected languageCode: string = 'fr_FR',
  ) {
    super(resource)
  }

  toObject() {
    this.resource.mergeTranslations(this.languageCode)
    return this.pickModel(this.resource)
  }

  /**
   * Lighter shape for index views (omits long description body).
   */
  forList() {
    this.resource.mergeTranslations(this.languageCode)
    return this.pickModel(this.resource, false)
  }

  private pickMergedString(model: Font, key: string): string {
    const loose = model as unknown as Record<string, unknown>
    const attrs = (model as unknown as { $attributes: Record<string, unknown> }).$attributes
    const v = loose[key] ?? attrs[key]
    return String(v ?? '')
  }

  private pickModel(model: Font, includeDescription = true) {
    return {
      ...this.pick(model, [
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
      ]),
      name: this.pickMergedString(model, 'name'),
      slug: this.pickMergedString(model, 'slug'),
      credit: this.pickMergedString(model, 'credit'),
      ...(includeDescription && { description: this.pickMergedString(model, 'description') }),
      styleFormatFiles: FontStyleFormatFileTransformer.transform(model.apiStyleFormatFiles ?? []),
    }
  }
}
