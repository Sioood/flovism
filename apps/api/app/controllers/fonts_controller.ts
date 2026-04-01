import FontService from '#services/font_service'
import { createFontValidator, fontStatusValidator, updateFontValidator } from '#validators/font'

import type { HttpContext } from '@adonisjs/core/http'

export default class FontsController {
  constructor(private readonly fontService = new FontService()) {}

  async index({ request }: HttpContext) {
    const lang = String(request.qs().lang || 'fr_FR')
    return this.fontService.list(lang)
  }

  async show({ params, request, response }: HttpContext) {
    const lang = String(request.qs().lang || 'fr_FR')
    const font = await this.fontService.show(params.id, lang)
    if (!font) return response.notFound({ message: 'Font not found' })
    return font
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createFontValidator)
    const created = await this.fontService.create(payload as never)
    return response.created(created)
  }

  async update({ params, request }: HttpContext) {
    const payload = await request.validateUsing(updateFontValidator)
    return this.fontService.update(params.id, payload as never)
  }

  async destroy({ params, response }: HttpContext) {
    await this.fontService.destroy(params.id)
    return response.ok({ success: true })
  }

  async status({ params, request }: HttpContext) {
    const payload = await request.validateUsing(fontStatusValidator)
    return this.fontService.transitionStatus(params.id, payload.statusCode, payload.scheduledAt)
  }
}
