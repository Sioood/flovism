import { compose } from '@adonisjs/core/helpers'
import { beforeCreate, belongsTo, hasMany } from '@adonisjs/lucid/orm'

import { FontStyleSchema } from '#database/schema'
import { Translatable } from '#mixins/translatable'
import Font from '#models/font'
import FontFamily from '#models/font_family'
import FontStyleTranslation from '#models/font_style_translation'
import { newId } from '#utils/custom_id'

import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class FontStyle extends compose(FontStyleSchema, Translatable) {
  static selfAssignPrimaryKey = true

  static translatableConfig = {
    table: 'font_style_translations',
    foreignKey: 'style_id',
    idPrefix: 'fontStyleTranslation' as const,
    translatableColumns: ['displayName'],
  }

  @beforeCreate()
  static assignId(model: FontStyle) {
    model.id = model.id || newId('fontStyle')
  }

  @belongsTo(() => Font)
  declare font: BelongsTo<typeof Font>

  @belongsTo(() => FontFamily)
  declare family: BelongsTo<typeof FontFamily>

  @hasMany(() => FontStyleTranslation, { foreignKey: 'styleId' })
  declare translations: HasMany<typeof FontStyleTranslation>
}
