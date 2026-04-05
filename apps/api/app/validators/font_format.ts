import vine from '@vinejs/vine'

export const createFontFormatValidator = vine.compile(
  vine.object({
    key: vine.string().trim().minLength(1).maxLength(32),
  }),
)

export const updateFontFormatValidator = vine.compile(
  vine.object({
    key: vine.string().trim().minLength(1).maxLength(32).optional(),
  }),
)
