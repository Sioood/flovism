import { beforeCreate, belongsTo } from '@adonisjs/lucid/orm'

import { FontTranslationSchema } from '#database/schema'
import Font from '#models/font'
import Language from '#models/language'
import { newId } from '#utils/custom_id'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class FontTranslation extends FontTranslationSchema {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(model: FontTranslation) {
    model.id = model.id || newId('fontTranslation')
  }

  @belongsTo(() => Font)
  declare font: BelongsTo<typeof Font>

  @belongsTo(() => Language, { foreignKey: 'languageCode' })
  declare language: BelongsTo<typeof Language>
}
