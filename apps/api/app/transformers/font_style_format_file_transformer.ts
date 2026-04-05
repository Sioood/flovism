import { BaseTransformer } from '@adonisjs/core/transformers'

export type FontStyleFormatFilePublic = {
  id: string
  styleId: string
  formatId: string
  uploadId: string
  url: string
}

export default class FontStyleFormatFileTransformer extends BaseTransformer<FontStyleFormatFilePublic> {
  toObject() {
    return this.pick(this.resource, ['id', 'styleId', 'formatId', 'uploadId', 'url'])
  }
}
