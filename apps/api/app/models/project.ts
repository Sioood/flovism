import { compose } from '@adonisjs/core/helpers'
import { beforeCreate, beforeUpdate, hasMany, manyToMany } from '@adonisjs/lucid/orm'

import { ProjectSchema } from '#database/schema'
import { Translatable } from '#mixins/translatable'
import ProjectCategory from '#models/project_category'
import ProjectImage from '#models/project_image'
import ProjectTranslation from '#models/project_translation'
import { newId } from '#utils/custom_id'
import { applyAuditBeforeCreate, applyAuditBeforeUpdate } from '#utils/model_audit'

import type { ProjectImagePublic } from '#transformers/project_image_transformer'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Project extends compose(ProjectSchema, Translatable) {
  static selfAssignPrimaryKey = true

  static translatableConfig = {
    table: 'project_translations',
    foreignKey: 'project_id',
    idPrefix: 'projectTranslation' as const,
    translatableColumns: ['name', 'slug', 'description', 'clientName', 'credit'],
  }

  /** Resolved image payloads for API serialization (not a DB column). Set in ProjectService#withImages. */
  apiImages?: ProjectImagePublic[]

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

  @hasMany(() => ProjectTranslation)
  declare translations: HasMany<typeof ProjectTranslation>

  @hasMany(() => ProjectImage)
  declare images: HasMany<typeof ProjectImage>

  @manyToMany(() => ProjectCategory, { pivotTable: 'project_category_project' })
  declare categories: ManyToMany<typeof ProjectCategory>
}
