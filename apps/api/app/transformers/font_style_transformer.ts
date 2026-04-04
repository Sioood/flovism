import { BaseTransformer } from '@adonisjs/core/transformers'

import type FontStyle from '#models/font_style'

export default class FontStyleTransformer extends BaseTransformer<FontStyle> {
  toObject() {
    return this.pick(this.resource, ['id', 'fontId', 'familyId', 'internalName', 'price', 'canTrial', 'isVariable', 'sortOrder'])
  }
}
