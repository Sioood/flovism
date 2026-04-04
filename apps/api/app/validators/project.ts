import vine from '@vinejs/vine'

import { paginationQueryFields } from '#validators/pagination'

export const projectsIndexQueryValidator = vine.compile(
  vine.object({
    ...paginationQueryFields,
    lang: vine.string().optional(),
  }),
)

export const projectTranslationSchema = vine.object({
  slug: vine.string().trim().minLength(1).maxLength(190),
  name: vine.string().trim().minLength(1).maxLength(190),
  description: vine.string().trim().minLength(1),
  client_name: vine.string().trim().maxLength(190).nullable().optional(),
  credit: vine.string().trim().maxLength(190).nullable().optional(),
})

export const createProjectValidator = vine.compile(
  vine.object({
    projectYear: vine.number(),
    categoryIds: vine.array(vine.string()).optional(),
    images: vine
      .array(
        vine.object({
          uploadId: vine.string(),
          sortOrder: vine.number().optional(),
          alts: vine
            .record(
              vine.object({
                alt: vine.string().trim().minLength(1).maxLength(190),
              }),
            )
            .optional(),
        }),
      )
      .optional(),
    translations: vine.record(projectTranslationSchema),
  }),
)

export const updateProjectValidator = vine.compile(
  vine.object({
    projectYear: vine.number().optional(),
    categoryIds: vine.array(vine.string()).optional(),
    images: vine
      .array(
        vine.object({
          uploadId: vine.string(),
          sortOrder: vine.number().optional(),
          alts: vine
            .record(
              vine.object({
                alt: vine.string().trim().minLength(1).maxLength(190),
              }),
            )
            .optional(),
        }),
      )
      .optional(),
    translations: vine.record(projectTranslationSchema).optional(),
  }),
)

export const projectStatusValidator = vine.compile(
  vine.object({
    statusCode: vine.enum(['draft', 'in_review', 'scheduled', 'published', 'archived'] as const),
    scheduledAt: vine.string().optional(),
  }),
)
