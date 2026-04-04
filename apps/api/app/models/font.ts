import { beforeCreate, beforeUpdate, hasMany, manyToMany } from '@adonisjs/lucid/orm'

import { FontSchema } from '#database/schema'
import FontFamily from '#models/font_family'
import FontFilter from '#models/font_filter'
import FontStyle from '#models/font_style'
import FontTranslation from '#models/font_translation'
import { newId } from '#utils/custom_id'
import { applyAuditBeforeCreate, applyAuditBeforeUpdate } from '#utils/model_audit'

import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Font extends FontSchema {
  static selfAssignPrimaryKey = true

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
}
