import vine from '@vinejs/vine'

/** Shared query fields for paginated index routes (use inside per-route `vine.object`). */
export const paginationQueryFields = {
  page: vine.number().min(1).optional(),
  limit: vine.number().min(1).optional(),
} as const

export const listingIndexQueryValidator = vine.compile(
  vine.object({
    ...paginationQueryFields,
  }),
)
