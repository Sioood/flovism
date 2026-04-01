import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'

import Font from '#models/font'
import Language from '#models/language'
import { newId } from '#utils/custom_id'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class FontTranslation extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(model: FontTranslation) {
    model.id = model.id || newId('fontTranslation')
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare fontId: string

  @column()
  declare languageCode: string

  @column()
  declare slug: string

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare credit: string | null

  @belongsTo(() => Font)
  declare font: BelongsTo<typeof Font>

  @belongsTo(() => Language, { foreignKey: 'languageCode' })
  declare language: BelongsTo<typeof Language>
}
