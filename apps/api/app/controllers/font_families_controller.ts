import Font from '#models/font'
import FontPolicy from '#policies/font_policy'
import AuthorizationResponseService from '#services/authorization_response_service'
import FontService from '#services/font_service'
import FontFamilyTransformer from '#transformers/font_family_transformer'
import { resolveListingPagination } from '#utils/listing_pagination'
import { createFontFamilyValidator, updateFontFamilyValidator } from '#validators/font_family'
import { listingIndexQueryValidator } from '#validators/pagination'

import type { HttpContext } from '@adonisjs/core/http'

export default class FontFamiliesController {
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
    const paginated = await this.fontService.listFamiliesPaginated(font.id, page, limit)
    return serialize(FontFamilyTransformer.paginate(paginated.all(), paginated.getMeta()))
  }

  async store({ params, request, response, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('update')
    await Font.findOrFail(params.fontId)
    const payload = await request.validateUsing(createFontFamilyValidator)
    const created = await this.fontService.createFamily(params.fontId, payload)
    return response.created(await serialize(FontFamilyTransformer.transform(created)))
  }

  async show(ctx: HttpContext) {
    const { params, bouncer, response, serialize } = ctx
    const family = await this.fontService.findFamily(params.fontId, params.familyId)
    if (!family) return response.notFound({ message: 'Font family not found' })
    const font = await Font.find(params.fontId)
    if (!font) return response.notFound({ message: 'Font not found' })
    const isAllowed = await bouncer.with(FontPolicy).allows('view', font)
    if (!isAllowed) {
      return this.authorizationResponse.denyRead(ctx, 'Font')
    }
    return serialize(FontFamilyTransformer.transform(family))
  }

  async update({ params, request, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('update')
    const payload = await request.validateUsing(updateFontFamilyValidator)
    const updated = await this.fontService.updateFamily(params.fontId, params.familyId, payload)
    return serialize(FontFamilyTransformer.transform(updated))
  }

  async destroy({ params, response, bouncer }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('delete')
    await this.fontService.destroyFamily(params.fontId, params.familyId)
    return response.ok({ success: true })
  }
}
