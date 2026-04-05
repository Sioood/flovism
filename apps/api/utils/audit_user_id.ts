import { HttpContext } from '@adonisjs/core/http'

/**
 * Resolves the authenticated user id for audit columns (createdBy / updatedBy).
 * Checks API (token) then web (session) guards when AsyncLocalStorage is enabled.
 */
export function resolveAuditUserId(): string | null {
  const ctx = HttpContext.get()
  if (!ctx) return null
  return ctx.auth.use('api').user?.id ?? ctx.auth.use('web').user?.id ?? null
}
