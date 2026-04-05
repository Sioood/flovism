import { compose } from '@adonisjs/core/helpers'
import { beforeCreate, beforeUpdate, hasMany, manyToMany } from '@adonisjs/lucid/orm'

import { FontSchema } from '#database/schema'
import { Translatable } from '#mixins/translatable'
import FontFamily from '#models/font_family'
import FontFilter from '#models/font_filter'
import FontStyle from '#models/font_style'
import FontTranslation from '#models/font_translation'
import { newId } from '#utils/custom_id'
import { applyAuditBeforeCreate, applyAuditBeforeUpdate } from '#utils/model_audit'

import type { FontStyleFormatFilePublic } from '#transformers/font_style_format_file_transformer'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Font extends compose(FontSchema, Translatable) {
  static selfAssignPrimaryKey = true

  static translatableConfig = {
    table: 'font_translations',
    foreignKey: 'font_id',
    idPrefix: 'fontTranslation' as const,
    translatableColumns: ['slug', 'name', 'description', 'credit'],
  }

  @beforeCreate()
  static assignId(model: Font) {
    model.id = model.id || newId('font')
  }

  @beforeCreate()
  static assignAuditOnCreate(model: Font) {
    applyAuditBeforeCreate(model)
  }

  @beforeUpdate()
  static assignAuditOnUpdate(model: Font) {
    applyAuditBeforeUpdate(model)
  }

  @hasMany(() => FontTranslation)
  declare translations: HasMany<typeof FontTranslation>

  @hasMany(() => FontFamily)
  declare families: HasMany<typeof FontFamily>

  @hasMany(() => FontStyle)
  declare styles: HasMany<typeof FontStyle>

  @manyToMany(() => FontFilter, { pivotTable: 'font_filter_font' })
  declare filters: ManyToMany<typeof FontFilter>

  /** Resolved file URLs for API serialization (not a DB column). Set in FontService#withFileUrls. */
  apiStyleFormatFiles?: FontStyleFormatFilePublic[]
}
