import { BaseModel, beforeCreate, beforeUpdate, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

import ProjectCategory from '#models/project_category'
import ProjectImage from '#models/project_image'
import ProjectTranslation from '#models/project_translation'
import { newId } from '#utils/custom_id'
import { applyAuditBeforeCreate, applyAuditBeforeUpdate } from '#utils/model_audit'

import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Project extends BaseModel {
  static selfAssignPrimaryKey = true

  @beforeCreate()
  static assignId(project: Project) {
    project.id = project.id || newId('project')
  }

  @beforeCreate()
  static assignAuditOnCreate(project: Project) {
    applyAuditBeforeCreate(project)
  }

  @beforeUpdate()
  static assignAuditOnUpdate(project: Project) {
    applyAuditBeforeUpdate(project)
  }

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare projectNumber: string

  @column()
  declare projectYear: number

  @column()
  declare statusCode: string

  @column.dateTime()
  declare scheduledAt: DateTime | null

  @column.dateTime()
  declare publishedAt: DateTime | null

  @column()
  declare createdBy: string | null

  @column()
  declare updatedBy: string | null

  @hasMany(() => ProjectTranslation)
  declare translations: HasMany<typeof ProjectTranslation>

  @hasMany(() => ProjectImage)
  declare images: HasMany<typeof ProjectImage>

  @manyToMany(() => ProjectCategory, { pivotTable: 'project_category_project' })
  declare categories: ManyToMany<typeof ProjectCategory>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
