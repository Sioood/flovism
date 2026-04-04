import vine from '@vinejs/vine'

const score = vine.number().min(0).max(100)

export const upsertFontMetricValidator = vine.compile(
  vine.object({
    serifSans: score.optional(),
    boringFun: score.optional(),
    scriptGeometric: score.optional(),
    readableIllegible: score.optional(),
    displayText: score.optional(),
    styleCountScore: score.optional(),
  }),
)
