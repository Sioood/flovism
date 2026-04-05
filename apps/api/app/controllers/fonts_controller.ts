import { roleIds } from '#constants/authorization'
import FontPolicy from '#policies/font_policy'
import AuthorizationResponseService from '#services/authorization_response_service'
import FontService from '#services/font_service'
import FontTransformer from '#transformers/font_transformer'
import { resolveListingPagination } from '#utils/listing_pagination'
import { createFontValidator, fontStatusValidator, fontsIndexQueryValidator, updateFontValidator } from '#validators/font'

import type { HttpContext } from '@adonisjs/core/http'

export default class FontsController {
  constructor(
    private readonly fontService = new FontService(),
    private readonly authorizationResponse = new AuthorizationResponseService(),
  ) {}

  async index({ request, auth, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('viewList')
    const qs = await request.validateUsing(fontsIndexQueryValidator)
    const lang = qs.lang ?? 'fr_FR'
    const isAdmin = auth.user?.roleId === roleIds.admin
    const { page, limit } = resolveListingPagination(qs, auth.user?.roleId)
    const { rows, paginator } = await this.fontService.listPaginated(lang, { publishedOnly: !isAdmin }, page, limit)
    return serialize(FontTransformer.paginate(rows, paginator.getMeta() as Record<string, unknown>, lang).useVariant('forList'))
  }

  async show(ctx: HttpContext) {
    const { params, request, response, auth, bouncer, serialize } = ctx
    const lang = String(request.qs().lang || 'fr_FR')
    const isAdmin = auth.user?.roleId === roleIds.admin
    const font = await this.fontService.show(params.id, lang, { publishedOnly: !isAdmin })
    if (!font) return response.notFound({ message: 'Font not found' })
    const statusCode = font.statusCode
    const isAllowed = await bouncer.with(FontPolicy).allows('view', { statusCode })
    if (!isAllowed) {
      return this.authorizationResponse.denyRead(ctx, 'Font')
    }
    return serialize(FontTransformer.transform(font, lang))
  }

  async store({ request, response, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('create')
    const payload = await request.validateUsing(createFontValidator)
    const lang = String(request.qs().lang || 'fr_FR')
    const created = await this.fontService.create(payload as never, lang)
    return response.created(await serialize(FontTransformer.transform(created, lang)))
  }

  async update({ params, request, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('update')
    const payload = await request.validateUsing(updateFontValidator)
    const lang = String(request.qs().lang || 'fr_FR')
    const updated = await this.fontService.update(params.id, payload as never, lang)
    return serialize(FontTransformer.transform(updated, lang))
  }

  async destroy({ params, response, bouncer }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('delete')
    await this.fontService.destroy(params.id)
    return response.ok({ success: true })
  }

  async status({ params, request, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('status')
    const payload = await request.validateUsing(fontStatusValidator)
    const lang = String(request.qs().lang || 'fr_FR')
    const updated = await this.fontService.transitionStatus(params.id, payload.statusCode, payload.scheduledAt, lang)
    return serialize(FontTransformer.transform(updated, lang))
  }
}
