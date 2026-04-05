import { BaseTransformer } from '@adonisjs/core/transformers'

import type FontFormat from '#models/font_format'

export default class FontFormatTransformer extends BaseTransformer<FontFormat> {
  toObject() {
    return this.pick(this.resource, ['id', 'key'])
  }
}
