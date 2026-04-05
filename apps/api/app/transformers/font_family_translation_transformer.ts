import { BaseTransformer } from '@adonisjs/core/transformers'

import type FontFamilyTranslation from '#models/font_family_translation'

export default class FontFamilyTranslationTransformer extends BaseTransformer<FontFamilyTranslation> {
  toObject() {
    return this.pick(this.resource, ['id', 'familyId', 'languageCode', 'displayName'])
  }
}
