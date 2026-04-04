import { beforeCreate, belongsTo } from '@adonisjs/lucid/orm'

import { FontStyleSchema } from '#database/schema'
import Font from '#models/font'
import FontFamily from '#models/font_family'
import { newId } from '#utils/custom_id'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class FontStyle extends FontStyleSchema {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(model: FontStyle) {
    model.id = model.id || newId('fontStyle')
  }

  @belongsTo(() => Font)
  declare font: BelongsTo<typeof Font>

  @belongsTo(() => FontFamily)
  declare family: BelongsTo<typeof FontFamily>
}
