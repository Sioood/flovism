import Font from '#models/font'
import FontPolicy from '#policies/font_policy'
import AuthorizationResponseService from '#services/authorization_response_service'
import FontService from '#services/font_service'
import FontMetricTransformer from '#transformers/font_metric_transformer'
import { upsertFontMetricValidator } from '#validators/font_metric'

import type { HttpContext } from '@adonisjs/core/http'

export default class FontMetricsController {
  constructor(
    private readonly fontService = new FontService(),
    private readonly authorizationResponse = new AuthorizationResponseService(),
  ) {}

  async show(ctx: HttpContext) {
    const { params, bouncer, response, serialize } = ctx
    const font = await Font.find(params.fontId)
    if (!font) return response.notFound({ message: 'Font not found' })
    const isAllowed = await bouncer.with(FontPolicy).allows('view', font)
    if (!isAllowed) {
      return this.authorizationResponse.denyRead(ctx, 'Font')
    }
    const row = await this.fontService.findMetrics(font.id)
    if (!row) return response.notFound({ message: 'Font metrics not found' })
    return serialize(FontMetricTransformer.transform(row))
  }

  async update({ params, request, bouncer, serialize }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('update')
    const payload = await request.validateUsing(upsertFontMetricValidator)
    const updated = await this.fontService.upsertMetrics(params.fontId, payload)
    return serialize(FontMetricTransformer.transform(updated))
  }

  async destroy({ params, response, bouncer }: HttpContext) {
    await bouncer.with(FontPolicy).authorize('delete')
    await this.fontService.destroyMetrics(params.fontId)
    return response.ok({ success: true })
  }
}
