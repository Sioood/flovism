import { beforeCreate, belongsTo } from '@adonisjs/lucid/orm'

import { FontFamilySchema } from '#database/schema'
import Font from '#models/font'
import { newId } from '#utils/custom_id'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class FontFamily extends FontFamilySchema {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(model: FontFamily) {
    model.id = model.id || newId('fontFamily')
  }

  @belongsTo(() => Font)
  declare font: BelongsTo<typeof Font>
}
