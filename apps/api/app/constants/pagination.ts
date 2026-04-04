import { roleIds } from '#constants/authorization'

export const LISTING_DEFAULT_PAGE = 1

export const LISTING_DEFAULT_LIMIT = 20

export const LISTING_MAX_LIMIT_USER = 100

export const LISTING_MAX_LIMIT_ADMIN = 500

/**
 * Caps `limit` by role after Vine validation (request may ask for more than allowed).
 */
export function clampListingLimit(limit: number, roleId: string | undefined): number {
  const max = roleId === roleIds.admin ? LISTING_MAX_LIMIT_ADMIN : LISTING_MAX_LIMIT_USER
  return Math.min(limit, max)
}
