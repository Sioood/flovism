import string from '@adonisjs/core/helpers/string'
import drive from '@adonisjs/drive/services/main'
import { attachmentManager } from '@jrmc/adonis-attachment'
import { DateTime } from 'luxon'

import Upload from '#models/upload'

import type { UploadWithUrl } from '#transformers/upload_transformer'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

export default class UploadService {
  async getUrl(params: { disk: string; key: string; visibility: string }) {
    const disk = drive.use(params.disk as never)
    if (params.visibility === 'public') {
      return disk.getUrl(params.key)
    }
    return disk.getSignedUrl(params.key, { expiresIn: '30 mins' })
  }

  async serializeWithUrl(upload: Upload): Promise<UploadWithUrl> {
    const url = await this.getUrl({
      disk: upload.disk,
      key: upload.key,
      visibility: upload.visibility,
    })
    return {
      ...(upload.serialize() as UploadWithUrl),
      url,
    }
  }

  async createFromFile(params: { file: MultipartFile; userId?: string | null; folder: string; disk?: string }): Promise<UploadWithUrl> {
    const attachment = await attachmentManager.createFromFile(params.file)
    attachment.setOptions({
      folder: params.folder,
      disk: params.disk || 'fs',
    })
    attachment.name = `${string.uuid()}.${params.file.extname || 'bin'}`

    const key = attachment.path

    const upload = await Upload.create({
      disk: params.disk || 'fs',
      key,
      originalName: params.file.clientName,
      extension: params.file.extname,
      mimeType: params.file.type || 'application/octet-stream',
      size: params.file.size,
      checksum: null,
      visibility: 'private',
      file: attachment,
      metadata: {},
      uploadedBy: params.userId || null,
    })
    return await this.serializeWithUrl(upload)
  }

  async deleteUpload(upload: Upload) {
    const disk = drive.use(upload.disk as never)
    const exists = await disk.exists(upload.key)
    if (exists) {
      await disk.delete(upload.key)
    }
    upload.deletedAt = upload.deletedAt || DateTime.utc()
    await upload.save()
  }
}
