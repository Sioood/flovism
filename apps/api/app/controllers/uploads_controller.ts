import { roleIds } from '#constants/authorization'
import Upload from '#models/upload'
import UploadPolicy from '#policies/upload_policy'
import AuthorizationResponseService from '#services/authorization_response_service'
import UploadService from '#services/upload_service'
import UploadTransformer from '#transformers/upload_transformer'

import type { HttpContext } from '@adonisjs/core/http'

export default class UploadsController {
  constructor(
    private readonly uploadService = new UploadService(),
    private readonly authorizationResponse = new AuthorizationResponseService(),
  ) {}

  async index({ auth, bouncer, serialize }: HttpContext) {
    await bouncer.with(UploadPolicy).authorize('viewList')
    const isAdmin = auth.user?.roleId === roleIds.admin
    const query = Upload.query().whereNull('deletedAt').orderBy('createdAt', 'desc')
    if (!isAdmin) {
      query.where('visibility', 'public')
    }
    const uploads = await query
    const withUrls = await Promise.all(uploads.map((upload) => this.uploadService.serializeWithUrl(upload)))
    return serialize(UploadTransformer.transform(withUrls))
  }

  async show(ctx: HttpContext) {
    const { params, response, bouncer, serialize } = ctx
    const upload = await Upload.find(params.id)
    if (!upload || upload.deletedAt) return response.notFound({ message: 'Upload not found' })
    const isAllowed = await bouncer.with(UploadPolicy).allows('view', upload)
    if (!isAllowed) {
      return this.authorizationResponse.denyRead(ctx, 'Upload')
    }
    const payload = await this.uploadService.serializeWithUrl(upload)
    return serialize(UploadTransformer.transform(payload))
  }

  async store({ request, auth, response, bouncer, serialize }: HttpContext) {
    await bouncer.with(UploadPolicy).authorize('create')
    const file = request.file('file')
    if (!file) {
      return response.badRequest({ message: 'Missing file field' })
    }
    const folder = String(request.input('folder') || 'uploads')
    const payload = await this.uploadService.createFromFile({
      file,
      folder,
      userId: auth.user?.id || null,
    })
    return response.created(await serialize(UploadTransformer.transform(payload)))
  }

  async destroy({ params, response, bouncer }: HttpContext) {
    await bouncer.with(UploadPolicy).authorize('delete')
    const upload = await Upload.find(params.id)
    if (!upload || upload.deletedAt) return response.notFound({ message: 'Upload not found' })
    await this.uploadService.deleteUpload(upload)
    return response.ok({ success: true })
  }
}
