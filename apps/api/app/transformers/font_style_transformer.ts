import { BaseTransformer } from '@adonisjs/core/transformers'

import type FontStyle from '#models/font_style'

export default class FontStyleTransformer extends BaseTransformer<FontStyle> {
  constructor(
    resource: FontStyle,
    protected languageCode: string = 'fr_FR',
  ) {
    super(resource)
  }

  private pickMergedString(model: FontStyle, key: string): string {
    const loose = model as unknown as Record<string, unknown>
    const attrs = (model as unknown as { $attributes: Record<string, unknown> }).$attributes
    const v = loose[key] ?? attrs[key]
    return String(v ?? '')
  }

  toObject() {
    this.resource.mergeTranslations(this.languageCode)
    return {
      ...this.pick(this.resource, ['id', 'fontId', 'familyId', 'internalName', 'price', 'canTrial', 'isVariable', 'sortOrder']),
      displayName: this.pickMergedString(this.resource, 'displayName'),
    }
  }
}
