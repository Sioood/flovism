import FontPolicy from '#policies/font_policy'
import FontFormatService from '#services/font_format_service'
import FontFormatTransformer from '#transformers/font_format_transformer'
import { resolveListingPagination } from '#utils/listing_pagination'
import { createFontFormatValidator, updateFontFormatValidator } from '#validators/font_format'
import { listingIndexQueryValidator } from '#validators/pagination'

import type { HttpContext } from '@adonisjs/core/http'

export default class FontFormatsController {
  constructor(private readonly fontFormatService = new FontFormatService()) {}

  async index({ request, auth, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('viewList')
    const qs = await request.validateUsing(listingIndexQueryValidator)
    const { page, limit } = resolveListingPagination(qs, auth.user?.roleId)
    const paginated = await this.fontFormatService.listPaginated(page, limit)
    return serialize(FontFormatTransformer.paginate(paginated.all(), paginated.getMeta()))
  }

  async show({ params, response, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('viewList')
    const row = await this.fontFormatService.find(params.id)
    if (!row) return response.notFound({ message: 'Font format not found' })
    return serialize(FontFormatTransformer.transform(row))
  }

  async store({ request, response, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('create')
    const payload = await request.validateUsing(createFontFormatValidator)
    const created = await this.fontFormatService.create(payload)
    return response.created(await serialize(FontFormatTransformer.transform(created)))
  }

  async update({ params, request, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('update')
    const payload = await request.validateUsing(updateFontFormatValidator)
    const updated = await this.fontFormatService.update(params.id, payload)
    return serialize(FontFormatTransformer.transform(updated))
  }

  async destroy({ params, response, bouncer }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('delete')
    await this.fontFormatService.destroy(params.id)
    return response.ok({ success: true })
  }
}
