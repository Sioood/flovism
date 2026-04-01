import vine from '@vinejs/vine'

export const fontTranslationSchema = vine.object({
  slug: vine.string().trim().minLength(1).maxLength(190),
  name: vine.string().trim().minLength(1).maxLength(190),
  description: vine.string().trim().minLength(1),
  credit: vine.string().trim().maxLength(190).nullable().optional(),
})

export const createFontValidator = vine.compile(
  vine.object({
    year: vine.number(),
    version: vine.string().trim().optional(),
    previewColor: vine
      .string()
      .trim()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .optional(),
    isVariableGlobal: vine.boolean().optional(),
    filterIds: vine.array(vine.string()).optional(),
    styleFormatFiles: vine
      .array(
        vine.object({
          styleId: vine.string(),
          formatId: vine.string(),
          uploadId: vine.string(),
        }),
      )
      .optional(),
    translations: vine.record(fontTranslationSchema),
  }),
)

export const updateFontValidator = vine.compile(
  vine.object({
    year: vine.number().optional(),
    version: vine.string().trim().optional(),
    previewColor: vine
      .string()
      .trim()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .optional(),
    styleFormatFiles: vine
      .array(
        vine.object({
          styleId: vine.string(),
          formatId: vine.string(),
          uploadId: vine.string(),
        }),
      )
      .optional(),
    translations: vine.record(fontTranslationSchema).optional(),
  }),
)

export const fontStatusValidator = vine.compile(
  vine.object({
    statusCode: vine.enum(['draft', 'in_review', 'scheduled', 'published', 'archived'] as const),
    scheduledAt: vine.string().optional(),
  }),
)
