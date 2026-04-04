import { beforeCreate, belongsTo } from '@adonisjs/lucid/orm'

import { FontFamilyTranslationSchema } from '#database/schema'
import FontFamily from '#models/font_family'
import Language from '#models/language'
import { newId } from '#utils/custom_id'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class FontFamilyTranslation extends FontFamilyTranslationSchema {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(model: FontFamilyTranslation) {
    model.id = model.id || newId('fontFamilyTranslation')
  }

  @belongsTo(() => FontFamily)
  declare family: BelongsTo<typeof FontFamily>

  @belongsTo(() => Language, { foreignKey: 'languageCode' })
  declare language: BelongsTo<typeof Language>
}
