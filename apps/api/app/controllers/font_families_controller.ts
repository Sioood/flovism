import Font from '#models/font'
import FontPolicy from '#policies/font_policy'
import AuthorizationResponseService from '#services/authorization_response_service'
import FontService from '#services/font_service'
import FontFamilyTransformer from '#transformers/font_family_transformer'
import { resolveListingPagination } from '#utils/listing_pagination'
import { createFontFamilyValidator, fontFamiliesIndexQueryValidator, updateFontFamilyValidator } from '#validators/font_family'

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
    const qs = await request.validateUsing(fontFamiliesIndexQueryValidator)
    const lang = qs.lang ?? 'fr_FR'
    const { page, limit } = resolveListingPagination(qs, auth.user?.roleId)
    const paginated = await this.fontService.listFamiliesPaginated(font.id, lang, page, limit)
    return serialize(FontFamilyTransformer.paginate(paginated.all(), paginated.getMeta() as Record<string, unknown>, lang))
  }

  async store({ params, request, response, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('update')
    await Font.findOrFail(params.fontId)
    const payload = await request.validateUsing(createFontFamilyValidator)
    const lang = String(request.qs().lang || 'fr_FR')
    const created = await this.fontService.createFamily(params.fontId, payload, lang)
    return response.created(await serialize(FontFamilyTransformer.transform(created, lang)))
  }

  async show(ctx: HttpContext) {
    const { params, request, bouncer, response, serialize } = ctx
    const lang = String(request.qs().lang || 'fr_FR')
    const family = await this.fontService.findFamily(params.fontId, params.familyId, lang)
    if (!family) return response.notFound({ message: 'Font family not found' })
    const font = await Font.find(params.fontId)
    if (!font) return response.notFound({ message: 'Font not found' })
    const isAllowed = await bouncer.with(FontPolicy).allows('view', font)
    if (!isAllowed) {
      return this.authorizationResponse.denyRead(ctx, 'Font')
    }
    return serialize(FontFamilyTransformer.transform(family, lang))
  }

  async update({ params, request, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('update')
    const payload = await request.validateUsing(updateFontFamilyValidator)
    const lang = String(request.qs().lang || 'fr_FR')
    const updated = await this.fontService.updateFamily(params.fontId, params.familyId, payload, lang)
    return serialize(FontFamilyTransformer.transform(updated, lang))
  }

  async destroy({ params, response, bouncer }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('delete')
    await this.fontService.destroyFamily(params.fontId, params.familyId)
    return response.ok({ success: true })
  }
}
