import { BaseTransformer } from '@adonisjs/core/transformers'

import type FontFamily from '#models/font_family'

export default class FontFamilyTransformer extends BaseTransformer<FontFamily> {
  constructor(
    resource: FontFamily,
    protected languageCode: string = 'fr_FR',
  ) {
    super(resource)
  }

  private pickMergedString(model: FontFamily, key: string): string {
    const loose = model as unknown as Record<string, unknown>
    const attrs = (model as unknown as { $attributes: Record<string, unknown> }).$attributes
    const v = loose[key] ?? attrs[key]
    return String(v ?? '')
  }

  toObject() {
    this.resource.mergeTranslations(this.languageCode)
    return {
      ...this.pick(this.resource, ['id', 'fontId', 'internalName', 'price', 'canTrial', 'sortOrder']),
      displayName: this.pickMergedString(this.resource, 'displayName'),
    }
  }
}
