import vine from '@vinejs/vine'

export const createFontStyleValidator = vine.compile(
  vine.object({
    internalName: vine.string().trim().minLength(1).maxLength(190),
    familyId: vine.string().trim().optional(),
    sortOrder: vine.number().optional(),
    canTrial: vine.boolean().optional(),
    isVariable: vine.boolean().optional(),
    price: vine.number().nullable().optional(),
  }),
)

export const updateFontStyleValidator = vine.compile(
  vine.object({
    internalName: vine.string().trim().minLength(1).maxLength(190).optional(),
    familyId: vine.string().trim().nullable().optional(),
    sortOrder: vine.number().optional(),
    canTrial: vine.boolean().optional(),
    isVariable: vine.boolean().optional(),
    price: vine.number().nullable().optional(),
  }),
)
