import vine from '@vinejs/vine'

const translationEntry = vine.object({
  displayName: vine.string().trim().minLength(1).maxLength(190),
})

export const createFontFamilyValidator = vine.compile(
  vine.object({
    internalName: vine.string().trim().minLength(1).maxLength(190),
    sortOrder: vine.number().optional(),
    canTrial: vine.boolean().optional(),
    price: vine.number().nullable().optional(),
    translations: vine.record(translationEntry).optional(),
  }),
)

export const updateFontFamilyValidator = vine.compile(
  vine.object({
    internalName: vine.string().trim().minLength(1).maxLength(190).optional(),
    sortOrder: vine.number().optional(),
    canTrial: vine.boolean().optional(),
    price: vine.number().nullable().optional(),
    translations: vine.record(translationEntry).optional(),
  }),
)
