import { BaseTransformer } from '@adonisjs/core/transformers'

import type FontMetric from '#models/font_metric'

export default class FontMetricTransformer extends BaseTransformer<FontMetric> {
  toObject() {
    return this.pick(this.resource, ['fontId', 'serifSans', 'boringFun', 'scriptGeometric', 'readableIllegible', 'displayText', 'styleCountScore'])
  }
}
