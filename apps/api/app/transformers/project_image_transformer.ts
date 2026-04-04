import { BaseTransformer } from '@adonisjs/core/transformers'

export type ProjectImagePublic = {
  id: string
  uploadId: string
  sortOrder: number
  alt: string | null
  url: string
}

export default class ProjectImageTransformer extends BaseTransformer<ProjectImagePublic> {
  toObject() {
    return this.pick(this.resource, ['id', 'uploadId', 'sortOrder', 'alt', 'url'])
  }
}
