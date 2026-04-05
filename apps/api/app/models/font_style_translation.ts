import { beforeCreate, belongsTo } from '@adonisjs/lucid/orm'

import { FontStyleTranslationSchema } from '#database/schema'
import FontStyle from '#models/font_style'
import Language from '#models/language'
import { newId } from '#utils/custom_id'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class FontStyleTranslation extends FontStyleTranslationSchema {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(model: FontStyleTranslation) {
    model.id = model.id || newId('fontStyleTranslation')
  }

  @belongsTo(() => FontStyle)
  declare style: BelongsTo<typeof FontStyle>

  @belongsTo(() => Language, { foreignKey: 'languageCode' })
  declare language: BelongsTo<typeof Language>
}
