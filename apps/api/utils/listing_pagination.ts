import { LISTING_DEFAULT_LIMIT, LISTING_DEFAULT_PAGE, clampListingLimit } from '#constants/pagination'

export function resolveListingPagination(parsed: { page?: number; limit?: number | undefined }, roleId: string | undefined): { page: number; limit: number } {
  const page = parsed.page ?? LISTING_DEFAULT_PAGE
  const rawLimit = parsed.limit ?? LISTING_DEFAULT_LIMIT
  const limit = clampListingLimit(rawLimit, roleId)
  return { page, limit }
}
