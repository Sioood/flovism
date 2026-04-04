import { BaseTransformer } from '@adonisjs/core/transformers'

export type UploadWithUrl = {
  id: string
  disk: string
  key: string
  originalName: string
  extension: string | null
  mimeType: string
  size: number
  visibility: string
  metadata: Record<string, unknown>
  uploadedBy: string | null
  createdAt: unknown
  updatedAt: unknown
  deletedAt?: unknown
  url: string
}

export default class UploadTransformer extends BaseTransformer<UploadWithUrl> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'disk',
      'key',
      'originalName',
      'extension',
      'mimeType',
      'size',
      'visibility',
      'metadata',
      'uploadedBy',
      'createdAt',
      'updatedAt',
      'url',
    ])
  }
}
