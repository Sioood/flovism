import authorizationConfig from '#config/authorization'

import type { HttpContext } from '@adonisjs/core/http'

export default class AuthorizationResponseService {
  private static extractDomain(value?: string | null) {
    if (!value) return null
    try {
      return new URL(value).hostname.toLowerCase()
    } catch {
      return value.split(':')[0]?.toLowerCase() || null
    }
  }

  private canDiscloseForbidden(ctx: HttpContext) {
    if (!authorizationConfig.apiResponseObfuscationEnabled) return true

    const allowed = new Set(authorizationConfig.apiResponseDisclosureDomains)
    if (!allowed.size) return false

    const originDomain = AuthorizationResponseService.extractDomain(ctx.request.header('origin'))
    const refererDomain = AuthorizationResponseService.extractDomain(ctx.request.header('referer'))
    const hostDomain = AuthorizationResponseService.extractDomain(ctx.request.header('host'))

    return [originDomain, refererDomain, hostDomain].some((domain) => !!domain && allowed.has(domain))
  }

  denyRead(ctx: HttpContext, resourceLabel: string) {
    if (this.canDiscloseForbidden(ctx)) {
      return ctx.response.forbidden({ message: 'Forbidden' })
    }
    return ctx.response.notFound({ message: `${resourceLabel} not found` })
  }
}
