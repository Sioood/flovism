import { compose } from '@adonisjs/core/helpers'
import { beforeCreate, belongsTo, hasMany } from '@adonisjs/lucid/orm'

import { FontFamilySchema } from '#database/schema'
import { Translatable } from '#mixins/translatable'
import Font from '#models/font'
import FontFamilyTranslation from '#models/font_family_translation'
import { newId } from '#utils/custom_id'

import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class FontFamily extends compose(FontFamilySchema, Translatable) {
  static selfAssignPrimaryKey = true

  static translatableConfig = {
    table: 'font_family_translations',
    foreignKey: 'family_id',
    idPrefix: 'fontFamilyTranslation' as const,
    translatableColumns: ['displayName'],
  }

  @beforeCreate()
  static assignId(model: FontFamily) {
    model.id = model.id || newId('fontFamily')
  }

  @belongsTo(() => Font)
  declare font: BelongsTo<typeof Font>

  @hasMany(() => FontFamilyTranslation, { foreignKey: 'familyId' })
  declare translations: HasMany<typeof FontFamilyTranslation>
}
