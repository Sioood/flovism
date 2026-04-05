import vine from '@vinejs/vine'

import { paginationQueryFields } from '#validators/pagination'

const translationEntry = vine.object({
  displayName: vine.string().trim().minLength(1).maxLength(190),
})

export const fontFamiliesIndexQueryValidator = vine.compile(
  vine.object({
    ...paginationQueryFields,
    lang: vine.string().optional(),
  }),
)

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
