import Upload from '#models/upload'
import UploadService from '#services/upload_service'

import type { HttpContext } from '@adonisjs/core/http'

export default class UploadsController {
  constructor(private readonly uploadService = new UploadService()) {}

  async index() {
    const uploads = await Upload.query().whereNull('deletedAt').orderBy('createdAt', 'desc')
    return Promise.all(uploads.map((upload) => this.uploadService.serializeWithUrl(upload)))
  }

  async show({ params, response }: HttpContext) {
    const upload = await Upload.find(params.id)
    if (!upload || upload.deletedAt) return response.notFound({ message: 'Upload not found' })
    return this.uploadService.serializeWithUrl(upload)
  }

  async store({ request, auth, response }: HttpContext) {
    const file = request.file('file')
    if (!file) {
      return response.badRequest({ message: 'Missing file field' })
    }
    const folder = String(request.input('folder') || 'uploads')
    const upload = await this.uploadService.createFromFile({
      file,
      folder,
      userId: auth.user?.id || null,
    })
    return response.created(upload)
  }

  async destroy({ params, response }: HttpContext) {
    const upload = await Upload.find(params.id)
    if (!upload || upload.deletedAt) return response.notFound({ message: 'Upload not found' })
    await this.uploadService.deleteUpload(upload)
    return response.ok({ success: true })
  }
}
