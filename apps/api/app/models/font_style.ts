import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'

import Font from '#models/font'
import FontFamily from '#models/font_family'
import { newId } from '#utils/custom_id'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class FontStyle extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(model: FontStyle) {
    model.id = model.id || newId('fontStyle')
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare fontId: string

  @column()
  declare familyId: string | null

  @column()
  declare internalName: string

  @column()
  declare price: number | null

  @column()
  declare canTrial: boolean

  @column()
  declare isVariable: boolean

  @column()
  declare sortOrder: number

  @belongsTo(() => Font)
  declare font: BelongsTo<typeof Font>

  @belongsTo(() => FontFamily)
  declare family: BelongsTo<typeof FontFamily>
}
