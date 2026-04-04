import Font from '#models/font'
import FontPolicy from '#policies/font_policy'
import AuthorizationResponseService from '#services/authorization_response_service'
import FontService from '#services/font_service'
import FontStyleTransformer from '#transformers/font_style_transformer'
import { resolveListingPagination } from '#utils/listing_pagination'
import { createFontStyleValidator, updateFontStyleValidator } from '#validators/font_style'
import { listingIndexQueryValidator } from '#validators/pagination'

import type { HttpContext } from '@adonisjs/core/http'

export default class FontStylesController {
  constructor(
    private readonly fontService = new FontService(),
    private readonly authorizationResponse = new AuthorizationResponseService(),
  ) {}

  async index(ctx: HttpContext) {
    const { params, request, auth, bouncer, response, serialize } = ctx
    const font = await Font.find(params.fontId)
    if (!font) return response.notFound({ message: 'Font not found' })
    const isAllowed = await bouncer.with(FontPolicy).allows('view', font)
    if (!isAllowed) {
      return this.authorizationResponse.denyRead(ctx, 'Font')
    }
    const qs = await request.validateUsing(listingIndexQueryValidator)
    const { page, limit } = resolveListingPagination(qs, auth.user?.roleId)
    const paginated = await this.fontService.listStylesPaginated(font.id, page, limit)
    return serialize(FontStyleTransformer.paginate(paginated.all(), paginated.getMeta()))
  }

  async store({ params, request, response, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('update')
    await Font.findOrFail(params.fontId)
    const payload = await request.validateUsing(createFontStyleValidator)
    const created = await this.fontService.createStyle(params.fontId, payload)
    return response.created(await serialize(FontStyleTransformer.transform(created)))
  }

  async show(ctx: HttpContext) {
    const { params, bouncer, response, serialize } = ctx
    const style = await this.fontService.findStyle(params.fontId, params.styleId)
    if (!style) return response.notFound({ message: 'Font style not found' })
    const font = await Font.find(params.fontId)
    if (!font) return response.notFound({ message: 'Font not found' })
    const isAllowed = await bouncer.with(FontPolicy).allows('view', font)
    if (!isAllowed) {
      return this.authorizationResponse.denyRead(ctx, 'Font')
    }
    return serialize(FontStyleTransformer.transform(style))
  }

  async update({ params, request, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('update')
    const payload = await request.validateUsing(updateFontStyleValidator)
    const updated = await this.fontService.updateStyle(params.fontId, params.styleId, payload)
    return serialize(FontStyleTransformer.transform(updated))
  }

  async destroy({ params, response, bouncer }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('delete')
    await this.fontService.destroyStyle(params.fontId, params.styleId)
    return response.ok({ success: true })
  }
}
