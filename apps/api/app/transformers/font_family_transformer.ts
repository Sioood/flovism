import { BaseTransformer } from '@adonisjs/core/transformers'

import FontFamilyTranslationTransformer from '#transformers/font_family_translation_transformer'

import type FontFamily from '#models/font_family'

export default class FontFamilyTransformer extends BaseTransformer<FontFamily> {
  toObject() {
    return {
      ...this.pick(this.resource, ['id', 'fontId', 'internalName', 'price', 'canTrial', 'sortOrder']),
      translations: FontFamilyTranslationTransformer.transform(this.resource.translations ?? []),
    }
  }
}
