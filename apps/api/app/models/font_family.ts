import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'

import Font from '#models/font'
import { newId } from '#utils/custom_id'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class FontFamily extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(model: FontFamily) {
    model.id = model.id || newId('fontFamily')
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare fontId: string

  @column()
  declare internalName: string

  @column()
  declare price: number | null

  @column()
  declare canTrial: boolean

  @column()
  declare sortOrder: number

  @belongsTo(() => Font)
  declare font: BelongsTo<typeof Font>
}
