import { roleIds } from '#constants/authorization'
import FontPolicy from '#policies/font_policy'
import AuthorizationResponseService from '#services/authorization_response_service'
import FontService from '#services/font_service'
import FontTransformer from '#transformers/font_transformer'
import { createFontValidator, fontStatusValidator, updateFontValidator } from '#validators/font'

import type { HttpContext } from '@adonisjs/core/http'

export default class FontsController {
  constructor(
    private readonly fontService = new FontService(),
    private readonly authorizationResponse = new AuthorizationResponseService(),
  ) {}

  async index({ request, auth, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('viewList')
    const lang = String(request.qs().lang || 'fr_FR')
    const isAdmin = auth.user?.roleId === roleIds.admin
    const fonts = await this.fontService.list(lang, { publishedOnly: !isAdmin })
    return serialize(FontTransformer.transform(fonts).useVariant('forList'))
  }

  async show(ctx: HttpContext) {
    const { params, request, response, auth, bouncer, serialize } = ctx
    const lang = String(request.qs().lang || 'fr_FR')
    const isAdmin = auth.user?.roleId === roleIds.admin
    const font = await this.fontService.show(params.id, lang, { publishedOnly: !isAdmin })
    if (!font) return response.notFound({ message: 'Font not found' })
    const row = font as Record<string, unknown>
    const statusCode = String(row.status_code ?? row.statusCode ?? '')
    const isAllowed = await bouncer.with(FontPolicy).allows('view', { statusCode })
    if (!isAllowed) {
      return this.authorizationResponse.denyRead(ctx, 'Font')
    }
    return serialize(FontTransformer.transform(font))
  }

  async store({ request, response, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('create')
    const payload = await request.validateUsing(createFontValidator)
    const created = await this.fontService.create(payload as never)
    return response.created(await serialize(FontTransformer.transform(created)))
  }

  async update({ params, request, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('update')
    const payload = await request.validateUsing(updateFontValidator)
    const updated = await this.fontService.update(params.id, payload as never)
    return serialize(FontTransformer.transform(updated))
  }

  async destroy({ params, response, bouncer }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('delete')
    await this.fontService.destroy(params.id)
    return response.ok({ success: true })
  }

  async status({ params, request, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('status')
    const payload = await request.validateUsing(fontStatusValidator)
    const updated = await this.fontService.transitionStatus(params.id, payload.statusCode, payload.scheduledAt)
    return serialize(FontTransformer.transform(updated))
  }
}
