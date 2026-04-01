import { roleIds } from '#constants/authorization'
import FontPolicy from '#policies/font_policy'
import AuthorizationResponseService from '#services/authorization_response_service'
import FontService from '#services/font_service'
import { createFontValidator, fontStatusValidator, updateFontValidator } from '#validators/font'

import type { HttpContext } from '@adonisjs/core/http'

export default class FontsController {
  constructor(
    private readonly fontService = new FontService(),
    private readonly authorizationResponse = new AuthorizationResponseService(),
  ) {}

  async index({ request, auth, bouncer }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('viewList')
    const lang = String(request.qs().lang || 'fr_FR')
    const isAdmin = auth.user?.roleId === roleIds.admin
    return this.fontService.list(lang, { publishedOnly: !isAdmin })
  }

  async show(ctx: HttpContext) {
    const { params, request, response, auth, bouncer } = ctx
    const lang = String(request.qs().lang || 'fr_FR')
    const isAdmin = auth.user?.roleId === roleIds.admin
    const font = await this.fontService.show(params.id, lang, { publishedOnly: !isAdmin })
    if (!font) return response.notFound({ message: 'Font not found' })
    const statusCode = String((font as Record<string, unknown>).statusCode || '')
    const isAllowed = await bouncer.with(FontPolicy).allows('view', { statusCode })
    if (!isAllowed) {
      return this.authorizationResponse.denyRead(ctx, 'Font')
    }
    return font
  }

  async store({ request, response, bouncer }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('create')
    const payload = await request.validateUsing(createFontValidator)
    const created = await this.fontService.create(payload as never)
    return response.created(created)
  }

  async update({ params, request, bouncer }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('update')
    const payload = await request.validateUsing(updateFontValidator)
    return this.fontService.update(params.id, payload as never)
  }

  async destroy({ params, response, bouncer }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('delete')
    await this.fontService.destroy(params.id)
    return response.ok({ success: true })
  }

  async status({ params, request, bouncer }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('status')
    const payload = await request.validateUsing(fontStatusValidator)
    return this.fontService.transitionStatus(params.id, payload.statusCode, payload.scheduledAt)
  }
}
