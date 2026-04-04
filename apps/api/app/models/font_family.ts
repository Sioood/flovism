import { beforeCreate, belongsTo, hasMany } from '@adonisjs/lucid/orm'

import { FontFamilySchema } from '#database/schema'
import Font from '#models/font'
import FontFamilyTranslation from '#models/font_family_translation'
import { newId } from '#utils/custom_id'

import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class FontFamily extends FontFamilySchema {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(model: FontFamily) {
    model.id = model.id || newId('fontFamily')
  }

  @belongsTo(() => Font)
  declare font: BelongsTo<typeof Font>

  @hasMany(() => FontFamilyTranslation)
  declare translations: HasMany<typeof FontFamilyTranslation>
}
